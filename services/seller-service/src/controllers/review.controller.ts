import { Request, Response, NextFunction } from 'express';
import { reviewService } from '../services/review.service';
import { sellerService } from '../services/seller.service';
import { successResponse, UnauthorizedError, NotFoundError } from '@freeshop/shared-utils';

export const reviewController = {
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('User not authenticated');

      const review = await reviewService.createReview({
        sellerId: req.params.sellerId,
        userId,
        orderId: req.body.orderId,
        rating: req.body.rating,
        title: req.body.title,
        comment: req.body.comment,
      });

      res.status(201).json(successResponse(review, 'Review created'));
    } catch (error) {
      next(error);
    }
  },

  async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('User not authenticated');

      const review = await reviewService.updateReview(req.params.reviewId, userId, {
        rating: req.body.rating,
        title: req.body.title,
        comment: req.body.comment,
      });

      res.json(successResponse(review, 'Review updated'));
    } catch (error) {
      next(error);
    }
  },

  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const isAdmin = req.user?.role === 'ADMIN';

      if (!userId) throw new UnauthorizedError('User not authenticated');

      await reviewService.deleteReview(req.params.reviewId, userId, isAdmin);

      res.json(successResponse(null, 'Review deleted successfully'));
    } catch (error) {
      next(error);
    }
  },

  async respondToReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const seller = await sellerService.getSellerByUserId(userId!);
      if (!seller) throw new NotFoundError('Seller account not found');

      const review = await reviewService.respondToReview(
        req.params.reviewId,
        seller.id,
        req.body.response
      );

      res.json(successResponse(review, 'Response submitted'));
    } catch (error) {
      next(error);
    }
  },

  async getSellerReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await reviewService.getSellerReviews({
        sellerId: req.params.sellerId,
        rating: req.query.rating ? parseInt(req.query.rating as string) : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      res.json(successResponse(result, 'Reviews retrieved'));
    } catch (error) {
      next(error);
    }
  },
};
