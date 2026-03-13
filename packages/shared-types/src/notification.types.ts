import { NotificationType, NotificationStatus } from './enums';

export interface INotification {
  id: string;
  userId?: string;
  guestEmail?: string;
  guestPhone?: string;
  type: NotificationType;
  channel: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  template: string;
  subject?: string;
  content: string;
  data?: Record<string, unknown>;
  status: NotificationStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationCreate {
  userId?: string;
  guestEmail?: string;
  guestPhone?: string;
  type: NotificationType;
  channel: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  template: string;
  data?: Record<string, unknown>;
}

export interface IEmailNotification {
  to: string | string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  template: string;
  data: Record<string, unknown>;
  attachments?: IEmailAttachment[];
}

export interface IEmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

export interface ISmsNotification {
  to: string | string[];
  message: string;
  template?: string;
  data?: Record<string, unknown>;
}

export interface IPushNotification {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  imageUrl?: string;
  clickAction?: string;
}

export interface INotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  channel: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationPreference {
  userId: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Events
export type NotificationEvent = 
  | 'ORDER_PLACED'
  | 'ORDER_CONFIRMED'
  | 'ORDER_SHIPPED'
  | 'ORDER_DELIVERED'
  | 'ORDER_CANCELLED'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'PASSWORD_RESET'
  | 'EMAIL_VERIFICATION'
  | 'WELCOME'
  | 'SELLER_APPROVED'
  | 'SELLER_REJECTED'
  | 'PRODUCT_APPROVED'
  | 'PRODUCT_REJECTED'
  | 'LOW_STOCK_ALERT'
  | 'WITHDRAWAL_PROCESSED';
