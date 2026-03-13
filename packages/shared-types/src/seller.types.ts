import { SellerStatus } from './enums';

export interface ISeller {
  id: string;
  userId: string;
  businessName: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: ISellerAddress;
  status: SellerStatus;
  isVerified: boolean;
  verificationDocuments?: IVerificationDocument[];
  bankDetails?: IBankDetails;
  commissionRate: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  joinedAt: Date;
  approvedAt?: Date;
  suspendedAt?: Date;
  suspensionReason?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISellerAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IVerificationDocument {
  id: string;
  type: string;
  documentNumber: string;
  documentUrl: string;
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
  uploadedAt: Date;
}

export interface IBankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchName?: string;
  routingNumber?: string;
  swiftCode?: string;
}

export interface ISellerCreate {
  userId: string;
  businessName: string;
  description?: string;
  logo?: string;
  banner?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: ISellerAddress;
  bankDetails?: IBankDetails;
}

export interface ISellerUpdate {
  businessName?: string;
  description?: string;
  logo?: string;
  banner?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  address?: Partial<ISellerAddress>;
  bankDetails?: Partial<IBankDetails>;
  status?: SellerStatus;
  commissionRate?: number;
}

export interface ISellerFilter {
  status?: SellerStatus;
  isVerified?: boolean;
  search?: string;
  city?: string;
  minRating?: number;
  sortBy?: 'createdAt' | 'rating' | 'orders' | 'revenue';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface IWithdrawalRequest {
  id: string;
  sellerId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  bankDetails: IBankDetails;
  requestedAt: Date;
  processedAt?: Date;
  processedBy?: string;
  rejectionReason?: string;
  transactionReference?: string;
  metadata?: Record<string, unknown>;
}

export interface ISellerAnalytics {
  sellerId: string;
  period: string;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  totalCommission: number;
  netRevenue: number;
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
