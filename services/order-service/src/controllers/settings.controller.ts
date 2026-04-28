import { Request, Response, NextFunction } from 'express';
import { zoneService } from '../services/zone.service.js';
import { successResponse } from '@freeshop/shared-utils';

export const settingsController = {
  async createDeliveryZone(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, price } = req.body;
      
      if (!name || typeof name !== 'string') throw new Error('Zone name is required');
      if (typeof price !== 'number') throw new Error('Price must be a number');

      // Create a new zone
      const zone = await zoneService.create({ name, price });
      res.status(201).json(successResponse({ zone }, 'Delivery zone created successfully'));
    } catch (error) {
      next(error);
    }
  },
  async getDeliveryZones(req: Request, res: Response, next: NextFunction) {
    try {
      const zones = await zoneService.getAll();
      res.json(successResponse({ zones }, 'Delivery zones retrieved'));
    } catch (error) {
      next(error);
    }
  },
  async updateDeliveryZone(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id || '');
      const body = req.body || {};
      if (!id) throw new Error('Zone id is required');
      if (body.name !== undefined && typeof body.name !== 'string') throw new Error('`name` must be a string');
      if (body.price !== undefined && typeof body.price !== 'number') throw new Error('`price` must be a number');

      const updated = await zoneService.update(id, { name: body.name, price: body.price });
      res.json(successResponse({ zone: updated }, 'Delivery zone updated'));
    } catch (error) {
      next(error);
    }
  },
  async deleteDeliveryZone(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id || '');
      if (!id) throw new Error('Zone id is required');
      await zoneService.delete(id);
      res.json(successResponse(null, 'Delivery zone deleted'));
    } catch (error) {
      next(error);
    }
  },
};
