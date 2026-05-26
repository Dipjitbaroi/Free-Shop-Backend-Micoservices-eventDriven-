import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service.js';
import { ApiResponse } from '@freeshop/shared-types';
import { parseDateRange } from '@freeshop/shared-utils';


export const salesReportController = {
  async getDailySalesReport(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const data = await analyticsService.getDailySalesReport(dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getMonthlySalesReport(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const data = await analyticsService.getMonthlySalesReport(dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getSalesByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const data = await analyticsService.getSalesByCategory(dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getSalesByPaymentMethod(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const data = await analyticsService.getSalesByPaymentMethod(dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getTopVendors(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const data = await analyticsService.getTopVendorsBySales(dateRange, limit);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getSalesGrowth(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const data = await analyticsService.getSalesGrowth(dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
