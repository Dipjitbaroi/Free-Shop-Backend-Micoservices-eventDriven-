import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service.js';
import { ApiResponse } from '@freeshop/shared-types';
import axios from 'axios';

const parseDateRange = (req: Request) => {
  const endDate = req.query.endDate 
    ? new Date(req.query.endDate as string) 
    : new Date();
  const startDate = req.query.startDate 
    ? new Date(req.query.startDate as string) 
    : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  return { startDate, endDate };
};

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

export const deliveryAnalyticsController = {
  async getDailyMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const userId = req.user?.id || req.user?.userId;
      const token = (req.headers.authorization || '').replace('Bearer ', '');

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const rbac = await getUserRbac(userId, token);
      const userRole = rbac.roleNames[0] || 'CUSTOMER';

      let data;
      if (userRole === 'DELIVERY_MAN') {
        data = await analyticsService.getDeliveryPersonPerformance(userId, dateRange);
      } else {
        data = await analyticsService.getDeliveryTimeMetrics(dateRange);
      }

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getPersonPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const personId = req.params.personId as string;
      const dateRange = parseDateRange(req);
      const userId = req.user?.id || req.user?.userId;
      const token = (req.headers.authorization || '').replace('Bearer ', '');

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const rbac = await getUserRbac(userId, token);
      const userRole = rbac.roleNames[0] || 'CUSTOMER';

      if (userRole === 'DELIVERY_MAN' && userId !== personId) {
        return res.status(403).json({
          success: false,
          error: 'Cannot view other delivery staff metrics',
        });
      }

      const data = await analyticsService.getDeliveryPersonPerformance(personId, dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getTimeMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const data = await analyticsService.getDeliveryTimeMetrics(dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getSuccessRate(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const data = await analyticsService.getDeliverySuccessRate(dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getByRegion(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const data = await analyticsService.getDeliveryByRegion(dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};

export const executiveDashboardController = {
  async getProfitability(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const data = await analyticsService.getProfitabilityReport(dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },


  async getCommissions(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const data = await analyticsService.getCommissionReport(dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },


  async getMargins(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const data = await analyticsService.getMarginAnalysis(dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },


  async getVendorPayouts(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const data = await analyticsService.getVendorPayoutReport(dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },


  async getFinancialHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const data = await analyticsService.getFinancialHealth(dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },


  async getRiskMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const data = await analyticsService.getRiskMetrics(dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
