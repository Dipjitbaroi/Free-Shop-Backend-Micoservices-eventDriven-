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
  body('firstName').isString().notEmpty().withMessage('First name is required'),
  body('lastName').isString().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isString().notEmpty().withMessage('Phone is required'),
  body('employeeId').isString().notEmpty().withMessage('Employee ID is required'),
  body('department').isIn(['ORDER_PROCESSING', 'DELIVERY_ASSIGNMENT', 'CUSTOMER_SUPPORT', 'QUALITY_CONTROL']).withMessage('Valid department is required'),
  body('assignedZone').optional().isString(),
  body('avatar').optional().isString().isURL(),
  body('commissionRate').optional().isDecimal(),
  body('bankDetails').optional().isObject(),
  body('workSchedule').optional().isObject(),
];

const updateSellerValidation = [
  body('firstName').optional().isString(),
  body('lastName').optional().isString(),
  body('phone').optional().isString(),
  body('avatar').optional().isString().isURL(),
  body('department').optional().isIn(['ORDER_PROCESSING', 'DELIVERY_ASSIGNMENT', 'CUSTOMER_SUPPORT', 'QUALITY_CONTROL']),
  body('assignedZone').optional().isString(),
  body('commissionRate').optional().isDecimal(),
  body('bankDetails').optional().isObject(),
  body('workSchedule').optional().isObject(),
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isString(),
  query('department').optional().isString(),
  query('isAvailable').optional().isBoolean(),
];

// Public routes - get seller info
/**
 * Get seller profile by employee ID
 * GET /sellers/employee/:employeeId
 */
router.get('/employee/:employeeId', param('employeeId').isString(), validate, sellerController.getSellerByEmployeeId);

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
 * Change seller status to suspended
 * PUT /sellers/:userId/suspend
 */
router.put(
  '/:userId/suspend',
  authenticate,
  param('userId').isUUID(),
  validate,
  sellerController.setSuspended
);

/**
 * Change seller status to active
 * PUT /sellers/:userId/activate
 */
router.put(
  '/:userId/activate',
  authenticate,
  param('userId').isUUID(),
  validate,
  sellerController.setActive
);

/**
 * Change seller status to on leave
 * PUT /sellers/:userId/on-leave
 */
router.put(
  '/:userId/on-leave',
  authenticate,
  param('userId').isUUID(),
  validate,
  sellerController.setOnLeave
);

export default router;
