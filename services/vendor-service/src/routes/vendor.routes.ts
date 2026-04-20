import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { vendorController } from '../controllers/vendor.controller.js';
import { authenticate, authorizePermission, validate } from '@freeshop/shared-middleware';
import { PERMISSION_CODES } from '@freeshop/shared-types';

const router: Router = Router();

router.post(
  '/',
  authenticate,
  [
    body('storeName').notEmpty().withMessage('Store name is required'),
    body('contactEmail').isEmail().withMessage('Valid email is required'),
    body('contactPhone').optional().isMobilePhone('any'),
    body('description').optional().isString(),
    body('businessAddress').optional().isObject(),
  ],
  validate,
  vendorController.createVendor
);

router.get('/me', authenticate, vendorController.getMyVendor);

router.get('/me/stats', authenticate, vendorController.getVendorStats);

router.patch(
  '/me',
  authenticate,
  [
    body('storeName').optional().notEmpty(),
    body('description').optional().isString(),
    body('logo').optional().isURL(),
    body('banner').optional().isURL(),
    body('contactEmail').optional().isEmail(),
    body('contactPhone').optional().isMobilePhone('any'),
    body('businessAddress').optional().isObject(),
    body('shippingZones').optional().isArray(),
    body('returnPolicy').optional().isString(),
    body('shippingPolicy').optional().isString(),
    body('bankDetails').optional().isObject(),
    body('mobileWallet').optional().isObject(),
  ],
  validate,
  vendorController.updateVendor
);

router.post(
  '/me/documents',
  authenticate,
  [
    body('type')
      .isIn(['NID', 'TRADE_LICENSE', 'TIN_CERTIFICATE', 'BANK_STATEMENT', 'UTILITY_BILL', 'OTHER'])
      .withMessage('Valid document type is required'),
    body('documentUrl').isURL().withMessage('Valid document URL is required'),
  ],
  validate,
  vendorController.addDocument
);

router.get(
  '/',
  [
    query('status').optional().isIn(['PENDING', 'ACTIVE', 'SUSPENDED', 'BANNED', 'CLOSED']),
    query('verificationStatus').optional().isIn(['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED']),
    query('search').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('sortBy').optional().isIn(['createdAt', 'rating', 'totalOrders', 'storeName']),
    query('sortOrder').optional().isIn(['asc', 'desc']),
  ],
  validate,
  vendorController.listVendors
);

router.get(
  '/store/:slug',
  param('slug').notEmpty(),
  validate,
  vendorController.getVendorBySlug
);

router.get(
  '/:id',
  param('id').isUUID(),
  validate,
  vendorController.getVendorById
);

router.patch(
  '/:id/status',
  authenticate,
  authorizePermission(PERMISSION_CODES.ADMIN_PANEL_ACCESS),
  [
    param('id').isUUID(),
    body('status').isIn(['PENDING', 'ACTIVE', 'SUSPENDED', 'BANNED', 'CLOSED']),
    body('reason').optional().isString(),
  ],
  validate,
  vendorController.updateVendorStatus
);

router.patch(
  '/:id/verify',
  authenticate,
  authorizePermission(PERMISSION_CODES.ADMIN_PANEL_ACCESS),
  [
    param('id').isUUID(),
    body('approved').isBoolean(),
    body('reason').optional().isString(),
  ],
  validate,
  vendorController.verifyVendor
);

router.patch(
  '/documents/:documentId/verify',
  authenticate,
  authorizePermission(PERMISSION_CODES.ADMIN_PANEL_ACCESS),
  [
    param('documentId').isUUID(),
    body('approved').isBoolean(),
    body('reason').optional().isString(),
  ],
  validate,
  vendorController.verifyDocument
);

export default router;

