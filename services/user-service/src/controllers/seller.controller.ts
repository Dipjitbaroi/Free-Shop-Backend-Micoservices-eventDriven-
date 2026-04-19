/**
 * Seller Controller
 * Handles HTTP endpoints for seller profile management
 */

import { Request, Response, NextFunction } from 'express';
import { sellerService } from '../services/seller.service.js';
import { successResponse, BadRequestError, NotFoundError, ForbiddenError } from '@freeshop/shared-utils';

export const sellerController = {
  async createSellerProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { shopName, shopSlug, shopDescription, phone, email, address, city, postalCode } = req.body;

      const seller = await sellerService.createSellerProfile(userId, {
        shopName,
        shopSlug,
        shopDescription,
        phone,
        email,
        address,
        city,
        postalCode,
      });

      res.status(201).json(successResponse(seller, 'Seller profile created successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getSellerProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

      const seller = await sellerService.getSellerProfileByUserId(userId);

      if (!seller) {
        throw new NotFoundError('Seller profile not found');
      }

      res.json(successResponse(seller, 'Seller profile retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getSellerByShop(req: Request, res: Response, next: NextFunction) {
    try {
      const shopSlug = Array.isArray(req.params.shopSlug) ? req.params.shopSlug[0] : req.params.shopSlug;

      const seller = await sellerService.getSellerProfileBySlug(shopSlug);

      if (!seller) {
        throw new NotFoundError('Shop not found');
      }

      res.json(successResponse(seller, 'Shop profile retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getCurrentSellerProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;

      const seller = await sellerService.getSellerProfileByUserId(userId);

      if (!seller) {
        throw new NotFoundError('Seller profile not found');
      }

      res.json(successResponse(seller, 'Seller profile retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async updateSellerProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
      const requesterId = req.user?.id as string;

      // Check if requesting user is the seller or an admin
      if (requesterId !== userId) {
        throw new ForbiddenError('You can only update your own profile');
      }

      const seller = await sellerService.updateSellerProfile(userId, req.body);

      res.json(successResponse(seller, 'Seller profile updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getAllSellers(req: Request, res: Response, next: NextFunction) {
    try {
      const pageStr = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page);
      const limitStr = String(Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit);
      const page = parseInt(pageStr) || 1;
      const limit = parseInt(limitStr) || 20;

      const filters: any = {};
      const status = Array.isArray(req.query.status) ? req.query.status[0] : req.query.status;
      const verified = Array.isArray(req.query.verified) ? req.query.verified[0] : req.query.verified;
      
      if (status) filters.status = status;
      if (verified !== undefined) filters.isVerified = verified === 'true';

      const { sellers, total } = await sellerService.getAllSellers(page, limit, filters);

      res.json(
        successResponse(
          {
            sellers,
            pagination: {
              page,
              limit,
              total,
              pages: Math.ceil(total / limit),
            },
          },
          'Sellers retrieved successfully'
        )
      );
    } catch (error) {
      next(error);
    }
  },

  async verifySeller(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
      const { verified } = req.body;

      const seller = await sellerService.verifySeller(userId, verified);

      res.json(successResponse(seller, `Seller ${verified ? 'verified' : 'unverified'} successfully`));
    } catch (error) {
      next(error);
    }
  },

  async suspendSeller(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

      const seller = await sellerService.suspendSeller(userId);

      res.json(successResponse(seller, 'Seller suspended successfully'));
    } catch (error) {
      next(error);
    }
  },

  async activateSeller(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

      const seller = await sellerService.activateSeller(userId);

      res.json(successResponse(seller, 'Seller activated successfully'));
    } catch (error) {
      next(error);
    }
  },
};
