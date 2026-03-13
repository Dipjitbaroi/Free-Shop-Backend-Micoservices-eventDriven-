import { messageBroker } from '../lib/message-broker';
import { sellerService } from '../services/seller.service';
import { commissionService } from '../services/commission.service';
import { EXCHANGES, getRoutingKey, QUEUES } from '@freeshop/shared-events';
import logger from '@freeshop/shared-utils';

interface OrderItem {
  productId: string;
  sellerId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface OrderCompletedPayload {
  orderId: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
}

interface OrderCancelledPayload {
  orderId: string;
  reason?: string;
}

interface ProductCreatedPayload {
  productId: string;
  sellerId: string;
}

interface ProductDeletedPayload {
  productId: string;
  sellerId: string;
}

interface PaymentCompletedPayload {
  paymentId: string;
  orderId: string;
  amount: number;
  sellerId?: string;
}

export const setupEventSubscribers = async (): Promise<void> => {
  await messageBroker.subscribe<OrderCompletedPayload>(
    EXCHANGES.ORDER,
    QUEUES.SELLER_ORDER_COMPLETED,
    getRoutingKey('ORDER', 'COMPLETED'),
    async (payload) => {
      try {
        logger.info('Processing order completed event for seller', { orderId: payload.orderId });

        const sellerItems = new Map<string, OrderItem[]>();
        
        for (const item of payload.items) {
          if (item.sellerId) {
            const items = sellerItems.get(item.sellerId) || [];
            items.push(item);
            sellerItems.set(item.sellerId, items);
          }
        }

        for (const [sellerId, items] of sellerItems) {
          let totalSellerAmount = 0;

          for (const item of items) {
            await commissionService.createCommission({
              sellerId,
              orderId: payload.orderId,
              productId: item.productId,
              orderAmount: item.subtotal,
            });
            totalSellerAmount += item.subtotal;
          }

          await sellerService.updateSellerStats(sellerId, {
            ordersChange: 1,
            revenueChange: totalSellerAmount,
          });
        }

        logger.info('Commissions created for order', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error processing order completed for seller', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<OrderCancelledPayload>(
    EXCHANGES.ORDER,
    QUEUES.SELLER_ORDER_CANCELLED,
    getRoutingKey('ORDER', 'CANCELLED'),
    async (payload) => {
      try {
        logger.info('Processing order cancelled event for seller', { orderId: payload.orderId });

        await commissionService.cancelCommissionsForOrder(payload.orderId);

        logger.info('Commissions cancelled for order', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error cancelling commissions for order', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<PaymentCompletedPayload>(
    EXCHANGES.PAYMENT,
    QUEUES.SELLER_PAYMENT_COMPLETED,
    getRoutingKey('PAYMENT', 'COMPLETED'),
    async (payload) => {
      try {
        logger.info('Processing payment completed event for seller', { 
          paymentId: payload.paymentId, 
          orderId: payload.orderId 
        });

        await commissionService.settleCommissionsForOrder(payload.orderId);

        logger.info('Commissions settled for order', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error settling commissions for payment', {
          error: error instanceof Error ? error.message : 'Unknown error',
          paymentId: payload.paymentId,
        });
      }
    }
  );

  await messageBroker.subscribe<ProductCreatedPayload>(
    EXCHANGES.PRODUCT,
    QUEUES.SELLER_PRODUCT_CREATED,
    getRoutingKey('PRODUCT', 'CREATED'),
    async (payload) => {
      try {
        logger.info('Processing product created event for seller', { 
          productId: payload.productId, 
          sellerId: payload.sellerId 
        });

        if (payload.sellerId) {
          await sellerService.updateSellerStats(payload.sellerId, {
            productsChange: 1,
          });
        }

        logger.info('Seller stats updated for new product', { sellerId: payload.sellerId });
      } catch (error) {
        logger.error('Error updating seller stats for product', {
          error: error instanceof Error ? error.message : 'Unknown error',
          productId: payload.productId,
        });
      }
    }
  );

  await messageBroker.subscribe<ProductDeletedPayload>(
    EXCHANGES.PRODUCT,
    QUEUES.SELLER_PRODUCT_DELETED,
    getRoutingKey('PRODUCT', 'DELETED'),
    async (payload) => {
      try {
        logger.info('Processing product deleted event for seller', { 
          productId: payload.productId, 
          sellerId: payload.sellerId 
        });

        if (payload.sellerId) {
          await sellerService.updateSellerStats(payload.sellerId, {
            productsChange: -1,
          });
        }

        logger.info('Seller stats updated for deleted product', { sellerId: payload.sellerId });
      } catch (error) {
        logger.error('Error updating seller stats for deleted product', {
          error: error instanceof Error ? error.message : 'Unknown error',
          productId: payload.productId,
        });
      }
    }
  );

  logger.info('Seller service event subscribers initialized');
};
