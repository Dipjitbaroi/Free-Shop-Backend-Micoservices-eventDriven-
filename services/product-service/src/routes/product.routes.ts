import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authenticate, authorize, optionalAuth } from '@freeshop/shared-middleware';
import { validate } from '@freeshop/shared-middleware';
import { UserRole } from '@freeshop/shared-types';
import { body, param, query } from 'express-validator';
import config from '../config';

const router = Router();

// Validation schemas
const createProductValidation = [
  body('name').isString().notEmpty().withMessage('Product name is required'),
  body('categoryId').isUUID().withMessage('Valid category ID is required'),
  body('supplierPrice').isFloat({ min: 0 }).withMessage('Supplier price must be a positive number'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description').optional().isString(),
  body('images').optional().isArray({ max: config.upload.maxImages }).withMessage(`Maximum ${config.upload.maxImages} images allowed`),
  body('unit').optional().isString(),
  body('stock').optional().isInt({ min: 0 }),
  body('isOrganic').optional().isBoolean(),
];

const updateProductValidation = [
  param('id').isUUID().withMessage('Valid product ID is required'),
  body('name').optional().isString().notEmpty(),
  body('categoryId').optional().isUUID(),
  body('supplierPrice').optional().isFloat({ min: 0 }),
  body('price').optional().isFloat({ min: 0 }),
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

const productFilterValidation = [
  ...paginationValidation,
  query('search').optional().isString().trim(),
  query('categoryId').optional().isUUID(),
  query('vendorId').optional().isUUID(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('isOrganic').optional().isIn(['true', 'false']),
  query('status').optional().isIn(['PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'REJECTED']),
  query('sortBy').optional().isIn(['price', 'createdAt', 'rating', 'sold']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
];

// Public routes
router.get(
  '/',
  optionalAuth,
  productFilterValidation,
  validate,
  productController.getProducts
);

router.get('/featured', productController.getFeaturedProducts);
router.get('/flash-sale', productController.getFlashSaleProducts);

router.get(
  '/slug/:slug',
  optionalAuth,
  productController.getProductBySlug
);

// Vendor routes
router.get(
  '/vendor/:vendorId?',
  authenticate,
  authorize([UserRole.VENDOR, UserRole.ADMIN, UserRole.MANAGER]),
  [
    ...paginationValidation,
    query('status').optional().isIn(['PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'REJECTED']),
  ],
  validate,
  productController.getVendorProducts
);

router.get(
  '/:id',
  optionalAuth,
  param('id').isUUID().withMessage('Valid product ID is required'),
  validate,
  productController.getProductById
);

router.post(
  '/',
  authenticate,
  authorize([UserRole.VENDOR, UserRole.ADMIN, UserRole.MANAGER]),
  createProductValidation,
  validate,
  productController.createProduct
);

// Update product
// NOTE: Pricing Policy
// - Vendors can update supplierPrice (their cost price)
// - Only ADMIN/MANAGER can update price (retail selling price)
// - Vendors attempting to update price will get ForbiddenError
router.patch(
  '/:id',
  authenticate,
  authorize([UserRole.VENDOR, UserRole.ADMIN, UserRole.MANAGER]),
  updateProductValidation,
  validate,
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize([UserRole.VENDOR, UserRole.ADMIN, UserRole.MANAGER]),
  param('id').isUUID().withMessage('Valid product ID is required'),
  validate,
  productController.deleteProduct
);

// Unified status update (Vendor + admin)
router.patch(
  '/:id/status',
  authenticate,
  authorize([UserRole.VENDOR, UserRole.ADMIN, UserRole.MANAGER]),
  [
    param('id').isUUID().withMessage('Valid product ID is required'),
    body('status')
      .isIn(['PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'REJECTED'])
      .withMessage('Invalid status value'),
    body('reason').optional().isString().trim(),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  ],
  validate,
  productController.updateProductStatus
);

export default router;

