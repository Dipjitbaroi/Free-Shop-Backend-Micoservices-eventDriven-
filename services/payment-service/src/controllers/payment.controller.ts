import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/payment.service';
import { successResponse } from '@freeshop/shared-utils';
import { PaymentMethod, PaymentStatus } from '../../generated/prisma';

export const paymentController = {
  async initiatePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { orderId, amount, method, metadata } = req.body;
      
      const result = await paymentService.initiatePayment({
        orderId,
        userId,
        amount,
        method: method as PaymentMethod,
        metadata,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      
      res.status(201).json(successResponse(result, 'Payment initiated'));
    } catch (error) {
      next(error);
    }
  },

  async bkashCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentID, status } = req.query;
      
      const payment = await paymentService.handleBkashCallback(
        paymentID as string,
        status as string
      );

      // Redirect to frontend with status
      const redirectUrl = payment.status === 'COMPLETED'
        ? `${process.env.FRONTEND_URL}/payment/success?orderId=${payment.orderId}`
        : `${process.env.FRONTEND_URL}/payment/failed?orderId=${payment.orderId}`;
      
      res.redirect(redirectUrl);
    } catch (error) {
      const redirectUrl = `${process.env.FRONTEND_URL}/payment/error`;
      res.redirect(redirectUrl);
    }
  },

  async epsCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId, status } = req.query;

      const payment = await paymentService.handleEpsCallback(
        paymentId as string,
        status as string
      );

      const redirectUrl = payment.status === 'COMPLETED'
        ? `${process.env.FRONTEND_URL}/payment/success?orderId=${payment.orderId}`
        : `${process.env.FRONTEND_URL}/payment/failed?orderId=${payment.orderId}`;

      res.redirect(redirectUrl);
    } catch (error) {
      const redirectUrl = `${process.env.FRONTEND_URL}/payment/error`;
      res.redirect(redirectUrl);
    }
  },

  async getPaymentById(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.getPaymentById(req.params.id as string);
      res.json(successResponse(payment, 'Payment retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async getPaymentByOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.getPaymentByOrder(req.params.orderId as string);
      res.json(successResponse(payment, 'Payment retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async getPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, orderId, status, method, startDate, endDate, page, limit } = req.query;
      
      const payments = await paymentService.getPayments({
        userId: userId as string,
        orderId: orderId as string,
        status: status as PaymentStatus,
        method: method as PaymentMethod,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });
      
      res.json(successResponse(payments, 'Payments retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async initiateRefund(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount, reason } = req.body;
      const processedBy = req.user?.id as string;
      
      const payment = await paymentService.initiateRefund(
        req.params.id as string,
        amount,
        reason,
        processedBy
      );
      
      res.json(successResponse(payment, 'Refund initiated'));
    } catch (error) {
      next(error);
    }
  },

  async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await paymentService.verifyPayment(req.params.id as string);
      res.json(successResponse(result, 'Payment verification result'));
    } catch (error) {
      next(error);
    }
  },

  async confirmCodPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { collectedAmount } = req.body;
      const collectedBy = req.user?.id as string;
      
      const payment = await paymentService.confirmCodPayment(
        req.params.id as string,
        collectedAmount,
        collectedBy
      );
      
      res.json(successResponse(payment, 'COD payment confirmed'));
    } catch (error) {
      next(error);
    }
  },
};
