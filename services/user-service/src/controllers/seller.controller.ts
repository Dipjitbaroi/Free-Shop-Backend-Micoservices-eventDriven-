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
      const { firstName, lastName, email, phone, employeeId, department, assignedZone, avatar, commissionRate, bankDetails, workSchedule } = req.body;

      const seller = await sellerService.createSellerProfile(userId, {
        firstName,
        lastName,
        email,
        phone,
        employeeId,
        department,
        assignedZone,
        avatar,
        commissionRate,
        bankDetails,
        workSchedule,
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

  async getSellerByEmployeeId(req: Request, res: Response, next: NextFunction) {
    try {
      const employeeId = Array.isArray(req.params.employeeId) ? req.params.employeeId[0] : req.params.employeeId;

      const seller = await sellerService.getSellerProfileByEmployeeId(employeeId);

      if (!seller) {
        throw new NotFoundError('Seller not found');
      }

      res.json(successResponse(seller, 'Seller profile retrieved successfully'));
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
      const department = Array.isArray(req.query.department) ? req.query.department[0] : req.query.department;
      const isAvailable = Array.isArray(req.query.isAvailable) ? req.query.isAvailable[0] : req.query.isAvailable;
      
      if (status) filters.status = status;
      if (department) filters.department = department;
      if (isAvailable !== undefined) filters.isAvailable = isAvailable === 'true';

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

  async setSuspended(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

      const seller = await sellerService.setSuspended(userId);

      res.json(successResponse(seller, 'Seller status changed to suspended'));
    } catch (error) {
      next(error);
    }
  },

  async setActive(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

      const seller = await sellerService.setActive(userId);

      res.json(successResponse(seller, 'Seller status changed to active'));
    } catch (error) {
      next(error);
    }
  },

  async setOnLeave(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

      const seller = await sellerService.setOnLeave(userId);

      res.json(successResponse(seller, 'Seller status changed to on leave'));
    } catch (error) {
      next(error);
    }
  },
};
