import { Prisma, Review } from '../../generated/prisma';
import { IReviewCreate, IPaginatedResult, ReviewReport } from '@freeshop/shared-types';
import { NotFoundError, BadRequestError, createPaginatedResponse, calculateOffset } from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma';
import { productService } from './product.service';
import { eventPublisher } from '../lib/message-broker';
import { Events } from '@freeshop/shared-events';

interface ReviewFilters {
  productId?: string;
  userId?: string;
  rating?: number;
  verified?: boolean;
  page?: number;
  limit?: number;
}

class ReviewService {
  async createReview(data: IReviewCreate): Promise<Review> {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: data.productId,
        userId: data.userId,
      },
    });

    if (existingReview) {
      throw new BadRequestError('You have already reviewed this product');
    }

    const review = await prisma.review.create({
      data: {
        productId: data.productId,
        userId: data.userId,
        orderId: data.orderId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        images: data.images,
        isVerifiedPurchase: data.verifiedPurchase || false,
      },
    });

    // Update product rating
    await this.recalculateProductRating(data.productId);

    // Publish review event
    await eventPublisher.publish(Events.REVIEW_CREATED, {
      reviewId: review.id,
      productId: review.productId,
      userId: review.userId,
      rating: review.rating,
      sellerId: product.sellerId,
    });

    return review;
  }

  async getReviewById(id: string): Promise<Review> {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    return review;
  }

  async getReviews(filters: ReviewFilters): Promise<IPaginatedResult<Review>> {
    const { productId, userId, rating, verified, page = 1, limit = 10 } = filters;

    const where: Prisma.ReviewWhereInput = {};

    if (productId) where.productId = productId;
    if (userId) where.userId = userId;
    if (rating) where.rating = rating;
    if (verified !== undefined) where.isVerifiedPurchase = verified;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip: calculateOffset(page, limit),
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where }),
    ]);

    return createPaginatedResponse(reviews, total, { page, limit });
  }

  async updateReview(id: string, userId: string, data: Partial<IReviewCreate>): Promise<Review> {
    const existingReview = await prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      throw new NotFoundError('Review not found');
    }

    if (existingReview.userId !== userId) {
      throw new BadRequestError('You can only update your own reviews');
    }

    const updateData: Prisma.ReviewUpdateInput = {};

    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.comment !== undefined) updateData.comment = data.comment;
    if (data.images !== undefined) updateData.images = data.images;

    const review = await prisma.review.update({
      where: { id },
      data: updateData,
    });

    // Recalculate product rating if rating changed
    if (data.rating !== undefined) {
      await this.recalculateProductRating(review.productId);
    }

    return review;
  }

  async deleteReview(id: string, userId?: string, isAdmin: boolean = false): Promise<void> {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (!isAdmin && review.userId !== userId) {
      throw new BadRequestError('You can only delete your own reviews');
    }

    await prisma.review.delete({
      where: { id },
    });

    // Recalculate product rating
    await this.recalculateProductRating(review.productId);
  }

  async addHelpfulVote(reviewId: string, _userId: string): Promise<Review> {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    // Here you would typically track which users voted
    // For simplicity, just incrementing the count
    return prisma.review.update({
      where: { id: reviewId },
      data: {
        helpfulCount: { increment: 1 },
      },
    });
  }

  async reportReview(reviewId: string, userId: string, reason: string): Promise<void> {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    const reports = (review.reports as ReviewReport[] | null) || [];
    reports.push({
      userId,
      reason,
      createdAt: new Date().toISOString(),
    });

    await prisma.review.update({
      where: { id: reviewId },
      data: { reports: reports as unknown as Prisma.InputJsonValue },
    });
  }

  async getProductRatingStats(productId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: Record<number, number>;
  }> {
    const reviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const totalReviews = reviews.length;
    const ratingBreakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    let sum = 0;
    for (const review of reviews) {
      sum += review.rating;
      ratingBreakdown[review.rating]++;
    }

    const averageRating = totalReviews > 0 ? Math.round((sum / totalReviews) * 10) / 10 : 0;

    return {
      averageRating,
      totalReviews,
      ratingBreakdown,
    };
  }

  private async recalculateProductRating(productId: string): Promise<void> {
    const stats = await this.getProductRatingStats(productId);

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: stats.averageRating,
        totalReviews: stats.totalReviews,
      },
    });

    // Update via product service to clear cache
    await productService.updateProductRating(productId);
  }
}

export const reviewService = new ReviewService();
