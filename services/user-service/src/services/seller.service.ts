/**
 * Seller Service
 * Manages seller profiles and related operations
 */

import { SellerProfile } from '../../generated/prisma';
import { BadRequestError, NotFoundError, ConflictError } from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma';

interface CreateSellerProfileData {
  shopName: string;
  shopSlug: string;
  shopDescription?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

interface UpdateSellerMetricsData {
  totalOrders?: number;
  completionRate?: number;
  returnRate?: number;
  totalRevenue?: number;
}

class SellerService {
  async createSellerProfile(
    userId: string,
    data: CreateSellerProfileData
  ): Promise<SellerProfile> {
    // Check if seller already exists
    const existing = await prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictError('User already has a seller profile');
    }

    // Check if shopSlug is unique
    const slugExists = await prisma.sellerProfile.findUnique({
      where: { shopSlug: data.shopSlug },
    });

    if (slugExists) {
      throw new ConflictError('Shop slug already exists');
    }

    const seller = await prisma.sellerProfile.create({
      data: {
        userId,
        shopName: data.shopName,
        shopSlug: data.shopSlug,
        shopDescription: data.shopDescription,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        status: 'ONBOARDING',
      },
    });

    return seller;
  }

  async getSellerProfileByUserId(userId: string): Promise<SellerProfile | null> {
    const seller = await prisma.sellerProfile.findUnique({
      where: { userId },
    });

    return seller;
  }

  async getSellerProfileBySlug(shopSlug: string): Promise<SellerProfile | null> {
    const seller = await prisma.sellerProfile.findUnique({
      where: { shopSlug },
    });

    return seller;
  }

  async updateSellerProfile(
    userId: string,
    data: Partial<SellerProfile>
  ): Promise<SellerProfile> {
    // Filter out read-only fields that shouldn't be updated
    const updateData: any = {};
    const allowedFields = [
      'shopName', 'shopSlug', 'shopDescription', 'shopLogo', 'shopBanner',
      'phone', 'email', 'address', 'city', 'postalCode', 'status',
      'operatingHours', 'bankDetails', 'returnAddress', 'customFields'
    ];

    for (const key of allowedFields) {
      if (key in data && data[key as keyof SellerProfile] !== undefined) {
        updateData[key] = data[key as keyof SellerProfile];
      }
    }

    const seller = await prisma.sellerProfile.update({
      where: { userId },
      data: updateData,
    });

    return seller;
  }

  async getAllSellers(
    page = 1,
    limit = 20,
    filters?: { status?: string; isVerified?: boolean }
  ): Promise<{ sellers: SellerProfile[]; total: number }> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.isVerified !== undefined) {
      where.isVerified = filters.isVerified;
    }

    const sellers = await prisma.sellerProfile.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.sellerProfile.count({ where });

    return { sellers, total };
  }

  async verifySeller(userId: string, verified: boolean): Promise<SellerProfile> {
    const seller = await prisma.sellerProfile.update({
      where: { userId },
      data: {
        isVerified: verified,
        status: verified ? 'ACTIVE' : 'PENDING_VERIFICATION',
      },
    });

    return seller;
  }

  async updateSellerRating(
    userId: string,
    rating: number,
    ratingCount: number
  ): Promise<SellerProfile> {
    const seller = await prisma.sellerProfile.update({
      where: { userId },
      data: {
        rating,
        ratingCount,
      },
    });

    return seller;
  }

  async updateSellerMetrics(
    userId: string,
    data: UpdateSellerMetricsData
  ): Promise<SellerProfile> {
    const updateData: any = {};

    if (data.totalOrders !== undefined) updateData.totalOrders = data.totalOrders;
    if (data.completionRate !== undefined) updateData.completionRate = data.completionRate;
    if (data.returnRate !== undefined) updateData.returnRate = data.returnRate;
    if (data.totalRevenue !== undefined) updateData.totalRevenue = data.totalRevenue;

    const seller = await prisma.sellerProfile.update({
      where: { userId },
      data: updateData,
    });

    return seller;
  }

  async suspendSeller(userId: string): Promise<SellerProfile> {
    const seller = await prisma.sellerProfile.update({
      where: { userId },
      data: { status: 'SUSPENDED' },
    });

    return seller;
  }

  async activateSeller(userId: string): Promise<SellerProfile> {
    const seller = await prisma.sellerProfile.update({
      where: { userId },
      data: { status: 'ACTIVE' },
    });

    return seller;
  }
}

export const sellerService = new SellerService();
