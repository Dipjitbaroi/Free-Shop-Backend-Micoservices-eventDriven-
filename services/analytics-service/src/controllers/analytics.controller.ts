import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service';
import { ApiResponse } from '@freeshop/shared-types';

const parseDateRange = (req: Request) => {
  const endDate = req.query.endDate 
    ? new Date(req.query.endDate as string) 
    : new Date();
  const startDate = req.query.startDate 
    ? new Date(req.query.startDate as string) 
    : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  return { startDate, endDate };
};

export const analyticsController = {
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const metrics = await analyticsService.getDashboardMetrics(dateRange);

      res.json({
        success: true,
        data: metrics,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getSalesReport(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const report = await analyticsService.getSalesReport(dateRange);

      res.json({
        success: true,
        data: report,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getSellerReport(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const report = await analyticsService.getSellerReport(req.params.sellerId, dateRange);

      res.json({
        success: true,
        data: report,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getProductAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const analytics = await analyticsService.getProductAnalytics(req.params.productId, dateRange);

      res.json({
        success: true,
        data: analytics,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getTopProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const topProducts = await analyticsService.getTopProducts(dateRange, limit);

      res.json({
        success: true,
        data: topProducts,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getTopSellers(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const topSellers = await analyticsService.getTopSellers(dateRange, limit);

      res.json({
        success: true,
        data: topSellers,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getUserAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const analytics = await analyticsService.getUserAnalytics(dateRange);

      res.json({
        success: true,
        data: analytics,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async trackEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await analyticsService.trackEvent({
        eventType: req.body.eventType,
        eventName: req.body.eventName,
        userId: req.user?.id,
        sessionId: req.body.sessionId,
        entityType: req.body.entityType,
        entityId: req.body.entityId,
        metadata: req.body.metadata,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        referer: req.headers['referer'],
      });

      res.status(201).json({
        success: true,
        data: { eventId: event.id },
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async trackSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const search = await analyticsService.trackSearch({
        query: req.body.query,
        resultsCount: req.body.resultsCount,
        clickedProductId: req.body.clickedProductId,
        userId: req.user?.id,
        sessionId: req.body.sessionId,
      });

      res.status(201).json({
        success: true,
        data: { searchId: search.id },
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getPopularSearches(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const searches = await analyticsService.getPopularSearches(limit);

      res.json({
        success: true,
        data: searches,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },
};
