import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';
import { successResponse } from '@freeshop/shared-utils';

export const userController = {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const email = req.user?.email;
      const profile = await userService.getProfile(userId, email);
      res.json(successResponse(profile, 'Profile retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const profile = await userService.updateProfile(userId, req.body);
      res.json(successResponse(profile, 'Profile updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  // Address endpoints
  async getAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const addresses = await userService.getAddresses(userId);
      res.json(successResponse(addresses, 'Addresses retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async addAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const address = await userService.addAddress(userId, req.body);
      res.status(201).json(successResponse(address, 'Address added successfully'));
    } catch (error) {
      next(error);
    }
  },

  async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { addressId } = req.params;
      const address = await userService.updateAddress(userId, addressId as string, req.body);
      res.json(successResponse(address, 'Address updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { addressId } = req.params;
      await userService.deleteAddress(userId, addressId as string);
      res.json(successResponse(null, 'Address deleted successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getAddressById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { addressId } = req.params;
      const address = await userService.getAddressById(userId, addressId as string);
      res.json(successResponse(address, 'Address retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async setDefaultAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { addressId } = req.params;
      const address = await userService.setDefaultAddress(userId, addressId as string);
      res.json(successResponse(address, 'Default address set successfully'));
    } catch (error) {
      next(error);
    }
  },
};
