import { messageBroker } from '../lib/message-broker.js';
import { analyticsService } from '../services/analytics.service.js';
import { EXCHANGES, getRoutingKey, QUEUES } from '@freeshop/shared-events';
import { createServiceLogger } from '@freeshop/shared-utils';

const logger = createServiceLogger('analytics-service');

interface EventEnvelope<T> {
  data?: T;
}

const unwrapEventData = <T>(payload: T | EventEnvelope<T>): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    const maybeEnvelope = payload as EventEnvelope<T>;
    if (maybeEnvelope.data) {
      return maybeEnvelope.data;
    }
  }

  return payload as T;
};

interface OrderItem {
  productId: string;
  vendorId?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface OrderCreatedPayload {
  orderId: string;
  userId?: string;
  items: OrderItem[];
  totalAmount: number;
  total?: number;
  paymentMethod?: string;
}

interface OrderDeliveredPayload {
  orderId: string;
  userId?: string;
  total: number;
  shippingFee: number;
  items: Array<{
    productId: string;
    vendorId?: string;
    quantity: number;
    price: number;
    supplierPrice?: number;
  }>;
}

interface OrderCancelledPayload {
  orderId: string;
}

interface ProductViewedPayload {
  productId: string;
  userId?: string;
  sessionId?: string;
}

interface UserCreatedPayload {
  userId: string;
}

interface PaymentReceivedPayload {
  paymentId: string;
  orderId: string;
  amount: number;
  method: string;
}

export const setupEventSubscribers = async (): Promise<void> => {
  await messageBroker.subscribe<OrderCreatedPayload>(
    EXCHANGES.ORDER,
    QUEUES.ANALYTICS_ORDER_CREATED,
    getRoutingKey('ORDER', 'CREATED'),
    async (rawPayload) => {
      let payload: OrderCreatedPayload | undefined;
      try {
        payload = unwrapEventData<OrderCreatedPayload>(rawPayload);
        logger.info('Processing order created event for analytics', { orderId: payload.orderId });

        const items = payload.items || [];
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

        // Note: Revenue is counted when order is DELIVERED, not when created
        await analyticsService.updateDailySalesReport(new Date(), {
          totalOrders: 1,
          totalItems,
          pendingOrders: 1,
          codOrders: payload.paymentMethod === 'COD' ? 1 : 0,
          bkashOrders: payload.paymentMethod === 'BKASH' ? 1 : 0,
        });

        for (const item of items) {
          await analyticsService.updateProductAnalytics(item.productId, new Date(), {
            views: 0,
            purchases: 0, // Purchases counted at delivery
          });
        }

        logger.info('Order created analytics updated', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error processing order for analytics', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload?.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<OrderDeliveredPayload>(
    EXCHANGES.ORDER,
    QUEUES.ANALYTICS_ORDER_COMPLETED,
    getRoutingKey('ORDER', 'DELIVERED'),
    async (rawPayload) => {
      let payload: OrderDeliveredPayload | undefined;
      try {
        payload = unwrapEventData<OrderDeliveredPayload>(rawPayload);
        logger.info('Processing order delivered event for analytics', { orderId: payload.orderId });

        // Revenue = Total - Delivery Charge
        const revenue = payload.total - payload.shippingFee;
        const items = payload.items || [];
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

        // Calculate platform profit = revenue - total supplier charges
        let totalSupplierCharge = 0;
        for (const item of items) {
          const supplierPrice = item.supplierPrice ?? 0;
          const itemSupplierCharge = supplierPrice * item.quantity;
          totalSupplierCharge += itemSupplierCharge;
        }
        const profit = revenue - totalSupplierCharge;

        await analyticsService.updateDailySalesReport(new Date(), {
          completedOrders: 1,
          totalRevenue: revenue,
          totalItems,
          pendingOrders: -1, // remove from pending (was counted at ORDER.CREATED)
        });

        // Update product and vendor analytics on delivery
        for (const item of items) {
          const itemSubtotal = item.price * item.quantity;
          const itemSupplierCharge = (item.supplierPrice ?? 0) * item.quantity;

          await analyticsService.updateProductAnalytics(item.productId, new Date(), {
            purchases: item.quantity,
            revenue: itemSubtotal,
          });

          if (item.vendorId) {
            // Vendor revenue = item subtotal - supplier charge (no delivery charge deduction for vendor)
            const vendorRevenue = itemSubtotal - itemSupplierCharge;
            await analyticsService.updateVendorReport(item.vendorId, new Date(), {
              totalOrders: 1,
              totalRevenue: vendorRevenue,
              totalItems: item.quantity,
            });
          }
        }

        logger.info('Order delivery analytics updated', { orderId: payload.orderId, revenue, profit });
      } catch (error) {
        logger.error('Error processing order delivery for analytics', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload?.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<OrderCancelledPayload>(
    EXCHANGES.ORDER,
    QUEUES.ANALYTICS_ORDER_CANCELLED,
    getRoutingKey('ORDER', 'CANCELLED'),
    async (rawPayload) => {
      let payload: OrderCancelledPayload | undefined;
      try {
        payload = unwrapEventData<OrderCancelledPayload>(rawPayload);
        logger.info('Processing order cancelled event for analytics', { orderId: payload.orderId });

        await analyticsService.updateDailySalesReport(new Date(), {
          cancelledOrders: 1,
        });

        logger.info('Order cancellation analytics updated', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error processing order cancellation for analytics', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload?.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<ProductViewedPayload>(
    EXCHANGES.PRODUCT,
    QUEUES.ANALYTICS_PRODUCT_VIEWED,
    getRoutingKey('PRODUCT', 'VIEWED'),
    async (rawPayload) => {
      let payload: ProductViewedPayload | undefined;
      try {
        payload = unwrapEventData<ProductViewedPayload>(rawPayload);
        await analyticsService.updateProductAnalytics(payload.productId, new Date(), {
          views: 1,
          uniqueViews: payload.userId ? 1 : 0,
        });

        logger.debug('Product view tracked', { productId: payload.productId });
      } catch (error) {
        logger.error('Error tracking product view', {
          error: error instanceof Error ? error.message : 'Unknown error',
          productId: payload?.productId,
        });
      }
    }
  );

  // User Created - Count new customers when account is created
  await messageBroker.subscribe<UserCreatedPayload>(
    EXCHANGES.USER,
    QUEUES.ANALYTICS_USER_CREATED,
    getRoutingKey('USER', 'CREATED'),
    async (rawPayload) => {
      let payload: UserCreatedPayload | undefined;
      try {
        payload = unwrapEventData<UserCreatedPayload>(rawPayload);
        logger.info('Processing user created event for analytics', { userId: payload.userId });

        await analyticsService.updateDailySalesReport(new Date(), {
          newCustomers: 1,
        });

        logger.info('New customer analytics updated', { userId: payload.userId });
      } catch (error) {
        logger.error('Error processing user creation for analytics', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: payload?.userId,
        });
      }
    }
  );

  await messageBroker.subscribe<PaymentReceivedPayload>(
    EXCHANGES.PAYMENT,
    QUEUES.ANALYTICS_EVENTS,
    getRoutingKey('PAYMENT', 'RECEIVED'),
    async (rawPayload) => {
      try {
        const payload = unwrapEventData<PaymentReceivedPayload>(rawPayload);
        logger.info('Processing payment received event for analytics', {
          paymentId: payload.paymentId,
          orderId: payload.orderId,
          method: payload.method,
        });

        // Only decrement pendingOrders for prepaid methods (e.g. BKASH).
        // For COD the payment.received event is fired by the payment-service
        // on delivery, AFTER ORDER.DELIVERED has already moved the order out
        // of pending — decrementing again here would underflow the counter.
        const method = (payload.method || '').toUpperCase();
        const isPrepaid = method === 'BKASH' || method === 'CARD' || method === 'ONLINE';

        if (isPrepaid) {
          await analyticsService.updateDailySalesReport(new Date(), {
            pendingOrders: -1,
          });
        }
      } catch (error) {
        logger.error('Error processing payment received for analytics', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  logger.info('Analytics service event subscribers initialized');
};
