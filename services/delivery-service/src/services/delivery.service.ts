import {
  Delivery,
  DeliveryDispatchStatus,
  DeliveryProvider,
  DeliveryStatus,
  Prisma,
} from '../../generated/prisma';
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  createPaginatedResponse,
  calculateOffset,
  IPaginatedResult,
} from '@freeshop/shared-utils';
import { UserRole } from '@freeshop/shared-types';
import { prisma } from '../lib/prisma';

interface AuthContext {
  userId: string;
  role: string;
}

interface ListFilters {
  page?: number;
  limit?: number;
  status?: DeliveryStatus;
  provider?: DeliveryProvider;
  dispatchStatus?: DeliveryDispatchStatus;
  deliveryAgentId?: string;
  orderId?: string;
}

interface CreateFromOrderInput {
  orderId: string;
  orderNumber: string;
  userId?: string;
  shippingAddress?: Record<string, unknown>;
  provider?: DeliveryProvider;
  items: Array<{ sellerId: string }>;
}

interface DispatchUpdateInput {
  orderId: string;
  provider: DeliveryProvider;
  status: DeliveryDispatchStatus;
  note?: string;
  trackingNumber?: string;
  providerMeta?: Record<string, unknown>;
}

const DELIVERY_AGENT_ROLES = new Set(['DELIVERY', 'DELIVERY_MAN', 'DELIVERY_AGENT', 'RIDER']);

class DeliveryService {
  private normalizeSellerIds(sellerIds: string[]): string[] {
    return [...new Set(sellerIds.map((id) => String(id || '').trim()).filter(Boolean))];
  }

  private canAccess(delivery: Delivery, auth: AuthContext): boolean {
    const role = auth.role;
    if ([UserRole.ADMIN, UserRole.MANAGER].includes(role as UserRole)) return true;

    if (role === UserRole.SELLER) {
      const sellerIds = Array.isArray(delivery.sellerIds) ? (delivery.sellerIds as unknown[]).map((x) => String(x)) : [];
      return sellerIds.includes(auth.userId);
    }

    if (DELIVERY_AGENT_ROLES.has(role)) {
      return delivery.deliveryAgentId === auth.userId;
    }

    return delivery.userId === auth.userId;
  }

  private statusUpdateData(status: DeliveryStatus, note?: string): Prisma.DeliveryUpdateInput {
    const now = new Date();
    const data: Prisma.DeliveryUpdateInput = {
      status,
      statusNote: note,
    };

    if (status === DeliveryStatus.PICKED_UP) data.pickedUpAt = now;
    if (status === DeliveryStatus.OUT_FOR_DELIVERY) data.outForDeliveryAt = now;
    if (status === DeliveryStatus.DELIVERED) data.deliveredAt = now;
    if (status === DeliveryStatus.DELIVERY_FAILED) data.failedAt = now;
    if (status === DeliveryStatus.CANCELLED) data.cancelledAt = now;

    return data;
  }

  async createFromOrder(input: CreateFromOrderInput): Promise<void> {
    const sellerIds = this.normalizeSellerIds(input.items.map((i) => i.sellerId));
    const provider = input.provider || DeliveryProvider.STEADFAST;

    await prisma.delivery.upsert({
      where: { orderId: input.orderId },
      update: {
        orderNumber: input.orderNumber,
        userId: input.userId,
        sellerIds,
        provider,
        shippingAddress: (input.shippingAddress || {}) as Prisma.InputJsonValue,
      },
      create: {
        orderId: input.orderId,
        orderNumber: input.orderNumber,
        userId: input.userId,
        sellerIds,
        provider,
        dispatchStatus: DeliveryDispatchStatus.PENDING,
        status: DeliveryStatus.PENDING_ASSIGNMENT,
        shippingAddress: (input.shippingAddress || {}) as Prisma.InputJsonValue,
      },
    });
  }

  async updateDispatchStatus(input: DispatchUpdateInput): Promise<void> {
    const found = await prisma.delivery.findUnique({ where: { orderId: input.orderId } });
    if (!found) return;

    await prisma.delivery.update({
      where: { orderId: input.orderId },
      data: {
        provider: input.provider,
        dispatchStatus: input.status,
        dispatchNote: input.note,
        dispatchedAt: input.status === DeliveryDispatchStatus.DISPATCHED ? new Date() : found.dispatchedAt,
        trackingNumber: input.trackingNumber || found.trackingNumber,
        carrier: input.provider,
        providerMeta: input.providerMeta as Prisma.InputJsonValue,
      },
    });
  }

