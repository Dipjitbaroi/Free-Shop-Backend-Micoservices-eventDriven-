import { Request, Response, NextFunction } from 'express';
import { bannerService } from '../services/banner.service.js';
import { successResponse } from '@freeshop/shared-utils';

export const bannerController = {
  async createBanner(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || req.user?.userId;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const banner = await bannerService.createBanner({
        ...req.body,
        createdBy: userId,
      });

      res.status(201).json(successResponse(banner, 'Banner created successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getBanners(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, isActive, page, limit } = req.query;

      const banners = await bannerService.getBanners({
        search: search as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : true,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });

      res.json(successResponse(banners, 'Banners fetched successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getActiveBanners(req: Request, res: Response, next: NextFunction) {
    try {
      const banners = await bannerService.getActiveBanners();
      res.json(successResponse(banners, 'Active banners fetched successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getBannerById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const banner = await bannerService.getBannerById(id);
      res.json(successResponse(banner, 'Banner fetched successfully'));
    } catch (error) {
      next(error);
    }
  },

  async updateBanner(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const banner = await bannerService.updateBanner(id, req.body);
      res.json(successResponse(banner, 'Banner updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async deleteBanner(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await bannerService.deleteBanner(id);
      res.json(successResponse(null, 'Banner deleted successfully'));
    } catch (error) {
      next(error);
    }
  },

  async reorderBanners(req: Request, res: Response, next: NextFunction) {
    try {
      const { bannerIds } = req.body;

      if (!Array.isArray(bannerIds)) {
        throw new Error('bannerIds must be an array');
      }

      const banners = await bannerService.reorderBanners(bannerIds);
      res.json(successResponse(banners, 'Banners reordered successfully'));
    } catch (error) {
      next(error);
    }
  },
};
