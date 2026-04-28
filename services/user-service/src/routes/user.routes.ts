import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authenticate } from '@freeshop/shared-middleware';
import { validate } from '@freeshop/shared-middleware';
import { body, param } from 'express-validator';

const router: Router = Router();

// Public route - get user profile by ID (no auth required)
router.get('/:userId/public-profile', userController.getPublicProfile);

// Validation schemas
const updateProfileValidation = [
  body('firstName').optional().isString().isLength({ max: 100 }),
  body('lastName').optional().isString().isLength({ max: 100 }),
  body('phone').optional().isString(),
  body('dateOfBirth').optional().isISO8601(),
  body('gender').optional().isIn(['MALE', 'FEMALE', 'OTHER']),
];

const addAddressValidation = [
  body('fullName').isString().notEmpty().withMessage('Full name is required'),
  body('phone').isString().notEmpty().withMessage('Phone is required'),
  body('addressLine').isString().notEmpty().withMessage('Address line is required'),
  body('district').isString().notEmpty().withMessage('District is required'),
  body('upazila').optional().isString(),
  body('zoneId').isUUID().notEmpty().withMessage('zoneId (UUID) is required'),
  body('label').optional().isString(),
  body('postalCode').optional().isString(),
  body('isDefault').optional().isBoolean(),
  body('type').optional().isIn(['SHIPPING', 'BILLING', 'BOTH']),
];

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get('/profile', userController.getProfile);
router.patch('/profile', updateProfileValidation, validate, userController.updateProfile);

// Address routes
router.get('/addresses', userController.getAddresses);
router.get(
  '/addresses/:addressId',
  param('addressId').isUUID(),
  validate,
  userController.getAddressById
);
router.post('/addresses', addAddressValidation, validate, userController.addAddress);
router.patch(
  '/addresses/:addressId',
  param('addressId').isUUID(),
  validate,
  userController.updateAddress
);
router.delete(
  '/addresses/:addressId',
  param('addressId').isUUID(),
  validate,
  userController.deleteAddress
);
router.post(
  '/addresses/:addressId/default',
  param('addressId').isUUID(),
  validate,
  userController.setDefaultAddress
);

export default router;
