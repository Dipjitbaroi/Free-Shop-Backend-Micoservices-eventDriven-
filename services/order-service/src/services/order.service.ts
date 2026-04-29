import { Order, OrderItem, OrderStatus, PaymentStatus, PaymentMethod, Prisma } from '../../generated/client/client.js';
import { 
  BadRequestError, 
  NotFoundError, 
  generateOrderNumber,
  createPaginatedResponse,
  calculateOffset,
  IPaginatedResult,
} from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma.js';
import { zoneService } from './zone.service.js';
import { eventPublisher } from '../lib/message-broker.js';
import { Events } from '@freeshop/shared-events';
import { cacheDelete, orderCacheKey } from '../lib/redis.js';

import config from '../config/index.js';
import { cartService } from './cart.service.js';
import { settingsService } from './settings.service.js';

interface OrderWithItems extends Order {
  items: OrderItem[];
}

type FreeItemSnapshot = {
  id: string;
  name: string;
  sku?: string;
  image?: string;
};

interface CreateOrderData {
  userId?: string;
  guestEmail?: string;
  guestPhone?: string;
  shippingAddress: Record<string, unknown>;
  // billingAddress?: Record<string, unknown>; // disabled - not currently used
  paymentMethod: PaymentMethod;
  customerNote?: string;
  couponCode?: string;
    items: {
    productId: string;
    vendorId: string;
    productName: string;
    productSlug: string;
    productImage?: string;
    unit?: string;
    quantity: number;
    freeItems?: FreeItemSnapshot[];
    price: number;
    discount?: number;
  }[];
}

interface OrderFilters {
  userId?: string;
  status?: OrderStatus | string;
  paymentStatus?: PaymentStatus | string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

class OrderService {
  /**
   * Syncs Order and DeliveryInfo statuses to maintain consistency
   * 
   * Status Mapping Rules:
   * - PENDING → delivery remains PENDING (no delivery created yet)
   * - CONFIRMED → delivery becomes ASSIGNED (ready for pickup)
   * - PROCESSING → delivery becomes ASSIGNED or IN_TRANSIT 
   * - SHIPPED → delivery becomes IN_TRANSIT (on the way)
   * - OUT_FOR_DELIVERY → delivery becomes OUT_FOR_DELIVERY
   * - DELIVERED → delivery becomes DELIVERED
   * - CANCELLED → delivery becomes CANCELLED
   * 
   * @param orderId Order ID to sync
   * @param newOrderStatus New Order status being set
   */
  private async syncOrderDeliveryStatus(orderId: string, newOrderStatus: OrderStatus): Promise<void> {
    try {
      const delivery = await prisma.deliveryInfo.findUnique({
        where: { orderId },
      });

      if (!delivery) {
        // No delivery info yet, only sync if order is being cancelled
        if (newOrderStatus === OrderStatus.CANCELLED) {
          // Can't do anything without delivery, but this is expected
        }
        return;
      }

      let newDeliveryStatus: string | null = null;

      // Map order status to delivery status
      switch (newOrderStatus) {
        case OrderStatus.PENDING:
          newDeliveryStatus = 'PENDING';
          break;
        case OrderStatus.CONFIRMED:
          newDeliveryStatus = 'ASSIGNED';
          break;
        case OrderStatus.PROCESSING:
          // Keep current status or move to ASSIGNED if still PENDING
          newDeliveryStatus = delivery.status === 'PENDING' ? 'ASSIGNED' : delivery.status;
          break;
        case OrderStatus.SHIPPED:
          newDeliveryStatus = 'IN_TRANSIT';
          break;
        case OrderStatus.OUT_FOR_DELIVERY:
          newDeliveryStatus = 'OUT_FOR_DELIVERY';
          break;
        case OrderStatus.DELIVERED:
          newDeliveryStatus = 'DELIVERED';
          break;
        case OrderStatus.CANCELLED:
          newDeliveryStatus = 'CANCELLED';
          break;
        case OrderStatus.REFUNDED:
          // For refunded orders, mark delivery as cancelled
          newDeliveryStatus = 'CANCELLED';
          break;
      }

      // Only update if status has changed
      if (newDeliveryStatus && delivery.status !== newDeliveryStatus) {
        await prisma.deliveryInfo.update({
          where: { id: delivery.id },
          data: {
            status: newDeliveryStatus as any,
            ...(newDeliveryStatus === 'DELIVERED' && { actualDeliveryDate: new Date() }),
            ...(newDeliveryStatus === 'CANCELLED' && { notes: 'Cancelled due to order cancellation' }),
          },
        });
      }
    } catch (error) {
      // Log but don't fail the operation if sync fails
      console.error(`Failed to sync delivery status for order ${orderId}:`, error);
    }
  }

