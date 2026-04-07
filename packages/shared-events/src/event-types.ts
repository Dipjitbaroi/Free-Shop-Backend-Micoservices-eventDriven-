import { EventName } from './constants';

// Base Event Interface
export interface IBaseEvent<T = unknown> {
  id: string;
  type: EventName;
  timestamp: string;
  version: string;
  source: string;
  correlationId?: string;
  data: T;
  metadata?: Record<string, unknown>;
}

// User Event Payloads
export interface IUserCreatedPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
  avatar?: string;
}

export interface IUserUpdatedPayload {
  userId: string;
  changes: Record<string, unknown>;
}

export interface IUserVerifiedPayload {
  userId: string;
  email: string;
  verifiedAt: string;
}

// Product Event Payloads
export interface IProductCreatedPayload {
  productId: string;
  vendorId: string;
  name: string;
  price: number;
  categoryId: string;
}

export interface IProductUpdatedPayload {
  productId: string;
  vendorId: string;
  changes: Record<string, unknown>;
}

export interface IProductStatusChangedPayload {
  productId: string;
  vendorId: string;
  previousStatus: string;
  newStatus: string;
  reason?: string;
}

// Order Event Payloads
export interface IOrderCreatedPayload {
  orderId: string;
  orderNumber: string;
  customerId?: string;
  userId?: string;
  guestId?: string;
  totalAmount?: number;
  total?: number;
  paymentMethod?: string;
  items: Array<{
    productId: string;
    vendorId: string;
    quantity: number;
    price: number;
    freeItemId?: string;
  }>;
}

export interface IOrderStatusChangedPayload {
  orderId: string;
  orderNumber: string;
  previousStatus: string;
  newStatus: string;
  updatedBy?: string;
}

export interface IOrderCancelledPayload {
  orderId: string;
  orderNumber: string;
  reason: string;
  cancelledBy?: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

// Payment Event Payloads
export interface IPaymentInitiatedPayload {
  paymentId: string;
  orderId: string;
  amount: number;
  method: string;
  currency: string;
}

export interface IPaymentCompletedPayload {
  paymentId: string;
  orderId: string;
  transactionId: string;
  amount: number;
  method: string;
  paidAt: string;
}

export interface IPaymentFailedPayload {
  paymentId: string;
  orderId: string;
  reason: string;
  errorCode?: string;
}

// Inventory Event Payloads
export interface IInventoryUpdatedPayload {
  productId: string;
  vendorId: string;
  previousStock: number;
  newStock: number;
  action: string;
  reason?: string;
}

export interface IStockReservedPayload {
  reservationId: string;
  productId: string;
  orderId: string;
  quantity: number;
  expiresAt: string;
}

export interface IStockReleasedPayload {
  reservationId: string;
  productId: string;
  orderId: string;
  quantity: number;
  reason: string;
}

export interface ILowStockAlertPayload {
  productId: string;
  vendorId: string;
  productName: string;
  currentStock: number;
  threshold: number;
}

// Vendor Event Payloads
export interface IVendorCreatedPayload {
  vendorId: string;
  userId: string;
  businessName: string;
  email: string;
}

export interface IVendorStatusChangedPayload {
  vendorId: string;
  previousStatus: string;
  newStatus: string;
  reason?: string;
}

// Notification Event Payloads
export interface INotificationRequestedPayload {
  userId?: string;
  email?: string;
  phone?: string;
  type: 'EMAIL' | 'SMS' | 'PUSH';
  template: string;
  data: Record<string, unknown>;
  priority?: 'HIGH' | 'NORMAL' | 'LOW';
}

export interface IEmailRequestedPayload {
  to: string | string[];
  subject: string;
  template: string;
  data: Record<string, unknown>;
  attachments?: Array<{ filename: string; content: string; contentType?: string }>;
}

export interface ISmsRequestedPayload {
  to: string | string[];
  message?: string;
  template?: string;
  data?: Record<string, unknown>;
}

// Analytics Event Payloads
export interface IAnalyticsEventPayload {
  eventType: string;
  userId?: string;
  sessionId?: string;
  properties: Record<string, unknown>;
  timestamp: string;
}

// Event Types Union
export type UserEvent = 
  | IBaseEvent<IUserCreatedPayload>
  | IBaseEvent<IUserUpdatedPayload>
  | IBaseEvent<IUserVerifiedPayload>;

export type ProductEvent = 
  | IBaseEvent<IProductCreatedPayload>
  | IBaseEvent<IProductUpdatedPayload>
  | IBaseEvent<IProductStatusChangedPayload>;

export type OrderEvent = 
  | IBaseEvent<IOrderCreatedPayload>
  | IBaseEvent<IOrderStatusChangedPayload>
  | IBaseEvent<IOrderCancelledPayload>;

export type PaymentEvent = 
  | IBaseEvent<IPaymentInitiatedPayload>
  | IBaseEvent<IPaymentCompletedPayload>
  | IBaseEvent<IPaymentFailedPayload>;

export type InventoryEvent = 
  | IBaseEvent<IInventoryUpdatedPayload>
  | IBaseEvent<IStockReservedPayload>
  | IBaseEvent<IStockReleasedPayload>
  | IBaseEvent<ILowStockAlertPayload>;

export type NotificationEvent = 
  | IBaseEvent<INotificationRequestedPayload>
  | IBaseEvent<IEmailRequestedPayload>
  | IBaseEvent<ISmsRequestedPayload>;

// Convenience event type aliases for service-level usage
export type IUserCreatedEvent = IUserCreatedPayload;
export type IUserDeletedEvent = { userId: string };
export type IOrderCreatedEvent = IOrderCreatedPayload;
export type IOrderCancelledEvent = IOrderCancelledPayload;
export type IVendorApprovedEvent = IVendorStatusChangedPayload;
export type IPaymentReceivedEvent = IPaymentCompletedPayload;
export type IInventoryReservedEvent = IStockReservedPayload;
export type IInventoryReleasedEvent = IStockReleasedPayload;
