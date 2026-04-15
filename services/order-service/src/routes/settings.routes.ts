import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller';
import { authenticate, authorizePermission } from '@freeshop/shared-middleware';
import { PERMISSION_CODES } from '@freeshop/shared-types';
import { body } from 'express-validator';
import { validate } from '@freeshop/shared-middleware';

const router: Router = Router();

// Only admin/manager can get or update delivery settings
router.get(
  '/delivery',
  authenticate,
  authorizePermission(PERMISSION_CODES.SETTINGS_UPDATE),
  settingsController.getDeliverySettings
);

// Public: get available delivery zones (no auth)
router.get('/delivery/zones', settingsController.getDeliveryZones);


// Accepts a JSON object: { in_feni: 60, in_dhaka: 50, outside_dhaka: 120, ... }
router.put(
  '/delivery',
  authenticate,
  authorizePermission(PERMISSION_CODES.SETTINGS_UPDATE),
  settingsController.updateDeliverySettings
);

export default router;
