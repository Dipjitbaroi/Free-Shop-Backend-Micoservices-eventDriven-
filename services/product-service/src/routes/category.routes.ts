import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { authenticate, authorize } from '@freeshop/shared-middleware';
import { validate } from '@freeshop/shared-middleware';
import { UserRole } from '@freeshop/shared-types';
import { body, param, query } from 'express-validator';

const router: Router = Router();

// Validation schemas
const createCategoryValidation = [
  body('name').isString().notEmpty().withMessage('Category name is required'),
  body('description').optional().isString(),
  body('image').optional().isString(),
  body('parentId').optional().isUUID(),
  body('sortOrder').optional().isInt({ min: 0 }),
];

const updateCategoryValidation = [
  param('id').isUUID().withMessage('Valid category ID is required'),
  body('name').optional().isString().notEmpty(),
  body('description').optional().isString(),
  body('image').optional().isString(),
  body('parentId').optional().isUUID(),
  body('sortOrder').optional().isInt({ min: 0 }),
];

// Public routes
router.get(
  '/',
  query('parentId').optional().isUUID(),
  validate,
  categoryController.getCategories
);

router.get('/tree', categoryController.getCategoryTree);

router.get(
  '/slug/:slug',
  categoryController.getCategoryBySlug
);

router.get(
  '/:id',
  param('id').isUUID().withMessage('Valid category ID is required'),
  validate,
  categoryController.getCategoryById
);

// Admin routes
router.post(
  '/',
  authenticate,
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  createCategoryValidation,
  validate,
  categoryController.createCategory
);

router.patch(
  '/:id',
  authenticate,
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  updateCategoryValidation,
  validate,
  categoryController.updateCategory
);

router.delete(
  '/:id',
  authenticate,
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  param('id').isUUID().withMessage('Valid category ID is required'),
  validate,
  categoryController.deleteCategory
);

router.patch(
  '/:id/status',
  authenticate,
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  param('id').isUUID().withMessage('Valid category ID is required'),
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
  validate,
  categoryController.toggleCategoryStatus
);

export default router;
