import { DeliveryInfo } from '../../generated/client/client.js';
import { BadRequestError, NotFoundError } from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma.js';
import { DeliveryProvider, DeliveryStatus } from '@freeshop/shared-types';
import { OrderStatus } from '../../generated/client/client.js';

interface DeliveryManProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

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
  private deliveryManCache = new Map<string, DeliveryManProfile>();

  private async fetchDeliveryManProfile(deliveryManId: string): Promise<DeliveryManProfile | null> {
    if (this.deliveryManCache.has(deliveryManId)) {
      return this.deliveryManCache.get(deliveryManId) || null;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `${process.env.USER_SERVICE_URL || 'http://user-service:3002'}/users/${deliveryManId}`,
        { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        }
      );
      
      clearTimeout(timeout);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const profile = data?.data || null;
      
      if (profile) {
        const validated: DeliveryManProfile = {
          id: profile.id || deliveryManId,
          firstName: profile.firstName || undefined,
          lastName: profile.lastName || undefined,
          email: profile.email || undefined,
          phone: profile.phone || undefined,
          avatar: profile.avatar || undefined,
        };
        this.deliveryManCache.set(deliveryManId, validated);
        return validated;
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch delivery man profile for ${deliveryManId}:`, error);
      return null;
    }
  }

  /**
   * Syncs DeliveryInfo status back to Order when delivery status changes
   * This ensures bi-directional consistency
   * 
   * @param deliveryId Delivery ID
   * @param newDeliveryStatus New delivery status
   */
  private async syncDeliveryOrderStatus(deliveryId: string, newDeliveryStatus: DeliveryStatus): Promise<void> {
    try {
      const delivery = await prisma.deliveryInfo.findUnique({
        where: { id: deliveryId },
        select: { orderId: true },
      });

      if (!delivery) {
        console.warn(`Delivery not found for sync: ${deliveryId}`);
        return;
      }

      let newOrderStatus: OrderStatus | null = null;

      // Map delivery status to order status
      switch (newDeliveryStatus) {
        case 'PENDING':
          newOrderStatus = OrderStatus.PENDING;
          break;
        case 'ASSIGNED':
          newOrderStatus = OrderStatus.PROCESSING;
          break;
        case 'PICKED_UP':
          newOrderStatus = OrderStatus.PROCESSING;
          break;
        case 'IN_TRANSIT':
          newOrderStatus = OrderStatus.SHIPPED;
          break;
        case 'OUT_FOR_DELIVERY':
          newOrderStatus = OrderStatus.OUT_FOR_DELIVERY;
          break;
        case 'DELIVERED':
          newOrderStatus = OrderStatus.DELIVERED;
          break;
        case 'FAILED':
          // Failed delivery doesn't immediately change order status
          // Admin needs to take action
          break;
        case 'CANCELLED':
          newOrderStatus = OrderStatus.CANCELLED;
          break;
      }

      // Only update if status has changed
      if (newOrderStatus) {
        const currentOrder = await prisma.order.findUnique({
          where: { id: delivery.orderId },
          select: { status: true },
        });

        if (!currentOrder) {
          console.warn(`Order not found for delivery: ${delivery.orderId}`);
          return;
        }

        if (currentOrder.status !== newOrderStatus) {
          const result = await prisma.order.update({
            where: { id: delivery.orderId },
            data: { status: newOrderStatus },
          });
          console.log(`✓ Synced delivery ${deliveryId} (${newDeliveryStatus}) → Order ${delivery.orderId} status (${newOrderStatus})`);
        }
      }
    } catch (error) {
      console.error(`Failed to sync order status for delivery ${deliveryId}:`, error);
    }
  }

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

    // Sync order status when delivery is created with ASSIGNED status
    if (deliveryData.status === 'ASSIGNED') {
      await this.syncDeliveryOrderStatus(delivery.id, 'ASSIGNED' as DeliveryStatus);
    }

    return delivery;
  }

  async getDeliveryByOrderId(orderId: string): Promise<any> {
    const delivery = await prisma.deliveryInfo.findUnique({
      where: { orderId },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            subtotal: true,
            shippingFee: true,
            tax: true,
            discount: true,
            paymentStatus: true,
            paymentMethod: true,
            shippingAddress: true,
            billingAddress: true,
            items: {
              select: {
                id: true,
                productId: true,
                productName: true,
                quantity: true,
                price: true,
                vendorId: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!delivery) {
      return null;
    }

    // Enrich delivery man info if exists
    if (delivery.deliveryManId) {
      const deliveryManProfile = await this.fetchDeliveryManProfile(delivery.deliveryManId);
      return {
        ...delivery,
        deliveryMan: deliveryManProfile ? {
          id: delivery.deliveryManId,
          name: deliveryManProfile.firstName && deliveryManProfile.lastName 
            ? `${deliveryManProfile.firstName} ${deliveryManProfile.lastName}` 
            : (deliveryManProfile.firstName || deliveryManProfile.lastName || ''),
          email: deliveryManProfile.email,
          phone: deliveryManProfile.phone,
          avatar: deliveryManProfile.avatar,
        } : null,
      };
    }

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

    // Sync order status to maintain consistency
    await this.syncDeliveryOrderStatus(deliveryId, status);

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
  ): Promise<{ deliveries: any[]; total: number }> {
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
            items: {
              select: {
                id: true,
                productName: true,
                quantity: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.deliveryInfo.count({ where });

    // Enrich delivery man info for all deliveries
    const deliveryManProfile = await this.fetchDeliveryManProfile(deliveryManId);
    const enrichedDeliveries = deliveries.map(delivery => ({
      ...delivery,
      deliveryMan: deliveryManProfile ? {
        id: deliveryManId,
        name: deliveryManProfile.firstName && deliveryManProfile.lastName 
          ? `${deliveryManProfile.firstName} ${deliveryManProfile.lastName}` 
          : (deliveryManProfile.firstName || deliveryManProfile.lastName || ''),
        email: deliveryManProfile.email,
        phone: deliveryManProfile.phone,
        avatar: deliveryManProfile.avatar,
      } : null,
    }));

    return { deliveries: enrichedDeliveries, total };
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
