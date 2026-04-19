import { Request, Response, NextFunction } from 'express';
import { vendorService } from '../services/vendor.service.js';
import { successResponse } from '@freeshop/shared-utils';
import { UnauthorizedError, NotFoundError } from '@freeshop/shared-utils';

export const vendorController = {
  async createVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('User not authenticated');

      const vendor = await vendorService.createVendor({
        userId,
        storeName: req.body.storeName,
        description: req.body.description,
        contactEmail: req.body.contactEmail,
        contactPhone: req.body.contactPhone,
        businessAddress: req.body.businessAddress,
      });

      res.status(201).json(successResponse(vendor, 'vendor account created'));
    } catch (error) {
      next(error);
    }
  },

  async getMyVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('User not authenticated');

      const vendor = await vendorService.getVendorByUserId(userId);
      if (!vendor) throw new NotFoundError('vendor account not found');

      res.json(successResponse(vendor, 'vendor account retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async getVendorById(req: Request, res: Response, next: NextFunction) {
    try {
      const vendor = await vendorService.getVendorById(req.params.id as string);
      if (!vendor) throw new NotFoundError('vendor not found');

      res.json(successResponse(vendor, 'vendor retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async getVendorBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const vendor = await vendorService.getVendorBySlug(req.params.slug as string);
      if (!vendor) throw new NotFoundError('Store not found');

      res.json(successResponse(vendor, 'vendor retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async updateVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('User not authenticated');

      const vendor = await vendorService.getVendorByUserId(userId);
      if (!vendor) throw new NotFoundError('vendor account not found');

      const updated = await vendorService.updateVendor(vendor.id, req.body);

      res.json(successResponse(updated, 'vendor account updated'));
    } catch (error) {
      next(error);
    }
  },

  async listVendors(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await vendorService.listVendors({
        status: req.query.status as any,
        verificationStatus: req.query.verificationStatus as any,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      });

      res.json(successResponse(result, 'Vendors retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async updateVendorStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const vendor = await vendorService.updateVendorStatus(
        req.params.id as string,
        req.body.status,
        req.body.reason
      );

      res.json(successResponse(vendor, 'vendor status updated'));
    } catch (error) {
      next(error);
    }
  },

  async verifyVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const vendor = await vendorService.verifyVendor(
        req.params.id as string,
        req.body.approved,
        req.body.reason
      );

      res.json(successResponse(vendor, 'vendor verification updated'));
    } catch (error) {
      next(error);
    }
  },

  async getVendorStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('User not authenticated');

      const vendor = await vendorService.getVendorByUserId(userId);
      if (!vendor) throw new NotFoundError('vendor account not found');

      const stats = await vendorService.getVendorStats(vendor.id);

      res.json(successResponse(stats, 'vendor stats retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async addDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('User not authenticated');

      const vendor = await vendorService.getVendorByUserId(userId);
      if (!vendor) throw new NotFoundError('vendor account not found');

      const document = await vendorService.addDocument(
        vendor.id,
        req.body.type,
        req.body.documentUrl
      );

      res.status(201).json(successResponse(document, 'Document added'));
    } catch (error) {
      next(error);
    }
  },

  async verifyDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const document = await vendorService.verifyDocument(
        req.params.documentId as string,
        req.body.approved,
        req.body.reason
      );

      res.json(successResponse(document, 'Document verification updated'));
    } catch (error) {
      next(error);
    }
  },
};

