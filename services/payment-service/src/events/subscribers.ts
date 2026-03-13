import { messageBroker } from '../lib/message-broker';
import { Events, Queues, IOrderCreatedEvent, IOrderCancelledEvent } from '@freeshop/shared-events';
import { prisma } from '../lib/prisma';
import { logger } from '@freeshop/shared-utils';
import { PaymentStatus } from '../../generated/prisma';

export async function setupEventSubscribers(): Promise<void> {
  // Subscribe to order created events
  await messageBroker.subscribe<IOrderCreatedEvent>(
    Queues.PAYMENT_EVENTS,
    Events.ORDER_CREATED,
    async (event) => {
      logger.info('Payment service received order created event', { 
        orderId: event.orderId,
        paymentMethod: event.paymentMethod,
      });
      
      // For COD orders, payment is auto-created in pending state
      if (event.paymentMethod === 'COD') {
        await prisma.payment.create({
          data: {
            orderId: event.orderId,
            userId: event.userId,
            amount: event.total || 0,
            method: 'COD',
            status: PaymentStatus.PENDING,
          },
        }).catch((err: any) => {
          logger.error('Failed to create COD payment record', { 
            orderId: event.orderId, 
            error: err.message 
          });
        });
      }
    }
  );

  // Subscribe to order cancelled events
  await messageBroker.subscribe<IOrderCancelledEvent>(
    Queues.PAYMENT_EVENTS,
    Events.ORDER_CANCELLED,
    async (event) => {
      logger.info('Payment service received order cancelled event', { orderId: event.orderId });
      
      // Cancel any pending payments
      await prisma.payment.updateMany({
        where: { 
          orderId: event.orderId,
          status: PaymentStatus.PENDING,
        },
        data: { status: PaymentStatus.CANCELLED },
      }).catch((err: any) => {
        logger.error('Failed to cancel payment', { 
          orderId: event.orderId, 
          error: err.message 
        });
      });
    }
  );

  logger.info('Payment service event subscribers initialized');
}
