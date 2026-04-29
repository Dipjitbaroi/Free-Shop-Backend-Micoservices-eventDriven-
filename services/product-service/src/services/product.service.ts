import { Prisma, Product, ProductStatus } from '../../generated/client/client.js';
import { 
  IProductCreate, 
  IProductUpdate, 
  IProductFilter,
  IFreeItemCreate,
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
import axios from 'axios';

interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

interface ProductActorContext {
  userId?: string;
  actorUserId?: string;
  canUpdateAny?: boolean;
  canDeleteAny?: boolean;
  canUpdatePrice?: boolean;
}

type FreeItemRow = {
  id: string;
  name: string;
  description?: string | null;
  sku?: string | null;
  image?: string | null;
  createdBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

interface FreeItemFilters {
  userId?: string;
  canReadAny?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

type FreeItemUpdateInput = {
  name?: string;
  description?: string;
  sku?: string;
  image?: string;
};

class ProductService {
  private userProfileCache = new Map<string, UserProfile>();

  private async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    if (this.userProfileCache.has(userId)) {
      return this.userProfileCache.get(userId) || null;
    }

    try {
      const response = await axios.get(
        `${process.env.USER_SERVICE_URL || 'http://user-service:3002'}/users/${userId}`,
        { timeout: 5000 }
      );
      const profile = response.data?.data || null;
      if (profile) {
        // Ensure profile has required fields
        const validated: UserProfile = {
          id: profile.id || userId,
          firstName: profile.firstName || undefined,
          lastName: profile.lastName || undefined,
          email: profile.email || undefined,
          avatar: profile.avatar || undefined,
        };
        this.userProfileCache.set(userId, validated);
        return validated;
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch user profile for ${userId}:`, error);
      // Return minimal profile structure instead of null to avoid breaking UI
      return {
        id: userId,
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        avatar: undefined,
      };
    }
  }

  private async attachLastUpdatedBy<T extends { id: string }>(product: T): Promise<T & { lastUpdatedBy?: { id: string; name?: string; email?: string; avatar?: string } | null }> {
    const rows = await prisma.$queryRaw<Array<{ lastUpdatedBy: string | null }>>`
      SELECT "lastUpdatedBy"
      FROM "products"
      WHERE "id" = ${product.id}
    `;

    const userId = rows[0]?.lastUpdatedBy;
    if (!userId) {
      return {
        ...product,
        lastUpdatedBy: null,
      };
    }

    const userProfile = await this.fetchUserProfile(userId);
    const lastUpdatedByData = userProfile ? {
      id: userId,
      name: userProfile.firstName && userProfile.lastName ? `${userProfile.firstName} ${userProfile.lastName}` : (userProfile.firstName || userProfile.lastName || ''),
      email: userProfile.email || undefined,
      avatar: userProfile.avatar,
    } : null;

    return {
      ...product,
      lastUpdatedBy: lastUpdatedByData,
    };
  }

  private async attachLastUpdatedByMany<T extends { id: string }>(products: T[]): Promise<Array<T & { lastUpdatedBy?: { id: string; name?: string; email?: string; avatar?: string } | null }>> {
    if (products.length === 0) {
      return [];
    }

    const ids = products.map((product) => product.id);
    const rows = await prisma.$queryRaw<Array<{ id: string; lastUpdatedBy: string | null }>>`
      SELECT "id", "lastUpdatedBy"
      FROM "products"
      WHERE "id" IN (${Prisma.join(ids)})
    `;

    const lastUpdatedByMap = new Map(rows.map((row) => [row.id, row.lastUpdatedBy]));
    const userIds = Array.from(new Set(rows.map(r => r.lastUpdatedBy).filter(Boolean)));
    
    const userProfiles = new Map<string, UserProfile>();
    await Promise.all(
      userIds.map(async (userId) => {
        const profile = await this.fetchUserProfile(userId!);
        if (profile) {
          userProfiles.set(userId!, profile);
        }
      })
    );

    return products.map((product) => {
      const userId = lastUpdatedByMap.get(product.id);
      if (!userId) {
        return {
          ...product,
          lastUpdatedBy: null,
        };
      }

      const userProfile = userProfiles.get(userId);
      const lastUpdatedByData = userProfile ? {
        id: userId,
        name: userProfile.firstName && userProfile.lastName ? `${userProfile.firstName} ${userProfile.lastName}` : (userProfile.firstName || userProfile.lastName || ''),
        email: userProfile.email || undefined,
        avatar: userProfile.avatar,
      } : null;

      return {
        ...product,
        lastUpdatedBy: lastUpdatedByData,
      };
    });
  }

  private async attachCreatedBy<T extends { id: string }>(product: T): Promise<T & { createdBy?: { id: string; name?: string; email?: string; avatar?: string } | null }> {
    const rows = await prisma.$queryRaw<Array<{ createdBy: string | null }>>`
      SELECT "createdBy"
      FROM "products"
      WHERE "id" = ${product.id}
    `;

    const userId = rows[0]?.createdBy;
    if (!userId) {
      return {
        ...product,
        createdBy: null,
      };
    }

    const userProfile = await this.fetchUserProfile(userId);
    const createdByData = userProfile ? {
      id: userId,
      name: userProfile.firstName && userProfile.lastName ? `${userProfile.firstName} ${userProfile.lastName}` : (userProfile.firstName || userProfile.lastName || ''),
      email: userProfile.email || undefined,
      avatar: userProfile.avatar,
    } : null;

    return {
      ...product,
      createdBy: createdByData,
    };
  }

  private async attachCreatedByMany<T extends { id: string }>(products: T[]): Promise<Array<T & { createdBy?: { id: string; name?: string; email?: string; avatar?: string } | null }>> {
    if (products.length === 0) {
      return [];
    }

    const ids = products.map((product) => product.id);
    const rows = await prisma.$queryRaw<Array<{ id: string; createdBy: string | null }>>`
      SELECT "id", "createdBy"
      FROM "products"
      WHERE "id" IN (${Prisma.join(ids)})
    `;

    const createdByMap = new Map(rows.map((row) => [row.id, row.createdBy]));
    const userIds = Array.from(new Set(rows.map(r => r.createdBy).filter(Boolean)));
    
    const userProfiles = new Map<string, UserProfile>();
    await Promise.all(
      userIds.map(async (userId) => {
        const profile = await this.fetchUserProfile(userId!);
        if (profile) {
          userProfiles.set(userId!, profile);
        }
      })
    );

    return products.map((product) => {
      const userId = createdByMap.get(product.id);
      if (!userId) {
        return {
          ...product,
          createdBy: null,
        };
      }

      const userProfile = userProfiles.get(userId);
      const createdByData = userProfile ? {
        id: userId,
        name: userProfile.firstName && userProfile.lastName ? `${userProfile.firstName} ${userProfile.lastName}` : (userProfile.firstName || userProfile.lastName || ''),
        email: userProfile.email || undefined,
        avatar: userProfile.avatar,
      } : null;

      return {
        ...product,
        createdBy: createdByData,
      };
    });
  }

  private async loadFreeItemsForProducts(productIds: string[]): Promise<Map<string, FreeItemRow[]>> {
    const result = new Map<string, FreeItemRow[]>();
    if (productIds.length === 0) {
      return result;
    }

    const rows = await prisma.$queryRaw<Array<{
      productId: string;
      id: string;
      name: string;
      description: string | null;
      sku: string | null;
      image: string | null;
      createdBy: string | null;
      createdAt: Date;
      updatedAt: Date;
    }>>`
      SELECT
        pfi."productId",
        fi."id",
        fi."name",
        fi."description",
        fi."sku",
        fi."image",
        fi."createdBy",
        fi."createdAt",
        fi."updatedAt"
      FROM "product_free_items" pfi
      INNER JOIN "free_items" fi ON fi."id" = pfi."freeItemId"
      WHERE pfi."productId" IN (${Prisma.join(productIds)})
      ORDER BY pfi."assignedAt" ASC
    `;

    for (const row of rows) {
      const items = result.get(row.productId) || [];
      items.push({
        id: row.id,
        name: row.name,
        description: row.description,
        sku: row.sku,
        image: row.image,
        createdBy: row.createdBy,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      });
      result.set(row.productId, items);
    }

    return result;
  }

  private async loadFreeItemsForProduct(productId: string): Promise<FreeItemRow[]> {
    const map = await this.loadFreeItemsForProducts([productId]);
    return map.get(productId) || [];
  }

  private async loadFreeItemById(id: string): Promise<FreeItemRow | null> {
    const item = await prisma.freeItem.findUnique({
      where: { id },
    } as any);

    return item as FreeItemRow | null;
  }

  private async loadVisibleFreeItems(filters: FreeItemFilters): Promise<{ items: FreeItemRow[]; total: number }> {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || config.pagination.defaultLimit, config.pagination.maxLimit);
    const offset = calculateOffset(page, limit);

    const where: Record<string, unknown> = {};
    if (!filters.canReadAny && filters.userId) {
      where.createdBy = filters.userId;
    }
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.freeItem.findMany({
        where: where as any,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      } as any),
      prisma.freeItem.count({ where: where as any } as any),
    ]);

    return {
      items: items as FreeItemRow[],
      total,
    };
  }

  private async upsertProductFreeItems(
    tx: typeof prisma,
    productId: string,
    data: { freeItems?: Array<{ name: string; description?: string; sku?: string; image?: string }>; freeItemIds?: string[] },
    creatorId?: string
  ): Promise<void> {
    const hasFreeItems = data.freeItems !== undefined;
    const hasFreeItemIds = data.freeItemIds !== undefined;

    if (!hasFreeItems && !hasFreeItemIds) {
      return;
    }

    await tx.$executeRaw`
      DELETE FROM "product_free_items"
      WHERE "productId" = ${productId}
    `;

    const freeItemIds = new Set<string>((data.freeItemIds || []).filter(Boolean));

    if (data.freeItems && data.freeItems.length > 0) {
      const created = await Promise.all(
        data.freeItems.map((item) =>
          tx.freeItem.create({
            data: {
              name: item.name,
              description: item.description ?? null,
              sku: item.sku ?? null,
              image: item.image ?? null,
              createdBy: creatorId || productId,
            } as any,
          } as any)
        )
      );

      created.forEach((item) => freeItemIds.add(item.id));
    }

    if (freeItemIds.size === 0) {
      return;
    }

    const existing = await tx.freeItem.findMany({
      where: { id: { in: Array.from(freeItemIds) } },
      select: { id: true },
    } as any);

    if (existing.length !== freeItemIds.size) {
      throw new BadRequestError('One or more free item IDs are invalid');
    }

    const values = Array.from(freeItemIds);
    await Promise.all(
      values.map((freeItemId) =>
        tx.$executeRaw`
          INSERT INTO "product_free_items" ("id", "productId", "freeItemId", "assignedAt")
          VALUES (${`${productId}:${freeItemId}`}, ${productId}, ${freeItemId}, NOW())
          ON CONFLICT ("productId", "freeItemId") DO NOTHING
        `
      )
    );
  }

  private async hydrateProduct<T extends { id: string }>(product: T): Promise<T & { freeItems: FreeItemRow[] }> {
    return {
      ...product,
      freeItems: await this.loadFreeItemsForProduct(product.id),
    };
  }

  private async hydrateProducts<T extends { id: string }>(products: T[]): Promise<Array<T & { freeItems: FreeItemRow[] }>> {
    const freeItemMap = await this.loadFreeItemsForProducts(products.map((product) => product.id));
    return products.map((product) => ({
      ...product,
      freeItems: freeItemMap.get(product.id) || [],
    }));
  }

  private async hydrateFreeItem<T extends FreeItemRow>(freeItem: T): Promise<T> {
    return freeItem;
  }

  private async invalidateProductsForFreeItem(freeItemId: string): Promise<void> {
    const rows = await prisma.$queryRaw<Array<{ id: string; slug: string }>>`
      SELECT p."id", p."slug"
      FROM "product_free_items" pfi
      INNER JOIN "products" p ON p."id" = pfi."productId"
      WHERE pfi."freeItemId" = ${freeItemId}
    `;

    if (rows.length === 0) return;

    await Promise.all(
      rows.flatMap((row) => [
        cacheDelete(productCacheKey(row.id)),
        cacheDelete(productSlugCacheKey(row.slug)),
      ])
    );
  }

  async createFreeItem(data: IFreeItemCreate, creatorId: string): Promise<FreeItemRow> {
    const item = await prisma.freeItem.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        sku: data.sku ?? null,
        image: data.image ?? null,
        createdBy: creatorId,
      } as any,
    } as any);

    return this.hydrateFreeItem(item as FreeItemRow);
  }

  async getFreeItemById(id: string, userId?: string, canReadAny: boolean = false): Promise<FreeItemRow> {
    const item = await this.loadFreeItemById(id);
    if (!item) {
      throw new NotFoundError('Free item not found');
    }

    if (!canReadAny && item.createdBy !== userId) {
      throw new ForbiddenError('You can only view your own free items unless you have free item read permission');
    }

    return this.hydrateFreeItem(item);
  }

  async getFreeItems(filters: FreeItemFilters): Promise<IPaginatedResult<FreeItemRow>> {
    const { items, total } = await this.loadVisibleFreeItems(filters);
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || config.pagination.defaultLimit, config.pagination.maxLimit);
    return createPaginatedResponse(items, total, { page, limit });
  }

  async updateFreeItem(id: string, data: FreeItemUpdateInput, userId: string, canUpdateAny: boolean = false): Promise<FreeItemRow> {
    const existing = await this.loadFreeItemById(id);
    if (!existing) {
      throw new NotFoundError('Free item not found');
    }

    if (!canUpdateAny && existing.createdBy !== userId) {
      throw new ForbiddenError('You can only update your own free items unless you have free item update permission');
    }

    const updated = await prisma.freeItem.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.sku !== undefined ? { sku: data.sku } : {}),
        ...(data.image !== undefined ? { image: data.image } : {}),
      } as any,
    } as any);

    await this.invalidateProductsForFreeItem(id);

    return this.hydrateFreeItem(updated as FreeItemRow);
  }

  async deleteFreeItem(id: string, userId: string, canDeleteAny: boolean = false): Promise<void> {
    const existing = await this.loadFreeItemById(id);
    if (!existing) {
      throw new NotFoundError('Free item not found');
    }

    if (!canDeleteAny && existing.createdBy !== userId) {
      throw new ForbiddenError('You can only delete your own free items unless you have free item delete permission');
    }

    await this.invalidateProductsForFreeItem(id);
    await prisma.freeItem.delete({
      where: { id },
    } as any);
  }

  async createProduct(data: IProductCreate & { freeItemIds?: string[]; actorUserId?: string }): Promise<Product> {
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
        createdBy: data.actorUserId || data.vendorId,
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
      },
      include: {
        category: true,
      } as any,
    });

    // Update category product count
    await prisma.category.update({
      where: { id: data.categoryId },
      data: { productCount: { increment: 1 } },
    });

    await this.upsertProductFreeItems(prisma as any, product.id, {
      freeItems: data.freeItems,
      freeItemIds: data.freeItemIds,
    }, data.actorUserId || data.vendorId);

    // Publish event
    await eventPublisher.productCreated({
      productId: product.id,
      vendorId: product.vendorId,
      name: product.name,
      price: Number(product.price),
      categoryId: product.categoryId,
    });

    return this.hydrateProduct(
      await this.attachCreatedBy(
        await this.attachLastUpdatedBy(product)
      )
    ) as Promise<Product>;
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
      },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const enrichedProduct = await this.hydrateProduct(
      await this.attachCreatedBy(
        await this.attachLastUpdatedBy(product)
      )
    );

    // Cache the result
    await cacheSet(productCacheKey(id), enrichedProduct, config.cache.productTTL);

    return enrichedProduct as Product;
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

    const enrichedProduct = await this.hydrateProduct(
      await this.attachCreatedBy(
        await this.attachLastUpdatedBy(product)
      )
    );

    await cacheSet(productSlugCacheKey(slug), enrichedProduct, config.cache.productTTL);

    return enrichedProduct as Product;
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
        },
        orderBy,
        skip: offset,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const enrichedProducts = await this.hydrateProducts(
      await this.attachCreatedByMany(
        await this.attachLastUpdatedByMany(products)
      )
    );

    return createPaginatedResponse(enrichedProducts, totalItems, { page, limit });
  }

  async updateProduct(id: string, data: IProductUpdate & { freeItemIds?: string[]; actorUserId?: string }, actor: ProductActorContext = {}): Promise<Product> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const isOwner = !!actor.userId && product.vendorId === actor.userId;
    if (!isOwner && !actor.canUpdateAny) {
      throw new ForbiddenError('You can only update your own products unless you have product update permission');
    }

    if (data.price !== undefined && !actor.canUpdatePrice) {
      throw new ForbiddenError('You are not allowed to update the retail price');
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

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true } as any,
    });

    await this.upsertProductFreeItems(prisma as any, id, {
      freeItems: data.freeItems,
      freeItemIds: data.freeItemIds,
    }, data.actorUserId || actor.userId);

    if (actor.userId) {
      await prisma.$executeRaw`
        UPDATE "products"
        SET "lastUpdatedBy" = ${actor.userId}
        WHERE "id" = ${id}
      `;
    }

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

    return this.hydrateProduct(
      await this.attachCreatedBy(
        await this.attachLastUpdatedBy(updatedProduct)
      )
    ) as Promise<Product>;
  }

  async deleteProduct(id: string, actor: ProductActorContext = {}): Promise<void> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const isOwner = !!actor.userId && product.vendorId === actor.userId;
    if (!isOwner && !actor.canDeleteAny) {
      throw new ForbiddenError('You can only delete your own products unless you have product delete permission');
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
    priceAuthorized?: boolean,
    actorUserId?: string,
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
      // Allow using existing product.price if present (> 0). If caller supplied
      // a new price, require they have priceAuthorized or be an admin.
      const finalPrice = price !== undefined && price !== null ? price : (product.price ? Number(product.price) : undefined);
      if (finalPrice === undefined || finalPrice === null || finalPrice <= 0) {
        throw new BadRequestError('Price must be provided when approving a product');
      }
      if (price !== undefined && price !== null && !priceAuthorized && !isAdmin) {
        throw new ForbiddenError('Not authorized to set product price');
      }
      // assign finalPrice to price variable for later update
      price = finalPrice;
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

    if (actorUserId) {
      await prisma.$executeRaw`
        UPDATE "products"
        SET "lastUpdatedBy" = ${actorUserId}
        WHERE "id" = ${id}
      `;
    }

    await eventPublisher.productStatusChanged({
      productId: id,
      vendorId: updated.vendorId,
      previousStatus: product.status,
      newStatus: status,
      ...(reason && { reason }),
    });

    await cacheDelete(productCacheKey(id));

    return this.hydrateProduct(
      await this.attachCreatedBy(
        await this.attachLastUpdatedBy(updated)
      )
    ) as Promise<Product>;
  }

  async getVendorProducts(vendorId: string, filter: IProductFilter): Promise<IPaginatedResult<Product>> {
    return this.getProducts({ ...filter, vendorId });
  }

  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    const products = await prisma.product.findMany({
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

    return this.hydrateProducts(
      await this.attachCreatedByMany(
        await this.attachLastUpdatedByMany(products)
      )
    ) as Promise<Product[]>;
  }

  async getFlashSaleProducts(limit: number = 10): Promise<Product[]> {
    const now = new Date();
    const products = await prisma.product.findMany({
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

    return this.hydrateProducts(
      await this.attachCreatedByMany(
        await this.attachLastUpdatedByMany(products)
      )
    ) as Promise<Product[]>;
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

