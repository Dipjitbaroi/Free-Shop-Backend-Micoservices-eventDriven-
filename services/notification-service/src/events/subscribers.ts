import { messageBroker } from '../lib/message-broker';
import { notificationService } from '../services/notification.service';
import { EXCHANGES, getRoutingKey, QUEUES } from '@freeshop/shared-events';
import logger from '@freeshop/shared-utils';

interface UserCreatedPayload {
  userId: string;
  email: string;
  name: string;
}

interface OrderCreatedPayload {
  orderId: string;
  userId?: string;
  email?: string;
  items: Array<{ productName: string; quantity: number; price: number }>;
  totalAmount: number;
}

interface OrderStatusPayload {
  orderId: string;
  userId?: string;
  email?: string;
  status: string;
  trackingNumber?: string;
}

interface PaymentPayload {
  paymentId: string;
  orderId: string;
  userId?: string;
  email?: string;
  amount: number;
  status: string;
}

interface VendorVerifiedPayload {
  vendorId: string;
  userId: string;
  email?: string;
  storeName: string;
  verified: boolean;
  reason?: string;
}

interface WithdrawalPayload {
  withdrawalId: string;
  vendorId: string;
  userId: string;
  email?: string;
  amount: number;
  transactionId?: string;
  reason?: string;
}

interface InventoryAlertPayload {
  productId: string;
  productName: string;
  vendorId: string;
  email?: string;
  currentStock: number;
  threshold: number;
}

