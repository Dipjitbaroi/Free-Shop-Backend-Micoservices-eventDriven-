import { Router } from 'express';
import { inventoryController } from '../controllers/inventory.controller.js';
import { authenticateService, validate } from '@freeshop/shared-middleware';
import { body, param } from 'express-validator';

const router: Router = Router();

// Internal service-to-service inventory initialization for auto-created free items
router.post(
  '/inventory/initialize',
  authenticateService,
  body('freeItemId').isUUID(),
  body('userId').isUUID(),
  body('initialStock').optional().isInt({ min: 0 }),
  body('lowStockThreshold').optional().isInt({ min: 0 }),
  validate,
  inventoryController.initializeInventory
);

// Internal endpoint: Check availability for a single product (for order service)
router.get(
  '/check-availability/:productId',
  param('productId').isUUID(),
  validate,
  inventoryController.checkSingleProductAvailability
);

export default router;
