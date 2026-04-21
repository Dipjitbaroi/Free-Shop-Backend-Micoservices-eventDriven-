import { messageBroker } from '../lib/message-broker.js';
import { vendorService } from '../services/vendor.service.js';
import { prisma } from '../lib/prisma.js';
import { EXCHANGES, getRoutingKey, QUEUES } from '@freeshop/shared-events';
import { createServiceLogger } from '@freeshop/shared-utils';

const logger = createServiceLogger('vendor-service');

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
          // Prefer using product.supplierPrice (vendor-visible) when available.
            let totalVendorAmount = 0;

            for (const item of items) {
              // item may include supplierPrice published by order-service
              const supplierPrice = (item as any).supplierPrice as number | undefined;
              const itemSubtotal = supplierPrice !== undefined && supplierPrice !== null
                ? supplierPrice * item.quantity
                : (item.subtotal ?? item.price * item.quantity);

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

        // Commissions are handled offline; no DB commission records to cancel.
        logger.info('Order cancellation received; commissions handled offline', { orderId: payload.orderId });
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

        // Commissions are handled offline; nothing to settle in-system.
        logger.info('Payment received; commission settlement handled offline', { orderId: payload.orderId, paymentId: payload.paymentId });
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

