import { messageBroker } from '../lib/message-broker.js';
import { inventoryService } from '../services/inventory.service.js';
import { EXCHANGES, getRoutingKey, QUEUES} from '@freeshop/shared-events';
import { createServiceLogger } from '@freeshop/shared-utils';

const logger = createServiceLogger('inventory-service');

interface OrderItem {
  productId: string;
  variantId?: string;
   freeItemId?: string;
   freeItemIds?: string[];
  quantity: number;
  price?: number;
}

interface OrderCreatedPayload {
  orderId: string;
  userId?: string;
  items: OrderItem[];
  totalAmount: number;
}

interface OrderCancelledPayload {
  orderId: string;
  reason?: string;
}

interface OrderCompletedPayload {
  orderId: string;
  userId?: string;
  items: OrderItem[];
}

interface PaymentRefundedPayload {
  paymentId: string;
  orderId: string;
  amount: number;
}

export const setupEventSubscribers = async (): Promise<void> => {
  await messageBroker.subscribe<OrderCreatedPayload>(
    EXCHANGES.ORDER,
    QUEUES.INVENTORY_ORDER_CREATED,
    getRoutingKey('ORDER', 'CREATED'),
    async (payload) => {
      try {
        logger.info('Processing order created event for inventory', { orderId: payload.orderId });

        for (const item of payload.items) {
          const chosenFreeId = Array.isArray(item.freeItemIds) && item.freeItemIds.length ? item.freeItemIds[0] : item.freeItemId;
          const inventoryKey = chosenFreeId
            ? `${item.productId}:free:${chosenFreeId}`
            : item.variantId
            ? `${item.productId}:${item.variantId}`
            : item.productId;

          const reserved = await inventoryService.reserveStock(
            inventoryKey,
            payload.orderId,
            item.quantity
          );

          if (!reserved) {
            logger.error('Failed to reserve stock for order', {
              orderId: payload.orderId,
              productId: item.productId,
              variantId: item.variantId,
              requestedQuantity: item.quantity,
            });

            await messageBroker.publish(
              EXCHANGES.INVENTORY,
              getRoutingKey('INVENTORY', 'RESERVATION_FAILED'),
              {
                orderId: payload.orderId,
                productId: item.productId,
                variantId: item.variantId,
                reason: 'Insufficient stock',
              }
            );
          }
        }

        await messageBroker.publish(
          EXCHANGES.INVENTORY,
          getRoutingKey('INVENTORY', 'RESERVED'),
          {
            orderId: payload.orderId,
            items: payload.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              freeItemId: item.freeItemId,
                freeItemIds: item.freeItemIds,
              quantity: item.quantity,
            })),
          }
        );

        logger.info('Stock reserved for order', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error reserving stock for order', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<OrderCancelledPayload>(
    EXCHANGES.ORDER,
    QUEUES.INVENTORY_ORDER_CANCELLED,
    getRoutingKey('ORDER', 'CANCELLED'),
    async (payload) => {
      try {
        logger.info('Processing order cancelled event for inventory', { orderId: payload.orderId });

        await inventoryService.releaseReservation(payload.orderId);

        await messageBroker.publish(
          EXCHANGES.INVENTORY,
          getRoutingKey('INVENTORY', 'RELEASED'),
          {
            orderId: payload.orderId,
            reason: payload.reason || 'Order cancelled',
          }
        );

        logger.info('Stock released for cancelled order', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error releasing stock for cancelled order', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<OrderCompletedPayload>(
    EXCHANGES.ORDER,
    QUEUES.INVENTORY_ORDER_COMPLETED,
    getRoutingKey('ORDER', 'COMPLETED'),
    async (payload) => {
      try {
        logger.info('Processing order completed event for inventory', { orderId: payload.orderId });

        await inventoryService.fulfillReservation(payload.orderId);

        await messageBroker.publish(
          EXCHANGES.INVENTORY,
          getRoutingKey('INVENTORY', 'FULFILLED'),
          {
            orderId: payload.orderId,
            items: payload.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
            })),
          }
        );

        logger.info('Reservation fulfilled for completed order', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error fulfilling reservation for order', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<PaymentRefundedPayload>(
    EXCHANGES.PAYMENT,
    QUEUES.INVENTORY_PAYMENT_REFUNDED,
    getRoutingKey('PAYMENT', 'REFUNDED'),
    async (payload) => {
      try {
        logger.info('Processing payment refunded event for inventory', {
          paymentId: payload.paymentId,
          orderId: payload.orderId,
        });

        logger.info('Payment refund processed for inventory tracking', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error processing payment refund for inventory', {
          error: error instanceof Error ? error.message : 'Unknown error',
          paymentId: payload.paymentId,
        });
      }
    }
  );

  logger.info('Inventory service event subscribers initialized');
};
