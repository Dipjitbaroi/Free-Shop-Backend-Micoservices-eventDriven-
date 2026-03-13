import { Request, Response, NextFunction } from 'express';
import { reviewService } from '../services/review.service';
import { successResponse } from '@freeshop/shared-utils';
import { UserRole } from '@freeshop/shared-types';

export const reviewController = {
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId as string;
      const review = await reviewService.createReview({
        ...req.body,
        userId,
      });
      res.status(201).json(successResponse(review, 'Review created successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, userId, rating, verified, page, limit } = req.query;

      const reviews = await reviewService.getReviews({
        productId: productId as string,
        userId: userId as string,
        rating: rating ? parseInt(rating as string) : undefined,
        verified: verified === 'true' ? true : verified === 'false' ? false : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });

      res.json(successResponse(reviews, 'Reviews retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getReviewById(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.getReviewById(req.params.id);
      res.json(successResponse(review, 'Review retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getProductReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const { page, limit } = req.query;

      const reviews = await reviewService.getReviews({
        productId,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });

      res.json(successResponse(reviews, 'Reviews retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getProductRatingStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await reviewService.getProductRatingStats(req.params.productId);
      res.json(successResponse(stats, 'Rating stats retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId as string;
      const review = await reviewService.updateReview(req.params.id, userId, req.body);
      res.json(successResponse(review, 'Review updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId as string;
      const isAdmin = [UserRole.ADMIN, UserRole.MANAGER].includes(req.user?.role as UserRole);
      await reviewService.deleteReview(req.params.id, userId, isAdmin);
      res.json(successResponse(null, 'Review deleted successfully'));
    } catch (error) {
      next(error);
    }
  },

  async addHelpfulVote(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId as string;
      const review = await reviewService.addHelpfulVote(req.params.id, userId);
      res.json(successResponse(review, 'Vote recorded successfully'));
    } catch (error) {
      next(error);
    }
  },

  async reportReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId as string;
      const { reason } = req.body;
      await reviewService.reportReview(req.params.id, userId, reason);
      res.json(successResponse(null, 'Review reported successfully'));
    } catch (error) {
      next(error);
    }
  },
};