export const setupEventSubscribers = async (): Promise<void> => {
  await messageBroker.subscribe<UserCreatedPayload>(
    EXCHANGES.USER,
    QUEUES.NOTIFICATION_USER_CREATED,
    getRoutingKey('USER', 'CREATED'),
    async (payload) => {
      try {
        logger.info('Processing user created event for notification', { userId: payload.userId });

        await notificationService.sendNotification({
          userId: payload.userId,
          email: payload.email,
          type: 'WELCOME',
          channel: 'EMAIL',
          templateId: 'welcome-email',
          templateData: {
            name: payload.name,
            email: payload.email,
          },
        });

        logger.info('Welcome notification sent', { userId: payload.userId });
      } catch (error) {
        logger.error('Error sending welcome notification', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: payload.userId,
        });
      }
    }
  );

  await messageBroker.subscribe<OrderCreatedPayload>(
    EXCHANGES.ORDER,
    QUEUES.NOTIFICATION_ORDER_CREATED,
    getRoutingKey('ORDER', 'CREATED'),
    async (payload) => {
      try {
        logger.info('Processing order created event for notification', { orderId: payload.orderId });

        const recipient = payload.userId || payload.email;
        if (recipient) {
          await notificationService.sendNotification({
            userId: payload.userId,
            email: payload.email,
            type: 'ORDER_CREATED',
            channel: 'EMAIL',
            templateId: 'order-created',
            templateData: {
              orderId: payload.orderId,
              items: payload.items,
              totalAmount: payload.totalAmount,
            },
          });
        }

        logger.info('Order created notification sent', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error sending order created notification', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<OrderStatusPayload>(
    EXCHANGES.ORDER,
    QUEUES.NOTIFICATION_ORDER_SHIPPED,
    getRoutingKey('ORDER', 'SHIPPED'),
    async (payload) => {
      try {
        logger.info('Processing order shipped event for notification', { orderId: payload.orderId });

        await notificationService.sendNotification({
          userId: payload.userId,
          email: payload.email,
          type: 'ORDER_SHIPPED',
          channel: 'EMAIL',
          templateId: 'order-shipped',
          templateData: {
            orderId: payload.orderId,
            trackingNumber: payload.trackingNumber,
          },
        });

        if (payload.userId) {
          await notificationService.sendNotification({
            userId: payload.userId,
            type: 'ORDER_SHIPPED',
            channel: 'PUSH',
            subject: 'Order Shipped!',
            content: `Your order #${payload.orderId.slice(0, 8)} has been shipped.`,
          });
        }

        logger.info('Order shipped notification sent', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error sending order shipped notification', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<OrderStatusPayload>(
    EXCHANGES.ORDER,
    QUEUES.NOTIFICATION_ORDER_DELIVERED,
    getRoutingKey('ORDER', 'DELIVERED'),
    async (payload) => {
      try {
        logger.info('Processing order delivered event for notification', { orderId: payload.orderId });

        await notificationService.sendNotification({
          userId: payload.userId,
          email: payload.email,
          type: 'ORDER_DELIVERED',
          channel: 'EMAIL',
          templateId: 'order-delivered',
          templateData: {
            orderId: payload.orderId,
          },
        });

        logger.info('Order delivered notification sent', { orderId: payload.orderId });
      } catch (error) {
        logger.error('Error sending order delivered notification', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId: payload.orderId,
        });
      }
    }
  );

  await messageBroker.subscribe<PaymentPayload>(
    EXCHANGES.PAYMENT,
    QUEUES.NOTIFICATION_PAYMENT_RECEIVED,
    getRoutingKey('PAYMENT', 'COMPLETED'),
    async (payload) => {
      try {
        logger.info('Processing payment completed event for notification', { 
          paymentId: payload.paymentId 
        });

        await notificationService.sendNotification({
          userId: payload.userId,
          email: payload.email,
          type: 'PAYMENT_RECEIVED',
          channel: 'EMAIL',
          templateId: 'payment-received',
          templateData: {
            orderId: payload.orderId,
            paymentId: payload.paymentId,
            amount: payload.amount,
          },
        });

        logger.info('Payment received notification sent', { paymentId: payload.paymentId });
      } catch (error) {
        logger.error('Error sending payment notification', {
          error: error instanceof Error ? error.message : 'Unknown error',
          paymentId: payload.paymentId,
        });
      }
    }
  );

  await messageBroker.subscribe<PaymentPayload>(
    EXCHANGES.PAYMENT,
    QUEUES.NOTIFICATION_PAYMENT_FAILED,
    getRoutingKey('PAYMENT', 'FAILED'),
    async (payload) => {
      try {
        logger.info('Processing payment failed event for notification', { 
          paymentId: payload.paymentId 
        });

        await notificationService.sendNotification({
          userId: payload.userId,
          email: payload.email,
          type: 'PAYMENT_FAILED',
          channel: 'EMAIL',
          templateId: 'payment-failed',
          templateData: {
            orderId: payload.orderId,
            paymentId: payload.paymentId,
            amount: payload.amount,
          },
        });

        logger.info('Payment failed notification sent', { paymentId: payload.paymentId });
      } catch (error) {
        logger.error('Error sending payment failed notification', {
          error: error instanceof Error ? error.message : 'Unknown error',
          paymentId: payload.paymentId,
        });
      }
    }
  );

  await messageBroker.subscribe<VendorVerifiedPayload>(
    EXCHANGES.VENDOR,
    QUEUES.NOTIFICATION_VENDOR_VERIFIED,
    getRoutingKey('Vendor', 'VERIFIED'),
    async (payload) => {
      try {
        logger.info('Processing Vendor verified event for notification', { 
          vendorId: payload.vendorId 
        });

        const type = payload.verified ? 'VENDOR_VERIFIED' : 'VENDOR_SUSPENDED';
        const templateId = payload.verified ? 'Vendor-verified' : 'Vendor-rejected';

        await notificationService.sendNotification({
          userId: payload.userId,
          email: payload.email,
          type,
          channel: 'EMAIL',
          templateId,
          templateData: {
            storeName: payload.storeName,
            reason: payload.reason,
          },
        });

        logger.info('Vendor verification notification sent', { vendorId: payload.vendorId });
      } catch (error) {
        logger.error('Error sending Vendor verification notification', {
          error: error instanceof Error ? error.message : 'Unknown error',
          vendorId: payload.vendorId,
        });
      }
    }
  );

  await messageBroker.subscribe<WithdrawalPayload>(
    EXCHANGES.VENDOR,
    QUEUES.NOTIFICATION_WITHDRAWAL_COMPLETED,
    getRoutingKey('Vendor', 'WITHDRAWAL_COMPLETED'),
    async (payload) => {
      try {
        logger.info('Processing withdrawal completed event for notification', { 
          withdrawalId: payload.withdrawalId 
        });

        await notificationService.sendNotification({
          userId: payload.userId,
          email: payload.email,
          type: 'WITHDRAWAL_COMPLETED',
          channel: 'EMAIL',
          templateId: 'withdrawal-completed',
          templateData: {
            withdrawalId: payload.withdrawalId,
            amount: payload.amount,
            transactionId: payload.transactionId,
          },
        });

        logger.info('Withdrawal completed notification sent', { withdrawalId: payload.withdrawalId });
      } catch (error) {
        logger.error('Error sending withdrawal completed notification', {
          error: error instanceof Error ? error.message : 'Unknown error',
          withdrawalId: payload.withdrawalId,
        });
      }
    }
  );

  await messageBroker.subscribe<InventoryAlertPayload>(
    EXCHANGES.INVENTORY,
    QUEUES.NOTIFICATION_LOW_STOCK,
    getRoutingKey('INVENTORY', 'LOW_STOCK'),
    async (payload) => {
      try {
        logger.info('Processing low stock event for notification', { 
          productId: payload.productId 
        });

        await notificationService.sendNotification({
          email: payload.email,
          type: 'LOW_STOCK_ALERT',
          channel: 'EMAIL',
          templateId: 'low-stock-alert',
          templateData: {
            productId: payload.productId,
            productName: payload.productName,
            currentStock: payload.currentStock,
            threshold: payload.threshold,
          },
        });

        logger.info('Low stock notification sent', { productId: payload.productId });
      } catch (error) {
        logger.error('Error sending low stock notification', {
          error: error instanceof Error ? error.message : 'Unknown error',
          productId: payload.productId,
        });
      }
    }
  );

  logger.info('Notification service event subscribers initialized');
};

