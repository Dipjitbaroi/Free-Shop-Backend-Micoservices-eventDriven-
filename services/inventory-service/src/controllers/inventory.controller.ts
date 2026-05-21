import { Request, Response, NextFunction } from 'express';
import { inventoryService } from '../services/inventory.service.js';
import { cleanupService } from '../services/cleanup.service.js';
import { successResponse, ForbiddenError, BadRequestError } from '@freeshop/shared-utils';

export const inventoryController = {
  async initializeInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, userId, initialStock, lowStockThreshold, variantId, freeItemId } = req.body;
      if (!productId && !freeItemId) {
        throw new BadRequestError('Either productId or freeItemId is required to initialize inventory');
      }
      const inventory = await inventoryService.initializeInventory(
        userId,
        initialStock,
        lowStockThreshold,
        productId,
        variantId,
        freeItemId
      );
      res.status(201).json(successResponse(inventory, 'Inventory initialized'));
    } catch (error) {
      next(error);
    }
  },

  async getInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, variantId, freeItemId } = req.params;
      const inventory = await inventoryService.getInventory(productId as string, variantId as string | undefined, freeItemId as string | undefined);
      res.json(successResponse(inventory, 'Inventory retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async getUserInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const authenticatedUserId = req.user?.id as string;
      
      // Allow if user is viewing their own inventory
      // For viewing other users' inventory, a separate permission check would be needed
      if (userId !== authenticatedUserId) {
        throw new ForbiddenError('You can only view your own inventory');
      }
      
      const { page, limit, lowStockOnly } = req.query;
      
      const inventory = await inventoryService.getUserInventory(
        userId,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20,
        lowStockOnly === 'true'
      );
      
      res.json(successResponse(inventory, 'User inventory retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async addStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const { quantity, reason } = req.body;
      const performedBy = req.user?.id;
      
      const inventory = await inventoryService.addStock(
        quantity,
        reason,
        performedBy,
        productId as string
      );
      
      res.json(successResponse(inventory, 'Stock added'));
    } catch (error) {
      next(error);
    }
  },

  async reduceStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const { quantity, reason } = req.body;
      const performedBy = req.user?.id;
      
      const inventory = await inventoryService.reduceStock(
        quantity,
        reason,
        performedBy,
        productId as string
      );
      
      res.json(successResponse(inventory, 'Stock reduced'));
    } catch (error) {
      next(error);
    }
  },

  async reserveStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const { orderId, quantity, variantId, freeItemId } = req.body;
      
      const reservation = await inventoryService.reserveStock(orderId, quantity, productId as string, variantId, freeItemId);
      
      res.json(successResponse(reservation, 'Stock reserved'));
    } catch (error) {
      next(error);
    }
  },

  async releaseReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      await inventoryService.releaseReservation(orderId as string);
      res.json(successResponse(null, 'Reservation released'));
    } catch (error) {
      next(error);
    }
  },

  async processReturn(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const { orderId, quantity } = req.body;
      const performedBy = req.user?.id;
      
      const inventory = await inventoryService.processReturn(
        productId as string,
        orderId,
        quantity,
        performedBy
      );
      
      res.json(successResponse(inventory, 'Return processed'));
    } catch (error) {
      next(error);
    }
  },

  async getMovements(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const { page, limit } = req.query;
      
      const movements = await inventoryService.getMovements(
        productId as string,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 50
      );
      
      res.json(successResponse(movements, 'Stock movements retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async setLowStockThreshold(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const { threshold } = req.body;
      
      const inventory = await inventoryService.setLowStockThreshold(threshold, productId as string);
      
      res.json(successResponse(inventory, 'Threshold updated'));
    } catch (error) {
      next(error);
    }
  },

  async checkAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { items } = req.body;
      const result = await inventoryService.checkAvailability(items);
      res.json(successResponse(result, 'Availability checked'));
    } catch (error) {
      next(error);
    }
  },

  async cleanupExpiredReservations(req: Request, res: Response, next: NextFunction) {
    try {
      const releasedCount = await cleanupService.releaseExpiredReservations();
      res.json(successResponse({ releasedCount }, 'Expired reservations cleaned up'));
    } catch (error) {
      next(error);
    }
  },

  async checkSingleProductAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, variantId, freeItemId } = req.params;
      const inventory = await inventoryService.getInventory(productId as string, variantId as string | undefined, freeItemId as string | undefined);
      
      res.json(successResponse({
        productId: inventory.productId,
        availableStock: inventory.availableStock,
        totalStock: inventory.totalStock,
        isOutOfStock: inventory.isOutOfStock,
      }, 'Availability checked'));
    } catch (error) {
      next(error);
    }
  },

  // ============ FREE ITEMS INVENTORY MANAGEMENT ============

  async initializeFreeItemInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { freeItemId, userId, initialStock } = req.body;
      const inventory = await inventoryService.initializeInventory(
        userId,
        initialStock,
        undefined, // Free items don't use low stock threshold
        undefined, // No productId for free items
        undefined, // No variantId
        freeItemId
      );
      res.status(201).json(successResponse(inventory, 'Free item inventory initialized'));
    } catch (error) {
      next(error);
    }
  },

  async getFreeItemInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { freeItemId } = req.params;
      const inventory = await inventoryService.getInventory(undefined, undefined, freeItemId as string);
      res.json(successResponse(inventory, 'Free item inventory retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async addFreeItemStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { freeItemId } = req.params;
      const { quantity, reason } = req.body;
      const performedBy = req.user?.id;
      
      const inventory = await inventoryService.addStock(
        quantity,
        reason || 'Free item stock added',
        performedBy,
        undefined,
        undefined,
        freeItemId as string
      );
      
      res.json(successResponse(inventory, 'Free item stock added'));
    } catch (error) {
      next(error);
    }
  },

  async reduceFreeItemStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { freeItemId } = req.params;
      const { quantity, reason } = req.body;
      const performedBy = req.user?.id;
      
      const inventory = await inventoryService.reduceStock(
        quantity,
        reason || 'Free item stock reduced',
        performedBy,
        undefined,
        undefined,
        freeItemId as string
      );
      
      res.json(successResponse(inventory, 'Free item stock reduced'));
    } catch (error) {
      next(error);
    }
  },

  async getFreeItemMovements(req: Request, res: Response, next: NextFunction) {
    try {
      const { freeItemId } = req.params;
      const { page, limit } = req.query;
      
      // Get free item movements by freeItemId
      const movements = await inventoryService.getMovements(
        undefined, // productId
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20,
        undefined, // variantId
        freeItemId as string
      );
      
      res.json(successResponse(movements, 'Free item movements retrieved'));
    } catch (error) {
      next(error);
    }
  },
};

