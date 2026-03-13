import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { sellerController } from '../controllers/seller.controller';
import { authenticate, authorize, validate } from '@freeshop/shared-middleware';

const router = Router();

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
  sellerController.createSeller
);

router.get('/me', authenticate, sellerController.getMySeller);

router.get('/me/stats', authenticate, sellerController.getSellerStats);

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
  sellerController.updateSeller
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
  sellerController.addDocument
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
  sellerController.listSellers
);

router.get(
  '/store/:slug',
  param('slug').notEmpty(),
  validate,
  sellerController.getSellerBySlug
);

router.get(
  '/:id',
  param('id').isUUID(),
  validate,
  sellerController.getSellerById
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  [
    param('id').isUUID(),
    body('status').isIn(['PENDING', 'ACTIVE', 'SUSPENDED', 'BANNED', 'CLOSED']),
    body('reason').optional().isString(),
  ],
  validate,
  sellerController.updateSellerStatus
);

router.patch(
  '/:id/verify',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  [
    param('id').isUUID(),
    body('approved').isBoolean(),
    body('reason').optional().isString(),
  ],
  validate,
  sellerController.verifySeller
);

router.patch(
  '/documents/:documentId/verify',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  [
    param('documentId').isUUID(),
    body('approved').isBoolean(),
    body('reason').optional().isString(),
  ],
  validate,
  sellerController.verifyDocument
);

export default router;
