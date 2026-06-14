import {
  Inventory,
  StockReservation,
  StockMovement,
  MovementType,
  ReservationStatus,
  Prisma,
} from '../../generated/client/client.js';
import {
  NotFoundError,
  BadRequestError,
  createPaginatedResponse,
  calculateOffset,
  IPaginatedResult,
  createServiceLogger,
} from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma.js';
import { eventPublisher } from '../lib/message-broker.js';
import { Events } from '@freeshop/shared-events';
import { acquireLock, releaseLock } from '../lib/redis.js';
import config from '../config/index.js';

const logger = createServiceLogger('inventory-service');

interface InventoryWithDetails extends Inventory {
  reservations?: StockReservation[];
  movements?: StockMovement[];
}

class InventoryService {
  private async publishInventoryUpdated(
    inventory: Inventory,
    action: string,
    reason?: string,
    previousStock?: number,
  ): Promise<void> {
    await eventPublisher.publish(Events.INVENTORY_UPDATED, {
      productId: inventory.productId,
      previousStock: previousStock ?? inventory.availableStock,
      newStock: inventory.availableStock,
      totalStock: inventory.totalStock,
      reservedStock: inventory.reservedStock,
      lowStockThreshold: inventory.lowStockThreshold,
      isLowStock: inventory.isLowStock,
      isOutOfStock: inventory.isOutOfStock,
      variantId: inventory.variantId ?? undefined,
      freeItemId: inventory.freeItemId ?? undefined,
      userId: inventory.userId,
      action,
      reason,
    });
  }

  // Initialize inventory for a product, product variant, or free item.
  //
  // All three foreign keys (productId, variantId, freeItemId) are optional at
  // the schema level. The valid combinations are:
  //   - (productId)             → simple product
  //   - (productId, variantId)  → product variant
  //   - (productId, freeItemId) → free item attached to a product
  //   - (freeItemId)            → standalone free item
  //
  // At least one of productId / freeItemId must be provided; this is enforced
  // at the controller boundary.
  async initializeInventory(
    userId: string,
    initialStock: number = 0,
    lowStockThreshold?: number,
    productId?: string,
    variantId?: string,
    freeItemId?: string
  ): Promise<Inventory> {
    // ── Lookup: build the where clause conditionally. We treat `undefined`
    //    arguments as "not part of the lookup key" (the column may be NULL in
    //    the matching row), and we only add fields that were actually
    //    provided. This avoids Prisma 7's behaviour of interpreting
    //    `undefined` as a literal `NULL` filter in some code paths.
    const whereClause: Prisma.InventoryWhereInput = {};
    if (productId !== undefined) whereClause.productId = productId;
    if (variantId !== undefined) whereClause.variantId = variantId;
    if (freeItemId !== undefined) whereClause.freeItemId = freeItemId;

    const existing = await prisma.inventory.findFirst({
      where: whereClause,
    });

    if (existing) {
      return existing;
    }

    // ── Insert: explicitly emit `null` for any FK the caller did not provide.
    //    We must NOT omit the field — Prisma 7's client-side validation for
    //    composite unique constraints requires every member to be present in
    //    the data payload, and an absent key is treated as `missing`, not
    //    `null`. See the migration `20260615000000_partial_unique_inventory_indexes`
    //    for the database-level uniqueness rules.
    const dataClause: Prisma.InventoryUncheckedCreateInput = {
      userId,
      productId: productId ?? null,
      variantId: variantId ?? null,
      freeItemId: freeItemId ?? null,
      totalStock: initialStock,
      availableStock: initialStock,
      lowStockThreshold: lowStockThreshold || config.inventory.defaultLowStockThreshold,
      isLowStock: initialStock <= (lowStockThreshold || config.inventory.defaultLowStockThreshold),
      isOutOfStock: initialStock === 0,
    };

    const inventory = await prisma.inventory.create({
      data: dataClause,
    });

    // Record initial movement
    if (initialStock > 0) {
      await this.recordMovement(
        inventory.id,
        MovementType.INITIAL,
        initialStock,
        0,
        initialStock,
        'Initial stock',
        undefined
      );
    }

    await this.publishInventoryUpdated(inventory, 'INITIAL', 'Inventory initialized', 0);

    return inventory;
  }

