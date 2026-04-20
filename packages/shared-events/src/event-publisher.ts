import { MessageBroker, IPublishOptions } from './message-broker';
import { Events, Exchanges, ExchangeName } from './constants';
import {
  IUserCreatedPayload,
  IUserUpdatedPayload,
  IUserDeletedEvent,
  IOrderCreatedPayload,
  IOrderStatusChangedPayload,
  IOrderCancelledPayload,
  IPaymentInitiatedPayload,
  IPaymentCompletedPayload,
  IPaymentFailedPayload,
  IInventoryUpdatedPayload,
  IStockReservedPayload,
  IStockReleasedPayload,
  ILowStockAlertPayload,
  IProductCreatedPayload,
  IProductUpdatedPayload,
  IProductStatusChangedPayload,
  IVendorCreatedPayload,
  IVendorStatusChangedPayload,
  INotificationRequestedPayload,
  IEmailRequestedPayload,
  ISmsRequestedPayload,
  IAnalyticsEventPayload,
} from './event-types';

/**
 * Event Publisher - Helper class for publishing events
 */
export class EventPublisher {
  constructor(private broker: MessageBroker) {}

  // User Events
  async userCreated(data: IUserCreatedPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.USER, Events.USER_CREATED, data, options);
  }

  async userUpdated(data: IUserUpdatedPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.USER, Events.USER_UPDATED, data, options);
  }

  async userDeleted(data: IUserDeletedEvent, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.USER, Events.USER_DELETED, data, options);
  }

  // Product Events
  async productCreated(data: IProductCreatedPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.PRODUCT, Events.PRODUCT_CREATED, data, options);
  }

  async productUpdated(data: IProductUpdatedPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.PRODUCT, Events.PRODUCT_UPDATED, data, options);
  }

  async productStatusChanged(data: IProductStatusChangedPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.PRODUCT, Events.PRODUCT_STATUS_CHANGED, data, options);
  }

  // Order Events
  async orderCreated(data: IOrderCreatedPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.ORDER, Events.ORDER_CREATED, data, options);
  }

  async orderStatusChanged(data: IOrderStatusChangedPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.ORDER, Events.ORDER_STATUS_CHANGED, data, options);
  }

  async orderCancelled(data: IOrderCancelledPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.ORDER, Events.ORDER_CANCELLED, data, options);
  }

  // Payment Events
  async paymentInitiated(data: IPaymentInitiatedPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.PAYMENT, Events.PAYMENT_INITIATED, data, options);
  }

  async paymentCompleted(data: IPaymentCompletedPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.PAYMENT, Events.PAYMENT_COMPLETED, data, options);
  }

  async paymentFailed(data: IPaymentFailedPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.PAYMENT, Events.PAYMENT_FAILED, data, options);
  }

  // Inventory Events
  async inventoryUpdated(data: IInventoryUpdatedPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.INVENTORY, Events.INVENTORY_UPDATED, data, options);
  }

  async stockReserved(data: IStockReservedPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.INVENTORY, Events.STOCK_RESERVED, data, options);
  }

  async stockReleased(data: IStockReleasedPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.INVENTORY, Events.STOCK_RELEASED, data, options);
  }

  async lowStockAlert(data: ILowStockAlertPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.INVENTORY, Events.INVENTORY_LOW_STOCK, data, options);
  }

  // Vendor Events
  async vendorCreated(data: IVendorCreatedPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.VENDOR, Events.VENDOR_CREATED, data, options);
  }

  async vendorStatusChanged(data: IVendorStatusChangedPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.VENDOR, Events.VENDOR_APPROVED, data, options);
  }

  // Notification Events
  async requestNotification(data: INotificationRequestedPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.NOTIFICATION, Events.NOTIFICATION_REQUESTED, data, options);
  }

  async requestEmail(data: IEmailRequestedPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.NOTIFICATION, Events.EMAIL_REQUESTED, data, options);
  }

  async requestSms(data: ISmsRequestedPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.NOTIFICATION, Events.SMS_REQUESTED, data, options);
  }

  // Analytics Events
  async trackAnalytics(data: IAnalyticsEventPayload, options?: IPublishOptions): Promise<boolean> {
    return this.broker.publish(Exchanges.ANALYTICS, Events.ANALYTICS_EVENT, data, options);
  }

  // Generic publish method
  async publish<T>(eventName: string, data: T, options?: IPublishOptions): Promise<boolean> {
    const exchange = this.getExchangeForEvent(eventName);
    return this.broker.publish(exchange, eventName, data, options);
  }

  private getExchangeForEvent(event: string): ExchangeName {
    const prefix = event.split('.')[0];
    const exchangeMap: Record<string, ExchangeName> = {
      user: Exchanges.USER,
      product: Exchanges.PRODUCT,
      order: Exchanges.ORDER,
      payment: Exchanges.PAYMENT,
      inventory: Exchanges.INVENTORY,
      vendor: Exchanges.VENDOR,
      notification: Exchanges.NOTIFICATION,
      analytics: Exchanges.ANALYTICS,
      review: Exchanges.PRODUCT,
    };
    return exchangeMap[prefix] || Exchanges.ANALYTICS;
  }
}

export const createEventPublisher = (broker: MessageBroker): EventPublisher => {
  return new EventPublisher(broker);
};
