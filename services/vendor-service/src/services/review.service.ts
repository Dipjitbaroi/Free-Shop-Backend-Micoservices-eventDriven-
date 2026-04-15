import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import { messageBroker } from '../lib/message-broker';
import { EXCHANGES, getRoutingKey } from '@freeshop/shared-events';
import { Prisma } from '../../generated/prisma';
import logger, { NotFoundError, ConflictError, ForbiddenError } from '@freeshop/shared-utils';

interface CreateReviewInput {
  vendorId: string;
  userId: string;
  orderId: string;
  rating: number;
  title?: string;
  comment?: string;
}

interface ReviewFilters {
  vendorId?: string;
  rating?: number;
  page?: number;
  limit?: number;
}

class ReviewService {
  async createReview(input: CreateReviewInput) {
    const existingReview = await prisma.vendorReview.findUnique({
      where: {
        userId_orderId: {
          userId: input.userId,
          orderId: input.orderId,
        },
      },
    });

    if (existingReview) {
      throw new ConflictError('You have already reviewed this vendor for this order');
    }

    const review = await prisma.vendorReview.create({
      data: {
        vendorId: input.vendorId,
        userId: input.userId,
        orderId: input.orderId,
        rating: input.rating,
        title: input.title,
        comment: input.comment,
        isVerifiedPurchase: true,
      },
    });

    await this.updateVendorRating(input.vendorId);

    await messageBroker.publish(
      EXCHANGES.VENDOR,
      getRoutingKey('vendor', 'REVIEW_CREATED'),
      {
        reviewId: review.id,
        vendorId: input.vendorId,
        userId: input.userId,
        rating: input.rating,
      }
    );

    return review;
  }

  async updateReview(reviewId: string, userId: string, updates: {
    rating?: number;
    title?: string;
    comment?: string;
  }) {
    const review = await prisma.vendorReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenError('You can only update your own reviews');
    }

    const updated = await prisma.vendorReview.update({
      where: { id: reviewId },
      data: updates,
    });

    if (updates.rating) {
      await this.updateVendorRating(review.vendorId);
    }

    return updated;
  }

  async deleteReview(reviewId: string, userId: string, isAdmin = false) {
    const review = await prisma.vendorReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (!isAdmin && review.userId !== userId) {
      throw new ForbiddenError('You can only delete your own reviews');
    }

    await prisma.vendorReview.delete({
      where: { id: reviewId },
    });

    await this.updateVendorRating(review.vendorId);

    return { success: true };
  }

  async respondToReview(reviewId: string, vendorId: string, response: string) {
    const review = await prisma.vendorReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.vendorId !== vendorId) {
      throw new ForbiddenError('You can only respond to reviews for your store');
    }

    const updated = await prisma.vendorReview.update({
      where: { id: reviewId },
      data: {
        vendorResponse: response,
        respondedAt: new Date(),
      },
    });

    return updated;
  }

  async getVendorReviews(filters: ReviewFilters) {
    const { vendorId, rating, page = 1, limit = 20 } = filters;

    const where: Prisma.VendorReviewWhereInput = {};
    if (vendorId) where.vendorId = vendorId;
    if (rating) where.rating = rating;

    const [reviews, total] = await Promise.all([
      prisma.vendorReview.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.vendorReview.count({ where }),
    ]);

    const ratingDistribution = vendorId
      ? await prisma.vendorReview.groupBy({
          by: ['rating'],
          where: { vendorId },
          _count: true,
        })
      : null;

    return {
      reviews,
      ratingDistribution: ratingDistribution?.reduce(
        (acc, item) => ({ ...acc, [item.rating]: item._count }),
        { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      ),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async updateVendorRating(vendorId: string) {
    const stats = await prisma.vendorReview.aggregate({
      where: { vendorId },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        rating: stats._avg.rating || 0,
        totalReviews: stats._count,
      },
    });

    await redis.del(`vendor:${vendorId}`);
    await redis.del(`vendor:stats:${vendorId}`);
  }
}

export const reviewService = new ReviewService();

