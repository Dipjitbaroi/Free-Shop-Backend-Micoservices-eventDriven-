import { Request, Response, NextFunction } from 'express';
import { deliveryService } from '../services/delivery.service.js';
import { successResponse, BadRequestError, NotFoundError } from '@freeshop/shared-utils';

export const deliveryController = {
  async createDelivery(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;
      const { type, deliveryManId, provider, trackingId, apiRef, weight, fragile, estimatedDeliveryDate } = req.body;

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
      next(error);
    }
  },

  async getDeliveryByOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;

      const delivery = await deliveryService.getDeliveryByOrderId(orderId);

      if (!delivery) {
        throw new NotFoundError('Delivery not found for this order');
      }

      res.json(successResponse(delivery, 'Delivery retrieved successfully'));
    } catch (error) {
      next(error);
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
      next(error);
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
      next(error);
    }
  },

  async recordFailedAttempt(req: Request, res: Response, next: NextFunction) {
    try {
      const deliveryId = Array.isArray(req.params.deliveryId) ? req.params.deliveryId[0] : req.params.deliveryId;
      const { reason } = req.body;

      const delivery = await deliveryService.recordFailedAttempt(deliveryId, reason);

      res.json(successResponse(delivery, 'Failed attempt recorded successfully'));
    } catch (error) {
      next(error);
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

      const { deliveries, total } = await deliveryService.getDeliveriesByDeliveryMan(
        deliveryManId,
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
      next(error);
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
      next(error);
    }
  },

  async getDeliveryStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await deliveryService.getDeliveryStats();

      res.json(successResponse(stats, 'Delivery statistics retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },
};
