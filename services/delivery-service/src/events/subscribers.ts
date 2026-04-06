import { Events, EXCHANGES, getRoutingKey, QUEUES } from '@freeshop/shared-events';
import logger from '@freeshop/shared-utils';
import { DeliveryDispatchStatus, DeliveryProvider } from '../../generated/prisma';
import { messageBroker } from '../lib/message-broker';
import { deliveryService } from '../services/delivery.service';

interface OrderCreatedPayload {
  orderId: string;
  orderNumber: string;
  userId?: string;
  shippingAddress?: Record<string, unknown>;
  items: Array<{
    sellerId: string;
  }>;
}

interface DeliveryDispatchPayload {
  orderId: string;
  orderNumber: string;
  userId?: string;
  provider: DeliveryProvider;
  status: DeliveryDispatchStatus;
  note?: string;
  trackingNumber?: string;
}

export const setupEventSubscribers = async (): Promise<void> => {
  await messageBroker.subscribe<OrderCreatedPayload>(
    EXCHANGES.ORDER,
    QUEUES.DELIVERY_ORDER_CREATED,
    getRoutingKey('ORDER', 'CREATED'),
    async (payload) => {
      try {
        const providerFromAddress = String((payload.shippingAddress as any)?.delivery?.provider || '').toUpperCase();
        const provider = providerFromAddress === 'INHOUSE' ? DeliveryProvider.INHOUSE : DeliveryProvider.STEADFAST;

        await deliveryService.createFromOrder({
          orderId: payload.orderId,
          orderNumber: payload.orderNumber,
          userId: payload.userId,
          shippingAddress: payload.shippingAddress,
          provider,
          items: payload.items,
        });

        logger.info('Delivery record created from order event', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Failed to create delivery from order event', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<DeliveryDispatchPayload>(
    EXCHANGES.ORDER,
    QUEUES.DELIVERY_ORDER_DISPATCHED,
    Events.ORDER_DELIVERY_DISPATCHED,
    async (payload) => {
      try {
        await deliveryService.updateDispatchStatus({
          orderId: payload.orderId,
          provider: payload.provider,
          status: DeliveryDispatchStatus.DISPATCHED,
          note: payload.note,
          trackingNumber: payload.trackingNumber,
          providerMeta: payload as unknown as Record<string, unknown>,
        });

        logger.info('Delivery dispatch status synced (dispatched)', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Failed to sync dispatched delivery event', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<DeliveryDispatchPayload>(
    EXCHANGES.ORDER,
    QUEUES.DELIVERY_ORDER_DISPATCH_FAILED,
    Events.ORDER_DELIVERY_DISPATCH_FAILED,
    async (payload) => {
      try {
        await deliveryService.updateDispatchStatus({
          orderId: payload.orderId,
          provider: payload.provider,
          status: DeliveryDispatchStatus.FAILED,
          note: payload.note,
          trackingNumber: payload.trackingNumber,
          providerMeta: payload as unknown as Record<string, unknown>,
        });

        logger.info('Delivery dispatch status synced (failed)', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Failed to sync failed delivery event', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload.orderId,
        });
      }
    }
  );

  logger.info('Delivery service event subscribers initialized');
};
