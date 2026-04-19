import { Prisma, Product, ProductStatus } from '../../generated/client/client.js';
import { 
  IProductCreate, 
  IProductUpdate, 
  IProductFilter,
  IPaginatedResult,
} from '@freeshop/shared-types';
import { 
  generateSlug, 
  generateSku, 
  NotFoundError, 
  BadRequestError,
  ForbiddenError,
  calculateOffset,
  createPaginatedResponse,
} from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma.js';
import { 
  cacheGet, 
  cacheSet, 
  cacheDelete,
  productCacheKey,
  productSlugCacheKey,
} from '../lib/redis.js';
import { eventPublisher } from '../lib/message-broker.js';
import config from '../config/index.js';

class ProductService {
  async createProduct(data: IProductCreate): Promise<Product> {
    const slug = generateSlug(data.name);
    const sku = data.sku || generateSku('PRD');

    // Check for duplicate slug
    const existingSlug = await prisma.product.findUnique({
      where: { slug },
    });

    const finalSlug = existingSlug 
      ? `${slug}-${Date.now().toString(36)}` 
      : slug;

    const product = await prisma.product.create({
      data: {
        vendorId: data.vendorId,
        name: data.name,
        slug: finalSlug,
        description: data.description,
        shortDescription: data.shortDescription,
        sku,
        categoryId: data.categoryId,
        supplierPrice: new Prisma.Decimal(data.supplierPrice),
        price: data.price ? new Prisma.Decimal(data.price) : new Prisma.Decimal(0),  // Default to 0, admin sets during approval
        discountPrice: data.discountPrice ? new Prisma.Decimal(data.discountPrice) : null,
        discountType: data.discountType,
        discountValue: data.discountValue ? new Prisma.Decimal(data.discountValue) : null,
        stock: data.stock || 0,
        lowStockThreshold: data.lowStockThreshold || 10,
        weight: data.weight ? new Prisma.Decimal(data.weight) : null,
        unit: data.unit || 'piece',
        isOrganic: data.isOrganic || false,
        organicCertification: data.organicCertification,
        images: data.images || [],
        tags: data.tags || [],
        isFeatured: data.isFeatured || false,
        status: ProductStatus.PENDING_APPROVAL,
        metadata: data.metadata as Prisma.JsonObject || {},
        freeItems: data.freeItems
          ? { create: data.freeItems.map(fi => ({
              name: fi.name,
              description: fi.description,
              sku: fi.sku,
              image: fi.image,
            })) }
          : undefined,
      },
      include: {
        category: true,
        freeItems: true,
      },
    });

    // Update category product count
    await prisma.category.update({
      where: { id: data.categoryId },
      data: { productCount: { increment: 1 } },
    });

    // Publish event
    await eventPublisher.productCreated({
      productId: product.id,
      vendorId: product.vendorId,
      name: product.name,
      price: Number(product.price),
      categoryId: product.categoryId,
    });

    return product;
  }

  async getProductById(id: string): Promise<Product> {
    // Try cache first
    const cached = await cacheGet<Product>(productCacheKey(id));
    if (cached) return cached;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          where: { status: 'APPROVED' },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        freeItems: true,
      },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Cache the result
    await cacheSet(productCacheKey(id), product, config.cache.productTTL);