  // Get inventory for a product, product variant, or free item.
  //
  // Callers MUST pass the identifier(s) they want to look up by. The valid
  // combinations match `initializeInventory`:
  //   - (productId)             → simple product
  //   - (productId, variantId)  → product variant
  //   - (freeItemId)            → standalone free item
  //
  // NOTE: We build the where clause conditionally. Including `variantId:
  // undefined` or `freeItemId: undefined` would, in Prisma 7, generate
  // `WHERE variantId IS NULL` — which would match every inventory row with
  // a NULL variant, not the row the caller is looking for. Omitting the
  // field is the correct way to express "I don't care about this column".
  async getInventory(
    productId?: string,
    variantId?: string,
    freeItemId?: string
  ): Promise<InventoryWithDetails> {
    const whereClause: Prisma.InventoryWhereInput = {};
    if (productId !== undefined) whereClause.productId = productId;
    if (variantId !== undefined) whereClause.variantId = variantId;
    if (freeItemId !== undefined) whereClause.freeItemId = freeItemId;

    const inventory = await prisma.inventory.findFirst({
      where: whereClause,
      include: {
        reservations: {
          where: { status: ReservationStatus.PENDING },
        },
      },
    });

    if (!inventory) {
      throw new NotFoundError(`Inventory not found for: productId=${productId}, variantId=${variantId}, freeItemId=${freeItemId}`);
    }

    return inventory;
  }

  async getUserInventoryByUserId(
    userId: string,
    page: number = 1,
    limit: number = 20,
    lowStockOnly: boolean = false
  ): Promise<IPaginatedResult<Inventory>> {
    const where: Prisma.InventoryWhereInput = { userId };
    
    if (lowStockOnly) {
      where.OR = [{ isLowStock: true }, { isOutOfStock: true }];
    }

    const [items, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        skip: calculateOffset(page, limit),
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.inventory.count({ where }),
    ]);

