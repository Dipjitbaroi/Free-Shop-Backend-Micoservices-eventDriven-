import { ProductStatus, DiscountType, ReviewStatus } from './enums';

export interface IProduct {
  id: string;
  sellerId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  categoryId: string;
  price: number;
  discountPrice?: number;
  discountType?: DiscountType;
  discountValue?: number;
  stock: number;
  reservedStock: number;
  lowStockThreshold: number;
  weight?: number;
  unit: string;
  isOrganic: boolean;
  organicCertification?: string;
  images: string[];
  thumbnail?: string;
  tags: string[];
  status: ProductStatus;
  isFeatured: boolean;
  isFlashSale: boolean;
  flashSalePrice?: number;
  flashSaleStartDate?: Date;
  flashSaleEndDate?: Date;
  averageRating: number;
  totalReviews: number;
  totalSold: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductCreate {
  sellerId: string;
  name: string;
  description: string;
  shortDescription?: string;
  sku?: string;
  categoryId: string;
  price: number;
  discountPrice?: number;
  discountType?: DiscountType;
  discountValue?: number;
  stock: number;
  lowStockThreshold?: number;
  weight?: number;
  unit?: string;
  isOrganic?: boolean;
  organicCertification?: string;
  images?: string[];
  tags?: string[];
  isFeatured?: boolean;
  metadata?: Record<string, unknown>;
}

export interface IProductUpdate {
  name?: string;
  description?: string;
  shortDescription?: string;
  categoryId?: string;
  price?: number;
  discountPrice?: number;
  discountType?: DiscountType;
  discountValue?: number;
  stock?: number;
  lowStockThreshold?: number;
  weight?: number;
  unit?: string;
  isOrganic?: boolean;
  organicCertification?: string;
  images?: string[];
  tags?: string[];
  isFeatured?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  level: number;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryCreate {
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  sortOrder?: number;
}

export interface IReview {
  id: string;
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  status: ReviewStatus;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewCreate {
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  verifiedPurchase?: boolean;
}

export interface IProductFilter {
  categoryId?: string;
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
  isOrganic?: boolean;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  status?: ProductStatus;
  search?: string;
  tags?: string[];
  sortBy?: 'price' | 'createdAt' | 'rating' | 'sold';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface IFlashSale {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  products: string[];
  bannerImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewReport {
  userId: string;
  reason: string;
  createdAt: string;
}