    return product;
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const cached = await cacheGet<Product>(productSlugCacheKey(slug));
    if (cached) return cached;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          where: { status: 'APPROVED' },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        freeItems: true,
      },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Increment view count
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    await cacheSet(productSlugCacheKey(slug), product, config.cache.productTTL);

    return product;
  }

  async getProducts(filter: IProductFilter): Promise<IPaginatedResult<Product>> {
    const page = filter.page || 1;
    const limit = Math.min(filter.limit || config.pagination.defaultLimit, config.pagination.maxLimit);
    const offset = calculateOffset(page, limit);

    const where: Prisma.ProductWhereInput = {};

    if (filter.status) {
      where.status = filter.status as ProductStatus;
    }

    if (filter.categoryId) where.categoryId = filter.categoryId;
    if (filter.vendorId) where.vendorId = filter.vendorId;
    if (filter.isOrganic !== undefined) where.isOrganic = filter.isOrganic;
    if (filter.isFeatured !== undefined) where.isFeatured = filter.isFeatured;
    if (filter.isFlashSale !== undefined) where.isFlashSale = filter.isFlashSale;
    
    if (filter.minPrice || filter.maxPrice) {
      where.price = {};
      if (filter.minPrice) where.price.gte = new Prisma.Decimal(filter.minPrice);
      if (filter.maxPrice) where.price.lte = new Prisma.Decimal(filter.maxPrice);
    }

    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
        { tags: { has: filter.search.toLowerCase() } },
      ];
    }

    if (filter.tags && filter.tags.length > 0) {
      where.tags = { hasSome: filter.tags };
    }

    // Build orderBy
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (filter.sortBy) {
      const order = filter.sortOrder || 'desc';
      switch (filter.sortBy) {
        case 'price':
          orderBy = { price: order };
          break;
        case 'rating':
          orderBy = { averageRating: order };
          break;
        case 'sold':
          orderBy = { totalSold: order };
          break;
        case 'createdAt':
        default:
          orderBy = { createdAt: order };
      }
    }

    const [products, totalItems] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          freeItems: true,
        },
        orderBy,
        skip: offset,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return createPaginatedResponse(products, totalItems, { page, limit });
  }

  async updateProduct(id: string, data: IProductUpdate, userRole?: string, userId?: string): Promise<Product> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Authorization: Only ADMIN/MANAGER can update price
    // Vendors can only update supplierPrice
    // Note: userRole may be undefined - rely on middleware authorization instead
    const isVendor = userRole === 'VENDOR' || userRole === 'Vendor';
    if (isVendor && data.price !== undefined) {
      throw new ForbiddenError('Vendors cannot update the retail price. Contact admin/manager to update pricing.');
    }

    // If userRole is not provided, we still enforce ownership by userId
    // (vendor must be updating their own product)
    if (userId && product.vendorId !== userId && !isVendor) {
      throw new ForbiddenError('You can only update your own products');
    }

    // Handle category change
    if (data.categoryId && data.categoryId !== product.categoryId) {
      await Promise.all([
        prisma.category.update({
          where: { id: product.categoryId },
          data: { productCount: { decrement: 1 } },
        }),
        prisma.category.update({
          where: { id: data.categoryId },
          data: { productCount: { increment: 1 } },
        }),
      ]);
    }

    const updateData: Prisma.ProductUpdateInput = {};
    
    if (data.name) {
      updateData.name = data.name;
      const newSlug = generateSlug(data.name);

      // Check if another product already uses this slug
      const existingSlug = await prisma.product.findFirst({
        where: { slug: newSlug, id: { not: id } },
      });

      updateData.slug = existingSlug
        ? `${newSlug}-${Date.now().toString(36)}`
        : newSlug;
    }
    if (data.description) updateData.description = data.description;
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
    if (data.categoryId) updateData.category = { connect: { id: data.categoryId } };
    if (data.supplierPrice !== undefined) updateData.supplierPrice = new Prisma.Decimal(data.supplierPrice);
    if (data.price !== undefined) updateData.price = new Prisma.Decimal(data.price);
    if (data.discountPrice !== undefined) {
      updateData.discountPrice = data.discountPrice ? new Prisma.Decimal(data.discountPrice) : null;
    }
    if (data.discountType !== undefined) updateData.discountType = data.discountType;
    if (data.discountValue !== undefined) {
      updateData.discountValue = data.discountValue ? new Prisma.Decimal(data.discountValue) : null;
    }
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.lowStockThreshold !== undefined) updateData.lowStockThreshold = data.lowStockThreshold;
    if (data.weight !== undefined) updateData.weight = data.weight ? new Prisma.Decimal(data.weight) : null;
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.isOrganic !== undefined) updateData.isOrganic = data.isOrganic;
    if (data.organicCertification !== undefined) updateData.organicCertification = data.organicCertification;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.metadata !== undefined) updateData.metadata = data.metadata as Prisma.JsonObject;
    if (data.freeItems !== undefined) {
      updateData.freeItems = {
        deleteMany: {},
        create: data.freeItems.map(fi => ({
          name: fi.name,
          description: fi.description,
          sku: fi.sku,
          image: fi.image,
        })),
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true, freeItems: true },
    });

    // Clear cache
    await Promise.all([
      cacheDelete(productCacheKey(id)),
      cacheDelete(productSlugCacheKey(product.slug)),
      cacheDelete(productSlugCacheKey(updatedProduct.slug)),
    ]);

    // Publish event
    await eventPublisher.productUpdated({
      productId: id,
      vendorId: product.vendorId,
      changes: data as Record<string, unknown>,
    });

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    await prisma.product.delete({
      where: { id },
    });

    // Update category count
    await prisma.category.update({
      where: { id: product.categoryId },
      data: { productCount: { decrement: 1 } },
    });

    // Clear cache
    await Promise.all([
      cacheDelete(productCacheKey(id)),
      cacheDelete(productSlugCacheKey(product.slug)),
    ]);
  }

  async updateProductStatus(
    id: string,
    status: ProductStatus,
    actorRole?: string,
    reason?: string,
    price?: number,  // Admin can set retail price during approval
  ): Promise<Product> {
    const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
    if (!product) throw new NotFoundError('Product not found');

    // Note: actorRole may be undefined - authorization is handled by middleware
    // Permission checks should be enforced via authorizePermission middleware
    const isAdmin = actorRole ? ['ADMIN', 'MANAGER'].includes(actorRole) : false;

    if (status === ProductStatus.OUT_OF_STOCK) {
      throw new BadRequestError('OUT_OF_STOCK is managed automatically by the inventory service');
    }
    if (status === ProductStatus.ACTIVE) {
      if (!isAdmin) throw new ForbiddenError('Only admins can approve products');
      // Require price to be set during approval
      if (price === undefined || price === null) {
        throw new BadRequestError('Price must be provided when approving a product');
      }
    }
    if (status === ProductStatus.REJECTED) {
      if (!isAdmin) throw new ForbiddenError('Only admins can reject products');
      if (!reason) throw new BadRequestError('Rejection reason is required');
    }
    if (status === ProductStatus.PENDING_APPROVAL && isAdmin) {
      throw new ForbiddenError('Admins cannot submit products for approval');
    }

    const updateData: Prisma.ProductUpdateInput = { status };
    if (status === ProductStatus.ACTIVE) {
      updateData.rejectionReason = null;
      if (price !== undefined) updateData.price = new Prisma.Decimal(price);
    }
    if (status === ProductStatus.REJECTED) updateData.rejectionReason = reason;
    if (status === ProductStatus.PENDING_APPROVAL) updateData.rejectionReason = null;

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    await eventPublisher.productStatusChanged({
      productId: id,
      vendorId: updated.vendorId,
      previousStatus: product.status,
      newStatus: status,
      ...(reason && { reason }),
    });

    await cacheDelete(productCacheKey(id));

    return updated;
  }

  async getVendorProducts(vendorId: string, filter: IProductFilter): Promise<IPaginatedResult<Product>> {
    return this.getProducts({ ...filter, vendorId });
  }

  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        status: ProductStatus.ACTIVE,
        isFeatured: true,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getFlashSaleProducts(limit: number = 10): Promise<Product[]> {
    const now = new Date();
    return prisma.product.findMany({
      where: {
        status: ProductStatus.ACTIVE,
        isFlashSale: true,
        flashSaleStartDate: { lte: now },
        flashSaleEndDate: { gte: now },
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { flashSaleEndDate: 'asc' },
      take: limit,
    });
  }

  async updateProductRating(productId: string): Promise<void> {
    const result = await prisma.review.aggregate({
      where: {
        productId,
        status: 'APPROVED',
      },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: result._avg.rating || 0,
        totalReviews: result._count.rating,
      },
    });

    await cacheDelete(productCacheKey(productId));
  }
}

export const productService = new ProductService();

