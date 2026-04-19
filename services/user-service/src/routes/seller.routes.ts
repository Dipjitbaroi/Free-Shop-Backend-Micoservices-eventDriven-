/**
 * Seller Routes
 * Endpoints for managing seller profiles
 */

import { Router } from 'express';
import { authenticate, validate } from '@freeshop/shared-middleware';
import { sellerController } from '../controllers/seller.controller.js';
import { body, param, query } from 'express-validator';

const router: Router = Router();

// Validation schemas
const createSellerValidation = [
  body('shopName').isString().notEmpty().withMessage('Shop name is required'),
  body('shopSlug').isString().notEmpty().isSlug().withMessage('Valid shop slug is required'),
  body('shopDescription').optional().isString(),
  body('phone').optional().isString(),
  body('email').optional().isEmail(),
  body('address').optional().isString(),
  body('city').optional().isString(),
  body('postalCode').optional().isString(),
];

const updateSellerValidation = [
  body('shopName').optional().isString(),
  body('shopSlug').optional().isSlug(),
  body('shopDescription').optional().isString(),
  body('phone').optional().isString(),
  body('email').optional().isEmail(),
  body('address').optional().isString(),
  body('city').optional().isString(),
  body('postalCode').optional().isString(),
];

const verifySellerValidation = [
  body('verified').isBoolean().withMessage('verified must be a boolean'),
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isString(),
  query('verified').optional().isBoolean(),
];

// Public routes - get seller info
/**
 * Get seller profile by shop slug (public)
 * GET /sellers/shop/:shopSlug
 */
router.get('/shop/:shopSlug', sellerController.getSellerByShop);

/**
 * Get all sellers (public - paginated)
 * GET /sellers?page=1&limit=20
 */
router.get('/', paginationValidation, validate, sellerController.getAllSellers);

// Protected routes - require authentication
/**
 * Create seller profile
 * POST /sellers
 */
router.post(
  '/',
  authenticate,
  createSellerValidation,
  validate,
  sellerController.createSellerProfile
);

/**
 * Get current user's seller profile
 * GET /sellers/me
 */
router.get('/me', authenticate, sellerController.getCurrentSellerProfile);

/**
 * Get seller profile by user ID
 * GET /sellers/:userId
 */
router.get('/:userId', authenticate, param('userId').isUUID(), validate, sellerController.getSellerProfile);

/**
 * Update seller profile
 * PUT /sellers/:userId
 */
router.put(
  '/:userId',
  authenticate,
  param('userId').isUUID(),
  updateSellerValidation,
  validate,
  sellerController.updateSellerProfile
);

// Admin-only routes
/**
 * Verify seller
 * PUT /sellers/:userId/verify
 */
router.put(
  '/:userId/verify',
  authenticate,
  param('userId').isUUID(),
  verifySellerValidation,
  validate,
  sellerController.verifySeller
);

/**
 * Suspend seller
 * PUT /sellers/:userId/suspend
 */
router.put(
  '/:userId/suspend',
  authenticate,
  param('userId').isUUID(),
  validate,
  sellerController.suspendSeller
);

/**
 * Activate seller
 * PUT /sellers/:userId/activate
 */
router.put(
  '/:userId/activate',
  authenticate,
  param('userId').isUUID(),
  validate,
  sellerController.activateSeller
);

export default router;
