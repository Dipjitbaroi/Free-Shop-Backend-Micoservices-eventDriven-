import { Router } from 'express';
import { bannerController } from '../controllers/banner.controller.js';
import { authenticate, authorizePermission, validate } from '@freeshop/shared-middleware';
import { body, param, query } from 'express-validator';

const router: Router = Router();

// Banner permission codes
const BANNER_PERMISSION_CODES = {
  CREATE: 14001,
  READ: 14002,
  UPDATE: 14003,
  DELETE: 14004,
  REORDER: 14005,
} as const;

// Validation schemas
const createBannerValidation = [
  body('title').isString().notEmpty().withMessage('Banner title is required'),
  body('image').isString().notEmpty().withMessage('Banner image is required'),
  body('description').optional().isString(),
  body('altText').optional().isString(),
  body('link').optional().isString(),
  body('linkType').optional().isIn(['internal', 'external', 'product', 'category']),
  body('targetId').optional().isUUID(),
  body('position').optional().isInt({ min: 0 }),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
];

const updateBannerValidation = [
  param('id').isUUID().withMessage('Valid banner ID is required'),
  body('title').optional().isString().notEmpty(),
  body('image').optional().isString().notEmpty(),
  body('description').optional().isString(),
  body('altText').optional().isString(),
  body('link').optional().isString(),
  body('linkType').optional().isIn(['internal', 'external', 'product', 'category']),
  body('targetId').optional().isUUID(),
  body('position').optional().isInt({ min: 0 }),
  body('isActive').optional().isBoolean(),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
];

const bannerIdValidation = [
  param('id').isUUID().withMessage('Valid banner ID is required'),
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString().trim(),
  query('isActive').optional().isIn(['true', 'false']),
];

const reorderValidation = [
  body('bannerIds').isArray({ min: 1 }).withMessage('bannerIds must be a non-empty array'),
  body('bannerIds.*').isUUID().withMessage('Each banner ID must be a valid UUID'),
];

// Public routes - Get active banners for hero section
router.get('/active', bannerController.getActiveBanners);

// Admin routes - Require authentication and permissions
router.post(
  '/',
  authenticate,
  authorizePermission(BANNER_PERMISSION_CODES.CREATE),
  createBannerValidation,
  validate,
  bannerController.createBanner
);

router.get(
  '/',
  authenticate,
  authorizePermission(BANNER_PERMISSION_CODES.READ),
  paginationValidation,
  validate,
  bannerController.getBanners
);

router.get(
  '/:id',
  authenticate,
  authorizePermission(BANNER_PERMISSION_CODES.READ),
  bannerIdValidation,
  validate,
  bannerController.getBannerById
);

router.patch(
  '/:id',
  authenticate,
  authorizePermission(BANNER_PERMISSION_CODES.UPDATE),
  updateBannerValidation,
  validate,
  bannerController.updateBanner
);

router.delete(
  '/:id',
  authenticate,
  authorizePermission(BANNER_PERMISSION_CODES.DELETE),
  bannerIdValidation,
  validate,
  bannerController.deleteBanner
);

router.post(
  '/reorder',
  authenticate,
  authorizePermission(BANNER_PERMISSION_CODES.REORDER),
  reorderValidation,
  validate,
  bannerController.reorderBanners
);

export default router;
