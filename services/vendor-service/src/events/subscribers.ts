import { messageBroker } from '../lib/message-broker';
import { vendorService } from '../services/vendor.service';
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
  vendorId: string;
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
  vendorId: string;
}

interface ProductDeletedPayload {
  productId: string;
  vendorId: string;
}

interface PaymentReceivedPayload {
  paymentId: string;
  orderId: string;
  amount: number;
  vendorId?: string;
}

export const setupEventSubscribers = async (): Promise<void> => {
  await messageBroker.subscribe<OrderCreatedPayload>(
    EXCHANGES.ORDER,
    QUEUES.VENDOR_ORDER_COMPLETED,
    getRoutingKey('ORDER', 'CREATED'),
    async (rawPayload) => {
      let payload: OrderCreatedPayload | undefined;
      try {
        payload = unwrapEventData<OrderCreatedPayload>(rawPayload);
        logger.info('Processing order created event for vendor', { orderId: payload.orderId });

        const vendorItems = new Map<string, OrderItem[]>();
        
        for (const item of payload.items) {
          if (item.vendorId) {
            const items = vendorItems.get(item.vendorId) || [];
            items.push(item);
            vendorItems.set(item.vendorId, items);
          }
        }

        for (const [vendorId, items] of vendorItems) {
          let totalVendorAmount = 0;

          for (const item of items) {
            const itemSubtotal = item.subtotal ?? item.price * item.quantity;

            await commissionService.createCommission({
              vendorId,
              orderId: payload.orderId,
              productId: item.productId,
              orderAmount: itemSubtotal,
            });
            totalVendorAmount += itemSubtotal;
          }

          await vendorService.updateVendorStats(vendorId, {
            ordersChange: 1,
            revenueChange: totalVendorAmount,
          });
        }

        logger.info('Commissions created for order', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error processing order creation for vendor', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload?.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<OrderCancelledPayload>(
    EXCHANGES.ORDER,
    QUEUES.VENDOR_ORDER_CANCELLED,
    getRoutingKey('ORDER', 'CANCELLED'),
    async (rawPayload) => {
      let payload: OrderCancelledPayload | undefined;
      try {
        payload = unwrapEventData<OrderCancelledPayload>(rawPayload);
        logger.info('Processing order cancelled event for vendor', { orderId: payload.orderId });

        const cancelledCommissions = await commissionService.cancelCommissionsForOrder(payload.orderId);

        const vendorTotals = new Map<string, { orders: number; revenue: number }>();
        for (const commission of cancelledCommissions) {
          const existing = vendorTotals.get(commission.vendorId) || { orders: 0, revenue: 0 };
          existing.orders += 1;
          existing.revenue += Number(commission.orderAmount);
          vendorTotals.set(commission.vendorId, existing);
        }

        for (const [vendorId, totals] of vendorTotals) {
          await vendorService.updateVendorStats(vendorId, {
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
    QUEUES.VENDOR_PAYMENT_COMPLETED,
    getRoutingKey('PAYMENT', 'RECEIVED'),
    async (rawPayload) => {
      let payload: PaymentReceivedPayload | undefined;
      try {
        payload = unwrapEventData<PaymentReceivedPayload>(rawPayload);
        logger.info('Processing payment completed event for vendor', { 
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
    QUEUES.VENDOR_PRODUCT_CREATED,
    getRoutingKey('PRODUCT', 'CREATED'),
    async (rawPayload) => {
      let payload: ProductCreatedPayload | undefined;
      try {
        payload = unwrapEventData<ProductCreatedPayload>(rawPayload);
        logger.info('Processing product created event for vendor', { 
          productId: payload.productId, 
          vendorId: payload.vendorId 
        });

        if (payload.vendorId) {
          await vendorService.updateVendorStats(payload.vendorId, {
            productsChange: 1,
          });
        }

        logger.info('vendor stats updated for new product', { vendorId: payload.vendorId });
      } catch (error) {
        logger.error('Error updating vendor stats for product', {
          error: error instanceof Error ? error.message : 'Unknown error',
          productId: payload?.productId,
        });
      }
    }
  );

  await messageBroker.subscribe<ProductDeletedPayload>(
    EXCHANGES.PRODUCT,
    QUEUES.VENDOR_PRODUCT_DELETED,
    getRoutingKey('PRODUCT', 'DELETED'),
    async (rawPayload) => {
      let payload: ProductDeletedPayload | undefined;
      try {
        payload = unwrapEventData<ProductDeletedPayload>(rawPayload);
        logger.info('Processing product deleted event for vendor', { 
          productId: payload.productId, 
          vendorId: payload.vendorId 
        });

        if (payload.vendorId) {
          await vendorService.updateVendorStats(payload.vendorId, {
            productsChange: -1,
          });
        }

        logger.info('vendor stats updated for deleted product', { vendorId: payload.vendorId });
      } catch (error) {
        logger.error('Error updating vendor stats for deleted product', {
          error: error instanceof Error ? error.message : 'Unknown error',
          productId: payload?.productId,
        });
      }
    }
  );

  logger.info('vendor service event subscribers initialized');
};

