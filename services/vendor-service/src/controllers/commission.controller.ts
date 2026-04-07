import { Request, Response, NextFunction } from 'express';
import { commissionService } from '../services/commission.service';
import { vendorService } from '../services/vendor.service';
import { successResponse, NotFoundError, ForbiddenError, UnauthorizedError } from '@freeshop/shared-utils';

export const commissionController = {
  async getMyCommissions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const vendor = await vendorService.getVendorByUserId(userId!);
      if (!vendor) throw new NotFoundError('vendor account not found');

      const result = await commissionService.getVendorCommissions(vendor.id, {
        status: req.query.status as any,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      res.json(successResponse(result, 'Commissions retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async getAvailableBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const vendor = await vendorService.getVendorByUserId(userId!);
      if (!vendor) throw new NotFoundError('vendor account not found');

      const balance = await commissionService.getAvailableBalance(vendor.id);

      res.json(successResponse({ balance }, 'Balance retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async requestWithdrawal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const vendor = await vendorService.getVendorByUserId(userId!);
      if (!vendor) throw new NotFoundError('vendor account not found');

      const withdrawal = await commissionService.requestWithdrawal({
        vendorId: vendor.id,
        amount: req.body.amount,
        method: req.body.method,
        accountDetails: req.body.accountDetails,
      });

      res.status(201).json(successResponse(withdrawal, 'Withdrawal requested'));
    } catch (error) {
      next(error);
    }
  },

  async getMyWithdrawals(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const vendor = await vendorService.getVendorByUserId(userId!);
      if (!vendor) throw new NotFoundError('vendor account not found');

      const result = await commissionService.listWithdrawals({
        vendorId: vendor.id,
        status: req.query.status as any,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      res.json(successResponse(result, 'Withdrawals retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async listAllWithdrawals(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await commissionService.listWithdrawals({
        vendorId: req.query.VendorId as string,
        status: req.query.status as any,
        method: req.query.method as any,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      res.json(successResponse(result, 'Withdrawals retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async getWithdrawal(req: Request, res: Response, next: NextFunction) {
    try {
      const withdrawal = await commissionService.getWithdrawalById(req.params.id);
      if (!withdrawal) throw new NotFoundError('Withdrawal not found');

      const userId = req.user?.id;
      const userRole = req.user?.role;
      if (!userId) throw new UnauthorizedError('User not authenticated');

      const isPrivileged = userRole === 'ADMIN' || userRole === 'MANAGER';
      if (!isPrivileged) {
        const vendor = await vendorService.getVendorByUserId(userId);
        if (!vendor || vendor.id !== withdrawal.vendorId) {
          throw new ForbiddenError('You do not have permission to access this withdrawal');
        }
      }

      res.json(successResponse(withdrawal, 'Withdrawal retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async processWithdrawal(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user?.id;

      const withdrawal = await commissionService.processWithdrawal(
        req.params.id,
        req.body.approved,
        adminId!,
        req.body.transactionId,
        req.body.reason
      );

      res.json(successResponse(withdrawal, 'Withdrawal processed'));
    } catch (error) {
      next(error);
    }
  },

  async completeWithdrawal(req: Request, res: Response, next: NextFunction) {
    try {
      const withdrawal = await commissionService.completeWithdrawal(
        req.params.id,
        req.body.transactionId
      );

      res.json(successResponse(withdrawal, 'Withdrawal completed'));
    } catch (error) {
      next(error);
    }
  },
};

