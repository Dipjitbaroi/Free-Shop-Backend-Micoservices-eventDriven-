import { messageBroker } from '../lib/message-broker';
import { sellerService } from '../services/seller.service';
import { commissionService } from '../services/commission.service';
import { EXCHANGES, getRoutingKey, QUEUES } from '@freeshop/shared-events';
import logger from '@freeshop/shared-utils';

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
  sellerId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface OrderCreatedPayload {
  orderId: string;
  userId: string;
  items: OrderItem[];
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

interface PaymentReceivedPayload {
  paymentId: string;
  orderId: string;
  amount: number;
  sellerId?: string;
}

export const setupEventSubscribers = async (): Promise<void> => {
  await messageBroker.subscribe<OrderCreatedPayload>(
    EXCHANGES.ORDER,
    QUEUES.SELLER_ORDER_COMPLETED,
    getRoutingKey('ORDER', 'CREATED'),
    async (rawPayload) => {
      let payload: OrderCreatedPayload | undefined;
      try {
        payload = unwrapEventData<OrderCreatedPayload>(rawPayload);
        logger.info('Processing order created event for seller', { orderId: payload.orderId });

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
            const itemSubtotal = item.subtotal ?? item.price * item.quantity;

            await commissionService.createCommission({
              sellerId,
              orderId: payload.orderId,
              productId: item.productId,
              orderAmount: itemSubtotal,
            });
            totalSellerAmount += itemSubtotal;
          }

          await sellerService.updateSellerStats(sellerId, {
            ordersChange: 1,
            revenueChange: totalSellerAmount,
          });
        }

        logger.info('Commissions created for order', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error processing order creation for seller', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload?.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<OrderCancelledPayload>(
    EXCHANGES.ORDER,
    QUEUES.SELLER_ORDER_CANCELLED,
    getRoutingKey('ORDER', 'CANCELLED'),
    async (rawPayload) => {
      let payload: OrderCancelledPayload | undefined;
      try {
        payload = unwrapEventData<OrderCancelledPayload>(rawPayload);
        logger.info('Processing order cancelled event for seller', { orderId: payload.orderId });

        const cancelledCommissions = await commissionService.cancelCommissionsForOrder(payload.orderId);

        const sellerTotals = new Map<string, { orders: number; revenue: number }>();
        for (const commission of cancelledCommissions) {
          const existing = sellerTotals.get(commission.sellerId) || { orders: 0, revenue: 0 };
          existing.orders += 1;
          existing.revenue += Number(commission.orderAmount);
          sellerTotals.set(commission.sellerId, existing);
        }

        for (const [sellerId, totals] of sellerTotals) {
          await sellerService.updateSellerStats(sellerId, {
            ordersChange: -totals.orders,
            revenueChange: -totals.revenue,
          });
        }

        logger.info('Commissions cancelled for order', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error cancelling commissions for order', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload?.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<PaymentReceivedPayload>(
    EXCHANGES.PAYMENT,
    QUEUES.SELLER_PAYMENT_COMPLETED,
    getRoutingKey('PAYMENT', 'RECEIVED'),
    async (rawPayload) => {
      let payload: PaymentReceivedPayload | undefined;
      try {
        payload = unwrapEventData<PaymentReceivedPayload>(rawPayload);
        logger.info('Processing payment completed event for seller', { 
          paymentId: payload.paymentId, 
          orderId: payload.orderId 
        });

        await commissionService.settleCommissionsForOrder(payload.orderId);

        logger.info('Commissions settled for order', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error settling commissions for payment', {
          error: error instanceof Error ? error.message : 'Unknown error',
          paymentId: payload?.paymentId,
        });
      }
    }
  );

  await messageBroker.subscribe<ProductCreatedPayload>(
    EXCHANGES.PRODUCT,
    QUEUES.SELLER_PRODUCT_CREATED,
    getRoutingKey('PRODUCT', 'CREATED'),
    async (rawPayload) => {
      let payload: ProductCreatedPayload | undefined;
      try {
        payload = unwrapEventData<ProductCreatedPayload>(rawPayload);
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
          productId: payload?.productId,
        });
      }
    }
  );

  await messageBroker.subscribe<ProductDeletedPayload>(
    EXCHANGES.PRODUCT,
    QUEUES.SELLER_PRODUCT_DELETED,
    getRoutingKey('PRODUCT', 'DELETED'),
    async (rawPayload) => {
      let payload: ProductDeletedPayload | undefined;
      try {
        payload = unwrapEventData<ProductDeletedPayload>(rawPayload);
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
          productId: payload?.productId,
        });
      }
    }
  );

  logger.info('Seller service event subscribers initialized');
};
