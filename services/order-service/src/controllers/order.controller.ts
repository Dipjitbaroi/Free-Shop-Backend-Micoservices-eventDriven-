import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';
import { cartService } from '../services/cart.service';
import { successResponse } from '@freeshop/shared-utils';
import { UserRole } from '@freeshop/shared-types';
import { fetchProduct, resolveEffectivePrice } from '../lib/product-client';
import { fetchAddressById } from '../lib/user-client';
import { BadRequestError } from '@freeshop/shared-utils';

export const orderController = {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const guestId = req.headers['x-guest-id'] as string;

      // Resolve product details server-side — never trust client-supplied price/sellerId
      const rawItems = req.body.items as { productId: string; quantity: number }[];
      const resolvedItems = await Promise.all(
        rawItems.map(async (item) => {
          const product = await fetchProduct(item.productId);
          if (product.status !== 'ACTIVE') {
            throw new BadRequestError(`Product "${product.name}" is not available for purchase`);
          }
          if (product.stock < item.quantity) {
            throw new BadRequestError(`Insufficient stock for "${product.name}". Available: ${product.stock}`);
          }
          return {
            productId: product.id,
            sellerId: product.sellerId,
            productName: product.name,
            productSlug: product.slug,
            productImage: product.images[0] ?? undefined,
            unit: product.unit,
            quantity: item.quantity,
            price: resolveEffectivePrice(product),
          };
        })
      );

      // Resolve shipping address: prefer saved address ID, fall back to inline object
      const { shippingAddressId, shippingAddress: inlineShippingAddress } = req.body;
      let shippingAddress: Record<string, unknown>;

      if (shippingAddressId) {
        const authHeader = req.headers.authorization as string;
        shippingAddress = (await fetchAddressById(shippingAddressId, authHeader)) as unknown as Record<string, unknown>;
      } else {
        shippingAddress = inlineShippingAddress as Record<string, unknown>;
      }

      const order = await orderService.createOrder({
        ...req.body,
        shippingAddress,
        items: resolvedItems,
        userId,
      });

      // Clear cart after successful order
      await cartService.clearCart(userId, guestId);
      
      res.status(201).json(successResponse(order, 'Order created successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, paymentStatus, startDate, endDate, page, limit } = req.query;
      
      const orders = await orderService.getOrders({
        status: status as string | undefined,
        paymentStatus: paymentStatus as string | undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });
      
      res.json(successResponse(orders, 'Orders retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getUserOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { page, limit } = req.query;
      
      const orders = await orderService.getUserOrders(
        userId,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20
      );
      
      res.json(successResponse(orders, 'Orders retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      res.json(successResponse(order, 'Order retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getOrderByNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getOrderByNumber(req.params.orderNumber);
      res.json(successResponse(order, 'Order retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, note } = req.body;
      const order = await orderService.updateOrderStatus(req.params.id, status, note);
      res.json(successResponse(order, 'Order status updated'));
    } catch (error) {
      next(error);
    }
  },

  async updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentStatus, transactionId } = req.body;
      const order = await orderService.updatePaymentStatus(req.params.id, paymentStatus, transactionId);
      res.json(successResponse(order, 'Payment status updated'));
    } catch (error) {
      next(error);
    }
  },

  async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { reason } = req.body;
      const order = await orderService.cancelOrder(req.params.id, userId, reason);
      res.json(successResponse(order, 'Order cancelled'));
    } catch (error) {
      next(error);
    }
  },

  async addTrackingInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { trackingNumber, carrier } = req.body;
      const order = await orderService.addTrackingInfo(req.params.id, trackingNumber, carrier);
      res.json(successResponse(order, 'Tracking info added'));
    } catch (error) {
      next(error);
    }
  },

  async validateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { code, subtotal } = req.body;
      const result = await orderService.validateCoupon(code, subtotal, userId);
      res.json(successResponse(result, 'Coupon validated'));
    } catch (error) {
      next(error);
    }
  },

  async getSellerOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const sellerId = req.params.sellerId || req.user?.id as string;
      const { page, limit } = req.query;
      
      const orders = await orderService.getSellerOrders(
        sellerId,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20
      );
      
      res.json(successResponse(orders, 'Seller orders retrieved'));
    } catch (error) {
      next(error);
    }
  },
};
