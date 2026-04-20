import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { commissionController } from '../controllers/commission.controller.js';
import { authenticate, authorizePermission, validate } from '@freeshop/shared-middleware';
import { PERMISSION_CODES } from '@freeshop/shared-types';

const router: Router = Router();

router.get(
  '/commissions',
  authenticate,
  [
    query('status').optional().isIn(['PENDING', 'SETTLED', 'WITHDRAWN', 'CANCELLED']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  commissionController.getMyCommissions
);

router.get(
  '/balance',
  authenticate,
  commissionController.getAvailableBalance
);

router.post(
  '/withdrawals',
  authenticate,
  [
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
    body('method')
      .isIn(['BANK_TRANSFER', 'BKASH', 'NAGAD', 'ROCKET'])
      .withMessage('Valid withdrawal method is required'),
    body('accountDetails').isObject().withMessage('Account details are required'),
  ],
  validate,
  commissionController.requestWithdrawal
);

router.get(
  '/withdrawals',
  authenticate,
  [
    query('status').optional().isIn(['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED', 'FAILED']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  commissionController.getMyWithdrawals
);

router.get(
  '/admin/withdrawals',
  authenticate,
  authorizePermission(PERMISSION_CODES.ADMIN_PANEL_ACCESS),
  [
    query('VendorId').optional().isUUID(),
    query('status').optional().isIn(['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED', 'FAILED']),
    query('method').optional().isIn(['BANK_TRANSFER', 'BKASH', 'NAGAD', 'ROCKET']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  commissionController.listAllWithdrawals
);

router.get(
  '/withdrawals/:id',
  authenticate,
  param('id').isUUID(),
  validate,
  commissionController.getWithdrawal
);

router.patch(
  '/withdrawals/:id/process',
  authenticate,
  authorizePermission(PERMISSION_CODES.ADMIN_PANEL_ACCESS),
  [
    param('id').isUUID(),
    body('approved').isBoolean(),
    body('transactionId').optional().isString(),
    body('reason').optional().isString(),
  ],
  validate,
  commissionController.processWithdrawal
);

router.patch(
  '/withdrawals/:id/complete',
  authenticate,
  authorizePermission(PERMISSION_CODES.ADMIN_PANEL_ACCESS),
  [
    param('id').isUUID(),
    body('transactionId').notEmpty().withMessage('Transaction ID is required'),
  ],
  validate,
  commissionController.completeWithdrawal
);

export default router;

