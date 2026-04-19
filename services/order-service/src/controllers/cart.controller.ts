import { Request, Response, NextFunction } from 'express';
import { cartService } from '../services/cart.service.js';
import { successResponse, BadRequestError } from '@freeshop/shared-utils';
import { fetchProduct, resolveEffectivePrice } from '../lib/product-client.js';

export const cartController = {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const guestId = req.headers['x-guest-id'] as string;
      
      const cart = await cartService.getCart(userId, guestId);
      const summary = await cartService.getCartSummary(userId, guestId);
      
      res.json(successResponse({ cart, summary }, 'Cart retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const guestId = req.headers['x-guest-id'] as string;
      const { productId, quantity } = req.body;

      // Fetch authoritative price from product-service — never trust client price
      const product = await fetchProduct(productId);

      if (product.status !== 'ACTIVE') {
        throw new BadRequestError(`Product is not available for purchase (status: ${product.status})`);
      }

      if (product.stock < quantity) {
        throw new BadRequestError(`Insufficient stock. Available: ${product.stock}`);
      }

      const price = resolveEffectivePrice(product);

      const cart = await cartService.addToCart(userId, guestId, { productId, quantity, price });
      const summary = await cartService.getCartSummary(userId, guestId);

      res.json(successResponse({ cart, summary }, 'Item added to cart'));
    } catch (error) {
      next(error);
    }
  },

  async updateCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const guestId = req.headers['x-guest-id'] as string;
      const { productId } = req.params;
      const { quantity } = req.body;
      
      const cart = await cartService.updateCartItem(userId, guestId, productId as string, quantity);
      const summary = await cartService.getCartSummary(userId, guestId);
      
      res.json(successResponse({ cart, summary }, 'Cart item updated'));
    } catch (error) {
      next(error);
    }
  },

  async removeFromCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const guestId = req.headers['x-guest-id'] as string;
      const { productId } = req.params;
      
      const cart = await cartService.removeFromCart(userId, guestId, productId as string);
      const summary = await cartService.getCartSummary(userId, guestId);
      
      res.json(successResponse({ cart, summary }, 'Item removed from cart'));
    } catch (error) {
      next(error);
    }
  },

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const guestId = req.headers['x-guest-id'] as string;
      
      await cartService.clearCart(userId, guestId);
      
      res.json(successResponse(null, 'Cart cleared'));
    } catch (error) {
      next(error);
    }
  },

  async mergeCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { guestId } = req.body;
      
      const cart = await cartService.mergeGuestCart(userId, guestId);
      const summary = await cartService.getCartSummary(userId, undefined);
      
      res.json(successResponse({ cart, summary }, 'Cart merged successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getCartSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const guestId = req.headers['x-guest-id'] as string;
      
      const summary = await cartService.getCartSummary(userId, guestId);
      
      res.json(successResponse(summary, 'Cart summary retrieved'));
    } catch (error) {
      next(error);
    }
  },
};
