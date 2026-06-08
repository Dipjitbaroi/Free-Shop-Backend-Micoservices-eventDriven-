import { Banner } from '../../generated/client/client.js';
import { 
  NotFoundError, 
  BadRequestError,
  calculateOffset,
  createPaginatedResponse,
} from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma.js';
import { 
  cacheGet, 
  cacheSet, 
  cacheDelete,
} from '../lib/redis.js';

interface IBannerCreate {
  title: string;
  description?: string;
  image: string;
  altText?: string;
  link?: string;
  linkType?: string;
  targetId?: string;
  position?: number;
  startDate?: Date;
  endDate?: Date;
  createdBy: string;
}

interface IBannerUpdate {
  title?: string;
  description?: string;
  image?: string;
  altText?: string;
  link?: string;
  linkType?: string;
  targetId?: string;
  position?: number;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
}

interface IBannerFilter {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

class BannerService {
  private readonly bannerCacheKey = 'banners:list';
  private readonly bannerDetailCacheKey = (id: string) => `banner:${id}`;
  private readonly activebannersCacheKey = 'banners:active';

  async createBanner(data: IBannerCreate): Promise<Banner> {
    if (!data.title || !data.image) {
      throw new BadRequestError('Title and image are required');
    }

    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        altText: data.altText,
        link: data.link,
        linkType: data.linkType || 'internal',
        targetId: data.targetId,
        position: data.position || 0,
        startDate: data.startDate,
        endDate: data.endDate,
        createdBy: data.createdBy,
      },
    });

    // Invalidate cache
    await this.invalidateCache();

    return banner;
  }

  async getBanners(filters: IBannerFilter & { isActive?: boolean } = {}): Promise<any> {
    const { search, isActive = true, page = 1, limit = 10 } = filters;

    const offset = calculateOffset(page, limit);
    const cacheKey = `${this.bannerCacheKey}:${isActive}:${page}:${limit}:${search || ''}`;

    // Try to get from cache
    const cached = await cacheGet<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const where: any = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [banners, total] = await Promise.all([
      prisma.banner.findMany({
        where,
        orderBy: { position: 'asc' },
        skip: offset,
        take: limit,
      }),
      prisma.banner.count({ where }),
    ]);

    const result = createPaginatedResponse(banners, total, page, limit);
    await cacheSet(cacheKey, result, 3600); // Cache for 1 hour

    return result;
  }

  async getActiveBanners(): Promise<Banner[]> {
    const cacheKey = this.activebannersCacheKey;

    // Try to get from cache
    const cached = await cacheGet<Banner[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const now = new Date();
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
        OR: [
          {
            AND: [
              { startDate: { lte: now } },
              { endDate: { gte: now } },
            ],
          },
          {
            AND: [
              { startDate: null },
              { endDate: null },
            ],
          },
        ],
      },
      orderBy: { position: 'asc' },
    });

    await cacheSet(cacheKey, banners, 1800); // Cache for 30 minutes

    return banners;
  }

  async getBannerById(id: string): Promise<Banner> {
    const cacheKey = this.bannerDetailCacheKey(id);

    // Try to get from cache
    const cached = await cacheGet<Banner>(cacheKey);
    if (cached) {
      return cached;
    }

    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundError(`Banner with ID ${id} not found`);
    }

    await cacheSet(cacheKey, banner, 3600); // Cache for 1 hour

    return banner;
  }

  async updateBanner(id: string, data: IBannerUpdate): Promise<Banner> {
    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundError(`Banner with ID ${id} not found`);
    }

    const updated = await prisma.banner.update({
      where: { id },
      data: {
        title: data.title ?? banner.title,
        description: data.description ?? banner.description,
        image: data.image ?? banner.image,
        altText: data.altText ?? banner.altText,
        link: data.link ?? banner.link,
        linkType: data.linkType ?? banner.linkType,
        targetId: data.targetId ?? banner.targetId,
        position: data.position ?? banner.position,
        isActive: data.isActive ?? banner.isActive,
        startDate: data.startDate ?? banner.startDate,
        endDate: data.endDate ?? banner.endDate,
      },
    });

    // Invalidate cache
    await this.invalidateCache();

    return updated;
  }

  async deleteBanner(id: string): Promise<void> {
    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundError(`Banner with ID ${id} not found`);
    }

    await prisma.banner.delete({
      where: { id },
    });

    // Invalidate cache
    await this.invalidateCache();
  }

  async reorderBanners(bannerIds: string[]): Promise<Banner[]> {
    const updated: Banner[] = [];

    for (let i = 0; i < bannerIds.length; i++) {
      const banner = await prisma.banner.update({
        where: { id: bannerIds[i] },
        data: { position: i },
      });
      updated.push(banner);
    }

    // Invalidate cache
    await this.invalidateCache();

    return updated;
  }

  private async invalidateCache(): Promise<void> {
    await cacheDelete(this.bannerCacheKey);
    await cacheDelete(this.activebannersCacheKey);
    // Also clear all pagination variants
    const pattern = `${this.bannerCacheKey}:*`;
    // Note: This would need a more sophisticated cache invalidation strategy
    // For now, we rely on cache TTL expiration
  }
}

export const bannerService = new BannerService();
