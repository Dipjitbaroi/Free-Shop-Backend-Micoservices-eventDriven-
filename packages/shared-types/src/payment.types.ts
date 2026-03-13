import { PaymentStatus, PaymentMethod } from './enums';

export interface IPayment {
  id: string;
  orderId: string;
  transactionId?: string;
  gatewayReference?: string;
  method: PaymentMethod;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gatewayResponse?: Record<string, unknown>;
  paidAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
  refundReason?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentCreate {
  orderId: string;
  method: PaymentMethod;
  amount: number;
  currency?: string;
}

export interface IPaymentUpdate {
  status?: PaymentStatus;
  transactionId?: string;
  gatewayReference?: string;
  gatewayResponse?: Record<string, unknown>;
  paidAt?: Date;
}

// bKash specific types
export interface IBkashCreatePaymentRequest {
  mode: string;
  payerReference: string;
  callbackURL: string;
  amount: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
}

export interface IBkashCreatePaymentResponse {
  paymentID: string;
  bkashURL: string;
  callbackURL: string;
  successCallbackURL: string;
  failureCallbackURL: string;
  cancelledCallbackURL: string;
  amount: string;
  intent: string;
  currency: string;
  paymentCreateTime: string;
  transactionStatus: string;
  merchantInvoiceNumber: string;
  statusCode: string;
  statusMessage: string;
}

export interface IBkashExecutePaymentResponse {
  paymentID: string;
  trxID: string;
  transactionStatus: string;
  amount: string;
  currency: string;
  intent: string;
  paymentExecuteTime: string;
  merchantInvoiceNumber: string;
  payerReference: string;
  customerMsisdn: string;
  payerAccount: string;
  statusCode: string;
  statusMessage: string;
}

// EPS specific types
export interface IEpsPaymentRequest {
  merchantId: string;
  orderId: string;
  amount: number;
  currency: string;
  returnUrl: string;
  cancelUrl: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface IEpsPaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  errorMessage?: string;
}

// Webhook types
export interface IPaymentWebhook {
  id: string;
  paymentId: string;
  provider: PaymentMethod;
  eventType: string;
  payload: Record<string, unknown>;
  processedAt?: Date;
  createdAt: Date;
}

// Refund types
export interface IRefundRequest {
  paymentId: string;
  amount?: number;
  reason: string;
}

export interface IRefundResponse {
  success: boolean;
  refundId?: string;
  amount: number;
  errorMessage?: string;
}
