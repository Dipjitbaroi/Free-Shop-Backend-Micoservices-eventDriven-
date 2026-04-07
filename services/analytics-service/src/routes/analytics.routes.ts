import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { analyticsController } from '../controllers/analytics.controller';
import { authenticate, authorize, validate } from '@freeshop/shared-middleware';

const router: Router = Router();

router.get(
  '/dashboard',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  analyticsController.getDashboard
);

router.get(
  '/sales',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  analyticsController.getSalesReport
);

router.get(
  '/vendors/:vendorId',
  authenticate,
  [
    param('vendorId').isUUID(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  analyticsController.getVendorReport
);

router.get(
  '/products/:productId',
  authenticate,
  [
    param('productId').isUUID(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  analyticsController.getProductAnalytics
);

router.get(
  '/top-products',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  analyticsController.getTopProducts
);

router.get(
  '/top-vendors',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  analyticsController.getTopVendors
);

router.get(
  '/users',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  analyticsController.getUserAnalytics
);

router.post(
  '/events',
  [
    body('eventType').notEmpty().withMessage('Event type is required'),
    body('eventName').notEmpty().withMessage('Event name is required'),
    body('sessionId').optional().isString(),
    body('entityType').optional().isString(),
    body('entityId').optional().isString(),
    body('metadata').optional().isObject(),
  ],
  validate,
  analyticsController.trackEvent
);

router.post(
  '/search',
  [
    body('query').notEmpty().withMessage('Search query is required'),
    body('resultsCount').isInt({ min: 0 }),
    body('clickedProductId').optional().isUUID(),
    body('sessionId').optional().isString(),
  ],
  validate,
  analyticsController.trackSearch
);

router.get(
  '/search/popular',
  [query('limit').optional().isInt({ min: 1, max: 100 })],
  validate,
  analyticsController.getPopularSearches
);

export default router;
