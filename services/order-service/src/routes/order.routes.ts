import { Router } from 'express';
import { orderController } from '../controllers/order.controller.js';
import { authenticate, authorizePermission, guestOrAuth } from '@freeshop/shared-middleware';
import { validate } from '@freeshop/shared-middleware';
import { PERMISSION_CODES } from '@freeshop/shared-types';
import { body, param, query } from 'express-validator';

const router: Router = Router();

// Validation schemas
const createOrderValidation = [
  // Accept either a saved address ID or a full inline address object
  body('shippingAddressId')
    .optional()
    .isUUID()
    .withMessage('shippingAddressId must be a valid UUID'),
  body('shippingAddress')
    .optional()
    .isObject()
    .withMessage('shippingAddress must be an object'),
  body().custom((value: Record<string, unknown>) => {
    if (!value.shippingAddressId && !value.shippingAddress) {
      throw new Error('Either shippingAddressId or shippingAddress is required');
    }
    return true;
  }),
  // If inline shippingAddress is provided, require a non-empty 'zone' property
  body().custom((value: Record<string, unknown>) => {
    if (value.shippingAddress) {
      const addr = value.shippingAddress as Record<string, unknown>;
      if (!addr || typeof addr !== 'object' || !('zone' in addr) || !String((addr as any).zone).trim()) {
        throw new Error('shippingAddress.zone is required when providing an inline shippingAddress');
      }
    }
    return true;
  }),
  body('paymentMethod').isIn(['COD', 'BKASH', 'NAGAD', 'ROCKET', 'EPS', 'CARD', 'BANK_TRANSFER'])
    .withMessage('Valid payment method is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').isUUID().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  // vendorId, productName, price are resolved server-side from product-service
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

// Guest or authenticated - create order
router.post(
  '/',
  guestOrAuth,
  createOrderValidation,
  validate,
  orderController.createOrder
);

// Validate coupon
router.post(
  '/coupon/validate',
  guestOrAuth,
  body('code').isString().notEmpty(),
  body('subtotal').isFloat({ min: 0 }),
  validate,
  orderController.validateCoupon
);

// User routes - get own orders
router.get(
  '/my-orders',
  authenticate,
  paginationValidation,
  validate,
  orderController.getUserOrders
);

// Get order by number (for tracking)
router.get(
  '/track/:orderNumber',
  param('orderNumber').isString().notEmpty(),
  validate,
  orderController.getOrderByNumber
);

// Seller/Admin routes - manage orders
router.get(
  '/vendor',
  authenticate,
  authorizePermission(PERMISSION_CODES.ORDER_READ),
  paginationValidation,
  validate,
  orderController.getVendorOrders
);

router.get(
  '/vendor/:vendorId',
  authenticate,
  authorizePermission(PERMISSION_CODES.ORDER_READ),
  paginationValidation,
  validate,
  orderController.getVendorOrders
);

// Cancel own order
router.post(
  '/:id/cancel',
  authenticate,
  param('id').isUUID(),
  body('reason').isString().notEmpty().withMessage('Cancellation reason is required'),
  validate,
  orderController.cancelOrder
);

// Get single order
router.get(
  '/:id',
  authenticate,
  param('id').isUUID(),
  validate,
  orderController.getOrderById
);

// Admin routes
router.get(
  '/',
  authenticate,
  authorizePermission(PERMISSION_CODES.ORDER_READ),
  [
    ...paginationValidation,
    query('status').optional().isIn(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED']),
    query('paymentStatus').optional().isIn(['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED']),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  orderController.getOrders
);

router.patch(
  '/:id/status',
  authenticate,
  authorizePermission(PERMISSION_CODES.ORDER_UPDATE),
  param('id').isUUID(),
  body('status').isIn([
    'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 
    'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED'
  ]),
  body('note').optional().isString(),
  validate,
  orderController.updateOrderStatus
);

router.patch(
  '/:id/payment',
  authenticate,
  authorizePermission(PERMISSION_CODES.ORDER_UPDATE),
  param('id').isUUID(),
  body('paymentStatus').isIn(['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED']),
  body('transactionId').optional().isString(),
  validate,
  orderController.updatePaymentStatus
);

router.patch(
  '/:id/tracking',
  authenticate,
  authorizePermission(PERMISSION_CODES.ORDER_UPDATE),
  param('id').isUUID(),
  body('trackingNumber').isString().notEmpty(),
  body('carrier').optional().isString(),
  validate,
  orderController.addTrackingInfo
);

export default router;
