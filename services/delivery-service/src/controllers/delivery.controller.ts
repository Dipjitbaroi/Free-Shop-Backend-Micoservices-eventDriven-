import { NextFunction, Request, Response } from 'express';
import { successResponse } from '@freeshop/shared-utils';
import {
  DeliveryDispatchStatus,
  DeliveryProvider,
  DeliveryStatus,
} from '../../generated/prisma';
import { deliveryService } from '../services/delivery.service';

const getAuthContext = (req: Request): { userId: string; role: string } => ({
  userId: String(req.user?.id || req.user?.userId || ''),
  role: String(req.user?.role || ''),
});

export const deliveryController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryService.list(
        {
          page: req.query.page ? parseInt(String(req.query.page), 10) : 1,
          limit: req.query.limit ? parseInt(String(req.query.limit), 10) : 20,
          status: req.query.status ? (String(req.query.status) as DeliveryStatus) : undefined,
          provider: req.query.provider ? (String(req.query.provider) as DeliveryProvider) : undefined,
          dispatchStatus: req.query.dispatchStatus ? (String(req.query.dispatchStatus) as DeliveryDispatchStatus) : undefined,
          deliveryAgentId: req.query.deliveryAgentId ? String(req.query.deliveryAgentId) : undefined,
          orderId: req.query.orderId ? String(req.query.orderId) : undefined,
        },
        getAuthContext(req)
      );

      res.json(successResponse(data, 'Deliveries retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async myAssignments(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = getAuthContext(req);
      const data = await deliveryService.list(
        {
          page: req.query.page ? parseInt(String(req.query.page), 10) : 1,
          limit: req.query.limit ? parseInt(String(req.query.limit), 10) : 20,
          deliveryAgentId: auth.userId,
        },
        auth
      );

      res.json(successResponse(data, 'Assigned deliveries retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const delivery = await deliveryService.getById(req.params.id, getAuthContext(req));
      res.json(successResponse(delivery, 'Delivery retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getByOrderId(req: Request, res: Response, next: NextFunction) {
    try {
      const delivery = await deliveryService.getByOrderId(req.params.orderId, getAuthContext(req));
      res.json(successResponse(delivery, 'Delivery retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async assignAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryAgentId, deliveryAgentName } = req.body;
      const updated = await deliveryService.assignAgent(req.params.id, { deliveryAgentId, deliveryAgentName });
      res.json(successResponse(updated, 'Delivery agent assigned'));
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, note } = req.body;
      const updated = await deliveryService.updateStatus(req.params.id, status, getAuthContext(req), note);
      res.json(successResponse(updated, 'Delivery status updated'));
    } catch (error) {
      next(error);
    }
  },

  async updateProvider(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider, dispatchStatus, trackingNumber, dispatchNote } = req.body;
      const updated = await deliveryService.updateProvider(req.params.id, {
        provider,
        dispatchStatus,
        trackingNumber,
        dispatchNote,
      });
      res.json(successResponse(updated, 'Delivery provider updated'));
    } catch (error) {
      next(error);
    }
  },
};
