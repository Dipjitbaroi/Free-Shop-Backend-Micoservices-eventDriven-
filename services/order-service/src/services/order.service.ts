import { Order, OrderItem, OrderStatus, PaymentStatus, PaymentMethod, Prisma } from '../../generated/prisma';
import { 
  BadRequestError, 
  NotFoundError, 
  generateOrderNumber,
  createPaginatedResponse,
  calculateOffset,
  IPaginatedResult,
} from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma';
import { eventPublisher } from '../lib/message-broker';
import { Events } from '@freeshop/shared-events';
import { cacheDelete, orderCacheKey } from '../lib/redis';

import config from '../config';
import { cartService } from './cart.service';
import { settingsService } from './settings.service';

interface OrderWithItems extends Order {
  items: OrderItem[];
}

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
    freeItemId?: string;
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

  async createOrder(data: CreateOrderData): Promise<OrderWithItems> {
    // Calculate totals
    const subtotal = data.items.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity - (item.discount || 0);
      return sum + itemTotal;
    }, 0);

    // Get deliveryCharges from settings
    let deliveryCharges: Record<string, number> = {};
    try {
      const charges = await settingsService.get('deliveryCharges');
      if (charges && typeof charges === 'object') {
        deliveryCharges = charges;
      }
    } catch {}

    // Determine shipping zone from shippingAddress (expects a 'zone' property)
    let shippingZone = '';
    if (data.shippingAddress && typeof data.shippingAddress === 'object' && 'zone' in data.shippingAddress) {
      shippingZone = String((data.shippingAddress as any).zone);
    }

    // shipping zone must be provided and must exist in deliveryCharges
    if (!shippingZone) {
      throw new BadRequestError('shippingAddress.zone is required');
    }

    if (!deliveryCharges || typeof deliveryCharges !== 'object' || deliveryCharges[shippingZone] === undefined) {
      throw new BadRequestError(`Unknown shipping zone: ${shippingZone}`);
    }

    const shippingFee = deliveryCharges[shippingZone];

    // Apply coupon if provided
    let couponDiscount = 0;
    if (data.couponCode) {
      const couponResult = await this.applyCoupon(data.couponCode, subtotal, data.userId);
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
            freeItemId: item.freeItemId || null,
            price: item.price,
            discount: item.discount || 0,
            total: (item.price * item.quantity) - (item.discount || 0),
          })),
        },
      },
      include: { items: true },
    });

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
      items: order.items.map(item => ({
        productId: item.productId,
        vendorId: item.vendorId,
        quantity: item.quantity,
        price: item.price,
        freeItemId: (item as any).freeItemId || undefined,
      })),
    });

    return order;
  }

  async getOrderById(orderId: string): Promise<OrderWithItems> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return order;
  }

  async getOrderByNumber(orderNumber: string): Promise<OrderWithItems> {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return order;
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

    return createPaginatedResponse(orders, total, page, limit);
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

    return updatedOrder;
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

    return order;
  }

  async cancelOrder(orderId: string, userId: string, reason: string): Promise<OrderWithItems> {
    const order = await this.getOrderById(orderId);

    // Check if user owns the order
    if (order.userId !== userId) {
      throw new BadRequestError('You can only cancel your own orders');
    }

    // Check if order can be cancelled
    const cancellableStatuses: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.CONFIRMED];
    if (!cancellableStatuses.includes(order.status)) {
      throw new BadRequestError('Order cannot be cancelled at this stage');
    }

    return this.updateOrderStatus(orderId, OrderStatus.CANCELLED, reason);
  }

  async addTrackingInfo(orderId: string, trackingNumber: string, carrier?: string): Promise<OrderWithItems> {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { trackingNumber, carrier },
      include: { items: true },
    });

    await cacheDelete(orderCacheKey(orderId));

    return order;
  }

  // Coupon methods
  async validateCoupon(code: string, subtotal: number, userId?: string): Promise<{
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
        // Try to use deliveryCharges['default'] if available, else fallback
        let deliveryCharges: Record<string, number> = {};
        try {
          const charges = await settingsService.get('deliveryCharges');
          if (charges && typeof charges === 'object') {
            deliveryCharges = charges;
          }
        } catch {}
        if (deliveryCharges['default'] !== undefined) {
          discount = deliveryCharges['default'];
        } else {
          discount = 0;
        }
        break;
      }
    }

    return { valid: true, discount };
  }

  private async applyCoupon(code: string, subtotal: number, userId?: string): Promise<{ discount: number }> {
    const result = await this.validateCoupon(code, subtotal, userId);
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

