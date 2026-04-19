import { Request, Response, NextFunction } from 'express';
import { wishlistService } from '../services/wishlist.service.js';
import { successResponse } from '@freeshop/shared-utils';

export const wishlistController = {
  async getWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { page, limit } = req.query;
      const wishlist = await wishlistService.getWishlist(
        userId,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20
      );
      res.json(successResponse(wishlist, 'Wishlist retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async addToWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { productId } = req.body;
      const item = await wishlistService.addToWishlist(userId, productId);
      res.status(201).json(successResponse(item, 'Product added to wishlist'));
    } catch (error) {
      next(error);
    }
  },

  async removeFromWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { productId } = req.params;
      await wishlistService.removeFromWishlist(userId, productId as string);
      res.json(successResponse(null, 'Product removed from wishlist'));
    } catch (error) {
      next(error);
    }
  },

  async checkInWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { productId } = req.params;
      const inWishlist = await wishlistService.isInWishlist(userId, productId as string);
      res.json(successResponse({ inWishlist }, 'Wishlist status retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async clearWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      await wishlistService.clearWishlist(userId);
      res.json(successResponse(null, 'Wishlist cleared'));
    } catch (error) {
      next(error);
    }
  },

  // Recently viewed
  async addRecentlyViewed(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { productId } = req.body;
      await wishlistService.addRecentlyViewed(userId, productId);
      res.json(successResponse(null, 'Added to recently viewed'));
    } catch (error) {
      next(error);
    }
  },

  async getRecentlyViewed(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { limit } = req.query;
      const items = await wishlistService.getRecentlyViewed(
        userId,
        limit ? parseInt(limit as string) : 20
      );
      res.json(successResponse(items, 'Recently viewed retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async clearRecentlyViewed(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      await wishlistService.clearRecentlyViewed(userId);
      res.json(successResponse(null, 'Recently viewed cleared'));
    } catch (error) {
      next(error);
    }
  },
};
