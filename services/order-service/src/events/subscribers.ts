import { messageBroker } from '../lib/message-broker.js';
import { Events, Queues, IPaymentReceivedEvent, IInventoryReservedEvent, IInventoryReleasedEvent } from '@freeshop/shared-events';
import { prisma } from '../lib/prisma.js';
import { logger } from '@freeshop/shared-utils';
import { PaymentStatus, OrderStatus } from '../../generated/client/client.js';

export async function setupEventSubscribers(): Promise<void> {
  // Subscribe to payment received events
  await messageBroker.subscribe<IPaymentReceivedEvent>(
    Queues.ORDER_EVENTS,
    Events.PAYMENT_RECEIVED,
    async (event) => {
      logger.info('Order service received payment event', { orderId: event.orderId });
      
      // Update order payment status
      await prisma.order.update({
        where: { id: event.orderId },
        data: { 
          paymentStatus: PaymentStatus.PAID,
          paidAt: new Date(),
          status: OrderStatus.CONFIRMED,
        },
      }).catch((err: any) => {
        logger.error('Failed to update order payment status', { 
          orderId: event.orderId, 
          error: err.message 
        });
      });
    }
  );

  // Subscribe to inventory reserved events
  await messageBroker.subscribe<IInventoryReservedEvent>(
    Queues.ORDER_EVENTS,
    Events.INVENTORY_RESERVED,
    async (event) => {
      logger.info('Order service received inventory reserved event', { orderId: event.orderId });
      
      // Order can proceed - inventory has been reserved
      await prisma.order.update({
        where: { id: event.orderId },
        data: { status: OrderStatus.PROCESSING },
      }).catch((err: any) => {
        logger.error('Failed to update order status after inventory reservation', { 
          orderId: event.orderId, 
          error: err.message 
        });
      });
    }
  );

  // Subscribe to inventory release events (order cancelled)
  await messageBroker.subscribe<IInventoryReleasedEvent>(
    Queues.ORDER_EVENTS,
    Events.INVENTORY_RELEASED,
    async (event) => {
      logger.info('Order service received inventory released event', { orderId: event.orderId });
      // No action needed - inventory service handles the release
    }
  );

  logger.info('Order service event subscribers initialized');
}
