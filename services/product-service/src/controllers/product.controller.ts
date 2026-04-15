import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';
import { ProductStatus } from '@freeshop/shared-types';
import { successResponse } from '@freeshop/shared-utils';

export const productController = {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const vendorId = req.user?.userId;
      const product = await productService.createProduct({
        ...req.body,
        vendorId,
      });
      // Filter price field for vendors (disabled - role not available, service layer enforces rules)
      res.status(201).json(successResponse(product, 'Product created successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        search,
        categoryId,
        vendorId,
        minPrice,
        maxPrice,
        isOrganic,
        status,
        sortBy,
        sortOrder,
        page,
        limit,
      } = req.query;

      const products = await productService.getProducts({
        search: search as string,
        categoryId: categoryId as string,
        vendorId: vendorId as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        isOrganic: isOrganic === 'true' ? true : isOrganic === 'false' ? false : undefined,
        status: status as ProductStatus,
        sortBy: sortBy as 'price' | 'createdAt' | 'rating' | 'sold' | undefined,
        sortOrder: sortOrder as 'asc' | 'desc',
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });

      // Filter price field for vendors (disabled - role not available, service layer enforces rules)
      res.json(successResponse(products, 'Products retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(req.params.id as string);
      // Filter price field for vendors (disabled - role not available, service layer enforces rules)
      res.json(successResponse(product, 'Product retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getProductBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductBySlug(req.params.slug as string);
      // Filter price field for vendors (disabled - role not available, service layer enforces rules)
      res.json(successResponse(product, 'Product retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      // Note: userRole cannot be determined here without extra auth service call
      // Service will check if updating price is allowed based on the update data
      const product = await productService.updateProduct(id as string, req.body, undefined, userId);
      // Filter price field for vendors (disabled - role not available, service layer enforces rules)
      res.json(successResponse(product, 'Product updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.deleteProduct(req.params.id as string);
      res.json(successResponse(null, 'Product deleted successfully'));
    } catch (error) {
      next(error);
    }
  },

  async updateProductStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, reason, price } = req.body;
      // Note: actorRole no longer available - service layer enforces business rules
      const product = await productService.updateProductStatus(id as string, status, undefined, reason, price);
      res.json(successResponse(product, 'Product status updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getVendorProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const vendorId = req.params.vendorId as string || req.user?.userId;
      const { status, page, limit } = req.query;

      const products = await productService.getVendorProducts(
        vendorId as string,
        {
          status: status as ProductStatus,
          page: page ? parseInt(page as string) : 1,
          limit: limit ? parseInt(limit as string) : 20,
        }
      );

      res.json(successResponse(products, 'Vendor products retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getFeaturedProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const products = await productService.getFeaturedProducts(limit);
      res.json(successResponse(products, 'Featured products retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getFlashSaleProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const products = await productService.getFlashSaleProducts(limit);
      res.json(successResponse(products, 'Flash sale products retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },
};
