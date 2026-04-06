import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, authorize, validate } from '@freeshop/shared-middleware';
import { UserRole } from '@freeshop/shared-types';
import { deliveryController } from '../controllers/delivery.controller';

const router = Router();

router.get(
  '/',
  authenticate,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['PENDING_ASSIGNMENT', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_FAILED', 'CANCELLED']),
    query('provider').optional().isIn(['INHOUSE', 'STEADFAST']),
    query('dispatchStatus').optional().isIn(['PENDING', 'DISPATCHED', 'FAILED']),
  ],
  validate,
  deliveryController.list
);

router.get('/my-assignments', authenticate, deliveryController.myAssignments);

router.get('/order/:orderId', authenticate, param('orderId').isUUID(), validate, deliveryController.getByOrderId);
router.get('/:id', authenticate, param('id').isUUID(), validate, deliveryController.getById);

router.patch(
  '/:id/assign',
  authenticate,
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  [
    param('id').isUUID(),
    body('deliveryAgentId').isString().notEmpty(),
    body('deliveryAgentName').optional().isString(),
  ],
  validate,
  deliveryController.assignAgent
);

router.patch(
  '/:id/status',
  authenticate,
  [
    param('id').isUUID(),
    body('status').isIn(['PENDING_ASSIGNMENT', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_FAILED', 'CANCELLED']),
    body('note').optional().isString(),
  ],
  validate,
  deliveryController.updateStatus
);

router.patch(
  '/:id/provider',
  authenticate,
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  [
    param('id').isUUID(),
    body('provider').isIn(['INHOUSE', 'STEADFAST']),
    body('dispatchStatus').optional().isIn(['PENDING', 'DISPATCHED', 'FAILED']),
    body('trackingNumber').optional().isString(),
    body('dispatchNote').optional().isString(),
  ],
  validate,
  deliveryController.updateProvider
);

export default router;
