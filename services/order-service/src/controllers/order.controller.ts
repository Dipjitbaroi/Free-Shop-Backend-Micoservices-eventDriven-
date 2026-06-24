import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service.js';
import { cartService } from '../services/cart.service.js';
import { successResponse, parseDateRange } from '@freeshop/shared-utils';
import { fetchProduct, resolveEffectivePrice } from '../lib/product-client.js';
import { fetchAddressById } from '../lib/user-client.js';
import { zoneService } from '../services/zone.service.js';
import { BadRequestError } from '@freeshop/shared-utils';
import { checkInventoryAvailabilityInternal } from '../lib/inventory-client.js';

export const orderController = {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const guestId = req.headers['x-guest-id'] as string;

      // Resolve product details server-side — never trust client-supplied price/vendorId
      const rawItems = req.body.items as { productId: string; quantity: number; freeItemId?: string; freeItemIds?: string[] }[];
      
      // Step 1: Resolve all product details and free items
      const productMap = new Map<string, any>();
      const freeItemMap = new Map<string, { productName: string; freeItemName: string }>();
      
      const resolvedItems = await Promise.all(
        rawItems.map(async (item) => {
          const product = await fetchProduct(item.productId);
          if (product.status !== 'ACTIVE') {
            throw new BadRequestError(`Product "${product.name}" is not available for purchase`);
          }
          
          productMap.set(product.id, product);
          
          // Validate freeItemIds if provided; limit to 1 for now
          const incomingFreeIds: string[] | undefined = Array.isArray(item.freeItemIds)
            ? item.freeItemIds
            : item.freeItemId
            ? [item.freeItemId]
            : undefined;
          if (incomingFreeIds && incomingFreeIds.length > 1) {
            throw new BadRequestError('Only one freeItem is allowed for now');
          }
          let selectedFreeItems: Array<{ id: string; name: string; sku?: string; image?: string }> = [];
          if (incomingFreeIds && incomingFreeIds.length === 1) {
            const fid = incomingFreeIds[0];
            const found = Array.isArray((product as any).freeItems) && (product as any).freeItems.find((fi: any) => fi.id === fid);
            if (!found) {
              throw new BadRequestError(`Invalid freeItemId for product "${product.name}"`);
            }
            selectedFreeItems = [{ id: found.id, name: found.name, sku: found.sku, image: found.image }];
            freeItemMap.set(fid, { productName: product.name, freeItemName: found.name });
          }
          
          return {
            productId: product.id,
            vendorId: product.vendorId,
            productName: product.name,
            productSlug: product.slug,
            productImage: product.images[0] ?? undefined,
            unit: product.unit,
            quantity: item.quantity,
            freeItems: selectedFreeItems,
            price: resolveEffectivePrice(product),
            supplierPrice: product.supplierPrice || 0,
          };
        })
      );

      // Step 2: Check inventory availability for ALL items including free items in one batch
      const inventoryCheckItems = rawItems.map((item) => {
        const incomingFreeIds: string[] | undefined = Array.isArray(item.freeItemIds)
          ? item.freeItemIds
          : item.freeItemId
          ? [item.freeItemId]
          : undefined;
        return {
          productId: item.productId,
          quantity: item.quantity,
          freeItemId: incomingFreeIds && incomingFreeIds.length === 1 ? incomingFreeIds[0] : undefined,
        };
      });

      try {
        const availabilityResult = await checkInventoryAvailabilityInternal(inventoryCheckItems);
        if (!availabilityResult.available) {
          // Build detailed error message with product and free item names
          const errorDetails = availabilityResult.unavailableItems.map((item) => {
            if (item.freeItemId) {
              const freeItemInfo = freeItemMap.get(item.freeItemId);
              return `Free item "${freeItemInfo?.freeItemName || item.freeItemId}" for "${freeItemInfo?.productName || 'Unknown'}" (requested: ${item.requested}, available: ${item.available})`;
            } else if (item.productId) {
              const product = productMap.get(item.productId);
              return `Product "${product?.name || item.productId}" (requested: ${item.requested}, available: ${item.available})`;
            } else {
              return `Item (requested: ${item.requested}, available: ${item.available})`;
            }
          }).join('; ');
          throw new BadRequestError(`Insufficient inventory for: ${errorDetails}`);
        }
      } catch (error: unknown) {
        if (error instanceof BadRequestError) {
          throw error;
        }
        // Fallback: if inventory service is unreachable, reject the request
        throw new BadRequestError('Could not verify inventory availability');
      }

      // Resolve shipping address: prefer saved address ID, fall back to inline object
      const { shippingAddressId, shippingAddress: inlineShippingAddress } = req.body;
      let shippingAddress: Record<string, unknown>;

      if (shippingAddressId) {
        // Saved address IDs require an authenticated user to prevent guest misuse
        if (!req.user || !req.headers.authorization) {
          throw new BadRequestError('Authentication required to use a saved shippingAddressId');
        }
        const authHeader = req.headers.authorization as string;
        shippingAddress = (await fetchAddressById(shippingAddressId, authHeader)) as unknown as Record<string, unknown>;
      } else {
        shippingAddress = inlineShippingAddress as Record<string, unknown>;
      }

      // Require shipping zone to be present on resolved address (`zoneId`)
      if (!shippingAddress || typeof shippingAddress !== 'object' || !('zoneId' in shippingAddress) || !String((shippingAddress as any).zoneId).trim()) {
        throw new BadRequestError('shippingAddress.zoneId is required');
      }

      // Validate zone exists as a Zone record
      const zoneId = String((shippingAddress as any).zoneId);
      try {
        const z = await zoneService.get(zoneId);
        if (!z) throw new BadRequestError(`Unknown shipping zone: ${zoneId}`);
      } catch (err) {
        if (err instanceof BadRequestError) throw err;
        throw new BadRequestError('Could not validate shipping zone');
      }

      const order = await orderService.createOrder({
        ...req.body,
        shippingAddress,
        items: resolvedItems,
        userId,
        couponCode: req.body.couponCode ?? req.body.discountCode,
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
      const { status, paymentStatus, page, limit } = req.query;
      const { startDate, endDate } = parseDateRange(req);
      
      const orders = await orderService.getOrders({
        status: status as string | undefined,
        paymentStatus: paymentStatus as string | undefined,
        startDate: startDate,
        endDate: endDate,
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
      const order = await orderService.getOrderById(req.params.id as string);
      res.json(successResponse(order, 'Order retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getOrderByNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getOrderByNumber(req.params.orderNumber as string);
      res.json(successResponse(order, 'Order retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, note } = req.body;
      const order = await orderService.updateOrderStatus(req.params.id as string, status, note);
      res.json(successResponse(order, 'Order status updated'));
    } catch (error) {
      next(error);
    }
  },

  async updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentStatus, transactionId } = req.body;
      const order = await orderService.updatePaymentStatus(req.params.id as string, paymentStatus, transactionId);
      res.json(successResponse(order, 'Payment status updated'));
    } catch (error) {
      next(error);
    }
  },

  async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { reason } = req.body;
      const order = await orderService.cancelOrder(req.params.id as string, userId, reason);
      res.json(successResponse(order, 'Order cancelled'));
    } catch (error) {
      next(error);
    }
  },

  async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      await orderService.deleteOrder(req.params.id as string, userId);
      res.json(successResponse(null, 'Order deleted successfully'));
    } catch (error) {
      next(error);
    }
  },

  async addTrackingInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { trackingNumber, carrier } = req.body;
      const order = await orderService.addTrackingInfo(req.params.id as string, trackingNumber, carrier);
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

  async createCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const coupon = await orderService.createCoupon(req.body);
      res.status(201).json(successResponse(coupon, 'Coupon created successfully'));
    } catch (error) {
      next(error);
    }
  },

  async updateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const coupon = await orderService.updateCoupon(id, req.body);
      res.json(successResponse(coupon, 'Coupon updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async deleteCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      await orderService.deleteCoupon(id);
      res.json(successResponse(null, 'Coupon deleted successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const coupon = await orderService.getCoupon(id);
      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }
      res.json(successResponse(coupon, 'Coupon retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async listCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const { isActive, type, search, page, limit } = req.query;
      const filter = {
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        type: type as string,
        search: search as string,
      };
      const result = await orderService.listCoupons(
        filter,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20
      );
      res.json(successResponse(result, 'Coupons retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async getCouponUsageStats(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const stats = await orderService.getCouponUsageStats(id);
      res.json(successResponse(stats, 'Coupon usage stats retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async getVendorOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const vendorId = (req.params.vendorId as string) || (req.user?.id as string);
      const { page, limit } = req.query;

      const orders = await orderService.getVendorOrders(
        vendorId,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20
      );
      
      res.json(successResponse(orders, 'Vendor orders retrieved'));
    } catch (error) {
      next(error);
    }
  },

  // ── Return Management Endpoints ──

  async initiateReturn(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id as string;
      const { reason, description, items, customerNote } = req.body;

      const orderReturn = await orderService.initiateReturn(orderId, {
        reason,
        description,
        items,
        customerNote,
      });

      res.status(201).json(successResponse(orderReturn, 'Return request initiated'));
    } catch (error) {
      next(error);
    }
  },

  async approveReturn(req: Request, res: Response, next: NextFunction) {
    try {
      const returnId = req.params.returnId as string;
      const { adminNote } = req.body;
      const approvedBy = req.user?.id as string;

      const updated = await orderService.approveReturn(returnId, approvedBy, adminNote);
      res.json(successResponse(updated, 'Return request approved'));
    } catch (error) {
      next(error);
    }
  },

  async rejectReturn(req: Request, res: Response, next: NextFunction) {
    try {
      const returnId = req.params.returnId as string;
      const { reason } = req.body;
      const rejectedBy = req.user?.id as string;

      const updated = await orderService.rejectReturn(returnId, rejectedBy, reason);
      res.json(successResponse(updated, 'Return request rejected'));
    } catch (error) {
      next(error);
    }
  },

  async updateReturnStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const returnId = req.params.returnId as string;
      const { status, note } = req.body;

      const updated = await orderService.updateReturnStatus(returnId, status, note);
      res.json(successResponse(updated, 'Return status updated'));
    } catch (error) {
      next(error);
    }
  },

  async processReturnRefund(req: Request, res: Response, next: NextFunction) {
    try {
      const returnId = req.params.returnId as string;
      const { refundAmount } = req.body;

      const updated = await orderService.processReturnRefund(returnId, refundAmount);
      res.json(successResponse(updated, 'Return refund processed'));
    } catch (error) {
      next(error);
    }
  },

  async getReturn(req: Request, res: Response, next: NextFunction) {
    try {
      const returnId = req.params.returnId as string;
      const orderReturn = await orderService.getReturn(returnId);
      res.json(successResponse(orderReturn, 'Return retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async getOrderReturns(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id as string;
      const { page, limit } = req.query;

      const returns = await orderService.getOrderReturns(
        orderId,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20
      );

      res.json(successResponse(returns, 'Order returns retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id as string;
      const { customerNote, adminNote, shippingAddress } = req.body;

      const updated = await orderService.updateOrder(orderId, {
        customerNote,
        adminNote,
        shippingAddress,
      });

      res.json(successResponse(updated, 'Order updated successfully'));
    } catch (error) {
      next(error);
    }
  },
};

