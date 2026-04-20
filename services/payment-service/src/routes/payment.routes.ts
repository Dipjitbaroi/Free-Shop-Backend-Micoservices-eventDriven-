import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller.js';
import { authenticate, authorizePermission, guestOrAuth } from '@freeshop/shared-middleware';
import { validate } from '@freeshop/shared-middleware';
import { PERMISSION_CODES } from '@freeshop/shared-types';
import { body, param, query } from 'express-validator';

const router: Router = Router();

// Initiate payment (guest or authenticated)
router.post(
  '/initiate',
  guestOrAuth,
  body('orderId').isUUID().withMessage('Valid order ID is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be positive'),
  body('method').isIn(['COD', 'BKASH', 'NAGAD', 'ROCKET', 'EPS', 'CARD', 'BANK_TRANSFER'])
    .withMessage('Valid payment method is required'),
  validate,
  paymentController.initiatePayment
);

// Payment gateway callbacks
router.get('/bkash/callback', paymentController.bkashCallback);
router.get('/eps/callback', paymentController.epsCallback);

// Get payment by order
router.get(
  '/order/:orderId',
  authenticate,
  param('orderId').isUUID(),
  validate,
  paymentController.getPaymentByOrder
);

// Verify payment status
router.get(
  '/:id/verify',
  authenticate,
  param('id').isUUID(),
  validate,
  paymentController.verifyPayment
);

// Get payment by ID
router.get(
  '/:id',
  authenticate,
  param('id').isUUID(),
  validate,
  paymentController.getPaymentById
);

// Admin routes
router.get(
  '/',
  authenticate,
  authorizePermission(PERMISSION_CODES.PAYMENT_READ),
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('userId').optional().isUUID(),
    query('orderId').optional().isUUID(),
    query('status').optional().isIn(['PENDING', 'INITIATED', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'CANCELLED']),
    query('method').optional().isIn(['COD', 'BKASH', 'NAGAD', 'ROCKET', 'EPS', 'CARD', 'BANK_TRANSFER']),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  paymentController.getPayments
);

// Refund
router.post(
  '/:id/refund',
  authenticate,
  authorizePermission(PERMISSION_CODES.PAYMENT_REFUND),
  param('id').isUUID(),
  body('amount').isFloat({ min: 0.01 }),
  body('reason').isString().notEmpty(),
  validate,
  paymentController.initiateRefund
);

// COD confirmation (for delivery staff)
router.post(
  '/:id/confirm-cod',
  authenticate,
  authorizePermission(PERMISSION_CODES.PAYMENT_UPDATE),
  param('id').isUUID(),
  body('collectedAmount').isFloat({ min: 0 }),
  validate,
  paymentController.confirmCodPayment
);

export default router;
