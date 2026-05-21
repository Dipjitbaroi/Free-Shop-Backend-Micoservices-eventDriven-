import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller.js';
import { authenticate, authorizePermission } from '@freeshop/shared-middleware';
import { PERMISSION_CODES } from '@freeshop/shared-types';
import { body, param } from 'express-validator';
import { validate } from '@freeshop/shared-middleware';

const router: Router = Router();

// Create a new delivery zone (admin/manager only)
router.post(
  '/delivery',
  authenticate,
  authorizePermission(PERMISSION_CODES.SETTINGS_UPDATE),
  body('name').isString().notEmpty().withMessage('Zone name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  validate,
  settingsController.createDeliveryZone
);

// Public: get available delivery zones (no auth)
router.get('/delivery/zones', settingsController.getDeliveryZones);

// Update a single zone by id (admin)
router.patch(
  '/delivery/:id',
  authenticate,
  authorizePermission(PERMISSION_CODES.SETTINGS_UPDATE),
  param('id').isUUID(),
  body('name').optional().isString(),
  body('price').optional().isNumeric(),
  validate,
  settingsController.updateDeliveryZone
);

// Delete a zone by id (admin)
router.delete(
  '/delivery/:id',
  authenticate,
  authorizePermission(PERMISSION_CODES.SETTINGS_UPDATE),
  param('id').isUUID(),
  validate,
  settingsController.deleteDeliveryZone
);

export default router;
