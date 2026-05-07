import { Router } from 'express';
import { inventoryController } from '../controllers/inventory.controller.js';
import { validate } from '@freeshop/shared-middleware';
import { param } from 'express-validator';

const router: Router = Router();

// Internal endpoint: Check availability for a single product (for order service)
router.get(
  '/check-availability/:productId',
  param('productId').isUUID(),
  validate,
  inventoryController.checkSingleProductAvailability
);

export default router;
