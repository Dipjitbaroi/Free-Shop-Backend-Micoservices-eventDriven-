import { messageBroker } from '../lib/message-broker.js';
import { inventoryService } from '../services/inventory.service.js';
import { cleanupService } from '../services/cleanup.service.js';
import { EXCHANGES, getRoutingKey, QUEUES} from '@freeshop/shared-events';
import { createServiceLogger } from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma.js';

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

interface ProductCreatedPayload {
  productId: string;
  createdBy: string;
  vendorId: string | null;
  name: string;
  price: number;
  stock?: number;
  reservedStock?: number;
  lowStockThreshold?: number;
  categoryId: string;
}

export const setupEventSubscribers = async (): Promise<void> => {
  await messageBroker.subscribe<ProductCreatedPayload>(
    EXCHANGES.PRODUCT,
    QUEUES.INVENTORY_PRODUCT_CREATED,
    getRoutingKey('PRODUCT', 'CREATED'),
    async (payload) => {
      try {
        logger.info('Processing product created event for inventory', { 
          productId: payload.productId,
          createdBy: payload.createdBy 
        });

        // Initialize inventory for the newly created product with the userId who created it
        await inventoryService.initializeInventory(
          payload.createdBy,
          payload.stock ?? 0,
          payload.lowStockThreshold,
          payload.productId // productId
        );

        logger.info('Inventory initialized for product', { productId: payload.productId });
      } catch (error) {
        logger.error('Error initializing inventory for product', {
          error: error instanceof Error ? error.message : 'Unknown error',
          productId: payload.productId,
        });
      }
    }
  );

  await messageBroker.subscribe<OrderCreatedPayload>(
    EXCHANGES.ORDER,
    QUEUES.INVENTORY_ORDER_CREATED,
    getRoutingKey('ORDER', 'CREATED'),
    async (payload) => {
      try {
        logger.info('Processing order created event for inventory', { orderId: payload.orderId });

        const reservedItems = [];
        const failedItems = [];
        let hasAnyFailure = false;

        for (const item of payload.items) {
          const freeItemId = Array.isArray(item.freeItemIds) && item.freeItemIds.length ? item.freeItemIds[0] : item.freeItemId;
          // Reserve quantity: 1 for free items (regardless of product quantity), or product quantity for regular items
          const reserveQuantity = freeItemId ? 1 : item.quantity;

          try {
            const reserved = await inventoryService.reserveStock(
              payload.orderId,
              reserveQuantity,
              item.productId,
              item.variantId,
              freeItemId
            );

            if (reserved) {
              reservedItems.push({
                productId: item.productId,
                variantId: item.variantId,
                freeItemId: item.freeItemId,
                freeItemIds: item.freeItemIds,
                quantity: item.quantity,
              });
            } else {
              hasAnyFailure = true;
              failedItems.push({
                productId: item.productId,
                variantId: item.variantId,
                freeItemId: item.freeItemId,
                quantity: item.quantity,
              });

              logger.warn('Failed to reserve stock for order item', {
                orderId: payload.orderId,
                productId: item.productId,
                variantId: item.variantId,
                requestedQuantity: item.quantity,
              });

              // Publish reservation failure event
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
          } catch (itemError) {
            hasAnyFailure = true;
            failedItems.push({
              productId: item.productId,
              variantId: item.variantId,
              freeItemId: item.freeItemId,
              quantity: item.quantity,
            });

            logger.error('Error reserving stock for order item', {
              error: itemError instanceof Error ? itemError.message : 'Unknown error',
              orderId: payload.orderId,
              productId: item.productId,
            });
          }
        }

        // If any items failed, compensate (rollback) all reserved items
        if (hasAnyFailure && reservedItems.length > 0) {
          logger.warn('Partial reservation failure detected, compensating reserved items', {
            orderId: payload.orderId,
            reserved: reservedItems.length,
            failed: failedItems.length,
          });

          const compensated = await cleanupService.compensateFailedReservation(
            payload.orderId,
            `Partial failure: ${failedItems.length} item(s) out of ${payload.items.length}`
          );

          await messageBroker.publish(
            EXCHANGES.INVENTORY,
            getRoutingKey('INVENTORY', 'COMPENSATED'),
            {
              orderId: payload.orderId,
              compensatedCount: compensated,
              reason: `Partial reservation failure - ${failedItems.length} items failed`,
            }
          );

          logger.info('Compensation completed for failed order', {
            orderId: payload.orderId,
            compensatedCount: compensated,
          });
          return;
        }

        // Only publish RESERVED event if ALL items were successfully reserved
        if (reservedItems.length > 0 && !hasAnyFailure) {
          await messageBroker.publish(
            EXCHANGES.INVENTORY,
            getRoutingKey('INVENTORY', 'RESERVED'),
            {
              orderId: payload.orderId,
              items: reservedItems,
            }
          );

          logger.info('Stock reserved for order', { orderId: payload.orderId });
        }
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
    getRoutingKey('ORDER', 'DELIVERED'),
    async (payload) => {
      try {
        logger.info('Processing order delivered event for inventory', { orderId: payload.orderId });

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

        logger.info('Reservation fulfilled for delivered order', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error fulfilling reservation for delivered order', {
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
          amount: payload.amount,
        });

        // Release inventory for refunded orders
        const refunded = await cleanupService.handlePaymentRefund(
          payload.orderId,
          payload.amount
        );

        logger.info('Payment refund processed for inventory', {
          orderId: payload.orderId,
          refundedItemCount: refunded,
        });
      } catch (error) {
        logger.error('Error processing payment refund for inventory', {
          error: error instanceof Error ? error.message : 'Unknown error',
          paymentId: payload.paymentId,
          orderId: payload.orderId,
        });
      }
    }
  );

  logger.info('Inventory service event subscribers initialized');
};
