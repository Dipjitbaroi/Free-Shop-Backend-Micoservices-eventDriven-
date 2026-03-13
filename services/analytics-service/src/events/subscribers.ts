import { messageBroker } from '../lib/message-broker';
import { analyticsService } from '../services/analytics.service';
import { EXCHANGES, getRoutingKey, QUEUES } from '@freeshop/shared-events';
import logger from '@freeshop/shared-utils';

interface OrderItem {
  productId: string;
  sellerId?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface OrderCreatedPayload {
  orderId: string;
  userId?: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod?: string;
}

interface OrderCompletedPayload {
  orderId: string;
  userId?: string;
  items: OrderItem[];
  totalAmount: number;
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

interface PaymentCompletedPayload {
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
    async (payload) => {
      try {
        logger.info('Processing order created event for analytics', { orderId: payload.orderId });

        const totalItems = payload.items.reduce((sum, item) => sum + item.quantity, 0);

        await analyticsService.updateDailySalesReport(new Date(), {
          totalOrders: 1,
          totalRevenue: payload.totalAmount,
          totalItems,
          pendingOrders: 1,
          codOrders: payload.paymentMethod === 'COD' ? 1 : 0,
          bkashOrders: payload.paymentMethod === 'BKASH' ? 1 : 0,
        });

        for (const item of payload.items) {
          await analyticsService.updateProductAnalytics(item.productId, new Date(), {
            purchases: item.quantity,
            revenue: item.subtotal,
          });

          if (item.sellerId) {
            await analyticsService.updateSellerReport(item.sellerId, new Date(), {
              totalOrders: 1,
              totalRevenue: item.subtotal,
              totalItems: item.quantity,
            });
          }
        }

        logger.info('Order analytics updated', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error processing order for analytics', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<OrderCompletedPayload>(
    EXCHANGES.ORDER,
    QUEUES.ANALYTICS_ORDER_COMPLETED,
    getRoutingKey('ORDER', 'COMPLETED'),
    async (payload) => {
      try {
        logger.info('Processing order completed event for analytics', { orderId: payload.orderId });

        await analyticsService.updateDailySalesReport(new Date(), {
          completedOrders: 1,
        });

        logger.info('Order completion analytics updated', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error processing order completion for analytics', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<OrderCancelledPayload>(
    EXCHANGES.ORDER,
    QUEUES.ANALYTICS_ORDER_CANCELLED,
    getRoutingKey('ORDER', 'CANCELLED'),
    async (payload) => {
      try {
        logger.info('Processing order cancelled event for analytics', { orderId: payload.orderId });

        await analyticsService.updateDailySalesReport(new Date(), {
          cancelledOrders: 1,
        });

        logger.info('Order cancellation analytics updated', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error processing order cancellation for analytics', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<ProductViewedPayload>(
    EXCHANGES.PRODUCT,
    QUEUES.ANALYTICS_PRODUCT_VIEWED,
    getRoutingKey('PRODUCT', 'VIEWED'),
    async (payload) => {
      try {
        await analyticsService.updateProductAnalytics(payload.productId, new Date(), {
          views: 1,
          uniqueViews: payload.userId ? 1 : 0,
        });

        logger.debug('Product view tracked', { productId: payload.productId });
      } catch (error) {
        logger.error('Error tracking product view', {
          error: error instanceof Error ? error.message : 'Unknown error',
          productId: payload.productId,
        });
      }
    }
  );

  await messageBroker.subscribe<UserCreatedPayload>(
    EXCHANGES.USER,
    QUEUES.ANALYTICS_USER_CREATED,
    getRoutingKey('USER', 'CREATED'),
    async (payload) => {
      try {
        logger.info('Processing user created event for analytics', { userId: payload.userId });

        await analyticsService.updateDailySalesReport(new Date(), {
          newCustomers: 1,
        });

        logger.info('New customer analytics updated', { userId: payload.userId });
      } catch (error) {
        logger.error('Error processing user creation for analytics', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: payload.userId,
        });
      }
    }
  );

  logger.info('Analytics service event subscribers initialized');
};
