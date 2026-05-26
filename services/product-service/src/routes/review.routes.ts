import { Router } from 'express';
import { reviewController } from '../controllers/review.controller.js';
import { authenticate, optionalAuth, authorizePermission } from '@freeshop/shared-middleware';
import { validate } from '@freeshop/shared-middleware';
import { body, param, query } from 'express-validator';
import { PERMISSION_CODES } from '@freeshop/shared-types';

const router: Router = Router();

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
    query('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED']),
  ],
  validate,
  reviewController.getReviews
);

router.get(
  '/product/:productId',
  param('productId').isUUID().withMessage('Valid product ID is required'),
  [...paginationValidation, query('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED'])],
  validate,
  reviewController.getProductReviews
);

router.get(
  '/product/:productId/stats',
  param('productId').isUUID().withMessage('Valid product ID is required'),
  query('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED']),
  validate,
  reviewController.getProductRatingStats
);

router.get(
  '/:id',
  param('id').isUUID().withMessage('Valid review ID is required'),
  query('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED']),
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

router.post(
  '/:id/approve',
  authenticate,
  authorizePermission(PERMISSION_CODES.REVIEW_APPROVE),
  param('id').isUUID().withMessage('Valid review ID is required'),
  validate,
  reviewController.approveReview
);

export default router;
