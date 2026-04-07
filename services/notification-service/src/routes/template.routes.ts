import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { templateController } from '../controllers/template.controller';
import { authenticate, authorize, validate } from '@freeshop/shared-middleware';

const router = Router();

const notificationTypes = [
  'ORDER_CREATED', 'ORDER_CONFIRMED', 'ORDER_SHIPPED', 'ORDER_DELIVERED', 'ORDER_CANCELLED',
  'PAYMENT_RECEIVED', 'PAYMENT_FAILED', 'PAYMENT_REFUNDED',
  'Vendor_VERIFIED', 'Vendor_SUSPENDED', 'WITHDRAWAL_COMPLETED', 'WITHDRAWAL_REJECTED',
  'LOW_STOCK_ALERT', 'PRICE_DROP', 'BACK_IN_STOCK',
  'WELCOME', 'PASSWORD_RESET', 'EMAIL_VERIFICATION', 'PROMOTION', 'CUSTOM'
];

const channelTypes = ['EMAIL', 'SMS', 'PUSH', 'IN_APP'];

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  [
    body('name').notEmpty().withMessage('Template name is required'),
    body('type').isIn(notificationTypes).withMessage('Valid notification type is required'),
    body('channel').isIn(channelTypes).withMessage('Valid channel is required'),
    body('body').notEmpty().withMessage('Template body is required'),
    body('description').optional().isString(),
    body('subject').optional().isString(),
    body('variables').optional().isArray(),
  ],
  validate,
  templateController.createTemplate
);

router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  [
    query('type').optional().isIn(notificationTypes),
    query('channel').optional().isIn(channelTypes),
    query('isActive').optional().isIn(['true', 'false']),
  ],
  validate,
  templateController.listTemplates
);

router.get(
  '/:id',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  param('id').notEmpty(),
  validate,
  templateController.getTemplate
);

router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  [
    param('id').isUUID(),
    body('name').optional().notEmpty(),
    body('description').optional().isString(),
    body('subject').optional().isString(),
    body('body').optional().notEmpty(),
    body('variables').optional().isArray(),
    body('isActive').optional().isBoolean(),
  ],
  validate,
  templateController.updateTemplate
);

export default router;

