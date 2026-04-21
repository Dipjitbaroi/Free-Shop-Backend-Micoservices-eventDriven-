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
};
