// Pagination
export interface IPaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IPaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// API Response
export interface IApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: IApiError;
  timestamp?: string;
  requestId?: string;
  pagination?: unknown;
}

// Backward-compatible alias
export type ApiResponse<T = unknown> = IApiResponse<T>;

export interface IApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
}

// Health Check
export interface IHealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  service: string;
  version: string;
  uptime: number;
  timestamp: string;
  dependencies: IHealthCheckDependency[];
}

export interface IHealthCheckDependency {
  name: string;
  status: 'healthy' | 'unhealthy';
  responseTime?: number;
  error?: string;
}

// File Upload
export interface IFileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedBy?: string;
  folder?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface IUploadResult {
  success: boolean;
  file?: IFileUpload;
  error?: string;
}

// Search
export interface ISearchParams {
  query: string;
  filters?: Record<string, unknown>;
  page?: number;
  limit?: number;
}

export interface ISearchResult<T> {
  items: T[];
  total: number;
  took: number;
  suggestions?: string[];
}

// Discount Code
export interface IDiscountCode {
  id: string;
  code: string;
  description?: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  perUserLimit?: number;
  applicableCategories?: string[];
  applicableProducts?: string[];
  excludedProducts?: string[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Audit Log
export interface IAuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId: string;
  previousValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// Configuration
export interface ISystemConfig {
  key: string;
  value: unknown;
  description?: string;
  group: string;
  isPublic: boolean;
  updatedBy?: string;
  updatedAt: Date;
}

// Analytics
export interface IAnalyticsEvent {
  id: string;
  eventType: string;
  userId?: string;
  sessionId?: string;
  properties?: Record<string, unknown>;
  timestamp: Date;
}

export interface IDashboardMetrics {
  period: string;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  totalSellers: number;
  averageOrderValue: number;
  conversionRate: number;
  ordersByStatus: Record<string, number>;
  revenueByDay: Array<{ date: string; revenue: number }>;
  topProducts: Array<{ productId: string; name: string; sold: number; revenue: number }>;
  topSellers: Array<{ sellerId: string; name: string; orders: number; revenue: number }>;
  topCategories: Array<{ categoryId: string; name: string; orders: number; revenue: number }>;
}

// Date Range
export interface IDateRange {
  startDate: Date;
  endDate: Date;
}
