import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import { authenticate, authorize, optionalAuth } from '@freeshop/shared-middleware';
import { validate } from '@freeshop/shared-middleware';
import { UserRole } from '@freeshop/shared-types';
import { body, param, query } from 'express-validator';

const router = Router();

// Validation schemas
const createReviewValidation = [
  body('productId').isUUID().withMessage('Valid product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().isString().isLength({ max: 100 }),
  body('comment').optional().isString().isLength({ max: 2000 }),
  body('images').optional().isArray(),
];

const updateReviewValidation = [
  param('id').isUUID().withMessage('Valid review ID is required'),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('title').optional().isString().isLength({ max: 100 }),
  body('comment').optional().isString().isLength({ max: 2000 }),
  body('images').optional().isArray(),
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
];

// Public routes
router.get(
  '/',
  [
    ...paginationValidation,
    query('productId').optional().isUUID(),
    query('userId').optional().isUUID(),
    query('rating').optional().isInt({ min: 1, max: 5 }),
    query('verified').optional().isIn(['true', 'false']),
  ],
  validate,
  reviewController.getReviews
);

router.get(
  '/product/:productId',
  param('productId').isUUID().withMessage('Valid product ID is required'),
  paginationValidation,
  validate,
  reviewController.getProductReviews
);

router.get(
  '/product/:productId/stats',
  param('productId').isUUID().withMessage('Valid product ID is required'),
  validate,
  reviewController.getProductRatingStats
);

router.get(
  '/:id',
  param('id').isUUID().withMessage('Valid review ID is required'),
  validate,
  reviewController.getReviewById
);

// Authenticated routes
router.post(
  '/',
  authenticate,
  createReviewValidation,
  validate,
  reviewController.createReview
);

router.patch(
  '/:id',
  authenticate,
  updateReviewValidation,
  validate,
  reviewController.updateReview
);

router.delete(
  '/:id',
  authenticate,
  param('id').isUUID().withMessage('Valid review ID is required'),
  validate,
  reviewController.deleteReview
);

router.post(
  '/:id/helpful',
  authenticate,
  param('id').isUUID().withMessage('Valid review ID is required'),
  validate,
  reviewController.addHelpfulVote
);

router.post(
  '/:id/report',
  authenticate,
  param('id').isUUID().withMessage('Valid review ID is required'),
  body('reason').isString().notEmpty().withMessage('Report reason is required'),
  validate,
  reviewController.reportReview
);

export default router;
