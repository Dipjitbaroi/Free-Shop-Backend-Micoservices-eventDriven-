import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service.js';
import axios from 'axios';
import { PERMISSION_CODES } from '@freeshop/shared-types';
import { ProductStatus } from '@freeshop/shared-types';
import { successResponse } from '@freeshop/shared-utils';

const FREE_ITEM_PERMISSION_CODES = {
  CREATE: 12001,
  READ: 12002,
  UPDATE: 12003,
  DELETE: 12004,
} as const;

const getUserRbacSnapshot = async (req: Request) => {
  const userId = req.user?.id || req.user?.userId;
  if (!userId) {
    return { roleNames: [] as string[], permissionCodes: [] as number[] };
  }

  const token = (req.headers.authorization || '').replace('Bearer ', '');
  const resp = await axios.get(
    `${process.env.AUTH_SERVICE_URL || 'http://auth-service:3001'}/rbac/users/${userId}/roles`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return {
    roleNames: resp.data?.data?.roleNames || [],
    permissionCodes: resp.data?.data?.permissionCodes || [],
  };
};

export const productController = {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const vendorId = req.user?.userId || req.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const product = await productService.createProduct({
        ...req.body,
        vendorId,
        actorUserId: userId,
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
      const userId = req.user?.id || req.user?.userId;
      const { permissionCodes, roleNames } = await getUserRbacSnapshot(req);
      const canUpdateAny = permissionCodes.includes(PERMISSION_CODES.PRODUCT_UPDATE);
      const canUpdatePrice =
        permissionCodes.includes(PERMISSION_CODES.PRODUCT_UPDATE_PRICE) ||
        roleNames.includes('SUPERADMIN') ||
        roleNames.includes('ADMIN') ||
        roleNames.includes('MANAGER');

      const product = await productService.updateProduct(id as string, req.body, {
        userId,
        canUpdateAny,
        canUpdatePrice,
        actorUserId: userId,
      });
      res.json(successResponse(product, 'Product updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getFreeItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { permissionCodes } = await getUserRbacSnapshot(req);
      const userId = req.user?.id || req.user?.userId;
      const canReadAny = permissionCodes.includes(FREE_ITEM_PERMISSION_CODES.READ);
      const { search, page, limit } = req.query;
      const items = await productService.getFreeItems({
        userId,
        canReadAny,
        search: search as string | undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });
      res.json(successResponse(items, 'Free items retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getFreeItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { permissionCodes } = await getUserRbacSnapshot(req);
      const userId = req.user?.id || req.user?.userId;
      const canReadAny = permissionCodes.includes(FREE_ITEM_PERMISSION_CODES.READ);
      const item = await productService.getFreeItemById(req.params.id as string, userId, canReadAny);
      res.json(successResponse(item, 'Free item retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async createFreeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const creatorId = req.user?.id || req.user?.userId;
      if (!creatorId) {
        throw new Error('Authenticated user ID is required');
      }
      const item = await productService.createFreeItem(req.body, String(creatorId));
      res.status(201).json(successResponse(item, 'Free item created successfully'));
    } catch (error) {
      next(error);
    }
  },

  async updateFreeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { permissionCodes } = await getUserRbacSnapshot(req);
      const userId = req.user?.id || req.user?.userId;
      if (!userId) {
        throw new Error('Authenticated user ID is required');
      }
      const canUpdateAny = permissionCodes.includes(FREE_ITEM_PERMISSION_CODES.UPDATE);
      const item = await productService.updateFreeItem(req.params.id as string, req.body, String(userId), canUpdateAny);
      res.json(successResponse(item, 'Free item updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async deleteFreeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { permissionCodes } = await getUserRbacSnapshot(req);
      const userId = req.user?.id || req.user?.userId;
      if (!userId) {
        throw new Error('Authenticated user ID is required');
      }
      const canDeleteAny = permissionCodes.includes(FREE_ITEM_PERMISSION_CODES.DELETE);
      await productService.deleteFreeItem(req.params.id as string, String(userId), canDeleteAny);
      res.json(successResponse(null, 'Free item deleted successfully'));
    } catch (error) {
      next(error);
    }
  },

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const { permissionCodes } = await getUserRbacSnapshot(req);

      await productService.deleteProduct(req.params.id as string, {
        userId,
        canDeleteAny: permissionCodes.includes(PERMISSION_CODES.PRODUCT_DELETE),
      });

      res.json(successResponse(null, 'Product deleted successfully'));
    } catch (error) {
      next(error);
    }
  },

  async updateProductStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, reason, price } = req.body;
      // Determine actor role by querying the auth-service so service can correctly
      // enforce admin-only approval rules. Falls back to undefined if unavailable.
      let actorRole: string | undefined = undefined;
      let priceAuthorized = false;
      try {
        const { roleNames, permissionCodes } = await getUserRbacSnapshot(req);
        if (roleNames.includes('SUPERADMIN') || roleNames.includes('ADMIN')) actorRole = 'ADMIN';
        else if (roleNames.includes('MANAGER')) actorRole = 'MANAGER';

        // Determine if caller is allowed to set/update product price
        const hasPricePermission = permissionCodes.includes(PERMISSION_CODES.PRODUCT_UPDATE_PRICE);
        priceAuthorized = (!!actorRole && ['ADMIN', 'MANAGER'].includes(actorRole)) || hasPricePermission;
      } catch (err) {
        // If the role lookup fails, continue without actorRole — the service
        // will perform conservative checks and may reject admin-only actions.
        // Log at debug level.
        // eslint-disable-next-line no-console
        console.debug('Failed to resolve actor role from auth-service', (err as any)?.message || err);
      }

      const product = await productService.updateProductStatus(
        id as string,
        status,
        actorRole,
        reason,
        price,
        priceAuthorized,
        req.user?.id || req.user?.userId
      );
      res.json(successResponse(product, 'Product status updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getVendorProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const vendorId = req.params.vendorId as string || req.user?.id || req.user?.userId;
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
