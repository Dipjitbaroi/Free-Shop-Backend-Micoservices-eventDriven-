import { Request, Response, NextFunction } from 'express';
import { settingsService } from '../services/settings.service.js';
import { zoneService } from '../services/zone.service.js';
import { successResponse } from '@freeshop/shared-utils';

export const settingsController = {
  async getDeliverySettings(req: Request, res: Response, next: NextFunction) {
    try {
      // Return zones from Zone table (preferred) and fallback to settings if empty
      const zonesFromDb = await zoneService.getAll();
      if (zonesFromDb && zonesFromDb.length > 0) {
        const deliveryCharges: Record<string, number> = {};
        for (const z of zonesFromDb) deliveryCharges[z.id] = z.price;
        res.json(successResponse({ deliveryCharges, zones: zonesFromDb }, 'Delivery charges retrieved'));
        return;
      }

      const deliveryCharges = (await settingsService.get('deliveryCharges')) || {};
      const zones = Object.keys(deliveryCharges);
      res.json(successResponse({ deliveryCharges, zones }, 'Delivery charges retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async updateDeliverySettings(req: Request, res: Response, next: NextFunction) {
    try {
      // Accepts an array of zones: [{ id?, name, price }, ...]
      const zones = req.body;
      if (!Array.isArray(zones)) throw new Error('Body must be an array of zones');
      for (const z of zones) {
        if (z.id && typeof z.id !== 'string') throw new Error('If provided, `id` must be a string');
        if (!z.name || typeof z.name !== 'string') throw new Error('Each zone must have a `name`');
        if (typeof z.price !== 'number') throw new Error('Each zone must have a numeric `price`');
      }

      // Upsert to Zone table (id optional)
      await zoneService.upsertMany(zones.map((z: any) => ({ id: z.id, name: z.name, price: z.price })));
      res.json(successResponse(null, 'Delivery zones updated'));
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
