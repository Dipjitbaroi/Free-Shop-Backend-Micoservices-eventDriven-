import { DeliveryInfo } from '../../generated/client/client.js';
import { BadRequestError, NotFoundError } from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma.js';
import { DeliveryProvider, DeliveryStatus } from '@freeshop/shared-types';

interface IDeliveryInfoData {
  type: 'INHOUSE' | 'THIRD_PARTY';
  provider?: DeliveryProvider;
  deliveryManId?: string;
  trackingId?: string;
  apiRef?: string;
  weight?: number;
  fragile?: boolean;
  estimatedDeliveryDate?: Date;
}

class DeliveryService {
  async createDelivery(orderId: string, data: IDeliveryInfoData): Promise<DeliveryInfo> {
    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Check if delivery already exists
    const existingDelivery = await prisma.deliveryInfo.findUnique({
      where: { orderId },
    });

    if (existingDelivery) {
      throw new BadRequestError('Delivery already exists for this order');
    }

    let deliveryData: any = {
      orderId,
      weight: data.weight,
      fragile: data.fragile,
      estimatedDeliveryDate: data.estimatedDeliveryDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'PENDING',
    };

    // Handle INHOUSE delivery
    if (data.type === 'INHOUSE') {
      deliveryData = {
        ...deliveryData,
        provider: 'INHOUSE',
        deliveryManId: data.deliveryManId,
        status: 'ASSIGNED', // Auto-assign status when man is assigned
      };
    }
    // Handle THIRD_PARTY delivery
    else if (data.type === 'THIRD_PARTY') {
      deliveryData = {
        ...deliveryData,
        provider: data.provider,
        externalProvider: data.provider,
        externalTrackingId: data.trackingId,
        externalApiRef: data.apiRef,
        status: 'ASSIGNED', // Auto-assign status when provider is set
      };
    } else {
      throw new BadRequestError('Invalid delivery type');
    }

    const delivery = await prisma.deliveryInfo.create({
      data: deliveryData,
    });

    return delivery;
  }

  async getDeliveryByOrderId(orderId: string): Promise<DeliveryInfo | null> {
    const delivery = await prisma.deliveryInfo.findUnique({
      where: { orderId },
    });

    return delivery;
  }

  async getDeliveryById(deliveryId: string): Promise<DeliveryInfo | null> {
    const delivery = await prisma.deliveryInfo.findUnique({
      where: { id: deliveryId },
    });

    return delivery;
  }



  async updateDeliveryStatus(
    deliveryId: string,
    status: DeliveryStatus,
    additionalData?: Record<string, any>
  ): Promise<DeliveryInfo> {
    const data: any = { status };

    // Set timestamps based on status
    switch (status) {
      case 'PICKED_UP':
        data.pickedUpAt = new Date();
        break;
      case 'IN_TRANSIT':
        data.inTransitAt = new Date();
        break;
      case 'OUT_FOR_DELIVERY':
        data.outForDeliveryAt = new Date();
        break;
      case 'DELIVERED':
        data.actualDeliveryDate = new Date();
        break;
    }

    // Add any additional data provided
    if (additionalData) {
      Object.assign(data, additionalData);
    }

    const updated = await prisma.deliveryInfo.update({
      where: { id: deliveryId },
      data,
    });

    return updated;
  }

  async recordFailedAttempt(deliveryId: string, reason: string): Promise<DeliveryInfo> {
    const delivery = await prisma.deliveryInfo.findUnique({
      where: { id: deliveryId },
    });

    if (!delivery) {
      throw new NotFoundError('Delivery not found');
    }

    const updated = await prisma.deliveryInfo.update({
      where: { id: deliveryId },
      data: {
        failedAttempts: delivery.failedAttempts + 1,
        lastFailureReason: reason,
      },
    });

    return updated;
  }

  async getDeliveriesByDeliveryMan(
    deliveryManId: string,
    page = 1,
    limit = 20,
    filters?: { status?: string }
  ): Promise<{ deliveries: DeliveryInfo[]; total: number }> {
    const where: any = {
      deliveryManId,
      ...(filters?.status && { status: filters.status }),
    };

    const deliveries = await prisma.deliveryInfo.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            shippingAddress: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.deliveryInfo.count({ where });

    return { deliveries: deliveries as DeliveryInfo[], total };
  }

  async getDeliveriesByProvider(
    provider: DeliveryProvider,
    page = 1,
    limit = 20,
    filters?: { status?: string }
  ): Promise<{ deliveries: DeliveryInfo[]; total: number }> {
    const where: any = {
      provider,
      ...(filters?.status && { status: filters.status }),
    };

    const deliveries = await prisma.deliveryInfo.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            shippingAddress: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.deliveryInfo.count({ where });

    return { deliveries: deliveries as DeliveryInfo[], total };
  }



  async getDeliveryStats(filters?: {
    provider?: DeliveryProvider;
    startDate?: Date;
    endDate?: Date;
  }): Promise<any> {
    const where: any = {};

    if (filters?.provider) {
      where.provider = filters.provider;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const total = await prisma.deliveryInfo.count({ where });

    const byStatus = await prisma.deliveryInfo.groupBy({
      by: ['status'],
      where,
      _count: true,
    });

    const byProvider = await prisma.deliveryInfo.groupBy({
      by: ['provider'],
      where,
      _count: true,
    });

    return {
      total,
      byStatus: Object.fromEntries(byStatus.map(item => [item.status, item._count])),
      byProvider: Object.fromEntries(byProvider.map(item => [item.provider, item._count])),
    };
  }
}

export const deliveryService = new DeliveryService();