    return createPaginatedResponse(items, total, page, limit);
  }

  async getUserInventory(
    userId: string,
    page: number = 1,
    limit: number = 20,
    lowStockOnly: boolean = false
  ): Promise<IPaginatedResult<Inventory>> {
    const where: Prisma.InventoryWhereInput = { userId };
    
    if (lowStockOnly) {
      where.OR = [{ isLowStock: true }, { isOutOfStock: true }];
    }

    const [items, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        skip: calculateOffset(page, limit),
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.inventory.count({ where }),
    ]);

    return createPaginatedResponse(items, total, page, limit);
  }

  // Add stock (for products, variants, or free items)
  async addStock(
    quantity: number,
    reason: string = 'Restock',
    performedBy?: string,
    productId?: string,
    variantId?: string,
    freeItemId?: string
  ): Promise<Inventory> {
    const lockKey = `inventory:${freeItemId || variantId || productId}`;
    const locked = await acquireLock(lockKey);
    
    if (!locked) {
      throw new BadRequestError('Unable to acquire lock. Try again.');
    }

    try {
      const inventory = await this.getInventory(productId, variantId, freeItemId);
      const previousStock = inventory.totalStock;
      const newTotalStock = previousStock + quantity;
      const newAvailableStock = inventory.availableStock + quantity;

      const updated = await prisma.inventory.update({
        where: { id: inventory.id },
        data: {
          totalStock: newTotalStock,
          availableStock: newAvailableStock,
          isLowStock: newAvailableStock <= inventory.lowStockThreshold,
          isOutOfStock: newAvailableStock === 0,
          lastRestockAt: new Date(),
        },
      });

      await this.recordMovement(
        inventory.id,
        MovementType.RESTOCK,
        quantity,
        previousStock,
        newTotalStock,
        reason,
        performedBy
      );

      await this.publishInventoryUpdated(
        updated,
        inventory.isOutOfStock && newAvailableStock > 0 ? 'BACK_IN_STOCK' : 'RESTOCK',
        reason,
        previousStock,
      );

      return updated;
    } finally {
      await releaseLock(lockKey);
    }
  }

  // Reduce stock (direct reduction, not through order - for products, variants, or free items)
  async reduceStock(
    quantity: number,
    reason: string = 'Adjustment',
    performedBy?: string,
    productId?: string,
    variantId?: string,
    freeItemId?: string
  ): Promise<Inventory> {
    const lockKey = `inventory:${freeItemId || variantId || productId}`;
    const locked = await acquireLock(lockKey);
    
    if (!locked) {
      throw new BadRequestError('Unable to acquire lock. Try again.');
    }

    try {
      const inventory = await this.getInventory(productId, variantId, freeItemId);
      
      if (inventory.availableStock < quantity) {
        throw new BadRequestError('Insufficient stock');
      }

      const previousStock = inventory.totalStock;
      const newTotalStock = previousStock - quantity;
      const newAvailableStock = inventory.availableStock - quantity;

      const updated = await prisma.inventory.update({
        where: { id: inventory.id },
        data: {
          totalStock: newTotalStock,
          availableStock: newAvailableStock,
          isLowStock: newAvailableStock <= inventory.lowStockThreshold,
          isOutOfStock: newAvailableStock === 0,
        },
      });

      await this.recordMovement(
        inventory.id,
        MovementType.ADJUSTMENT,
        -quantity,
        previousStock,
        newTotalStock,
        reason,
        performedBy
      );

      // Send alerts if needed
      await this.checkAndSendAlerts(updated);

      await this.publishInventoryUpdated(updated, 'ADJUSTMENT', reason, previousStock);

      return updated;
    } finally {
      await releaseLock(lockKey);
    }
  }

  // Reserve stock for an order. Identifiers are optional individually but the
  // caller must pass whichever ones identify the row to lock + reserve. See
  // `initializeInventory` for the valid combinations.
  async reserveStock(
    orderId: string,
    quantity: number,
    productId?: string,
    variantId?: string,
    freeItemId?: string
  ): Promise<StockReservation | null> {
    // Build lock key from the actual identifier
    const lockKey = `inventory:${freeItemId || variantId || productId}`;
    const locked = await acquireLock(lockKey);

    if (!locked) {
      throw new BadRequestError('Unable to acquire lock. Try again.');
    }

    try {
      // Build where clause conditionally — never include `undefined` keys,
      // they would translate to `IS NULL` filters in some Prisma versions and
      // match the wrong rows.
      //
      // CRITICAL: `productId` in the order event refers to the *product line item*
      // in the order, not the inventory row's productId. For free items the
      // inventory row has `productId=NULL` and `freeItemId=<id>`. If we include
      // the order's productId in the where clause along with freeItemId, the
      // query will never match the standalone free-item inventory row.
      // Resolution: when `freeItemId` is provided, it uniquely identifies the
      // inventory row — ignore productId/variantId in that case.
      const whereClause: Prisma.InventoryWhereInput = {};
      if (freeItemId !== undefined) {
        whereClause.freeItemId = freeItemId;
        // Standalone free-item inventory rows have productId=null — make
        // absolutely sure we don't accidentally match a row that has the same
        // freeItemId but a non-null productId (shouldn't exist by schema, but
        // belt-and-braces).
        whereClause.productId = null;
      } else {
        if (productId !== undefined) whereClause.productId = productId;
        if (variantId !== undefined) whereClause.variantId = variantId;
      }

      const inventory = await prisma.inventory.findFirst({
        where: whereClause,
      });

      if (!inventory) {
        throw new NotFoundError(
          `Inventory not found for: productId=${productId}, variantId=${variantId}, freeItemId=${freeItemId}`
        );
      }
      
      if (inventory.availableStock < quantity) {
        return null; // Return null instead of throwing - allows partial failure handling
      }

      // Idempotency check: if a reservation already exists for this (order, inventory, variant)
      // return it instead of creating a duplicate. This guards against RabbitMQ
      // re-delivery / republishWithRetry duplicate consumption.
      const existingReservation = await prisma.stockReservation.findFirst({
        where: {
          inventoryId: inventory.id,
          orderId,
          variantId: variantId || inventory.variantId,
          status: ReservationStatus.PENDING,
        },
      });

      if (existingReservation) {
        logger.info('Reservation already exists for order, returning existing (idempotent)', {
          orderId,
          inventoryId: inventory.id,
          variantId: variantId || inventory.variantId,
          reservationId: existingReservation.id,
        });
        return existingReservation;
      }

      const expiresAt = new Date(
        Date.now() + config.inventory.reservationExpiryMinutes * 60 * 1000
      );

      // Create reservation and update available stock
      const [reservation, updatedInventory] = await prisma.$transaction([
        prisma.stockReservation.create({
          data: {
            inventoryId: inventory.id,
            orderId,
            variantId: variantId || inventory.variantId,
            quantity,
            expiresAt,
          },
        }),
        prisma.inventory.update({
          where: { id: inventory.id },
          data: {
            reservedStock: { increment: quantity },
            availableStock: { decrement: quantity },
            isLowStock: inventory.availableStock - quantity <= inventory.lowStockThreshold,
            isOutOfStock: inventory.availableStock - quantity === 0,
          },
        }),
      ]);

      await this.recordMovement(
        inventory.id,
        MovementType.RESERVATION,
        -quantity,
        inventory.availableStock,
        inventory.availableStock - quantity,
        `Reserved for order ${orderId}`,
        undefined,
        orderId
      );

      await this.publishInventoryUpdated(updatedInventory, 'RESERVED', `Reserved for order ${orderId}`, inventory.availableStock);

      return reservation;
    } finally {
      await releaseLock(lockKey);
    }
  }

  // Fulfill reservation (order confirmed, stock permanently reduced)
  async fulfillReservation(orderId: string): Promise<void> {
    const reservations = await prisma.stockReservation.findMany({
      where: { orderId, status: ReservationStatus.PENDING },
      include: { inventory: true },
    });

    for (const reservation of reservations) {
      // Use freeItemId if standalone free item, otherwise variantId, otherwise productId
      const lockKey = `inventory:${reservation.inventory.freeItemId || reservation.inventory.variantId || reservation.inventory.productId}`;
      const locked = await acquireLock(lockKey);
      
      if (!locked) {
        throw new BadRequestError(`Unable to acquire lock for fulfilling reservation ${reservation.id}`);
      }

      try {
        // Compute the post-decrement available stock so we can refresh the
        // isLowStock / isOutOfStock flags. After fulfilment, the stock is
        // permanently removed from the warehouse, so:
        //   newAvailableStock = previousTotal - quantity
        //   newReservedStock  = previousReserved - quantity
        const previousTotal = reservation.inventory.totalStock;
        const previousReserved = reservation.inventory.reservedStock;
        const newTotalStock = previousTotal - reservation.quantity;
        const newReservedStock = previousReserved - reservation.quantity;
        const newAvailableStock = newTotalStock - newReservedStock;

        await prisma.$transaction([
          prisma.stockReservation.update({
            where: { id: reservation.id },
            data: {
              status: ReservationStatus.FULFILLED,
              fulfilledAt: new Date(),
            },
          }),
          prisma.inventory.update({
            where: { id: reservation.inventoryId },
            data: {
              totalStock: { decrement: reservation.quantity },
              reservedStock: { decrement: reservation.quantity },
              isLowStock: newAvailableStock <= reservation.inventory.lowStockThreshold,
              isOutOfStock: newAvailableStock === 0,
              lastSoldAt: new Date(),
            },
          }),
        ]);

        const updatedInventory = await prisma.inventory.findUnique({
          where: { id: reservation.inventoryId },
        });

        await this.recordMovement(
          reservation.inventoryId,
          MovementType.SALE,
          -reservation.quantity,
          previousTotal,
          newTotalStock,
          `Sold - Order ${orderId}`,
          undefined,
          orderId
        );

        // Check for alerts
        const updated = await prisma.inventory.findUnique({
          where: { id: reservation.inventoryId },
        });
        if (updated) {
          await this.checkAndSendAlerts(updated);
          if (updatedInventory) {
            await this.publishInventoryUpdated(updatedInventory, 'FULFILLED', `Sold - Order ${orderId}`, reservation.inventory.availableStock);
          }
        }
      } finally {
        await releaseLock(lockKey);
      }
    }

    // Publish reservation fulfilled event
    await eventPublisher.publish(Events.INVENTORY_RESERVED, {
      orderId,
      items: reservations.map(r => ({
        productId: r.inventory.productId || undefined,
        variantId: r.inventory.variantId || undefined,
        freeItemId: r.inventory.freeItemId || undefined,
        freeItemIds: r.inventory.freeItemId ? [r.inventory.freeItemId] : undefined,
        quantity: r.quantity,
      })),
    });
  }

  // Release reservation (order cancelled)
  async releaseReservation(orderId: string): Promise<void> {
    const reservations = await prisma.stockReservation.findMany({
      where: { orderId, status: ReservationStatus.PENDING },
      include: { inventory: true },
    });

    for (const reservation of reservations) {
      // Use freeItemId if standalone free item, otherwise variantId, otherwise productId
      const lockKey = `inventory:${reservation.inventory.freeItemId || reservation.inventory.variantId || reservation.inventory.productId}`;
      const locked = await acquireLock(lockKey);
      
      if (!locked) {
        throw new BadRequestError(`Unable to acquire lock for releasing reservation ${reservation.id}`);
      }

      try {
        await prisma.$transaction([
          prisma.stockReservation.update({
            where: { id: reservation.id },
            data: { 
              status: ReservationStatus.RELEASED,
              releasedAt: new Date(),
            },
          }),
          prisma.inventory.update({
            where: { id: reservation.inventoryId },
            data: {
              reservedStock: { decrement: reservation.quantity },
              availableStock: { increment: reservation.quantity },
              isLowStock: reservation.inventory.availableStock + reservation.quantity <= reservation.inventory.lowStockThreshold,
              isOutOfStock: false,
            },
          }),
        ]);

        const updatedInventory = await prisma.inventory.findUnique({
          where: { id: reservation.inventoryId },
        });

        await this.recordMovement(
          reservation.inventoryId,
          MovementType.RELEASE,
          reservation.quantity,
          reservation.inventory.availableStock,
          reservation.inventory.availableStock + reservation.quantity,
          `Released - Order ${orderId} cancelled`,
          undefined,
          orderId
        );

        if (updatedInventory) {
          await this.publishInventoryUpdated(updatedInventory, 'RELEASED', `Released - Order ${orderId} cancelled`, reservation.inventory.availableStock);
        }
      } finally {
        await releaseLock(lockKey);
      }
    }

    // Publish release event
    await eventPublisher.publish(Events.INVENTORY_RELEASED, {
      orderId,
      items: reservations.map(r => ({
        productId: r.inventory.productId || undefined,
        variantId: r.inventory.variantId || undefined,
        freeItemId: r.inventory.freeItemId || undefined,
        freeItemIds: r.inventory.freeItemId ? [r.inventory.freeItemId] : undefined,
        quantity: r.quantity,
      })),
    });
  }

  // Process return
  async processReturn(
    productId: string,
    orderId: string,
    quantity: number,
    performedBy?: string
  ): Promise<Inventory> {
    return this.addStock(quantity, `Return from order ${orderId}`, performedBy, productId);
  }

  // Get stock movements
  async getMovements(
    productId?: string,
    page: number = 1,
    limit: number = 50,
    variantId?: string,
    freeItemId?: string
  ): Promise<IPaginatedResult<StockMovement>> {
    const inventory = await this.getInventory(productId, variantId, freeItemId);

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where: { inventoryId: inventory.id },
        skip: calculateOffset(page, limit),
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.stockMovement.count({ where: { inventoryId: inventory.id } }),
    ]);

    return createPaginatedResponse(movements, total, page, limit);
  }

  // Set low stock threshold
  async setLowStockThreshold(
    threshold: number,
    productId?: string,
    variantId?: string,
    freeItemId?: string
  ): Promise<Inventory> {
    const inventory = await this.getInventory(productId, variantId, freeItemId);

    const updated = await prisma.inventory.update({
      where: { id: inventory.id },
      data: {
        lowStockThreshold: threshold,
        isLowStock: inventory.availableStock <= threshold,
      },
    });

    await this.publishInventoryUpdated(updated, 'THRESHOLD_UPDATED', 'Low stock threshold updated', inventory.availableStock);

    return updated;
  }

  // Bulk check availability
  async checkAvailability(
    items: { productId?: string; inventoryKey?: string; quantity: number; variantId?: string; freeItemId?: string }[]
  ): Promise<{
    available: boolean;
    unavailableItems: { productId?: string; requested: number; available: number; variantId?: string; freeItemId?: string }[];
  }> {
    const unavailableItems: { productId?: string; requested: number; available: number; variantId?: string; freeItemId?: string }[] = [];

    for (const item of items) {
      try {
        // Use real IDs directly - no prefix parsing needed
        const { productId, freeItemId, variantId, quantity } = item;

        if (!productId && !freeItemId) {
          unavailableItems.push({
            productId: productId,
            freeItemId: freeItemId,
            requested: quantity,
            available: 0,
            variantId: variantId,
          });
          continue;
        }

        const inventory = await this.getInventory(productId, variantId, freeItemId);
        if (inventory.availableStock < quantity) {
          unavailableItems.push({
            productId: inventory.productId || undefined,
            requested: quantity,
            available: inventory.availableStock,
            variantId: inventory.variantId ?? undefined,
            freeItemId: inventory.freeItemId ?? undefined,
          });
        }
      } catch {
        unavailableItems.push({
          productId: item.productId,
          requested: item.quantity,
          available: 0,
          variantId: item.variantId,
          freeItemId: item.freeItemId,
        });
      }
    }

    return {
      available: unavailableItems.length === 0,
      unavailableItems,
    };
  }

  // Private methods
  private async recordMovement(
    inventoryId: string,
    type: MovementType,
    quantity: number,
    previousStock: number,
    newStock: number,
    reason?: string,
    performedBy?: string,
    reference?: string
  ): Promise<void> {
    await prisma.stockMovement.create({
      data: {
        inventoryId,
        type,
        quantity,
        previousStock,
        newStock,
        reason,
        reference,
        performedBy,
      },
    });
  }

  private async checkAndSendAlerts(inventory: Inventory): Promise<void> {
    const itemId = inventory.freeItemId || inventory.productId || inventory.id;
    if (inventory.isOutOfStock) {
      await prisma.inventoryAlert.create({
        data: {
          inventoryId: inventory.id,
          productId: inventory.productId || itemId,
          userId: inventory.userId,
          type: 'OUT_OF_STOCK',
          message: `Inventory ${itemId} is out of stock`,
        },
      });

      await eventPublisher.publish(Events.INVENTORY_LOW, {
        productId: inventory.productId || itemId,
        userId: inventory.userId,
        availableStock: 0,
        type: 'OUT_OF_STOCK',
      });
    } else if (inventory.isLowStock) {
      await prisma.inventoryAlert.create({
        data: {
          inventoryId: inventory.id,
          productId: inventory.productId || itemId,
          userId: inventory.userId,
          type: 'LOW_STOCK',
          message: `Inventory ${itemId} is running low (${inventory.availableStock} remaining)`,
        },
      });

      await eventPublisher.publish(Events.INVENTORY_LOW, {
        productId: inventory.productId || itemId,
        userId: inventory.userId,
        availableStock: inventory.availableStock,
        type: 'LOW_STOCK',
      });
    }
  }
}

export const inventoryService = new InventoryService();
