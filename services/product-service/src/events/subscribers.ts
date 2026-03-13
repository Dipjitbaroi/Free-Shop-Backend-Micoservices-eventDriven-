import { messageBroker } from '../lib/message-broker';
import { Events, Queues, IOrderCreatedEvent, IOrderCancelledEvent, ISellerApprovedEvent } from '@freeshop/shared-events';
import { prisma } from '../lib/prisma';
import { logger } from '@freeshop/shared-utils';

export async function setupEventSubscribers(): Promise<void> {
  // Subscribe to order created events to potentially track product sales
  await messageBroker.subscribe<IOrderCreatedEvent>(
    Queues.PRODUCT_EVENTS,
    Events.ORDER_CREATED,
    async (event) => {
      logger.info('Product service received order created event', { orderId: event.orderId });
      
      // Update product sold counts if needed
      for (const item of event.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            totalSold: { increment: item.quantity },
          },
        }).catch(err => {
          logger.error('Failed to update product sold count', { 
            productId: item.productId, 
            error: err.message 
          });
        });
      }
    }
  );

  // Subscribe to order cancelled events to decrement sold count
  await messageBroker.subscribe<IOrderCancelledEvent>(
    Queues.PRODUCT_EVENTS,
    Events.ORDER_CANCELLED,
    async (event) => {
      logger.info('Product service received order cancelled event', { orderId: event.orderId });
      
      // Revert product sold counts
      for (const item of event.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            totalSold: { decrement: item.quantity },
          },
        }).catch(err => {
          logger.error('Failed to revert product sold count', { 
            productId: item.productId, 
            error: err.message 
          });
        });
      }
    }
  );

  // Subscribe to seller approved events
  await messageBroker.subscribe<ISellerApprovedEvent>(
    Queues.PRODUCT_EVENTS,
    Events.SELLER_APPROVED,
    async (event) => {
      logger.info('Product service received seller approved event', { sellerId: event.sellerId });
      
      // Auto-approve pending products from verified sellers (optional behavior)
      // This is a business logic decision - uncomment if needed
      /*
      await prisma.product.updateMany({
        where: { 
          sellerId: event.sellerId,
          status: 'PENDING',
        },
        data: {
          status: 'APPROVED',
        },
      });
      */
    }
  );

  logger.info('Product service event subscribers initialized');
}
