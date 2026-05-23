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
      const eventTimestamp = new Date().toISOString();
      logger.info('💰 [EVENT] Order service received PAYMENT_RECEIVED event', { 
        orderId: event.orderId,
        eventTimestamp,
        eventData: {
          paymentId: event.paymentId,
          amount: event.amount,
          method: event.method,
          transactionId: event.transactionId,
          paidAt: event.paidAt,
        },
      });
      
      // Get current order status and payment method to prevent overwriting cancelled orders
      const order = await prisma.order.findUnique({
        where: { id: event.orderId },
        select: { status: true, paymentStatus: true, paymentMethod: true, createdAt: true },
      });

      if (!order) {
        logger.error('❌ [EVENT] Order not found for PAYMENT_RECEIVED event', { orderId: event.orderId });
        return;
      }

      logger.info('📋 [EVENT] Order details retrieved', {
        orderId: event.orderId,
        currentOrderStatus: order.status,
        currentPaymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        orderCreatedAt: order.createdAt,
        orderAge: new Date().getTime() - new Date(order.createdAt).getTime() + 'ms',
      });

      // Do not update order if it's already cancelled to prevent race conditions
      if (order?.status === OrderStatus.CANCELLED) {
        logger.warn('🚫 [EVENT] Ignoring PAYMENT_RECEIVED for cancelled order', { orderId: event.orderId });
        return;
      }
      
      // Guard: For COD orders, only mark as PAID if delivery is actually DELIVERED
      // This prevents premature payment completion
      if (order?.paymentMethod === 'COD') {
        const delivery = await prisma.deliveryInfo.findUnique({
          where: { orderId: event.orderId },
          select: { status: true, createdAt: true },
        });
        
        logger.info('📦 [EVENT] COD order - checking delivery status', {
          orderId: event.orderId,
          deliveryExists: !!delivery,
          deliveryStatus: delivery?.status || 'no-delivery',
          deliveryCreatedAt: delivery?.createdAt,
        });

        if (!delivery || delivery.status !== 'DELIVERED') {
          logger.warn('🚫 [EVENT] Blocking PAYMENT_RECEIVED for COD - delivery not DELIVERED', { 
            orderId: event.orderId,
            deliveryStatus: delivery?.status || 'no-delivery',
            paymentMethod: order.paymentMethod,
            reason: !delivery ? 'No delivery record' : `Delivery status is ${delivery.status}, not DELIVERED`,
          });
          return; // Don't mark as paid yet
        }

        logger.info('✅ [EVENT] COD delivery is DELIVERED - proceeding with payment completion', {
          orderId: event.orderId,
          deliveryStatus: delivery.status,
        });
      }
      
      // Update order payment status
      const shouldMoveToConfirmed = order?.status === OrderStatus.PENDING;
      logger.info('💾 [EVENT] Updating order payment status', {
        orderId: event.orderId,
        newPaymentStatus: PaymentStatus.PAID,
        shouldMoveOrderToConfirmed: shouldMoveToConfirmed,
        newOrderStatus: shouldMoveToConfirmed ? OrderStatus.CONFIRMED : undefined,
      });

      await prisma.order.update({
        where: { id: event.orderId },
        data: { 
          paymentStatus: PaymentStatus.PAID,
          paidAt: new Date(),
          ...(shouldMoveToConfirmed && { status: OrderStatus.CONFIRMED }),
        },
      }).catch((err: any) => {
        logger.error('❌ [EVENT] Failed to update order payment status', { 
          orderId: event.orderId, 
          error: err.message 
        });
      });

      logger.info('✅ [EVENT] PAYMENT_RECEIVED processed successfully', {
        orderId: event.orderId,
        paymentStatus: PaymentStatus.PAID,
        orderStatus: shouldMoveToConfirmed ? OrderStatus.CONFIRMED : order.status,
      });
    }
  );

  // Subscribe to inventory reserved events
  await messageBroker.subscribe<IInventoryReservedEvent>(
    Queues.ORDER_EVENTS,
    Events.INVENTORY_RESERVED,
    async (event) => {
      logger.info('Order service received inventory reserved event', { orderId: event.orderId });
      
      // Get current order status to prevent overwriting cancelled orders
      const order = await prisma.order.findUnique({
        where: { id: event.orderId },
        select: { status: true },
      });

      if (!order) {
        logger.error('[EVENT] Order not found for INVENTORY_RESERVED event', { orderId: event.orderId });
        return;
      }

      // Do not update order if it's already cancelled to prevent race conditions
      if (order.status === OrderStatus.CANCELLED) {
        logger.warn('[EVENT] Ignoring INVENTORY_RESERVED for cancelled order', { orderId: event.orderId });
        return;
      }
      
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
