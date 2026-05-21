import { prisma } from '../lib/prisma.js';
import { redis, CACHE_TTL } from '../lib/redis.js';
import { messageBroker } from '../lib/message-broker.js';
import { EXCHANGES, getRoutingKey } from '@freeshop/shared-events';
import { Prisma, VendorStatus, VerificationStatus } from '../../generated/client/client.js';
import { config } from '../config/index.js';
import { createServiceLogger, ConflictError, NotFoundError } from '@freeshop/shared-utils';

const logger = createServiceLogger('vendor-service');

interface createVendorInput {
  userId: string;
  storeName: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  businessAddress?: Record<string, unknown>;
}

interface updateVendorInput {
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

interface VendorFilters {
  status?: VendorStatus;
  verificationStatus?: VerificationStatus;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

class VendorService {
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
      const existing = await prisma.vendor.findFirst({
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

  async createVendor(input: createVendorInput) {
    const existingVendor = await prisma.vendor.findUnique({
      where: { userId: input.userId },
    });

    if (existingVendor) {
      throw new ConflictError('User already has a vendor account');
    }

    const baseSlug = this.generateSlug(input.storeName);
    const storeSlug = await this.ensureUniqueSlug(baseSlug);

    const vendor = await prisma.vendor.create({
      data: {
        userId: input.userId,
        storeName: input.storeName,
        storeSlug,
        description: input.description,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        status: 'PENDING',
        verificationStatus: 'PENDING',
        businessAddress: input.businessAddress as Prisma.InputJsonValue,
      },
    });

    void messageBroker.publish(
      EXCHANGES.VENDOR,
      getRoutingKey('Vendor', 'CREATED'),
      {
        vendorId: vendor.id,
        userId: vendor.userId,
        storeName: vendor.storeName,
        storeSlug: vendor.storeSlug,
      }
    ).catch((error) => {
      logger.error('Failed to publish vendor created event', {
        error: error instanceof Error ? error.message : 'Unknown error',
        vendorId: vendor.id,
      });
    });

    return vendor;
  }

  async deleteVendorRequest(userId: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        storeSlug: true,
        status: true,
        verificationStatus: true,
      },
    });

    if (!vendor) {
      throw new NotFoundError('vendor request not found');
    }

    if (vendor.status === 'ACTIVE' || vendor.verificationStatus === 'VERIFIED') {
      throw new ConflictError('Approved vendor accounts cannot be deleted from this endpoint');
    }

    await prisma.vendor.delete({
      where: { id: vendor.id },
    });

    await this.invalidateVendorCache(vendor.id, vendor.userId, vendor.storeSlug);

    return {
      deleted: true,
      vendorId: vendor.id,
      userId: vendor.userId,
    };
  }

  async getVendorById(id: string) {
    const cacheKey = `vendor:${id}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        documents: true,
      },
    });

    if (vendor) {
      await redis.setex(cacheKey, CACHE_TTL.Vendor_PROFILE, JSON.stringify(vendor));
    }

    return vendor;
  }

  async getVendorByUserId(userId: string) {
    const cacheKey = `vendor:user:${userId}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      include: {
        documents: true,
      },
    });

    if (vendor) {
      await redis.setex(cacheKey, CACHE_TTL.Vendor_PROFILE, JSON.stringify(vendor));
    }

