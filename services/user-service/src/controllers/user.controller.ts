import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';
import { successResponse, NotFoundError } from '@freeshop/shared-utils';

export const userController = {
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      try {
        const profile = await userService.getUserById(userId);
        res.json(successResponse(profile, 'User profile retrieved successfully'));
      } catch (err: any) {
        // If profile not found in user-service DB, attempt to create/upsert
        // by using getProfile (which upserts). This helps internal callers
        // that expect a profile even when it wasn't created earlier.
        if (err instanceof NotFoundError || String(err?.message).includes('User profile not found')) {
          const profile = await userService.getProfile(userId);
          res.json(successResponse(profile, 'User profile retrieved successfully'));
        } else {
          throw err;
        }
      }
    } catch (error) {
      next(error);
    }
  },

  async getPublicProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      try {
        const profile = await userService.getPublicProfile(userId);
        res.json(successResponse(profile, 'Public profile retrieved successfully'));
      } catch (err: any) {
        if (err instanceof NotFoundError || String(err?.message).includes('User profile not found')) {
          // Attempt to create minimal profile (upsert) so we can enrich and return public fields
          await userService.getProfile(userId).catch(() => null);
          const profile = await userService.getPublicProfile(userId);
          res.json(successResponse(profile, 'Public profile retrieved successfully'));
        } else {
          throw err;
        }
      }
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const email = (req.user?.email as string) || undefined;
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
