import { Prisma, WishlistItem, RecentlyViewed } from '../../generated/prisma';
import { BadRequestError, NotFoundError, createPaginatedResponse, calculateOffset, IPaginatedResult } from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma';
import { 
  cacheGet, 
  cacheSet, 
  cacheDelete,
  wishlistCacheKey,
} from '../lib/redis';
import config from '../config';

class WishlistService {
  async getWishlist(userId: string, page: number = 1, limit: number = 20): Promise<IPaginatedResult<WishlistItem>> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return createPaginatedResponse([] as WishlistItem[], 0, page, limit);
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

    return createPaginatedResponse(items, total, page, limit);
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
