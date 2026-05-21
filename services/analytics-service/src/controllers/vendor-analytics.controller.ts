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

export const vendorAnalyticsController = {
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

      let data;
      if (userRole === 'VENDOR') {
        data = await analyticsService.getVendorDashboard(userId, dateRange);
      } else {
        data = await analyticsService.getAllVendorsDashboard(dateRange);
      }

      res.json({ success: true, data } as any);
    } catch (error) {
      next(error);
    }
  },

  async getVendorDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { vendorId } = req.params as any;
      const dateRange = parseDateRange(req);
      const userId = req.user?.id || req.user?.userId;
      const token = (req.headers.authorization || '').replace('Bearer ', '');
      
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const rbac = await getUserRbac(userId, token);
      const userRole = rbac.roleNames[0] || 'CUSTOMER';

      if (userRole === 'VENDOR') {
        const userVendor = await analyticsService.getUserVendor(userId);
        if (!userVendor || userVendor.id !== vendorId) {
          return res.status(403).json({
            success: false,
            error: 'Cannot view other vendor data',
          });
        }
        const data = await analyticsService.getVendorDashboardFiltered(vendorId, dateRange, 'VENDOR');
        res.json({ success: true, data });
      } else {
        const data = await analyticsService.getVendorDashboardFiltered(vendorId, dateRange, userRole);
        res.json({ success: true, data });
      }
    } catch (error) {
      next(error);
    }
  },

  async getVendorProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { vendorId } = req.params as any;
      const dateRange = parseDateRange(req);
      const userId = req.user?.id || req.user?.userId;
      const token = (req.headers.authorization || '').replace('Bearer ', '');
      
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const rbac = await getUserRbac(userId, token);
      const userRole = rbac.roleNames[0] || 'CUSTOMER';

      if (userRole === 'VENDOR') {
        const userVendor = await analyticsService.getUserVendor(userId);
        if (!userVendor || userVendor.id !== vendorId) {
          return res.status(403).json({
            success: false,
            error: 'Cannot view other vendor data',
          });
        }
      }

      const data = await analyticsService.getVendorProductsAnalytics(vendorId, dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getRevenueTrend(req: Request, res: Response, next: NextFunction) {
    try {
      const { vendorId } = req.params as any;
      const dateRange = parseDateRange(req);
      const userId = req.user?.id || req.user?.userId;
      const token = (req.headers.authorization || '').replace('Bearer ', '');
      
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const rbac = await getUserRbac(userId, token);
      const userRole = rbac.roleNames[0] || 'CUSTOMER';

      if (userRole === 'VENDOR') {
        const userVendor = await analyticsService.getUserVendor(userId);
        if (!userVendor || userVendor.id !== vendorId) {
          return res.status(403).json({
            success: false,
            error: 'Cannot view other vendor data',
          });
        }
      }

      const data = await analyticsService.getVendorRevenueTrend(vendorId, dateRange, userRole);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getVendorRatings(req: Request, res: Response, next: NextFunction) {
    try {
      const { vendorId } = req.params as any;
      const dateRange = parseDateRange(req);
      const userId = req.user?.id || req.user?.userId;
      const token = (req.headers.authorization || '').replace('Bearer ', '');
      
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const rbac = await getUserRbac(userId, token);
      const userRole = rbac.roleNames[0] || 'CUSTOMER';

      if (userRole === 'VENDOR') {
        const userVendor = await analyticsService.getUserVendor(userId);
        if (!userVendor || userVendor.id !== vendorId) {
          return res.status(403).json({
            success: false,
            error: 'Cannot view other vendor data',
          });
        }
      }

      const data = await analyticsService.getVendorRatings(vendorId, dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
