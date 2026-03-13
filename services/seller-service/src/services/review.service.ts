import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import { messageBroker } from '../lib/message-broker';
import { EXCHANGES, getRoutingKey } from '@freeshop/shared-events';
import { Prisma } from '../../generated/prisma';
import logger, { NotFoundError, ConflictError, ForbiddenError } from '@freeshop/shared-utils';

interface CreateReviewInput {
  sellerId: string;
  userId: string;
  orderId: string;
  rating: number;
  title?: string;
  comment?: string;
}

interface ReviewFilters {
  sellerId?: string;
  rating?: number;
  page?: number;
  limit?: number;
}

class ReviewService {
  async createReview(input: CreateReviewInput) {
    const existingReview = await prisma.sellerReview.findUnique({
      where: {
        userId_orderId: {
          userId: input.userId,
          orderId: input.orderId,
        },
      },
    });

    if (existingReview) {
      throw new ConflictError('You have already reviewed this seller for this order');
    }

    const review = await prisma.sellerReview.create({
      data: {
        sellerId: input.sellerId,
        userId: input.userId,
        orderId: input.orderId,
        rating: input.rating,
        title: input.title,
        comment: input.comment,
        isVerifiedPurchase: true,
      },
    });

    await this.updateSellerRating(input.sellerId);

    await messageBroker.publish(
      EXCHANGES.SELLER,
      getRoutingKey('SELLER', 'REVIEW_CREATED'),
      {
        reviewId: review.id,
        sellerId: input.sellerId,
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
    const review = await prisma.sellerReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenError('You can only update your own reviews');
    }

    const updated = await prisma.sellerReview.update({
      where: { id: reviewId },
      data: updates,
    });

    if (updates.rating) {
      await this.updateSellerRating(review.sellerId);
    }

    return updated;
  }

  async deleteReview(reviewId: string, userId: string, isAdmin = false) {
    const review = await prisma.sellerReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (!isAdmin && review.userId !== userId) {
      throw new ForbiddenError('You can only delete your own reviews');
    }

    await prisma.sellerReview.delete({
      where: { id: reviewId },
    });

    await this.updateSellerRating(review.sellerId);

    return { success: true };
  }

  async respondToReview(reviewId: string, sellerId: string, response: string) {
    const review = await prisma.sellerReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.sellerId !== sellerId) {
      throw new ForbiddenError('You can only respond to reviews for your store');
    }

    const updated = await prisma.sellerReview.update({
      where: { id: reviewId },
      data: {
        sellerResponse: response,
        respondedAt: new Date(),
      },
    });

    return updated;
  }

  async getSellerReviews(filters: ReviewFilters) {
    const { sellerId, rating, page = 1, limit = 20 } = filters;

    const where: Prisma.SellerReviewWhereInput = {};
    if (sellerId) where.sellerId = sellerId;
    if (rating) where.rating = rating;

    const [reviews, total] = await Promise.all([
      prisma.sellerReview.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.sellerReview.count({ where }),
    ]);

    const ratingDistribution = sellerId
      ? await prisma.sellerReview.groupBy({
          by: ['rating'],
          where: { sellerId },
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

  private async updateSellerRating(sellerId: string) {
    const stats = await prisma.sellerReview.aggregate({
      where: { sellerId },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.seller.update({
      where: { id: sellerId },
      data: {
        rating: stats._avg.rating || 0,
        totalReviews: stats._count,
      },
    });

    await redis.del(`seller:${sellerId}`);
    await redis.del(`seller:stats:${sellerId}`);
  }
}

export const reviewService = new ReviewService();
