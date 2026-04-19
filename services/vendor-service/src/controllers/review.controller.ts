import { Request, Response, NextFunction } from 'express';
import { reviewService } from '../services/review.service.js';
import { vendorService } from '../services/vendor.service.js';
import { successResponse, UnauthorizedError, NotFoundError } from '@freeshop/shared-utils';

export const reviewController = {
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('User not authenticated');

      const review = await reviewService.createReview({
        vendorId: req.params.vendorId as string,
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

      const review = await reviewService.updateReview(req.params.reviewId as string, userId, {
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
      // Role no longer available on request - admin check should be done via RBAC/middleware
      // Routes now use authorizePermission(PERMISSION_CODES) instead
      const isAdmin = false; // Admins are filtered by middleware now

      if (!userId) throw new UnauthorizedError('User not authenticated');

      await reviewService.deleteReview(req.params.reviewId as string, userId, isAdmin);

      res.json(successResponse(null, 'Review deleted successfully'));
    } catch (error) {
      next(error);
    }
  },

  async respondToReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const vendor = await vendorService.getVendorByUserId(userId!);
      if (!vendor) throw new NotFoundError('vendor account not found');

      const review = await reviewService.respondToReview(
        req.params.reviewId as string,
        vendor.id,
        req.body.response
      );

      res.json(successResponse(review, 'Response submitted'));
    } catch (error) {
      next(error);
    }
  },

  async getVendorReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await reviewService.getVendorReviews({
        vendorId: req.params.VendorId as string,
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

