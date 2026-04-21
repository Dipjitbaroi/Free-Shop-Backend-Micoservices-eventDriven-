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
} from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma.js';
import { eventPublisher } from '../lib/message-broker.js';
import { Events } from '@freeshop/shared-events';
import { acquireLock, releaseLock } from '../lib/redis.js';
import config from '../config/index.js';

interface InventoryWithDetails extends Inventory {
  reservations?: StockReservation[];
  movements?: StockMovement[];
}

class InventoryService {
  // Initialize inventory for a product
  async initializeInventory(
    productId: string,
    vendorId: string,
    initialStock: number = 0,
    lowStockThreshold?: number
  ): Promise<Inventory> {
    const existing = await prisma.inventory.findUnique({
      where: { productId },
    });

    if (existing) {
      return existing;
    }

    const inventory = await prisma.inventory.create({
      data: {
        productId,
        vendorId,
        totalStock: initialStock,
        availableStock: initialStock,
        lowStockThreshold: lowStockThreshold || config.inventory.defaultLowStockThreshold,
        isLowStock: initialStock <= (lowStockThreshold || config.inventory.defaultLowStockThreshold),
        isOutOfStock: initialStock === 0,
      },
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

    return inventory;
  }

  async getInventory(productId: string): Promise<InventoryWithDetails> {
    const inventory = await prisma.inventory.findUnique({
      where: { productId },
      include: {
        reservations: {
          where: { status: ReservationStatus.PENDING },
        },
      },
    });

    if (!inventory) {
      throw new NotFoundError('Inventory not found');
    }

    return inventory;
  }

  async getVendorInventory(
    vendorId: string,
    page: number = 1,
    limit: number = 20,
    lowStockOnly: boolean = false
  ): Promise<IPaginatedResult<Inventory>> {
    const where: Prisma.InventoryWhereInput = { vendorId };
    
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

  // Add stock
  async addStock(
    productId: string,
    quantity: number,
    reason: string = 'Restock',
    performedBy?: string
  ): Promise<Inventory> {
    const lockKey = `inventory:${productId}`;
    const locked = await acquireLock(lockKey);
    
    if (!locked) {
      throw new BadRequestError('Unable to acquire lock. Try again.');
    }

    try {
      const inventory = await this.getInventory(productId);
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

      // Check if back in stock
      if (inventory.isOutOfStock && newAvailableStock > 0) {
        await eventPublisher.publish(Events.INVENTORY_UPDATED, {
          productId,
          type: 'BACK_IN_STOCK',
          availableStock: newAvailableStock,
        });
      }

      return updated;
    } finally {
      await releaseLock(lockKey);
    }
  }

  // Reduce stock (direct reduction, not through order)
  async reduceStock(
    productId: string,
    quantity: number,
    reason: string = 'Adjustment',
    performedBy?: string
  ): Promise<Inventory> {
    const lockKey = `inventory:${productId}`;
    const locked = await acquireLock(lockKey);
    
    if (!locked) {
      throw new BadRequestError('Unable to acquire lock. Try again.');
    }

    try {
      const inventory = await this.getInventory(productId);
      
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

      return updated;
    } finally {
      await releaseLock(lockKey);
    }
  }

  // Reserve stock for an order
  async reserveStock(
    productId: string,
    orderId: string,
    quantity: number
  ): Promise<StockReservation> {
    const lockKey = `inventory:${productId}`;
    const locked = await acquireLock(lockKey);
    
    if (!locked) {
      throw new BadRequestError('Unable to acquire lock. Try again.');
    }

    try {
      const inventory = await this.getInventory(productId);
      
      if (inventory.availableStock < quantity) {
        throw new BadRequestError(`Insufficient stock for product ${productId}`);
      }

      const expiresAt = new Date(
        Date.now() + config.inventory.reservationExpiryMinutes * 60 * 1000
      );

      // Create reservation and update available stock
      const [reservation] = await prisma.$transaction([
        prisma.stockReservation.create({
          data: {
            inventoryId: inventory.id,
            orderId,
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
      const lockKey = `inventory:${reservation.inventory.productId}`;
      const locked = await acquireLock(lockKey);
      
      if (!locked) continue;

      try {
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
              lastSoldAt: new Date(),
            },
          }),
        ]);

        await this.recordMovement(
          reservation.inventoryId,
          MovementType.SALE,
          -reservation.quantity,
          reservation.inventory.totalStock,
          reservation.inventory.totalStock - reservation.quantity,
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
        }
      } finally {
        await releaseLock(lockKey);
      }
    }

    // Publish reservation fulfilled event
    await eventPublisher.publish(Events.INVENTORY_RESERVED, {
      orderId,
      items: reservations.map(r => {
        const rawId = r.inventory.productId;
        if (rawId.includes(':free:')) {
          const [base, freeId] = rawId.split(':free:');
          return { productId: base, freeItemId: freeId, freeItemIds: [freeId], quantity: r.quantity };
        }
        if (rawId.includes(':')) {
          const [base, variant] = rawId.split(':');
          return { productId: base, variantId: variant, quantity: r.quantity };
        }
        return { productId: rawId, quantity: r.quantity };
      }),
    });
  }

  // Release reservation (order cancelled)
  async releaseReservation(orderId: string): Promise<void> {
    const reservations = await prisma.stockReservation.findMany({
      where: { orderId, status: ReservationStatus.PENDING },
      include: { inventory: true },
    });

    for (const reservation of reservations) {
      const lockKey = `inventory:${reservation.inventory.productId}`;
      const locked = await acquireLock(lockKey);
      
      if (!locked) continue;

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
      } finally {
        await releaseLock(lockKey);
      }
    }

    // Publish release event
    await eventPublisher.publish(Events.INVENTORY_RELEASED, {
      orderId,
      items: reservations.map(r => {
        const rawId = r.inventory.productId;
        if (rawId.includes(':free:')) {
          const [base, freeId] = rawId.split(':free:');
          return { productId: base, freeItemId: freeId, freeItemIds: [freeId], quantity: r.quantity };
        }
        if (rawId.includes(':')) {
          const [base, variant] = rawId.split(':');
          return { productId: base, variantId: variant, quantity: r.quantity };
        }
        return { productId: rawId, quantity: r.quantity };
      }),
    });
  }

  // Process return
  async processReturn(
    productId: string,
    orderId: string,
    quantity: number,
    performedBy?: string
  ): Promise<Inventory> {
    return this.addStock(productId, quantity, `Return from order ${orderId}`, performedBy);
  }

  // Get stock movements
  async getMovements(
    productId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<IPaginatedResult<StockMovement>> {
    const inventory = await this.getInventory(productId);

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
  async setLowStockThreshold(productId: string, threshold: number): Promise<Inventory> {
    const inventory = await this.getInventory(productId);

    return prisma.inventory.update({
      where: { id: inventory.id },
      data: {
        lowStockThreshold: threshold,
        isLowStock: inventory.availableStock <= threshold,
      },
    });
  }

  // Bulk check availability
  async checkAvailability(
    items: { productId: string; quantity: number }[]
  ): Promise<{ available: boolean; unavailableItems: { productId: string; requested: number; available: number }[] }> {
    const unavailableItems: { productId: string; requested: number; available: number }[] = [];

    for (const item of items) {
      try {
        const inventory = await this.getInventory(item.productId);
        if (inventory.availableStock < item.quantity) {
          unavailableItems.push({
            productId: item.productId,
            requested: item.quantity,
            available: inventory.availableStock,
          });
        }
      } catch {
        unavailableItems.push({
          productId: item.productId,
          requested: item.quantity,
          available: 0,
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
    if (inventory.isOutOfStock) {
      await prisma.inventoryAlert.create({
        data: {
          inventoryId: inventory.id,
          productId: inventory.productId,
          vendorId: inventory.vendorId,
          type: 'OUT_OF_STOCK',
          message: `Product ${inventory.productId} is out of stock`,
        },
      });

      await eventPublisher.publish(Events.INVENTORY_LOW, {
        productId: inventory.productId,
        vendorId: inventory.vendorId,
        availableStock: 0,
        type: 'OUT_OF_STOCK',
      });
    } else if (inventory.isLowStock) {
      await prisma.inventoryAlert.create({
        data: {
          inventoryId: inventory.id,
          productId: inventory.productId,
          vendorId: inventory.vendorId,
          type: 'LOW_STOCK',
          message: `Product ${inventory.productId} is running low (${inventory.availableStock} remaining)`,
        },
      });

      await eventPublisher.publish(Events.INVENTORY_LOW, {
        productId: inventory.productId,
        vendorId: inventory.vendorId,
        availableStock: inventory.availableStock,
        type: 'LOW_STOCK',
      });
    }
  }
}

export const inventoryService = new InventoryService();
