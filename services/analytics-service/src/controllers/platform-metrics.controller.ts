import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service.js';
import { ApiResponse } from '@freeshop/shared-types';
import axios from 'axios';
import { parseDateRange } from '@freeshop/shared-utils';


const getUserRbac = async (userId: string, token: string) => {
  try {
    const resp = await axios.get(
      `${process.env.AUTH_SERVICE_URL || 'http://auth-service:3001'}/rbac/users/${userId}/roles`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { roleNames: resp.data?.data?.roleNames || [], permissionCodes: resp.data?.data?.permissionCodes || [] };
  } catch (err) {
    return { roleNames: [], permissionCodes: [] };
  }
};

export const platformMetricsController = {
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const userId = req.user?.id || req.user?.userId;
      const token = (req.headers.authorization || '').replace('Bearer ', '');

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const rbac = await getUserRbac(userId, token);
      const userRole = rbac.roleNames[0] || 'CUSTOMER';

      // For VENDOR/DELIVERY_MAN - apply filtering
      let metrics;
      if (userRole === 'VENDOR') {
        metrics = await analyticsService.getPlatformMetricsForVendor(userId, dateRange);
      } else if (userRole === 'DELIVERY_MAN') {
        metrics = await analyticsService.getPlatformMetricsForDeliveryPerson(userId, dateRange);
      } else {
        metrics = await analyticsService.getDashboardMetrics(dateRange);
      }

      res.json({
        success: true,
        data: metrics,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getOrdersTrend(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const metrics = await analyticsService.getOrderTrends(dateRange);

      res.json({
        success: true,
        data: metrics,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getPaymentMethodDistribution(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const metrics = await analyticsService.getPaymentMethodDistribution(dateRange);

      res.json({
        success: true,
        data: metrics,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getRegionalBreakdown(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const metrics = await analyticsService.getRegionalBreakdown(dateRange);

      res.json({
        success: true,
        data: metrics,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getTopProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
      const metrics = await analyticsService.getTopProducts(dateRange, limit);

      res.json({
        success: true,
        data: metrics,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },
};
