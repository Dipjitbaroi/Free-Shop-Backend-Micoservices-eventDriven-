/**
 * Seller Service
 * Manages seller (employee/worker) profiles and related operations
 * Sellers are internal Free Shop staff who process orders and assign deliveries
 */

import { SellerProfile, SellerStatus, SellerDepartment } from '../../generated/client/client.js';
import { BadRequestError, NotFoundError, ConflictError } from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma.js';

interface CreateSellerProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  department: SellerDepartment;
  assignedZone?: string;
  avatar?: string;
  commissionRate?: number;
  bankDetails?: any;
  workSchedule?: any;
}

interface UpdateSellerProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  department?: SellerDepartment;
  assignedZone?: string;
  commissionRate?: number;
  bankDetails?: any;
  workSchedule?: any;
}

interface UpdateSellerMetricsData {
  ordersProcessed?: number;
  assignedDeliveries?: number;
  successRate?: number;
  rating?: number;
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

    // Check if employeeId is unique
    const employeeExists = await prisma.sellerProfile.findUnique({
      where: { employeeId: data.employeeId },
    });

    if (employeeExists) {
      throw new ConflictError('Employee ID already exists');
    }

    // Check if email is unique
    const emailExists = await prisma.sellerProfile.findUnique({
      where: { email: data.email },
    });

    if (emailExists) {
      throw new ConflictError('Email already in use');
    }

    const seller = await prisma.sellerProfile.create({
      data: {
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        employeeId: data.employeeId,
        department: data.department,
        assignedZone: data.assignedZone,
        avatar: data.avatar,
        commissionRate: data.commissionRate || 5,
        bankDetails: data.bankDetails,
        workSchedule: data.workSchedule,
        status: 'ACTIVE' as SellerStatus,
        isAvailable: true,
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

  async getSellerProfileByEmployeeId(employeeId: string): Promise<SellerProfile | null> {
    const seller = await prisma.sellerProfile.findUnique({
      where: { employeeId },
    });

    return seller;
  }

  async updateSellerProfile(
    userId: string,
    data: UpdateSellerProfileData
  ): Promise<SellerProfile> {
    const updateData: any = {};
    const allowedFields = [
      'firstName', 'lastName', 'phone', 'avatar',
      'department', 'assignedZone', 'commissionRate',
      'bankDetails', 'workSchedule'
    ];

    for (const key of allowedFields) {
      if (key in data && data[key as keyof UpdateSellerProfileData] !== undefined) {
        updateData[key] = data[key as keyof UpdateSellerProfileData];
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
    filters?: { status?: SellerStatus; department?: SellerDepartment; isAvailable?: boolean }
  ): Promise<{ sellers: SellerProfile[]; total: number }> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.department) {
      where.department = filters.department;
    }

    if (filters?.isAvailable !== undefined) {
      where.isAvailable = filters.isAvailable;
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

  async getSellersByDepartment(
    department: SellerDepartment,
    status?: SellerStatus
  ): Promise<SellerProfile[]> {
    const where: any = { department };

    if (status) {
      where.status = status;
    }

    return prisma.sellerProfile.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });
  }

  async getSellersByZone(assignedZone: string): Promise<SellerProfile[]> {
    return prisma.sellerProfile.findMany({
      where: { assignedZone, status: 'ACTIVE' as SellerStatus, isAvailable: true },
      orderBy: { firstName: 'asc' },
    });
  }

  async updateSellerRating(
    userId: string,
    rating: number
  ): Promise<SellerProfile> {
    const seller = await prisma.sellerProfile.update({
      where: { userId },
      data: { rating },
    });

    return seller;
  }

  async updateSellerMetrics(
    userId: string,
    data: UpdateSellerMetricsData
  ): Promise<SellerProfile> {
    const updateData: any = {};

    if (data.ordersProcessed !== undefined) updateData.ordersProcessed = data.ordersProcessed;
    if (data.assignedDeliveries !== undefined) updateData.assignedDeliveries = data.assignedDeliveries;
    if (data.successRate !== undefined) updateData.successRate = data.successRate;
    if (data.rating !== undefined) updateData.rating = data.rating;

    const seller = await prisma.sellerProfile.update({
      where: { userId },
      data: updateData,
    });

    return seller;
  }

  async setSuspended(userId: string): Promise<SellerProfile> {
    const seller = await prisma.sellerProfile.update({
      where: { userId },
      data: { status: 'SUSPENDED' as SellerStatus },
    });

    return seller;
  }

  async setActive(userId: string): Promise<SellerProfile> {
    const seller = await prisma.sellerProfile.update({
      where: { userId },
      data: { status: 'ACTIVE' as SellerStatus },
    });

    return seller;
  }

  async setOnLeave(userId: string): Promise<SellerProfile> {
    const seller = await prisma.sellerProfile.update({
      where: { userId },
      data: { status: 'ON_LEAVE' as SellerStatus, isAvailable: false },
    });

    return seller;
  }

  async setTerminated(userId: string): Promise<SellerProfile> {
    const seller = await prisma.sellerProfile.update({
      where: { userId },
      data: { 
        status: 'TERMINATED' as SellerStatus, 
        isAvailable: false,
        terminationDate: new Date(),
      },
    });

    return seller;
  }

  async setAvailability(userId: string, isAvailable: boolean): Promise<SellerProfile> {
    const seller = await prisma.sellerProfile.update({
      where: { userId },
      data: { isAvailable },
    });

    return seller;
  }
}

export const sellerService = new SellerService();