    return vendor;
  }

  async getVendorBySlug(slug: string) {
    const cacheKey = `vendor:slug:${slug}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const vendor = await prisma.vendor.findUnique({
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

    if (vendor) {
      await redis.setex(cacheKey, CACHE_TTL.Vendor_PROFILE, JSON.stringify(vendor));
    }

    return vendor;
  }

  async updateVendor(id: string, input: updateVendorInput) {
    const vendor = await prisma.vendor.findUnique({ where: { id } });
    if (!vendor) {
      throw new NotFoundError('vendor not found');
    }

    let storeSlug = vendor.storeSlug;
    if (input.storeName && input.storeName !== vendor.storeName) {
      const baseSlug = this.generateSlug(input.storeName);
      storeSlug = await this.ensureUniqueSlug(baseSlug, id);
    }

    const updated = await prisma.vendor.update({
      where: { id },
      data: {
        ...input,
        storeSlug,
        businessAddress: input.businessAddress as Prisma.InputJsonValue,
        bankDetails: input.bankDetails as Prisma.InputJsonValue,
        mobileWallet: input.mobileWallet as Prisma.InputJsonValue,
      },
    });

    await this.invalidateVendorCache(id, vendor.userId, vendor.storeSlug);
    if (storeSlug !== vendor.storeSlug) {
      await redis.del(`vendor:slug:${storeSlug}`);
    }

    await messageBroker.publish(
      EXCHANGES.VENDOR,
      getRoutingKey('Vendor', 'UPDATED'),
      {
        vendorId: updated.id,
        userId: updated.userId,
        storeName: updated.storeName,
        storeSlug: updated.storeSlug,
      }
    );

    return updated;
  }

  async updateVendorStatus(id: string, status: VendorStatus, reason?: string) {
    const vendor = await prisma.vendor.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === 'SUSPENDED' || status === 'BANNED' ? reason : null,
      },
    });

    await this.invalidateVendorCache(id, vendor.userId, vendor.storeSlug);

    await messageBroker.publish(
      EXCHANGES.VENDOR,
      getRoutingKey('Vendor', 'STATUS_CHANGED'),
      {
        vendorId: vendor.id,
        userId: vendor.userId,
        status,
        reason,
      }
    );

    return vendor;
  }

  async verifyVendor(id: string, approved: boolean, reason?: string) {
    const vendor = await prisma.vendor.update({
      where: { id },
      data: {
        verificationStatus: approved ? 'VERIFIED' : 'REJECTED',
        verifiedAt: approved ? new Date() : null,
        rejectionReason: !approved ? reason : null,
        status: approved ? 'ACTIVE' : 'PENDING',
      },
    });

    await this.invalidateVendorCache(id, vendor.userId, vendor.storeSlug);

    await messageBroker.publish(
      EXCHANGES.VENDOR,
      getRoutingKey('Vendor', 'VERIFIED'),
      {
        vendorId: vendor.id,
        userId: vendor.userId,
        verified: approved,
        reason,
      }
    );

    return vendor;
  }

  private async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    const serviceToken = process.env.SERVICE_AUTH_TOKEN;
    if (!serviceToken) {
      return null;
    }

    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';

    try {
      const response = await fetch(`${authServiceUrl}/internal/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${serviceToken}`,
          'X-Service-Call': 'true',
        },
      });

      if (!response.ok) {
        return null;
      }

      const payload = await response.json() as { data?: UserProfile };
      const user = payload.data;

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      };
    } catch (error) {
      logger.error('Failed to fetch user profile for vendor list', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  async listVendors(filters: VendorFilters) {
    const {
      status,
      verificationStatus,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const where: Prisma.VendorWhereInput = {};

    if (status) where.status = status;
    if (verificationStatus) where.verificationStatus = verificationStatus;
    if (search) {
      where.OR = [
        { storeName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { contactEmail: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
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
      prisma.vendor.count({ where }),
    ]);

    const userIds = [...new Set(vendors.map((vendor) => vendor.userId))];
    const userProfiles = new Map<string, UserProfile | null>();

    await Promise.all(
      userIds.map(async (userId) => {
        userProfiles.set(userId, await this.fetchUserProfile(userId));
      })
    );

    return {
      Vendors: vendors.map((vendor) => ({
        ...vendor,
        user: userProfiles.get(vendor.userId) || null,
      })),
      vendors: vendors.map((vendor) => ({
        ...vendor,
        user: userProfiles.get(vendor.userId) || null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async addDocument(vendorId: string, type: string, documentUrl: string) {
    const document = await prisma.vendorDocument.create({
      data: {
        vendorId,
        type: type as any,
        documentUrl,
      },
    });

    await prisma.vendor.update({
      where: { id: vendorId },
      data: { verificationStatus: 'PENDING' },
    });

    return document;
  }

  async verifyDocument(documentId: string, approved: boolean, reason?: string) {
    const document = await prisma.vendorDocument.update({
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

  async getVendorStats(vendorId: string) {
    const cacheKey = `vendor:stats:${vendorId}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      select: {
        totalProducts: true,
        totalOrders: true,
        totalRevenue: true,
        rating: true,
        totalReviews: true,
      },
    });

    const stats = { ...vendor };

    await redis.setex(cacheKey, CACHE_TTL.Vendor_STATS, JSON.stringify(stats));

    return stats;
  }

  async updateVendorStats(vendorId: string, updates: {
    productsChange?: number;
    ordersChange?: number;
    revenueChange?: number;
  }) {
    const vendor = await prisma.vendor.update({
      where: { id: vendorId },
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

    await redis.del(`vendor:stats:${vendorId}`);

    return vendor;
  }

  private async invalidateVendorCache(id: string, userId: string, storeSlug: string) {
    await Promise.all([
      redis.del(`vendor:${id}`),
      redis.del(`vendor:user:${userId}`),
      redis.del(`vendor:slug:${storeSlug}`),
      redis.del(`vendor:stats:${id}`),
    ]);
  }
}

export const vendorService = new VendorService();

