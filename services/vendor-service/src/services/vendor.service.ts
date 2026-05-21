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

  async deleteVendor(id: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        storeSlug: true,
      },
    });

    if (!vendor) {
      throw new NotFoundError('vendor not found');
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

  async getVendorById(id: string): Promise<any> {
    const cacheKey = `vendor:${id}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      const vendor = JSON.parse(cached) as any;

      // If vendor has userId but no user data (or user is null), try to fetch user again
      if (vendor.userId && (!vendor.user || vendor.user === null)) {
        const hydratedVendor = await this.hydrateVendorWithUser(vendor as { userId: string });

        if (hydratedVendor) {
          await redis.setex(cacheKey, CACHE_TTL.Vendor_PROFILE, JSON.stringify(hydratedVendor));
        }

        return hydratedVendor;
      }

      return vendor;
    }

    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        documents: true,
      },
    });

    const hydratedVendor = await this.hydrateVendorWithUser(vendor) as any;

    if (hydratedVendor) {
      await redis.setex(cacheKey, CACHE_TTL.Vendor_PROFILE, JSON.stringify(hydratedVendor));
    }

    return hydratedVendor;
  }

  async getVendorByUserId(userId: string): Promise<any> {
    const cacheKey = `vendor:user:${userId}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      const vendor = JSON.parse(cached) as any;

      // If vendor has userId but no user data (or user is null), try to fetch user again
      if (vendor.userId && (!vendor.user || vendor.user === null)) {
        const hydratedVendor = await this.hydrateVendorWithUser(vendor as { userId: string });

        if (hydratedVendor) {
          await redis.setex(cacheKey, CACHE_TTL.Vendor_PROFILE, JSON.stringify(hydratedVendor));
        }

        return hydratedVendor;
      }

      return vendor;
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      include: {
        documents: true,
      },
    });

    const hydratedVendor = await this.hydrateVendorWithUser(vendor) as any;

    if (hydratedVendor) {
      await redis.setex(cacheKey, CACHE_TTL.Vendor_PROFILE, JSON.stringify(hydratedVendor));
    }

    return hydratedVendor;
  }

  async getVendorBySlug(slug: string): Promise<any> {
    const cacheKey = `vendor:slug:${slug}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      const vendor = JSON.parse(cached) as any;

      // If vendor has userId but no user data (or user is null), try to fetch user again
      if (vendor.userId && (!vendor.user || vendor.user === null)) {
        const hydratedVendor = await this.hydrateVendorWithUser(vendor as { userId: string });

        if (hydratedVendor) {
          await redis.setex(cacheKey, CACHE_TTL.Vendor_PROFILE, JSON.stringify(hydratedVendor));
        }

        return hydratedVendor;
      }

      return vendor;
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

    const hydratedVendor = await this.hydrateVendorWithUser(vendor) as any;

    if (hydratedVendor) {
      await redis.setex(cacheKey, CACHE_TTL.Vendor_PROFILE, JSON.stringify(hydratedVendor));
    }

    return hydratedVendor;
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

    // If approved, update user role to VENDOR via internal auth-service API
    if (approved) {
      try {
        const serviceToken = process.env.SERVICE_AUTH_TOKEN;
        if (!serviceToken) {
          logger.warn('SERVICE_AUTH_TOKEN not configured, cannot update user role', { vendorId: id, userId: vendor.userId });
        } else {
          const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
          const response = await fetch(`${authServiceUrl}/internal/users/${vendor.userId}/role`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${serviceToken}`,
              'X-Service-Call': 'true',
            },
            body: JSON.stringify({
              roleName: 'VENDOR',
              assignedBy: 'SYSTEM_VENDOR_VERIFIED',
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            logger.error('Failed to update user role after vendor approval', {
              vendorId: id,
              userId: vendor.userId,
              status: response.status,
              body: errorText,
            });
          } else {
            const result = await response.json();
            logger.info('User role successfully updated to VENDOR', {
              vendorId: id,
              userId: vendor.userId,
              result,
            });
          }
        }
      } catch (error) {
        logger.error('Exception while updating user role after vendor approval', {
          vendorId: id,
          userId: vendor.userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Fetch user email for event payload
    let userEmail: string | undefined;
    try {
      const userProfile = await this.fetchUserProfile(vendor.userId);
      userEmail = userProfile?.email;
    } catch (error) {
      logger.warn('Failed to fetch user email for event payload', {
        vendorId: id,
        userId: vendor.userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // Publish event with enhanced payload
    await messageBroker.publish(
      EXCHANGES.VENDOR,
      getRoutingKey('Vendor', 'VERIFIED'),
      {
        vendorId: vendor.id,
        userId: vendor.userId,
        storeName: vendor.storeName,
        email: userEmail,
        verified: approved,
        reason,
      }
    );

    return vendor;
  }

  private async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    const serviceToken = process.env.SERVICE_AUTH_TOKEN;
    if (!serviceToken) {
      logger.warn('SERVICE_AUTH_TOKEN not configured, cannot fetch user profile', { userId });
      return null;
    }

    const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:3002';

    try {
      logger.debug('Fetching user profile', { userId, userServiceUrl });
      const response = await fetch(`${userServiceUrl}/internal/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${serviceToken}`,
          'X-Service-Call': 'true',
        },
      });

      logger.debug('User profile fetch response', { userId, status: response.status, ok: response.ok });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Failed to fetch user profile - non-ok response', {
          userId,
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        return null;
      }

      const payload = await response.json() as { data?: UserProfile };
      const user = payload.data;

      if (!user) {
        logger.warn('User profile response data is empty', { userId, payload });
        return null;
      }

      logger.debug('User profile fetched successfully', { userId, user });

      return {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      };
    } catch (error) {
      logger.error('Failed to fetch user profile for vendor', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  private async hydrateVendorWithUser<T extends { userId: string }>(vendor: T | null): Promise<(T & { user: UserProfile | null }) | null> {
    if (!vendor) {
      return null;
    }

    return {
      ...vendor,
      user: await this.fetchUserProfile(vendor.userId),
    };
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

