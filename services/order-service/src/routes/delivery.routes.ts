/**
 * Delivery Routes
 * Endpoints for managing delivery operations
 */

import { Router } from 'express';
import { authenticate, authorizePermission, validate } from '@freeshop/shared-middleware';
import { deliveryController } from '../controllers/delivery.controller.js';
import { body, param, query } from 'express-validator';
import { PERMISSION_CODES } from '@freeshop/shared-types';

const router: Router = Router();

// Validation schemas
const createDeliveryValidation = [
  body('type').isIn(['INHOUSE', 'THIRD_PARTY']).withMessage('Delivery type must be INHOUSE or THIRD_PARTY'),
  // INHOUSE only
  body('deliveryManId').if(body('type').equals('INHOUSE')).isUUID().withMessage('Valid delivery man ID is required for INHOUSE delivery'),
  // THIRD_PARTY only
  body('provider').if(body('type').equals('THIRD_PARTY')).isIn(['STEADFAST', 'PATHAO', 'REDX', 'SUNDARBAN', 'OTHER']).withMessage('Valid provider is required for THIRD_PARTY delivery'),
  body('trackingId').if(body('type').equals('THIRD_PARTY')).optional().isString(),
  body('apiRef').if(body('type').equals('THIRD_PARTY')).optional().isString(),
  // Common fields
  body('weight').optional().isFloat({ min: 0 }),
  body('fragile').optional().isBoolean(),
  body('estimatedDeliveryDate').optional().isISO8601(),
];

const updateStatusValidation = [
  body('status').isIn(['PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'RETURNED']),
  body('notes').optional().isString(),
];

const recordFailedAttemptValidation = [
  body('reason').isString().notEmpty().withMessage('Failure reason is required'),
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isString(),
];

// ── Order-specific delivery routes ──────────────────────────────────────────

/**
 * Create delivery for an order (Unified endpoint)
 * POST /orders/:orderId/delivery
 * Permission Required: DELIVERY_CREATE
 * 
 * Request body:
 * - INHOUSE delivery:
 *   { "type": "INHOUSE", "deliveryManId": "uuid", "weight": 2.5, "fragile": false }
 * 
 * - THIRD_PARTY delivery:
 *   { "type": "THIRD_PARTY", "provider": "STEADFAST", "trackingId": "ST123", "apiRef": "ref-123" }
 */
router.post(
  '/orders/:orderId/delivery',
  authenticate,
  authorizePermission(PERMISSION_CODES.DELIVERY_CREATE),
  createDeliveryValidation,
  validate,
  deliveryController.createDelivery
);

/**
 * Get delivery by order
 * GET /orders/:orderId/delivery
 */
router.get(
  '/orders/:orderId/delivery',
  authenticate,
  param('orderId').isUUID().withMessage('Invalid order ID'),
  query('search').optional().isString(),
  validate,
  deliveryController.getDeliveryByOrder
);



// ── Delivery-specific routes ────────────────────────────────────────────────

/**
 * Get delivery by ID
 * GET /deliveries/:deliveryId
 */
router.get(
  '/deliveries/:deliveryId',
  authenticate,
  deliveryController.getDeliveryById
);

/**
 * Update delivery status
 * PUT /deliveries/:deliveryId/status
 * Permission Required: DELIVERY_UPDATE
 */
router.put(
  '/deliveries/:deliveryId/status',
  authenticate,
  authorizePermission(PERMISSION_CODES.DELIVERY_UPDATE),
  updateStatusValidation,
  validate,
  deliveryController.updateDeliveryStatus
);

/**
 * Record failed delivery attempt
 * POST /deliveries/:deliveryId/failed-attempt
 * Permission Required: DELIVERY_UPDATE
 * TODO: Can also allow DELIVERY_MAN role when implemented
 */
router.post(
  '/deliveries/:deliveryId/failed-attempt',
  authenticate,
  authorizePermission(PERMISSION_CODES.DELIVERY_UPDATE),
  recordFailedAttemptValidation,
  validate,
  deliveryController.recordFailedAttempt
);

// ── Delivery man specific routes ────────────────────────────────────────────

/**
 * Get deliveries for a delivery man
 * GET /deliveries/delivery-man/:deliveryManId
 */
router.get(
  '/deliveries/delivery-man/:deliveryManId',
  authenticate,
  paginationValidation,
  query('search').optional().isString(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  validate,
  deliveryController.getDeliveriesForDeliveryMan
);

// ── Provider-specific routes ────────────────────────────────────────────

/**
 * Get deliveries by provider
 * GET /deliveries/provider/:provider
 */
router.get(
  '/deliveries/provider/:provider',
  authenticate,
  paginationValidation,
  validate,
  deliveryController.getDeliveriesByProvider
);

// ── Statistics routes ──────────────────────────────────────────────────────

/**
 * Get delivery statistics
 * GET /deliveries/stats
 */
router.get(
  '/deliveries/stats',
  authenticate,
  deliveryController.getDeliveryStats
);

export default router;