  async getById(id: string, auth: AuthContext): Promise<Delivery> {
    const delivery = await prisma.delivery.findUnique({ where: { id } });
    if (!delivery) throw new NotFoundError('Delivery not found');
    if (!this.canAccess(delivery, auth)) throw new ForbiddenError('You are not allowed to view this delivery');
    return delivery;
  }

  async getByOrderId(orderId: string, auth: AuthContext): Promise<Delivery> {
    const delivery = await prisma.delivery.findUnique({ where: { orderId } });
    if (!delivery) throw new NotFoundError('Delivery not found');
    if (!this.canAccess(delivery, auth)) throw new ForbiddenError('You are not allowed to view this delivery');
    return delivery;
  }

  async list(filters: ListFilters, auth: AuthContext): Promise<IPaginatedResult<Delivery>> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;

    const where: Prisma.DeliveryWhereInput = {};

    if (filters.status) where.status = filters.status;
    if (filters.provider) where.provider = filters.provider;
    if (filters.dispatchStatus) where.dispatchStatus = filters.dispatchStatus;
    if (filters.deliveryAgentId) where.deliveryAgentId = filters.deliveryAgentId;
    if (filters.orderId) where.orderId = filters.orderId;

    const role = auth.role;
    if ([UserRole.ADMIN, UserRole.MANAGER].includes(role as UserRole)) {
      // no extra restrictions
    } else if (role === UserRole.SELLER) {
      where.sellerIds = { array_contains: [auth.userId] };
    } else if (DELIVERY_AGENT_ROLES.has(role)) {
      where.deliveryAgentId = auth.userId;
    } else {
      where.userId = auth.userId;
    }

    const [items, total] = await Promise.all([
      prisma.delivery.findMany({
        where,
        skip: calculateOffset(page, limit),
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.delivery.count({ where }),
    ]);

    return createPaginatedResponse(items, total, page, limit);
  }

  async assignAgent(id: string, input: { deliveryAgentId: string; deliveryAgentName?: string }): Promise<Delivery> {
    const delivery = await prisma.delivery.findUnique({ where: { id } });
    if (!delivery) throw new NotFoundError('Delivery not found');

    return prisma.delivery.update({
      where: { id },
      data: {
        deliveryAgentId: input.deliveryAgentId,
        deliveryAgentName: input.deliveryAgentName,
        status: DeliveryStatus.ASSIGNED,
        assignedAt: new Date(),
      },
    });
  }

  async updateStatus(id: string, status: DeliveryStatus, auth: AuthContext, note?: string): Promise<Delivery> {
    const delivery = await prisma.delivery.findUnique({ where: { id } });
    if (!delivery) throw new NotFoundError('Delivery not found');

    const role = auth.role;
    const canAdminManage = [UserRole.ADMIN, UserRole.MANAGER].includes(role as UserRole);
    const canSellerManage = role === UserRole.SELLER && (delivery.sellerIds as unknown[]).map((x) => String(x)).includes(auth.userId);
    const canAgentManage = DELIVERY_AGENT_ROLES.has(role) && delivery.deliveryAgentId === auth.userId;

    if (!canAdminManage && !canSellerManage && !canAgentManage) {
      throw new ForbiddenError('You are not allowed to update this delivery');
    }

    if (canAgentManage && status === DeliveryStatus.CANCELLED) {
      throw new ForbiddenError('Delivery agent cannot cancel a delivery');
    }

    if (delivery.status === DeliveryStatus.DELIVERED) {
      throw new BadRequestError('Delivered orders cannot be changed');
    }

    return prisma.delivery.update({
      where: { id },
      data: this.statusUpdateData(status, note),
    });
  }

  async updateProvider(id: string, input: {
    provider: DeliveryProvider;
    dispatchStatus?: DeliveryDispatchStatus;
    trackingNumber?: string;
    dispatchNote?: string;
  }): Promise<Delivery> {
    const delivery = await prisma.delivery.findUnique({ where: { id } });
    if (!delivery) throw new NotFoundError('Delivery not found');

    return prisma.delivery.update({
      where: { id },
      data: {
        provider: input.provider,
        dispatchStatus: input.dispatchStatus || delivery.dispatchStatus,
        trackingNumber: input.trackingNumber || delivery.trackingNumber,
        dispatchNote: input.dispatchNote,
        carrier: input.provider,
      },
    });
  }
}

export const deliveryService = new DeliveryService();
