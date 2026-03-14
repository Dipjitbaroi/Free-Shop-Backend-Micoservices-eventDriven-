import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';
import { ProductStatus } from '@freeshop/shared-types';
import { successResponse } from '@freeshop/shared-utils';

export const productController = {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const sellerId = req.user?.userId;
      const product = await productService.createProduct({
        ...req.body,
        sellerId,
      });
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
        sellerId,
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
        sellerId: sellerId as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        isOrganic: isOrganic === 'true' ? true : isOrganic === 'false' ? false : undefined,
        status: status as ProductStatus,
        sortBy: sortBy as 'price' | 'createdAt' | 'rating' | 'sold' | undefined,
        sortOrder: sortOrder as 'asc' | 'desc',
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });

      res.json(successResponse(products, 'Products retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.json(successResponse(product, 'Product retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getProductBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductBySlug(req.params.slug);
      res.json(successResponse(product, 'Product retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(id, req.body);
      res.json(successResponse(product, 'Product updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.deleteProduct(req.params.id);
      res.json(successResponse(null, 'Product deleted successfully'));
    } catch (error) {
      next(error);
    }
  },

  async updateProductStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      const actorRole = req.user?.role as string;
      const product = await productService.updateProductStatus(id, status, actorRole, reason);
      res.json(successResponse(product, 'Product status updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getSellerProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const sellerId = req.params.sellerId || req.user?.userId;
      const { status, page, limit } = req.query;

      const products = await productService.getSellerProducts(
        sellerId as string,
        {
          status: status as ProductStatus,
          page: page ? parseInt(page as string) : 1,
          limit: limit ? parseInt(limit as string) : 20,
        }
      );

      res.json(successResponse(products, 'Seller products retrieved successfully'));
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
