import { OrderStatus, PaymentMethod } from './enums';
import { IFreeItem } from './product.types';

export interface IOrder {
  id: string;
  orderNumber: string;
  customerId?: string;
  guestId?: string;
  customerEmail: string;
  customerPhone?: string;
  customerName: string;
  items: IOrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  shippingAddress: IShippingAddress;
  // billingAddress?: IShippingAddress; // disabled - not currently used
  notes?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  cancelReason?: string;
  cancelledAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  sellerId: string;
  productName: string;
  productImage?: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  /** Shipping zone identifier (used to calculate delivery charges) */
  zone?: string;
  postalCode: string;
  country: string;
}

export interface IOrderCreate {
  customerId?: string;
  guestId?: string;
  customerEmail: string;
  customerPhone?: string;
  customerName: string;
  items: IOrderItemCreate[];
  /** Provide either shippingAddressId (to inherit a saved address) or shippingAddress inline */
  shippingAddressId?: string;
  shippingAddress?: IShippingAddress;
  // billingAddress?: IShippingAddress; // disabled - not currently used
  paymentMethod: PaymentMethod;
  discountCode?: string;
  notes?: string;
}

export interface IOrderItemCreate {
  productId: string;
  quantity: number;
}

export interface IOrderUpdate {
  status?: OrderStatus;
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  notes?: string;
}

export interface IOrderFilter {
  customerId?: string;
  sellerId?: string;
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ICart {
  id: string;
  userId?: string;
  guestId?: string;
  items: ICartItem[];
  subtotal: number;
  totalItems: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface ICartItem {
  productId: string;
  sellerId: string;
  quantity: number;
  unitPrice: number;
  discountPrice?: number;
  totalPrice: number;
  product?: {
    name: string;
    image?: string;
  };
  freeItems?: Array<{
    id: string;
    name: string;
    sku?: string;
    image?: string;
  }>;
}

export interface ICartItemAdd {
  productId: string;
  quantity: number;
}

export interface ICheckoutData {
  cart: ICart;
  /** Provide either shippingAddressId (to inherit a saved address) or shippingAddress inline */
  shippingAddressId?: string;
  shippingAddress?: IShippingAddress;
  // billingAddress?: IShippingAddress; // disabled - not currently used
  paymentMethod: PaymentMethod;
  customerEmail: string;
  customerPhone?: string;
  customerName: string;
  discountCode?: string;
  notes?: string;
}

export interface IOrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  comment?: string;
  changedBy?: string;
  createdAt: Date;
}
