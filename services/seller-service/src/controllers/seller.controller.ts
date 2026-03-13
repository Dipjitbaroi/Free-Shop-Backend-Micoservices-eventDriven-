import { Request, Response, NextFunction } from 'express';
import { sellerService } from '../services/seller.service';
import { successResponse } from '@freeshop/shared-utils';
import { UnauthorizedError, NotFoundError } from '@freeshop/shared-utils';

export const sellerController = {
  async createSeller(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('User not authenticated');

      const seller = await sellerService.createSeller({
        userId,
        storeName: req.body.storeName,
        description: req.body.description,
        contactEmail: req.body.contactEmail,
        contactPhone: req.body.contactPhone,
        businessAddress: req.body.businessAddress,
      });

      res.status(201).json(successResponse(seller, 'Seller account created'));
    } catch (error) {
      next(error);
    }
  },

  async getMySeller(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('User not authenticated');

      const seller = await sellerService.getSellerByUserId(userId);
      if (!seller) throw new NotFoundError('Seller account not found');

      res.json(successResponse(seller, 'Seller account retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async getSellerById(req: Request, res: Response, next: NextFunction) {
    try {
      const seller = await sellerService.getSellerById(req.params.id);
      if (!seller) throw new NotFoundError('Seller not found');

      res.json(successResponse(seller, 'Seller retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async getSellerBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const seller = await sellerService.getSellerBySlug(req.params.slug);
      if (!seller) throw new NotFoundError('Store not found');

      res.json(successResponse(seller, 'Seller retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async updateSeller(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('User not authenticated');

      const seller = await sellerService.getSellerByUserId(userId);
      if (!seller) throw new NotFoundError('Seller account not found');

      const updated = await sellerService.updateSeller(seller.id, req.body);

      res.json(successResponse(updated, 'Seller account updated'));
    } catch (error) {
      next(error);
    }
  },

  async listSellers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await sellerService.listSellers({
        status: req.query.status as any,
        verificationStatus: req.query.verificationStatus as any,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      });

      res.json(successResponse(result, 'Sellers retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async updateSellerStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const seller = await sellerService.updateSellerStatus(
        req.params.id,
        req.body.status,
        req.body.reason
      );

      res.json(successResponse(seller, 'Seller status updated'));
    } catch (error) {
      next(error);
    }
  },

  async verifySeller(req: Request, res: Response, next: NextFunction) {
    try {
      const seller = await sellerService.verifySeller(
        req.params.id,
        req.body.approved,
        req.body.reason
      );

      res.json(successResponse(seller, 'Seller verification updated'));
    } catch (error) {
      next(error);
    }
  },

  async getSellerStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('User not authenticated');

      const seller = await sellerService.getSellerByUserId(userId);
      if (!seller) throw new NotFoundError('Seller account not found');

      const stats = await sellerService.getSellerStats(seller.id);

      res.json(successResponse(stats, 'Seller stats retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async addDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('User not authenticated');

      const seller = await sellerService.getSellerByUserId(userId);
      if (!seller) throw new NotFoundError('Seller account not found');

      const document = await sellerService.addDocument(
        seller.id,
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
      const document = await sellerService.verifyDocument(
        req.params.documentId,
        req.body.approved,
        req.body.reason
      );

      res.json(successResponse(document, 'Document verification updated'));
    } catch (error) {
      next(error);
    }
  },
};
