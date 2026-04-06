import { Request, Response, NextFunction } from 'express';
import { settingsService } from '../services/settings.service';
import { successResponse } from '@freeshop/shared-utils';
import { deliveryService } from '../services/delivery.service';

export const settingsController = {
  async getDeliverySettings(req: Request, res: Response, next: NextFunction) {
    try {
      const deliveryCharges = (await settingsService.get('deliveryCharges')) || {};
      const zones = Object.keys(deliveryCharges);
      const routing = await deliveryService.getPublicRoutingConfig();
      res.json(successResponse({ deliveryCharges, zones, routing }, 'Delivery settings retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async updateDeliverySettings(req: Request, res: Response, next: NextFunction) {
    try {
      // Accepts a JSON object: { in_feni: 60, in_dhaka: 50, outside_dhaka: 120, ... }
      const deliveryCharges = req.body;
      if (!deliveryCharges || typeof deliveryCharges !== 'object') {
        throw new Error('Body must be a JSON object with zone keys and numeric values');
      }
      for (const key in deliveryCharges) {
        if (typeof deliveryCharges[key] !== 'number') {
          throw new Error('All delivery charge values must be numbers');
        }
      }
      const updatedBy = req.user?.id || 'system';
      await settingsService.set('deliveryCharges', deliveryCharges, updatedBy);
      res.json(successResponse(null, 'Delivery charges updated'));
    } catch (error) {
      next(error);
    }
  },
  async getDeliveryZones(req: Request, res: Response, next: NextFunction) {
    try {
      const deliveryCharges = (await settingsService.get('deliveryCharges')) || {};
      const zones = Object.keys(deliveryCharges);
      res.json(successResponse({ zones }, 'Delivery zones retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async getDeliveryRouting(req: Request, res: Response, next: NextFunction) {
    try {
      const routing = await deliveryService.getPublicRoutingConfig();
      res.json(successResponse(routing, 'Delivery routing settings retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async updateDeliveryRouting(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as {
        inhouseZones?: string[];
        inhouseDistricts?: string[];
        inhouseAreas?: string[];
      };

      const sanitizeArray = (value: unknown): string[] => {
        if (!Array.isArray(value)) return [];
        return value
          .map((v) => String(v || '').trim().toLowerCase())
          .filter(Boolean);
      };

      const routing = {
        inhouseZones: sanitizeArray(body.inhouseZones),
        inhouseDistricts: sanitizeArray(body.inhouseDistricts),
        inhouseAreas: sanitizeArray(body.inhouseAreas),
      };

      const updatedBy = req.user?.id || 'system';
      await settingsService.set('deliveryRouting', routing, updatedBy);
      res.json(successResponse(routing, 'Delivery routing settings updated'));
    } catch (error) {
      next(error);
    }
  },
};
