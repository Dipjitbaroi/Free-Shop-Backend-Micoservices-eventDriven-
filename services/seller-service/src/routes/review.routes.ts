import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { reviewController } from '../controllers/review.controller';
import { authenticate, authorize, validate } from '@freeshop/shared-middleware';

const router = Router();

router.get(
  '/:sellerId/reviews',
  [
    param('sellerId').isUUID(),
    query('rating').optional().isInt({ min: 1, max: 5 }),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  reviewController.getSellerReviews
);

router.post(
  '/:sellerId/reviews',
  authenticate,
  [
    param('sellerId').isUUID(),
    body('orderId').isUUID().withMessage('Order ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title').optional().isString().isLength({ max: 100 }),
    body('comment').optional().isString().isLength({ max: 1000 }),
  ],
  validate,
  reviewController.createReview
);

router.patch(
  '/reviews/:reviewId',
  authenticate,
  [
    param('reviewId').isUUID(),
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('title').optional().isString().isLength({ max: 100 }),
    body('comment').optional().isString().isLength({ max: 1000 }),
  ],
  validate,
  reviewController.updateReview
);

router.delete(
  '/reviews/:reviewId',
  authenticate,
  param('reviewId').isUUID(),
  validate,
  reviewController.deleteReview
);

router.post(
  '/reviews/:reviewId/respond',
  authenticate,
  [
    param('reviewId').isUUID(),
    body('response').notEmpty().isString().isLength({ max: 1000 }),
  ],
  validate,
  reviewController.respondToReview
);

export default router;