  private async loadOrderItemFreeItems(orderItemIds: string[]): Promise<Map<string, FreeItemSnapshot[]>> {
    const result = new Map<string, FreeItemSnapshot[]>();
    if (orderItemIds.length === 0) return result;

    const rows = await prisma.$queryRaw<Array<{
      orderItemId: string;
      freeItemId: string;
      freeItemName: string;
      sku: string | null;
      image: string | null;
    }>>`
      SELECT
        "orderItemId",
        "freeItemId",
        "freeItemName",
        "sku",
        "image"
      FROM "OrderItemFreeItem"
      WHERE "orderItemId" IN (${Prisma.join(orderItemIds)})
      ORDER BY "assignedAt" ASC
    `;

    for (const row of rows) {
      const items = result.get(row.orderItemId) || [];
      items.push({
        id: row.freeItemId,
        name: row.freeItemName,
        sku: row.sku ?? undefined,
        image: row.image ?? undefined,
      });
      result.set(row.orderItemId, items);
    }

    return result;
  }

  private async hydrateOrder(order: OrderWithItems): Promise<OrderWithItems & { items: Array<OrderItem & { freeItems: FreeItemSnapshot[] }> }> {
    const freeItemMap = await this.loadOrderItemFreeItems(order.items.map((item) => item.id));
    return {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        freeItems: freeItemMap.get(item.id) || [],
      })),
    };
  }

  private async replaceOrderItemFreeItems(
    orderItemId: string,
    freeItems: FreeItemSnapshot[]
  ): Promise<void> {
    await prisma.$executeRaw`
      DELETE FROM "OrderItemFreeItem"
      WHERE "orderItemId" = ${orderItemId}
    `;

    if (freeItems.length === 0) return;

    await Promise.all(
      freeItems.map((item) =>
        prisma.$executeRaw`
          INSERT INTO "OrderItemFreeItem" ("id", "orderItemId", "freeItemId", "freeItemName", "sku", "image", "assignedAt")
          VALUES (${`${orderItemId}:${item.id}`}, ${orderItemId}, ${item.id}, ${item.name}, ${item.sku ?? null}, ${item.image ?? null}, NOW())
          ON CONFLICT ("orderItemId", "freeItemId") DO NOTHING
        `
      )
    );
  }

  async createOrder(data: CreateOrderData): Promise<OrderWithItems> {
    // Calculate totals
    const subtotal = data.items.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity - (item.discount || 0);
      return sum + itemTotal;
    }, 0);

    // Determine shipping zone from shippingAddress (expects a 'zoneId' property)
    let zoneId = '';
    if (data.shippingAddress && typeof data.shippingAddress === 'object' && 'zoneId' in data.shippingAddress) {
      zoneId = String((data.shippingAddress as any).zoneId);
    }

    if (!zoneId) {
      throw new BadRequestError('shippingAddress.zoneId is required');
    }

    const z = await zoneService.get(zoneId);
    if (!z) throw new BadRequestError(`Unknown shipping zone: ${zoneId}`);

    const shippingFee = z.price;

    // Apply coupon if provided (coupon logic may use shippingFee for FREE_SHIPPING)
    let couponDiscount = 0;
    if (data.couponCode) {
      const couponResult = await this.applyCoupon(data.couponCode, subtotal, data.userId, shippingFee);
      couponDiscount = couponResult.discount;
    }

    const discount = data.items.reduce((sum, item) => sum + (item.discount || 0), 0) + couponDiscount;
    const total = subtotal + shippingFee - couponDiscount;

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: data.userId,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        shippingAddress: data.shippingAddress as unknown as Prisma.InputJsonValue,
        subtotal,
        shippingFee,
        discount,
        total,
        couponCode: data.couponCode,
        couponDiscount,
        paymentMethod: data.paymentMethod,
        customerNote: data.customerNote,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            vendorId: item.vendorId,
            productName: item.productName,
            productSlug: item.productSlug,
            productImage: item.productImage,
            unit: item.unit,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount || 0,
            total: (item.price * item.quantity) - (item.discount || 0),
          })),
        },
      },
      include: { items: true },
    });

    for (let i = 0; i < data.items.length; i += 1) {
      const freeItems = data.items[i].freeItems || [];
      if (freeItems.length > 0) {
        await this.replaceOrderItemFreeItems(order.items[i].id, freeItems);
      }
    }

    // Clear cart after order
    // Note: Cart clearing should happen in the controller after successful order
    
    // Record coupon usage
    if (data.couponCode && data.userId) {
      await this.recordCouponUsage(data.couponCode, data.userId, order.id, couponDiscount);
    }

    // Publish order created event
    await eventPublisher.publish(Events.ORDER_CREATED, {
      orderId: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      total: order.total,
      paymentMethod: order.paymentMethod,
      items: order.items.map((item, index) => ({
          productId: item.productId,
          vendorId: item.vendorId,
          quantity: item.quantity,
          price: item.price,
          supplierPrice: (item as any).supplierPrice ?? undefined,
          freeItemIds: data.items[index]?.freeItems?.length
            ? data.items[index].freeItems.map((fi) => fi.id)
            : undefined,
        })),
    });

    return this.hydrateOrder(order) as Promise<OrderWithItems>;
  }

  async getOrderById(orderId: string): Promise<OrderWithItems> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return this.hydrateOrder(order) as Promise<OrderWithItems>;
  }

  async getOrderByNumber(orderNumber: string): Promise<OrderWithItems> {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return this.hydrateOrder(order) as Promise<OrderWithItems>;
  }

  async getOrders(filters: OrderFilters): Promise<IPaginatedResult<OrderWithItems>> {
    const { userId, status, paymentStatus, startDate, endDate, page = 1, limit = 20 } = filters;

    const where: Prisma.OrderWhereInput = {};

    if (userId) where.userId = userId;
    if (status) where.status = status as OrderStatus;
    if (paymentStatus) where.paymentStatus = paymentStatus as PaymentStatus;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true },
        skip: calculateOffset(page, limit),
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    const hydrated = await Promise.all(orders.map((order) => this.hydrateOrder(order as OrderWithItems)));
    return createPaginatedResponse(hydrated as any, total, page, limit);
  }

  async getUserOrders(userId: string, page: number = 1, limit: number = 20): Promise<IPaginatedResult<OrderWithItems>> {
    return this.getOrders({ userId, page, limit });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Promise<OrderWithItems> {
    const order = await this.getOrderById(orderId);

    const updateData: Prisma.OrderUpdateInput = { status };

    // Set timestamps based on status
    switch (status) {
      case OrderStatus.SHIPPED:
        updateData.shippedAt = new Date();
        break;
      case OrderStatus.DELIVERED:
        updateData.deliveredAt = new Date();
        break;
      case OrderStatus.CANCELLED:
        updateData.cancelledAt = new Date();
        if (note) updateData.cancellationReason = note;
        break;
    }

    if (note && status !== OrderStatus.CANCELLED) {
      updateData.adminNote = note;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: { items: true },
    });

    await cacheDelete(orderCacheKey(orderId));

    // Sync delivery status to maintain consistency
    await this.syncOrderDeliveryStatus(orderId, status);

    // Publish status update event
    await eventPublisher.publish(Events.ORDER_STATUS_CHANGED, {
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      userId: updatedOrder.userId,
      oldStatus: order.status,
      newStatus: status,
    });

    // Publish specific events
    if (status === OrderStatus.CANCELLED) {
      await eventPublisher.publish(Events.ORDER_CANCELLED, {
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        userId: updatedOrder.userId,
        reason: note,
        items: updatedOrder.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
    } else if (status === OrderStatus.DELIVERED) {
      await eventPublisher.publish(Events.ORDER_DELIVERED, {
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        userId: updatedOrder.userId,
      });
    }

    return this.hydrateOrder(updatedOrder) as Promise<OrderWithItems>;
  }

  async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus, transactionId?: string): Promise<OrderWithItems> {
    const updateData: Prisma.OrderUpdateInput = { paymentStatus };

    if (paymentStatus === PaymentStatus.PAID) {
      updateData.paidAt = new Date();
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: { items: true },
    });

    await cacheDelete(orderCacheKey(orderId));

    // Publish payment update event
    await eventPublisher.publish(Events.PAYMENT_RECEIVED, {
      orderId: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      amount: order.total,
      paymentMethod: order.paymentMethod,
      transactionId,
    });

    return this.hydrateOrder(order) as Promise<OrderWithItems>;
  }

  async cancelOrder(orderId: string, userId: string, reason: string): Promise<OrderWithItems> {
    const order = await this.getOrderById(orderId);

    // Check if user owns the order (handle both authenticated and guest orders)
    if (order.userId && order.userId !== userId) {
      throw new BadRequestError('You can only cancel your own orders');
    }

    // Guest orders cannot be cancelled by authenticated users (security)
    if (!order.userId && userId) {
      throw new BadRequestError('Cannot cancel guest orders as authenticated user');
    }

    // Check if order can be cancelled
    const cancellableStatuses: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.CONFIRMED];
    if (!cancellableStatuses.includes(order.status)) {
      throw new BadRequestError(`Order cannot be cancelled when in ${order.status} status. Only PENDING and CONFIRMED orders can be cancelled.`);
    }

    return this.updateOrderStatus(orderId, OrderStatus.CANCELLED, reason);
  }

  async deleteOrder(orderId: string, userId: string): Promise<void> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, deliveryInfo: true },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Only allow deletion of orders that are in a cancellable state
    // or have been delivered/returned to avoid data loss
    const deletableStatuses: OrderStatus[] = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.CANCELLED,
      OrderStatus.RETURNED,
    ];

    if (!deletableStatuses.includes(order.status)) {
      throw new BadRequestError(
        `Order cannot be deleted when in ${order.status} status. Only pending, confirmed, cancelled, or returned orders can be deleted.`
      );
    }

    // Delete related delivery info first
    if (order.deliveryInfo) {
      await prisma.deliveryInfo.delete({
        where: { orderId },
      });
    }

    // Delete order (items will cascade due to onDelete: Cascade)
    await prisma.order.delete({
      where: { id: orderId },
    });

    // Clear cache
    await cacheDelete(orderCacheKey(orderId));

    // Publish deletion event
    await eventPublisher.publish(Events.ORDER_DELETED, {
      orderId,
      orderNumber: order.orderNumber,
      userId: order.userId,
    });
  }

  async addTrackingInfo(orderId: string, trackingNumber: string, carrier?: string): Promise<OrderWithItems> {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { trackingNumber, carrier },
      include: { items: true },
    });

    await cacheDelete(orderCacheKey(orderId));

    return this.hydrateOrder(order) as Promise<OrderWithItems>;
  }

  // Coupon methods
  async validateCoupon(code: string, subtotal: number, userId?: string, shippingFee?: number): Promise<{
    valid: boolean;
    discount: number;
    message?: string;
  }> {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid coupon code' };
    }

    if (!coupon.isActive) {
      return { valid: false, discount: 0, message: 'Coupon is not active' };
    }

    const now = new Date();
    if (coupon.startDate > now) {
      return { valid: false, discount: 0, message: 'Coupon is not yet valid' };
    }

    if (coupon.endDate && coupon.endDate < now) {
      return { valid: false, discount: 0, message: 'Coupon has expired' };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'Coupon usage limit reached' };
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return { 
        valid: false, 
        discount: 0, 
        message: `Minimum order amount of ${coupon.minOrderAmount} BDT required` 
      };
    }

    // Check per-user limit
    if (userId && coupon.perUserLimit) {
      const userUsage = await prisma.couponUsage.count({
        where: { couponId: coupon.id, userId },
      });
      if (userUsage >= coupon.perUserLimit) {
        return { valid: false, discount: 0, message: 'You have already used this coupon' };
      }
    }

    // Calculate discount
    let discount = 0;
    switch (coupon.type) {
      case 'PERCENTAGE':
        discount = (subtotal * coupon.value) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
        break;
      case 'FIXED':
        discount = Math.min(coupon.value, subtotal);
        break;
        case 'FREE_SHIPPING': {
          // If shippingFee provided, grant free shipping equal to shippingFee; otherwise none
          discount = shippingFee ?? 0;
          break;
        }
    }

    return { valid: true, discount };
  }

  private async applyCoupon(code: string, subtotal: number, userId?: string, shippingFee?: number): Promise<{ discount: number }> {
    const result = await this.validateCoupon(code, subtotal, userId, shippingFee);
    if (!result.valid) {
      throw new BadRequestError(result.message || 'Invalid coupon');
    }
    return { discount: result.discount };
  }

  private async recordCouponUsage(code: string, userId: string, orderId: string, discount: number): Promise<void> {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (coupon) {
      await prisma.$transaction([
        prisma.couponUsage.create({
          data: {
            couponId: coupon.id,
            userId,
            orderId,
            discount,
          },
        }),
        prisma.coupon.update({
          where: { id: coupon.id },
          data: { usageCount: { increment: 1 } },
        }),
      ]);
    }
  }

  // Vendor order methods
  async getVendorOrders(vendorId: string, page: number = 1, limit: number = 20): Promise<IPaginatedResult<Order>> {
    const orderItemsWithOrders = await prisma.orderItem.findMany({
      where: { vendorId },
      include: { order: true },
      distinct: ['orderId'],
      skip: calculateOffset(page, limit),
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.orderItem.groupBy({
      by: ['orderId'],
      where: { vendorId },
    });

    const orders = orderItemsWithOrders.map(item => item.order);

    return createPaginatedResponse(orders, total.length, page, limit);
  }
}

export const orderService = new OrderService();

