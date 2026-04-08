import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { notificationController } from '../controllers/notification.controller';
import { authenticate, authorizePermission, validate } from '@freeshop/shared-middleware';
import { PERMISSION_CODES } from '@freeshop/shared-types';

const router: Router = Router();

const notificationTypes = [
  'ORDER_CREATED', 'ORDER_CONFIRMED', 'ORDER_SHIPPED', 'ORDER_DELIVERED', 'ORDER_CANCELLED',
  'PAYMENT_RECEIVED', 'PAYMENT_FAILED', 'PAYMENT_REFUNDED',
  'Vendor_VERIFIED', 'Vendor_SUSPENDED', 'WITHDRAWAL_COMPLETED', 'WITHDRAWAL_REJECTED',
  'LOW_STOCK_ALERT', 'PRICE_DROP', 'BACK_IN_STOCK',
  'WELCOME', 'PASSWORD_RESET', 'EMAIL_VERIFICATION', 'PROMOTION', 'CUSTOM'
];

const channelTypes = ['EMAIL', 'SMS', 'PUSH', 'IN_APP'];
const statusTypes = ['PENDING', 'QUEUED', 'SENT', 'DELIVERED', 'FAILED', 'CANCELLED'];

router.post(
  '/',
  authenticate,
  authorizePermission(PERMISSION_CODES.ADMIN_PANEL_ACCESS),
  [
    body('type').isIn(notificationTypes).withMessage('Valid notification type is required'),
    body('channel').isIn(channelTypes).withMessage('Valid channel is required'),
    body('userId').optional().isUUID(),
    body('email').optional().isEmail(),
    body('phone').optional().isMobilePhone('any'),
    body('templateId').optional().isString(),
    body('templateData').optional().isObject(),
    body('subject').optional().isString(),
    body('content').optional().isString(),
  ],
  validate,
  notificationController.sendNotification
);

router.post(
  '/bulk',
  authenticate,
  authorizePermission(PERMISSION_CODES.ADMIN_PANEL_ACCESS),
  [
    body('userIds').isArray({ min: 1 }).withMessage('At least one user ID is required'),
    body('userIds.*').isUUID(),
    body('type').isIn(notificationTypes),
    body('channel').isIn(channelTypes),
    body('templateId').notEmpty().withMessage('Template ID is required for bulk notifications'),
    body('templateData').optional().isObject(),
  ],
  validate,
  notificationController.sendBulkNotification
);

router.get(
  '/',
  authenticate,
  authorizePermission(PERMISSION_CODES.ADMIN_PANEL_ACCESS),
  [
    query('userId').optional().isUUID(),
    query('type').optional().isIn(notificationTypes),
    query('channel').optional().isIn(channelTypes),
    query('status').optional().isIn(statusTypes),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  notificationController.getNotifications
);

router.get(
  '/me',
  authenticate,
  [
    query('type').optional().isIn(notificationTypes),
    query('channel').optional().isIn(channelTypes),
    query('status').optional().isIn(statusTypes),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  notificationController.getMyNotifications
);

router.get(
  '/preferences',
  authenticate,
  notificationController.getMyPreferences
);

router.patch(
  '/preferences',
  authenticate,
  [
    body('emailEnabled').optional().isBoolean(),
    body('smsEnabled').optional().isBoolean(),
    body('pushEnabled').optional().isBoolean(),
    body('orderUpdates').optional().isBoolean(),
    body('promotions').optional().isBoolean(),
    body('VendorUpdates').optional().isBoolean(),
    body('accountUpdates').optional().isBoolean(),
    body('priceAlerts').optional().isBoolean(),
  ],
  validate,
  notificationController.updateMyPreferences
);

router.post(
  '/devices',
  authenticate,
  [
    body('token').notEmpty().withMessage('Device token is required'),
    body('platform').isIn(['IOS', 'ANDROID', 'WEB']).withMessage('Valid platform is required'),
    body('deviceInfo').optional().isObject(),
  ],
  validate,
  notificationController.registerDevice
);

router.delete(
  '/devices/:token',
  authenticate,
  param('token').notEmpty(),
  validate,
  notificationController.unregisterDevice
);

router.get(
  '/:id',
  authenticate,
  param('id').isUUID(),
  validate,
  notificationController.getNotificationById
);

router.patch(
  '/:id/cancel',
  authenticate,
  authorizePermission(PERMISSION_CODES.ADMIN_PANEL_ACCESS),
  param('id').isUUID(),
  validate,
  notificationController.cancelNotification
);

export default router;

