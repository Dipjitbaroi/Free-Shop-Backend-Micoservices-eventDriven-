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

export const productAnalyticsController = {
  async getProductMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.productId as string;
      const dateRange = parseDateRange(req);
      const userId = req.user?.id || req.user?.userId;
      const token = (req.headers.authorization || '').replace('Bearer ', '');

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const rbac = await getUserRbac(userId, token);
      const userRole = rbac.roleNames[0] || 'CUSTOMER';

      if (userRole === 'VENDOR') {
        const product = await analyticsService.getProduct(productId);
        const userVendor = await analyticsService.getUserVendor(userId);
        if (product?.vendorId !== userVendor?.id) {
          return res.status(403).json({
            success: false,
            error: 'Cannot view other vendors\' products',
          });
        }
      }

      const data = await analyticsService.getProductMetrics(productId, dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getViewsAndConversions(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.productId as string;
      const dateRange = parseDateRange(req);
      const userId = req.user?.id || req.user?.userId;
      const token = (req.headers.authorization || '').replace('Bearer ', '');

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const rbac = await getUserRbac(userId, token);
      const userRole = rbac.roleNames[0] || 'CUSTOMER';

      if (userRole === 'VENDOR') {
        const product = await analyticsService.getProduct(productId);
        const userVendor = await analyticsService.getUserVendor(userId);
        if (product?.vendorId !== userVendor?.id) {
          return res.status(403).json({
            success: false,
            error: 'Cannot view other vendors\' products',
          });
        }
      }

      const data = await analyticsService.getProductViewsAndConversions(productId, dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.productId as string;
      const data = await analyticsService.getProductInventory(productId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getReturns(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.productId as string;
      const dateRange = parseDateRange(req);
      const data = await analyticsService.getProductReturns(productId, dateRange);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async listProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const offset = parseInt(req.query.offset as string) || 0;
      const userId = req.user?.id || req.user?.userId;
      const token = (req.headers.authorization || '').replace('Bearer ', '');

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const rbac = await getUserRbac(userId, token);
      const userRole = rbac.roleNames[0] || 'CUSTOMER';

      let data;
      if (userRole === 'VENDOR') {
        data = await analyticsService.listVendorProducts(userId, limit, offset);
      } else {
        data = await analyticsService.listAllProducts(limit, offset);
      }

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
