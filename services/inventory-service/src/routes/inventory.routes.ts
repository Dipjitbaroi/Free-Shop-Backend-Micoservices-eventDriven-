import { Router } from 'express';
import { inventoryController } from '../controllers/inventory.controller.js';
import { authenticate, authorizePermission } from '@freeshop/shared-middleware';
import { validate } from '@freeshop/shared-middleware';
import { PERMISSION_CODES } from '@freeshop/shared-types';
import { body, param, query } from 'express-validator';

const router: Router = Router();

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

// Initialize inventory (internal use / admin)
router.post(
  '/initialize',
  authenticate,
  authorizePermission(PERMISSION_CODES.INVENTORY_CREATE),
  body('productId').isUUID(),
  body('vendorId').isUUID(),
  body('initialStock').optional().isInt({ min: 0 }),
  body('lowStockThreshold').optional().isInt({ min: 0 }),
  validate,
  inventoryController.initializeInventory
);

// Check availability (for checkout)
router.post(
  '/check-availability',
  body('items').isArray({ min: 1 }),
  body('items.*.productId').isUUID(),
  body('items.*.quantity').isInt({ min: 1 }),
  validate,
  inventoryController.checkAvailability
);

// Get product inventory
router.get(
  '/product/:productId',
  param('productId').isUUID(),
  validate,
  inventoryController.getInventory
);

// Get vendor inventory
router.get(
  '/vendor',
  authenticate,
  authorizePermission(PERMISSION_CODES.INVENTORY_READ),
  [
    ...paginationValidation,
    query('lowStockOnly').optional().isIn(['true', 'false']),
  ],
  validate,
  inventoryController.getVendorInventory
);

router.get(
  '/vendor/:vendorId',
  authenticate,
  authorizePermission(PERMISSION_CODES.INVENTORY_READ),
  [
    ...paginationValidation,
    query('lowStockOnly').optional().isIn(['true', 'false']),
  ],
  validate,
  inventoryController.getVendorInventory
);

// Add stock
router.post(
  '/:productId/add',
  authenticate,
  authorizePermission(PERMISSION_CODES.INVENTORY_UPDATE),
  param('productId').isUUID(),
  body('quantity').isInt({ min: 1 }),
  body('reason').optional().isString(),
  validate,
  inventoryController.addStock
);

// Reduce stock
router.post(
  '/:productId/reduce',
  authenticate,
  authorizePermission(PERMISSION_CODES.INVENTORY_UPDATE),
  param('productId').isUUID(),
  body('quantity').isInt({ min: 1 }),
  body('reason').optional().isString(),
  validate,
  inventoryController.reduceStock
);

// Reserve stock (internal use)
router.post(
  '/:productId/reserve',
  body('orderId').isUUID(),
  body('quantity').isInt({ min: 1 }),
  validate,
  inventoryController.reserveStock
);

// Release reservation
router.post(
  '/release/:orderId',
  param('orderId').isUUID(),
  validate,
  inventoryController.releaseReservation
);

// Process return
router.post(
  '/:productId/return',
  authenticate,
  authorizePermission(PERMISSION_CODES.INVENTORY_UPDATE),
  param('productId').isUUID(),
  body('orderId').isUUID(),
  body('quantity').isInt({ min: 1 }),
  validate,
  inventoryController.processReturn
);

// Get stock movements
router.get(
  '/:productId/movements',
  authenticate,
  authorizePermission(PERMISSION_CODES.INVENTORY_READ),
  param('productId').isUUID(),
  paginationValidation,
  validate,
  inventoryController.getMovements
);

// Set low stock threshold
router.patch(
  '/:productId/threshold',
  authenticate,
  authorizePermission(PERMISSION_CODES.INVENTORY_UPDATE),
  param('productId').isUUID(),
  body('threshold').isInt({ min: 0 }),
  validate,
  inventoryController.setLowStockThreshold
);

export default router;
