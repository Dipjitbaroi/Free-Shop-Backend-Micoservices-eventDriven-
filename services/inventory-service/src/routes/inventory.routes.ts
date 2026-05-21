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
  // Accept either productId (for products) or freeItemId (for standalone free items)
  body('productId').optional().isUUID(),
  body('freeItemId').optional().isUUID(),
  body('userId').isUUID(),
  body('initialStock').optional().isInt({ min: 0 }),
  body('lowStockThreshold').optional().isInt({ min: 0 }),
  validate,
  inventoryController.initializeInventory
);

// Check availability (for checkout)
router.post(
  '/check-availability',
  body('items').isArray({ min: 1 }),
  body('items.*.productId').isString().notEmpty(),
  body('items.*.quantity').isInt({ min: 1 }),
  validate,
  inventoryController.checkAvailability
);

// Cleanup expired reservations (manual API trigger instead of cron)
router.post(
  '/cleanup/expired-reservations',
  authenticate,
  authorizePermission(PERMISSION_CODES.INVENTORY_UPDATE),
  validate,
  inventoryController.cleanupExpiredReservations
);

// Get product inventory
router.get(
  '/product/:productId',
  param('productId').isUUID(),
  validate,
  inventoryController.getInventory
);

// Get user's full inventory (if vendor, returns vendor inventory; otherwise returns user's products)
router.get(
  '/user/:userId',
  authenticate,
  authorizePermission(PERMISSION_CODES.INVENTORY_READ),
  [
    param('userId').isUUID().withMessage('Valid user ID is required'),
    ...paginationValidation,
    query('lowStockOnly').optional().isIn(['true', 'false']),
  ],
  validate,
  inventoryController.getUserInventory
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

// ============ FREE ITEMS INVENTORY MANAGEMENT ============

// Initialize free item inventory
router.post(
  '/free-items/initialize',
  authenticate,
  authorizePermission(PERMISSION_CODES.INVENTORY_CREATE),
  body('freeItemId').isUUID(),
  body('userId').isUUID(),
  body('initialStock').isInt({ min: 1 }),
  validate,
  inventoryController.initializeFreeItemInventory
);

// Get free item inventory
router.get(
  '/free-items/:freeItemId',
  param('freeItemId').isUUID(),
  validate,
  inventoryController.getFreeItemInventory
);

// Add free item stock (restock)
router.post(
  '/free-items/:freeItemId/add',
  authenticate,
  authorizePermission(PERMISSION_CODES.INVENTORY_UPDATE),
  param('freeItemId').isUUID(),
  body('quantity').isInt({ min: 1 }),
  body('reason').optional().isString(),
  validate,
  inventoryController.addFreeItemStock
);

// Reduce free item stock
router.post(
  '/free-items/:freeItemId/reduce',
  authenticate,
  authorizePermission(PERMISSION_CODES.INVENTORY_UPDATE),
  param('freeItemId').isUUID(),
  body('quantity').isInt({ min: 1 }),
  body('reason').optional().isString(),
  validate,
  inventoryController.reduceFreeItemStock
);

// Get free item stock movements
router.get(
  '/free-items/:freeItemId/movements',
  authenticate,
  authorizePermission(PERMISSION_CODES.INVENTORY_READ),
  param('freeItemId').isUUID(),
  paginationValidation,
  validate,
  inventoryController.getFreeItemMovements
);

export default router;
