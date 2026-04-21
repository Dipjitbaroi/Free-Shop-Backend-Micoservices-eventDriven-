import { VendorStatus } from './enums';

export interface IVendor {
  id: string;
  userId: string;
  storeName: string;
  storeSlug: string;
  description?: string;
  logo?: string;
  banner?: string;
  contactEmail: string;
  contactPhone?: string;
  status: VendorStatus;
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedAt?: Date;
  rejectionReason?: string;
  rating: number;
  totalReviews: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  
  businessAddress?: Record<string, unknown>;
  shippingZones: string[];
  returnPolicy?: string;
  shippingPolicy?: string;
  bankDetails?: Record<string, unknown>;
  mobileWallet?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVendorDocument {
  id: string;
  vendorId: string;
  type: 'NID' | 'TRADE_LICENSE' | 'TIN_CERTIFICATE' | 'BANK_STATEMENT' | 'UTILITY_BILL' | 'OTHER';
  documentUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  verifiedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVendorCreate {
  userId: string;
  storeName: string;
  storeSlug: string;
  description?: string;
  logo?: string;
  banner?: string;
  contactEmail: string;
  contactPhone?: string;
  businessAddress?: Record<string, unknown>;
  shippingZones?: string[];
  returnPolicy?: string;
  shippingPolicy?: string;
  bankDetails?: Record<string, unknown>;
  mobileWallet?: Record<string, unknown>;
}

export interface IVendorUpdate {
  storeName?: string;
  description?: string;
  logo?: string;
  banner?: string;
  contactEmail?: string;
  contactPhone?: string;
  businessAddress?: Partial<Record<string, unknown>>;
  shippingZones?: string[];
  returnPolicy?: string;
  shippingPolicy?: string;
  bankDetails?: Partial<Record<string, unknown>>;
  mobileWallet?: Partial<Record<string, unknown>>;
  
}

export interface IVendorFilter {
  status?: VendorStatus;
  verificationStatus?: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  search?: string;
  minRating?: number;
  sortBy?: 'createdAt' | 'rating' | 'orders' | 'revenue';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface IVendorAnalytics {
  vendorId: string;
  period: string;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  
  averageOrderValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    totalSold: number;
    revenue: number;
  }>;
  ordersByStatus: Record<string, number>;
  revenueByDay: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export interface IVendorReview {
  id: string;
  vendorId: string;
  userId: string;
  orderId: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  vendorResponse?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
