import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate, authorize } from '@freeshop/shared-middleware';
import { validate } from '@freeshop/shared-middleware';
import { body, param } from 'express-validator';

const router: Router = Router();

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
  body('addressLine1').isString().notEmpty().withMessage('Address line 1 is required'),
  body('city').isString().notEmpty().withMessage('City is required'),
  body('state').optional().isString(),
  body('district').optional().isString(),
  body('division').optional().isString(),
  body('label').optional().isString(),
  body('addressLine2').optional().isString(),
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
