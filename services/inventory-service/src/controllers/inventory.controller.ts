import { Request, Response, NextFunction } from 'express';
import { inventoryService } from '../services/inventory.service';
import { successResponse } from '@freeshop/shared-utils';

export const inventoryController = {
  async initializeInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, vendorId, initialStock, lowStockThreshold } = req.body;
      const inventory = await inventoryService.initializeInventory(
        productId,
        vendorId,
        initialStock,
        lowStockThreshold
      );
      res.status(201).json(successResponse(inventory, 'Inventory initialized'));
    } catch (error) {
      next(error);
    }
  },

  async getInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const inventory = await inventoryService.getInventory(req.params.productId as string);
      res.json(successResponse(inventory, 'Inventory retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async getVendorInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const vendorId = req.params.vendorId as string || req.user?.id as string;
      const { page, limit, lowStockOnly } = req.query;
      
      const inventory = await inventoryService.getVendorInventory(
        vendorId,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20,
        lowStockOnly === 'true'
      );
      
      res.json(successResponse(inventory, 'Vendor inventory retrieved'));
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
        productId as string,
        quantity,
        reason,
        performedBy
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
        productId as string,
        quantity,
        reason,
        performedBy
      );
      
      res.json(successResponse(inventory, 'Stock reduced'));
    } catch (error) {
      next(error);
    }
  },

  async reserveStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const { orderId, quantity } = req.body;
      
      const reservation = await inventoryService.reserveStock(productId as string, orderId, quantity);
      
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
      
      const inventory = await inventoryService.setLowStockThreshold(productId as string, threshold);
      
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
};

