import { Request, Response, NextFunction } from 'express';
import { deliveryService } from '../services/delivery.service.js';
import {
  successResponse,
  AppError,
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  ServiceUnavailableError,
  UnauthorizedError,
} from '@freeshop/shared-utils';
import config from '../config/index.js';
import { createServiceLogger } from '@freeshop/shared-utils';

const logger = createServiceLogger('delivery-controller');

const STEADFAST_ERROR_MARKERS = ['Steadfast', 'fetch failed', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND'];

function normalizeDeliveryError(error: unknown, context: string): Error {
  if (error instanceof AppError) {
    return error;
  }

  const err = error as { name?: string; message?: string; code?: string; meta?: { target?: string[] } };
  const message = typeof err?.message === 'string' && err.message ? err.message : 'Unknown error';

  if (err?.name === 'PrismaClientValidationError') {
    return new BadRequestError(`${context}: invalid delivery data`, { reason: message });
  }

  if (err?.name === 'PrismaClientKnownRequestError') {
    switch (err.code) {
      case 'P2002':
        return new ConflictError(`${context}: delivery already exists`, {
          target: err.meta?.target,
        });
      case 'P2025':
        return new NotFoundError(`${context}: delivery or related resource not found`);
      case 'P2003':
      case 'P2014':
        return new BadRequestError(`${context}: related resource not found`, { reason: message });
      default:
        return new InternalServerError(`${context}: database error`, { reason: message, code: err.code });
    }
  }

  if (STEADFAST_ERROR_MARKERS.some((marker) => message.includes(marker))) {
    return new ServiceUnavailableError(`${context}: Steadfast or network service unavailable`, {
      reason: message,
    });
  }

  return new InternalServerError(`${context}: unexpected delivery error`, { reason: message });
}

export const deliveryController = {
  async createDelivery(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;
      const { type, deliveryManId, provider, trackingId, apiRef, weight, fragile, estimatedDeliveryDate } = req.body;

      logger.info('Create delivery request received', {
        orderId,
        type,
        provider,
        deliveryManId,
        weight,
        fragile,
        estimatedDeliveryDate,
        hasTrackingId: Boolean(trackingId),
        hasApiRef: Boolean(apiRef),
      });

      // Validate required fields based on type
      if (type === 'INHOUSE' && !deliveryManId) {
        throw new BadRequestError('deliveryManId is required for INHOUSE delivery');
      }
      if (type === 'THIRD_PARTY' && !provider) {
        throw new BadRequestError('provider is required for THIRD_PARTY delivery');
      }

      const delivery = await deliveryService.createDelivery(orderId, {
        type,
        deliveryManId,
        provider,
        trackingId,
        apiRef,
        weight,
        fragile,
        estimatedDeliveryDate: estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : undefined,
      });

      res.status(201).json(successResponse(delivery, 'Delivery created successfully'));
    } catch (error) {
      logger.error('Create delivery failed', error, {
        orderId: Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId,
        type: req.body?.type,
        provider: req.body?.provider,
      });
      next(normalizeDeliveryError(error, 'Failed to create delivery'));
    }
  },

  async getDeliveryByOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;

      const searchRaw = Array.isArray(req.query.search) ? req.query.search[0] : req.query.search;
      const search = typeof searchRaw === 'string' ? searchRaw : undefined;

      const delivery = await deliveryService.getDeliveryByOrderId(orderId, search);

      if (!delivery) {
        throw new NotFoundError('Delivery not found for this order');
      }

      res.json(successResponse(delivery, 'Delivery retrieved successfully'));
    } catch (error) {
      next(normalizeDeliveryError(error, 'Failed to get delivery by order'));
    }
  },

  async getDeliveryById(req: Request, res: Response, next: NextFunction) {
    try {
      const deliveryId = Array.isArray(req.params.deliveryId) ? req.params.deliveryId[0] : req.params.deliveryId;

      const delivery = await deliveryService.getDeliveryById(deliveryId);

      if (!delivery) {
        throw new NotFoundError('Delivery not found');
      }

      res.json(successResponse(delivery, 'Delivery retrieved successfully'));
    } catch (error) {
      next(normalizeDeliveryError(error, 'Failed to get delivery by id'));
    }
  },



  async updateDeliveryStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const deliveryId = Array.isArray(req.params.deliveryId) ? req.params.deliveryId[0] : req.params.deliveryId;
      const { status, notes } = req.body;

      const delivery = await deliveryService.updateDeliveryStatus(deliveryId, status, {
        notes,
      });

      res.json(successResponse(delivery, 'Delivery status updated successfully'));
    } catch (error) {
      next(normalizeDeliveryError(error, 'Failed to update delivery status'));
    }
  },

  async recordFailedAttempt(req: Request, res: Response, next: NextFunction) {
    try {
      const deliveryId = Array.isArray(req.params.deliveryId) ? req.params.deliveryId[0] : req.params.deliveryId;
      const { reason } = req.body;

      const delivery = await deliveryService.recordFailedAttempt(deliveryId, reason);

      res.json(successResponse(delivery, 'Failed attempt recorded successfully'));
    } catch (error) {
      next(normalizeDeliveryError(error, 'Failed to record delivery attempt'));
    }
  },

  async getDeliveriesForDeliveryMan(req: Request, res: Response, next: NextFunction) {
    try {
      const deliveryManId = Array.isArray(req.params.deliveryManId) ? req.params.deliveryManId[0] : req.params.deliveryManId;
      const pageStr = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page);
      const limitStr = String(Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit);
      const page = parseInt(pageStr) || 1;
      const limit = parseInt(limitStr) || 20;
      const statusRaw = Array.isArray(req.query.status) ? req.query.status[0] : req.query.status;
      const status = typeof statusRaw === 'string' ? statusRaw : undefined;

      const searchRaw = Array.isArray(req.query.search) ? req.query.search[0] : req.query.search;
      const search = typeof searchRaw === 'string' ? searchRaw.trim() : undefined;

      const startDateRaw = Array.isArray(req.query.startDate) ? req.query.startDate[0] : req.query.startDate;
      const endDateRaw = Array.isArray(req.query.endDate) ? req.query.endDate[0] : req.query.endDate;

      const startDate = startDateRaw ? new Date(String(startDateRaw)) : undefined;
      const endDate = endDateRaw ? new Date(String(endDateRaw)) : undefined;

      const { deliveries, total } = await deliveryService.getDeliveriesByDeliveryMan(
        deliveryManId,
        page,
        limit,
        { status, search, startDate, endDate }
      );

      res.json(
        successResponse(
          {
            deliveries,
            pagination: {
              page,
              limit,
              total,
              pages: Math.ceil(total / limit),
            },
          },
          'Deliveries retrieved successfully'
        )
      );
    } catch (error) {
      next(normalizeDeliveryError(error, 'Failed to get deliveries for delivery man'));
    }
  },

  async getDeliveriesByProvider(req: Request, res: Response, next: NextFunction) {
    try {
      const providerRaw = Array.isArray(req.params.provider) ? req.params.provider[0] : req.params.provider;
      const provider = providerRaw as string;
      const pageStr = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page);
      const limitStr = String(Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit);
      const page = parseInt(pageStr) || 1;
      const limit = parseInt(limitStr) || 20;
      const statusRaw = Array.isArray(req.query.status) ? req.query.status[0] : req.query.status;
      const status = typeof statusRaw === 'string' ? statusRaw : undefined;

      const { deliveries, total } = await deliveryService.getDeliveriesByProvider(
        provider as any,
        page,
        limit,
        { status }
      );

      res.json(
        successResponse(
          {
            deliveries,
            pagination: {
              page,
              limit,
              total,
              pages: Math.ceil(total / limit),
            },
          },
          'Deliveries retrieved successfully'
        )
      );
    } catch (error) {
      next(normalizeDeliveryError(error, 'Failed to get deliveries by provider'));
    }
  },

  async getDeliveryStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await deliveryService.getDeliveryStats();

      res.json(successResponse(stats, 'Delivery statistics retrieved successfully'));
    } catch (error) {
      next(normalizeDeliveryError(error, 'Failed to get delivery statistics'));
    }
  },

  async handleSteadfastWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const configuredToken = config.steadfast.webhookBearerToken;

      if (!configuredToken) {
        throw new ServiceUnavailableError('Steadfast webhook token is not configured');
      }

      const authorization = String(req.headers.authorization || '');
      if (authorization !== `Bearer ${configuredToken}`) {
        throw new UnauthorizedError('Invalid Steadfast webhook token');
      }

      const result = await deliveryService.handleSteadfastWebhook(req.body as Record<string, unknown>);

      if (!result.matched) {
        res.json(successResponse(result, 'Steadfast webhook received but no matching delivery was found'));
        return;
      }

      res.json(successResponse(result, 'Steadfast delivery status processed'));
    } catch (error) {
      next(normalizeDeliveryError(error, 'Failed to process Steadfast webhook'));
    }
  },
};
