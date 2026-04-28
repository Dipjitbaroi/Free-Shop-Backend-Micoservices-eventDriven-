import { Prisma, WishlistItem, RecentlyViewed } from '../../generated/client/client.js';
import { BadRequestError, NotFoundError, createPaginatedResponse, calculateOffset, IPaginatedResult } from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma.js';
import { 
  cacheGet, 
  cacheSet, 
  cacheDelete,
  wishlistCacheKey,
} from '../lib/redis.js';
import config from '../config/index.js';
import axios from 'axios';

interface ProductInfo {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  thumbnail?: string;
  images?: string[];
  status: string;
  vendorId: string;
}

interface WishlistItemWithProduct extends WishlistItem {
  product?: ProductInfo | null;
}

class WishlistService {
  private productCache = new Map<string, ProductInfo>();

  private async fetchProductInfo(productId: string): Promise<ProductInfo | null> {
    if (this.productCache.has(productId)) {
      return this.productCache.get(productId) || null;
    }

    try {
      const response = await axios.get(
        `${process.env.PRODUCT_SERVICE_URL || 'http://product-service:3003'}/${productId}`,
        { timeout: 5000 }
      );
      const product = response.data?.data || null;
      if (product) {
        const productInfo: ProductInfo = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          discountPrice: product.discountPrice,
          thumbnail: product.thumbnail,
          images: product.images,
          status: product.status,
          vendorId: product.vendorId,
        };
        this.productCache.set(productId, productInfo);
        return productInfo;
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch product ${productId}:`, error);
      return null;
    }
  }

  async getWishlist(userId: string, page: number = 1, limit: number = 20): Promise<IPaginatedResult<WishlistItemWithProduct>> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return createPaginatedResponse([] as WishlistItemWithProduct[], 0, page, limit);
    }

    const [items, total] = await Promise.all([
      prisma.wishlistItem.findMany({
        where: { userProfileId: profile.id },
        skip: calculateOffset(page, limit),
        take: limit,
        orderBy: { addedAt: 'desc' },
      }),
      prisma.wishlistItem.count({ where: { userProfileId: profile.id } }),
    ]);

    const itemsWithProducts = await Promise.all(
      items.map(async (item) => ({
        ...item,
        product: await this.fetchProductInfo(item.productId),
      }))
    );

    return createPaginatedResponse(itemsWithProducts, total, page, limit);
  }

  async addToWishlist(userId: string, productId: string): Promise<WishlistItem> {
    let profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      profile = await prisma.userProfile.create({
        data: { userId },
      });
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userProfileId_productId: {
          userProfileId: profile.id,
          productId,
        },
      },
    });

    if (existing) {
      throw new BadRequestError('Product already in wishlist');
    }

    const item = await prisma.wishlistItem.create({
      data: {
        userProfileId: profile.id,
        productId,
      },
    });

    await cacheDelete(wishlistCacheKey(userId));

    return item;
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    await prisma.wishlistItem.delete({
      where: {
        userProfileId_productId: {
          userProfileId: profile.id,
          productId,
        },
      },
    }).catch(() => {
      throw new NotFoundError('Product not in wishlist');
    });

    await cacheDelete(wishlistCacheKey(userId));
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) return false;

    const item = await prisma.wishlistItem.findUnique({
      where: {
        userProfileId_productId: {
          userProfileId: profile.id,
          productId,
        },
      },
    });

    return !!item;
  }

  async clearWishlist(userId: string): Promise<void> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) return;

    await prisma.wishlistItem.deleteMany({
      where: { userProfileId: profile.id },
    });

    await cacheDelete(wishlistCacheKey(userId));
  }

  // Recently viewed
  async addRecentlyViewed(userId: string, productId: string): Promise<void> {
    await prisma.recentlyViewed.upsert({
      where: {
        userId_productId: { userId, productId },
      },
      create: {
        userId,
        productId,
      },
      update: {
        viewedAt: new Date(),
      },
    });

    // Keep only last 50 viewed items
    const items = await prisma.recentlyViewed.findMany({
      where: { userId },
      orderBy: { viewedAt: 'desc' },
      skip: 50,
    });

    if (items.length > 0) {
      await prisma.recentlyViewed.deleteMany({
        where: {
          id: { in: items.map(i => i.id) },
        },
      });
    }
  }

  async getRecentlyViewed(userId: string, limit: number = 20): Promise<RecentlyViewed[]> {
    return prisma.recentlyViewed.findMany({
      where: { userId },
      orderBy: { viewedAt: 'desc' },
      take: limit,
    });
  }

  async clearRecentlyViewed(userId: string): Promise<void> {
    await prisma.recentlyViewed.deleteMany({
      where: { userId },
    });
  }
}

export const wishlistService = new WishlistService();
