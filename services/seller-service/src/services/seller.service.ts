import { prisma } from '../lib/prisma';
import { redis, CACHE_TTL } from '../lib/redis';
import { messageBroker } from '../lib/message-broker';
import { EXCHANGES, getRoutingKey } from '@freeshop/shared-events';
import { Prisma, SellerStatus, VerificationStatus } from '../../generated/prisma';
import { config } from '../config';
import logger, { ConflictError, NotFoundError } from '@freeshop/shared-utils';

interface CreateSellerInput {
  userId: string;
  storeName: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  businessAddress?: Record<string, unknown>;
}

interface UpdateSellerInput {
  storeName?: string;
  description?: string;
  logo?: string;
  banner?: string;
  contactEmail?: string;
  contactPhone?: string;
  businessAddress?: Record<string, unknown>;
  shippingZones?: string[];
  returnPolicy?: string;
  shippingPolicy?: string;
  bankDetails?: Record<string, unknown>;
  mobileWallet?: Record<string, unknown>;
}

interface SellerFilters {
  status?: SellerStatus;
  verificationStatus?: VerificationStatus;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class SellerService {
  private generateSlug(storeName: string): string {
    return storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.seller.findFirst({
        where: {
          storeSlug: slug,
          NOT: excludeId ? { id: excludeId } : undefined,
        },
      });

      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  async createSeller(input: CreateSellerInput) {
    const existingSeller = await prisma.seller.findUnique({
      where: { userId: input.userId },
    });

    if (existingSeller) {
      throw new ConflictError('User already has a seller account');
    }

    const baseSlug = this.generateSlug(input.storeName);
    const storeSlug = await this.ensureUniqueSlug(baseSlug);

    const seller = await prisma.seller.create({
      data: {
        userId: input.userId,
        storeName: input.storeName,
        storeSlug,
        description: input.description,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        businessAddress: input.businessAddress as Prisma.InputJsonValue,
        commissionRate: config.defaultCommissionRate,
        minimumWithdrawal: config.defaultMinimumWithdrawal,
      },
    });

    await messageBroker.publish(
      EXCHANGES.SELLER,
      getRoutingKey('SELLER', 'CREATED'),
      {
        sellerId: seller.id,
        userId: seller.userId,
        storeName: seller.storeName,
        storeSlug: seller.storeSlug,
      }
    );

    return seller;
  }

  async getSellerById(id: string) {
    const cacheKey = `seller:${id}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const seller = await prisma.seller.findUnique({
      where: { id },
      include: {
        documents: true,
      },
    });

    if (seller) {
      await redis.setex(cacheKey, CACHE_TTL.SELLER_PROFILE, JSON.stringify(seller));
    }

    return seller;
  }

  async getSellerByUserId(userId: string) {
    const cacheKey = `seller:user:${userId}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const seller = await prisma.seller.findUnique({
      where: { userId },
      include: {
        documents: true,
      },
    });

    if (seller) {
      await redis.setex(cacheKey, CACHE_TTL.SELLER_PROFILE, JSON.stringify(seller));
    }

    return seller;
  }

  async getSellerBySlug(slug: string) {
    const cacheKey = `seller:slug:${slug}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const seller = await prisma.seller.findUnique({
      where: { storeSlug: slug },
      include: {
        documents: {
          where: { status: 'APPROVED' },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (seller) {
      await redis.setex(cacheKey, CACHE_TTL.SELLER_PROFILE, JSON.stringify(seller));
    }

    return seller;
  }

  async updateSeller(id: string, input: UpdateSellerInput) {
    const seller = await prisma.seller.findUnique({ where: { id } });
    if (!seller) {
      throw new NotFoundError('Seller not found');
    }

    let storeSlug = seller.storeSlug;
    if (input.storeName && input.storeName !== seller.storeName) {
      const baseSlug = this.generateSlug(input.storeName);
      storeSlug = await this.ensureUniqueSlug(baseSlug, id);
    }

    const updated = await prisma.seller.update({
      where: { id },
      data: {
        ...input,
        storeSlug,
        businessAddress: input.businessAddress as Prisma.InputJsonValue,
        bankDetails: input.bankDetails as Prisma.InputJsonValue,
        mobileWallet: input.mobileWallet as Prisma.InputJsonValue,
      },
    });

    await this.invalidateSellerCache(id, seller.userId, seller.storeSlug);
    if (storeSlug !== seller.storeSlug) {
      await redis.del(`seller:slug:${storeSlug}`);
    }

    await messageBroker.publish(
      EXCHANGES.SELLER,
      getRoutingKey('SELLER', 'UPDATED'),
      {
        sellerId: updated.id,
        userId: updated.userId,
        storeName: updated.storeName,
        storeSlug: updated.storeSlug,
      }
    );

    return updated;
  }

  async updateSellerStatus(id: string, status: SellerStatus, reason?: string) {
    const seller = await prisma.seller.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === 'SUSPENDED' || status === 'BANNED' ? reason : null,
      },
    });

    await this.invalidateSellerCache(id, seller.userId, seller.storeSlug);

    await messageBroker.publish(
      EXCHANGES.SELLER,
      getRoutingKey('SELLER', 'STATUS_CHANGED'),
      {
        sellerId: seller.id,
        userId: seller.userId,
        status,
        reason,
      }
    );

    return seller;
  }

  async verifySeller(id: string, approved: boolean, reason?: string) {
    const seller = await prisma.seller.update({
      where: { id },
      data: {
        verificationStatus: approved ? 'VERIFIED' : 'REJECTED',
        verifiedAt: approved ? new Date() : null,
        rejectionReason: !approved ? reason : null,
        status: approved ? 'ACTIVE' : 'PENDING',
      },
    });

    await this.invalidateSellerCache(id, seller.userId, seller.storeSlug);

    await messageBroker.publish(
      EXCHANGES.SELLER,
      getRoutingKey('SELLER', 'VERIFIED'),
      {
        sellerId: seller.id,
        userId: seller.userId,
        verified: approved,
        reason,
      }
    );

    return seller;
  }

  async listSellers(filters: SellerFilters) {
    const {
      status,
      verificationStatus,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const where: Prisma.SellerWhereInput = {};

    if (status) where.status = status;
    if (verificationStatus) where.verificationStatus = verificationStatus;
    if (search) {
      where.OR = [
        { storeName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { contactEmail: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [sellers, total] = await Promise.all([
      prisma.seller.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          userId: true,
          storeName: true,
          storeSlug: true,
          description: true,
          logo: true,
          status: true,
          verificationStatus: true,
          rating: true,
          totalReviews: true,
          totalProducts: true,
          createdAt: true,
        },
      }),
      prisma.seller.count({ where }),
    ]);

    return {
      sellers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async addDocument(sellerId: string, type: string, documentUrl: string) {
    const document = await prisma.sellerDocument.create({
      data: {
        sellerId,
        type: type as any,
        documentUrl,
      },
    });

    await prisma.seller.update({
      where: { id: sellerId },
      data: { verificationStatus: 'PENDING' },
    });

    return document;
  }

  async verifyDocument(documentId: string, approved: boolean, reason?: string) {
    const document = await prisma.sellerDocument.update({
      where: { id: documentId },
      data: {
        status: approved ? 'APPROVED' : 'REJECTED',
        verifiedAt: approved ? new Date() : null,
        rejectedAt: !approved ? new Date() : null,
        rejectionReason: !approved ? reason : null,
      },
    });

    return document;
  }

  async getSellerStats(sellerId: string) {
    const cacheKey = `seller:stats:${sellerId}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
      select: {
        totalProducts: true,
        totalOrders: true,
        totalRevenue: true,
        rating: true,
        totalReviews: true,
      },
    });

    const [pendingCommissions, availableBalance, pendingWithdrawals] = await Promise.all([
      prisma.commission.aggregate({
        where: { sellerId, status: 'PENDING' },
        _sum: { netAmount: true },
      }),
      prisma.commission.aggregate({
        where: { sellerId, status: 'SETTLED' },
        _sum: { netAmount: true },
      }),
      prisma.withdrawal.aggregate({
        where: { sellerId, status: { in: ['PENDING', 'PROCESSING'] } },
        _sum: { amount: true },
      }),
    ]);

    const stats = {
      ...seller,
      pendingCommissions: pendingCommissions._sum.netAmount || 0,
      availableBalance: availableBalance._sum.netAmount || 0,
      pendingWithdrawals: pendingWithdrawals._sum.amount || 0,
    };

    await redis.setex(cacheKey, CACHE_TTL.SELLER_STATS, JSON.stringify(stats));

    return stats;
  }

  async updateSellerStats(sellerId: string, updates: {
    productsChange?: number;
    ordersChange?: number;
    revenueChange?: number;
  }) {
    const seller = await prisma.seller.update({
      where: { id: sellerId },
      data: {
        totalProducts: updates.productsChange 
          ? { increment: updates.productsChange } 
          : undefined,
        totalOrders: updates.ordersChange 
          ? { increment: updates.ordersChange } 
          : undefined,
        totalRevenue: updates.revenueChange 
          ? { increment: updates.revenueChange } 
          : undefined,
      },
    });

    await redis.del(`seller:stats:${sellerId}`);

    return seller;
  }

  private async invalidateSellerCache(id: string, userId: string, storeSlug: string) {
    await Promise.all([
      redis.del(`seller:${id}`),
      redis.del(`seller:user:${userId}`),
      redis.del(`seller:slug:${storeSlug}`),
      redis.del(`seller:stats:${id}`),
    ]);
  }
}

export const sellerService = new SellerService();
