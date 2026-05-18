import { DeliveryInfo } from '../../generated/client/client.js';
import { BadRequestError, NotFoundError, ServiceUnavailableError, createServiceLogger } from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma.js';
import { DeliveryProvider, DeliveryStatus } from '@freeshop/shared-types';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../../generated/client/client.js';
import { completeCODPayment } from '../lib/payment-client.js';
import { steadfastClient } from '../lib/steadfast-client.js';

const logger = createServiceLogger('delivery-service');

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

interface SteadfastWebhookPayload {
  consignment_id?: string | number;
  invoice?: string;
  tracking_code?: string;
  status?: string;
  cod_amount?: number | string;
  note?: string | null;
  updated_at?: string;
  [key: string]: unknown;
}

interface SteadfastWebhookResult {
  matched: boolean;
  deliveryId?: string;
  orderId?: string;
  internalStatus?: DeliveryStatus;
}

class DeliveryService {
  private deliveryManCache = new Map<string, DeliveryManProfile>();

  private normalizeText(value: unknown): string {
    if (typeof value === 'string') {
      return value.trim();
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value).trim();
    }

    return '';
  }

  private getShippingAddressValue(address: Record<string, unknown> | null | undefined, keys: string[]): string {
    if (!address) {
      return '';
    }

    for (const key of keys) {
      const value = this.normalizeText(address[key]);
      if (value) {
        return value;
      }
    }

    return '';
  }

  private formatSteadfastAddress(address: Record<string, unknown> | null | undefined): string {
    if (!address) {
      return 'No address provided';
    }

    const parts = [
      this.getShippingAddressValue(address, ['addressLine1', 'addressLine', 'street', 'house', 'road']),
      this.getShippingAddressValue(address, ['addressLine2', 'area', 'locality', 'thana', 'upazila']),
      this.getShippingAddressValue(address, ['district', 'city']),
      this.getShippingAddressValue(address, ['state', 'division']),
      this.getShippingAddressValue(address, ['postalCode', 'postcode', 'zip']),
    ].filter(Boolean);

    if (parts.length > 0) {
      return parts.join(', ');
    }

    const fallback = this.normalizeText(address.fullAddress || address.address || address.location || address.note);
    return fallback || 'No address provided';
  }

  private getSteadfastRecipientName(order: any): string {
    const shippingAddress = (order.shippingAddress || {}) as Record<string, unknown>;
    const name = this.getShippingAddressValue(shippingAddress, ['name', 'fullName', 'full_name', 'recipientName']);
    if (name) {
      return name;
    }

    const firstName = this.getShippingAddressValue(shippingAddress, ['firstName', 'first_name']);
    const lastName = this.getShippingAddressValue(shippingAddress, ['lastName', 'last_name']);
    const combined = `${firstName} ${lastName}`.trim();
    if (combined) {
      return combined;
    }

    if (order.guestEmail) {
      return order.guestEmail;
    }

    return 'Customer';
  }

  private getSteadfastRecipientPhone(order: any): string {
    const shippingAddress = (order.shippingAddress || {}) as Record<string, unknown>;
    const phone = this.getShippingAddressValue(shippingAddress, ['phone', 'mobile', 'phoneNumber', 'recipientPhone']);
    return phone || this.normalizeText(order.guestPhone) || '0000000000';
  }

  private getSteadfastCodAmount(order: any): number {
    if (order.paymentMethod === PaymentMethod.COD) {
      return Number(order.total || 0);
    }

    return 0;
  }

  private getSteadfastOrderNote(order: any): string | null {
    const note = this.normalizeText(order.customerNote || order.sellerNote || order.adminNote);
    return note || null;
  }

  private buildSteadfastPayload(order: any) {
    const shippingAddress = (order.shippingAddress || {}) as Record<string, unknown>;

    return {
      invoice: order.orderNumber,
      recipient_name: this.getSteadfastRecipientName(order),
      recipient_phone: this.getSteadfastRecipientPhone(order),
      recipient_address: this.formatSteadfastAddress(shippingAddress),
      cod_amount: this.getSteadfastCodAmount(order),
      note: this.getSteadfastOrderNote(order),
    };
  }

  private normalizeSteadfastStatus(status: string): string {
    const normalized = status.trim().toLowerCase();

    switch (normalized) {
      case 'delivered':
        return 'DELIVERED';
      case 'in_transit':
        return 'IN_TRANSIT';
      case 'out_for_delivery':
        return 'OUT_FOR_DELIVERY';
      case 'pending':
      case 'in_review':
      case 'hold':
        return 'ASSIGNED';
      case 'failed':
      case 'cancelled':
      case 'returned':
        return 'FAILED';
      case 'delivered_approval_pending':
      case 'partial_delivered':
      case 'partial_delivered_approval_pending':
        return 'OUT_FOR_DELIVERY';
      case 'cancelled_approval_pending':
      case 'unknown_approval_pending':
      case 'unknown':
      default:
        return 'ASSIGNED';
    }
  }

  private async completeCODPaymentOnDelivery(orderId: string): Promise<void> {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          total: true,
          paymentMethod: true,
          paymentStatus: true,
        },
      });

      if (!order) {
        console.warn(`Order not found while completing COD payment for delivery: ${orderId}`);
        return;
      }

      if (order.paymentMethod !== PaymentMethod.COD) {
        return;
      }

      if (order.paymentStatus === PaymentStatus.PAID) {
        return;
      }

      const paymentResult = await completeCODPayment(order.id, Number(order.total));

      if (!paymentResult.success) {
        console.error(
          `Failed to complete COD payment for delivered order ${order.id}: ${paymentResult.error || 'Unknown error'}`
        );
        return;
      }

      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.PAID,
          paidAt: new Date(),
        },
      });

      console.log(`✓ COD payment marked as PAID for delivered order ${order.id}`);
    } catch (error) {
      console.error(`Failed COD payment sync for delivered order ${orderId}:`, error);
    }
  }

  private async fetchDeliveryManProfile(deliveryManId: string): Promise<DeliveryManProfile | null> {
    // Check cache, but skip if profile is incomplete (null firstName/lastName)
    if (this.deliveryManCache.has(deliveryManId)) {
      const cached = this.deliveryManCache.get(deliveryManId);
      if (cached && (cached.firstName || cached.lastName)) {
        return cached; // Return only if profile has complete names
      }
      // If cached profile is incomplete, skip it and refetch from server
    }

    try {
      const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:3002';
      const serviceToken = process.env.SERVICE_AUTH_TOKEN;
      
      if (!serviceToken) {
        console.warn(`⚠ SERVICE_AUTH_TOKEN not configured, cannot fetch delivery man profile`);
        return null;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `${userServiceUrl}/internal/profile/${deliveryManId}`,
        { 
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceToken}`,
            'X-Service-Call': 'true',
          },
          signal: controller.signal,
        }
      );
      
      clearTimeout(timeout);

      if (!response.ok) {
        console.warn(`⚠ Failed to fetch profile: ${response.statusText}`);
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
        console.log(`✓ Cached delivery man profile for ${deliveryManId}`);
        return validated;
      }
      console.warn(`⚠ No profile data in response for delivery man ${deliveryManId}`);
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
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    const existingDelivery = await prisma.deliveryInfo.findUnique({
      where: { orderId },
    });

    if (existingDelivery) {
      throw new BadRequestError('Delivery already exists for this order');
    }

    const baseDeliveryData: any = {
      orderId,
      weight: data.weight,
      fragile: data.fragile,
      estimatedDeliveryDate: data.estimatedDeliveryDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };

    if (data.type === 'INHOUSE') {
      const delivery = await prisma.deliveryInfo.create({
        data: {
          ...baseDeliveryData,
          status: 'ASSIGNED',
          provider: 'INHOUSE',
          deliveryManId: data.deliveryManId,
          carrier: 'INHOUSE',
        },
      });

      await this.syncDeliveryOrderStatus(delivery.id, 'ASSIGNED' as DeliveryStatus);
      return delivery;
    }

    if (data.type === 'THIRD_PARTY') {
      if (data.provider === 'STEADFAST') {
        const draftDelivery = await prisma.deliveryInfo.create({
          data: {
            ...baseDeliveryData,
            status: 'PENDING',
            provider: 'STEADFAST',
            externalProvider: 'STEADFAST',
            carrier: 'STEADFAST',
          },
        });

        try {
          const payload = this.buildSteadfastPayload(order);
          logger.info('Creating Steadfast delivery', {
            orderId,
            orderNumber: order.orderNumber,
            provider: data.provider,
            payload,
          });

          const steadfastResponse = await steadfastClient.placeOrder(payload);
          const responseData = steadfastResponse as any;
          const consignment = responseData.consignment || responseData.data?.consignment || responseData.result?.consignment || responseData;
          const trackingCode = consignment?.tracking_code?.toString?.() || responseData.tracking_code?.toString?.() || '';
          const consignmentId = consignment?.consignment_id?.toString?.() || responseData.consignment_id?.toString?.() || '';

          if (!trackingCode && !consignmentId) {
            throw new ServiceUnavailableError('Steadfast booking succeeded but did not return tracking details', {
              response: steadfastResponse,
            });
          }

          const updatedDelivery = await prisma.deliveryInfo.update({
            where: { id: draftDelivery.id },
            data: {
              status: 'ASSIGNED',  // ✓ Assigned to Steadfast - booking confirmed
              externalTrackingId: trackingCode || null,
              externalApiRef: consignmentId || null,
              trackingNumber: trackingCode || null,
              carrier: 'STEADFAST',
              notes: this.normalizeText(consignment?.note) || draftDelivery.notes,
            },
          });

          console.log(`✓ Steadfast booking successful: Consignment ID=${consignmentId}, Tracking Code=${trackingCode}`);
          return updatedDelivery;
        } catch (error) {
          logger.error('Steadfast delivery booking failed', error, {
            orderId,
            orderNumber: order.orderNumber,
            provider: data.provider,
            payload: this.buildSteadfastPayload(order),
          });
          await prisma.deliveryInfo.delete({ where: { id: draftDelivery.id } }).catch(() => undefined);
          throw error;
        }
      }

      const delivery = await prisma.deliveryInfo.create({
        data: {
          ...baseDeliveryData,
          provider: data.provider,
          externalProvider: data.provider,
          externalTrackingId: data.trackingId,
          externalApiRef: data.apiRef,
          trackingNumber: data.trackingId,
          carrier: data.provider,
          status: 'ASSIGNED',
        },
      });

      await this.syncDeliveryOrderStatus(delivery.id, 'ASSIGNED' as DeliveryStatus);
      return delivery;
    }

    throw new BadRequestError('Invalid delivery type');
  }

  async handleSteadfastWebhook(payload: SteadfastWebhookPayload): Promise<SteadfastWebhookResult> {
    const consignmentId = this.normalizeText(payload.consignment_id);
    const trackingCode = this.normalizeText(payload.tracking_code);
    const invoice = this.normalizeText(payload.invoice);
    const rawStatus = this.normalizeText(payload.status);

    if (!consignmentId && !trackingCode && !invoice) {
      throw new BadRequestError('Steadfast webhook requires consignment_id, tracking_code, or invoice');
    }

    const delivery = await prisma.deliveryInfo.findFirst({
      where: {
        provider: 'STEADFAST',
        OR: [
          ...(consignmentId ? [{ externalApiRef: consignmentId }] : []),
          ...(trackingCode ? [{ externalTrackingId: trackingCode }] : []),
          ...(invoice ? [{ order: { orderNumber: invoice } }] : []),
        ],
      },
    });

    if (!delivery) {
      console.warn(`⚠ Webhook unmatched: No delivery found for consignment_id=${consignmentId}, tracking_code=${trackingCode}, invoice=${invoice}`);
      return { matched: false };
    }
    
    console.log(`✓ Webhook matched: Delivery ID=${delivery.id}, Order ID=${delivery.orderId}`);

    const internalStatus: any = rawStatus ? this.normalizeSteadfastStatus(rawStatus) : delivery.status;
    const updateData: Record<string, unknown> = {};

    if (consignmentId && !delivery.externalApiRef) {
      updateData.externalApiRef = consignmentId;
    }

    if (trackingCode && !delivery.externalTrackingId) {
      updateData.externalTrackingId = trackingCode;
      updateData.trackingNumber = trackingCode;
    }

    if (rawStatus) {
      updateData.status = internalStatus;
      
      // Update timestamp based on status
      switch (internalStatus) {
        case 'PICKED_UP':
          updateData.pickedUpAt = new Date();
          break;
        case 'IN_TRANSIT':
          updateData.inTransitAt = new Date();
          break;
        case 'OUT_FOR_DELIVERY':
          updateData.outForDeliveryAt = new Date();
          break;
        case 'DELIVERED':
          updateData.actualDeliveryDate = new Date();
          break;
      }
      
      if (this.normalizeText(payload.note)) {
        updateData.notes = this.normalizeText(payload.note);
      }
      
      // Log webhook processing
      console.log(`✓ Webhook: Delivery ${delivery.id} status updated to ${internalStatus}`);
    } else {
      console.warn(`⚠ Webhook received but no status change for delivery ${delivery.id}`);
    }

    const updatedDelivery = Object.keys(updateData).length > 0
      ? await prisma.deliveryInfo.update({
          where: { id: delivery.id },
          data: updateData,
        })
      : delivery;

    if (rawStatus && internalStatus !== delivery.status) {
      await this.syncDeliveryOrderStatus(updatedDelivery.id, internalStatus);
      
      // Auto-complete COD payment if delivery is marked as DELIVERED
      if (internalStatus === 'DELIVERED') {
        await this.completeCODPaymentOnDelivery(updatedDelivery.orderId);
      }
    }

    return {
      matched: true,
      deliveryId: updatedDelivery.id,
      orderId: updatedDelivery.orderId,
      internalStatus,
    };
  }

  async getDeliveryByOrderId(orderId: string, search?: string): Promise<any> {
    // Build where clause — allow optional `search` to match order number, tracking id, or delivery id
    const where: any = { orderId };
    if (search) {
      where.AND = [
        {
          OR: [
            { externalTrackingId: { contains: search, mode: 'insensitive' } },
            { id: { contains: search, mode: 'insensitive' } },
            { order: { orderNumber: { contains: search, mode: 'insensitive' } } },
          ],
        },
      ];
    }

    const delivery = await prisma.deliveryInfo.findFirst({
      where,
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
    let deliveryMan = null;
    if (delivery.deliveryManId) {
      try {
        const deliveryManProfile = await this.fetchDeliveryManProfile(delivery.deliveryManId);
        if (deliveryManProfile) {
          deliveryMan = {
            id: delivery.deliveryManId,
            name: deliveryManProfile.firstName && deliveryManProfile.lastName
              ? `${deliveryManProfile.firstName} ${deliveryManProfile.lastName}`
              : (deliveryManProfile.firstName || deliveryManProfile.lastName || ''),
            email: deliveryManProfile.email,
            phone: deliveryManProfile.phone,
            avatar: deliveryManProfile.avatar,
          };
        }
      } catch (error) {
        console.error(`Failed to enrich delivery man: ${error}`);
      }
    }

    return {
      id: delivery.id,
      orderId: delivery.orderId,
      status: delivery.status,
      deliveryManId: delivery.deliveryManId,
      deliveryMan,
      order: delivery.order,
      provider: delivery.provider,
      carrier: delivery.carrier,
      trackingId: delivery.externalTrackingId,
      externalTrackingId: delivery.externalTrackingId,
      externalApiRef: delivery.externalApiRef,
      trackingNumber: delivery.trackingNumber,
      estimatedDeliveryDate: delivery.estimatedDeliveryDate,
      actualDeliveryDate: delivery.actualDeliveryDate,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
    };
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

    if (additionalData) {
      Object.assign(data, additionalData);
    }

    const updated = await prisma.deliveryInfo.update({
      where: { id: deliveryId },
      data,
    });

    await this.syncDeliveryOrderStatus(deliveryId, status);

    if (status === 'DELIVERED') {
      await this.completeCODPaymentOnDelivery(updated.orderId);
    }

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
    filters?: { status?: string; search?: string; startDate?: Date; endDate?: Date }
  ): Promise<{ deliveries: any[]; total: number }> {
    const where: any = {
      deliveryManId,
      ...(filters?.status && { status: filters.status }),
    };

    // Apply date range filters on delivery.createdAt if provided
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    // Fetch all matching deliveries (we'll paginate after applying search on joined order fields)
    const deliveries = await prisma.deliveryInfo.findMany({
      where,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            shippingAddress: true,
            guestEmail: true,
            guestPhone: true,
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

    // Filter by customer name or orderNumber if search provided
    let filtered = deliveries;
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      filtered = deliveries.filter((d) => {
        const orderNumber = d.order?.orderNumber?.toLowerCase() || '';
        const shippingAddr = d.order?.shippingAddress as any;
        const shippingName = (shippingAddr && (shippingAddr.name || shippingAddr.fullName)) || '';
        const guestEmail = d.order?.guestEmail || '';
        const guestPhone = d.order?.guestPhone || '';

        return (
          orderNumber.includes(s) ||
          String(shippingName).toLowerCase().includes(s) ||
          String(guestEmail).toLowerCase().includes(s) ||
          String(guestPhone).toLowerCase().includes(s)
        );
      });
    }

    const total = filtered.length;

    // Enrich delivery man info for all deliveries
    let deliveryMan = null;
    try {
      const deliveryManProfile = await this.fetchDeliveryManProfile(deliveryManId);
      if (deliveryManProfile) {
        deliveryMan = {
          id: deliveryManId,
          name: deliveryManProfile.firstName && deliveryManProfile.lastName 
            ? `${deliveryManProfile.firstName} ${deliveryManProfile.lastName}` 
            : (deliveryManProfile.firstName || deliveryManProfile.lastName || ''),
          email: deliveryManProfile.email,
          phone: deliveryManProfile.phone,
          avatar: deliveryManProfile.avatar,
        };
      }
    } catch (error) {
      console.error(`Failed to enrich delivery man: ${error}`);
    }

    // Apply pagination on the filtered array
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    // Return serializable objects
    const enrichedDeliveries = paged.map(delivery => ({
      id: delivery.id,
      orderId: delivery.orderId,
      status: delivery.status,
      deliveryManId: delivery.deliveryManId,
      deliveryMan,
      order: delivery.order,
      provider: delivery.provider,
      trackingId: delivery.externalTrackingId,
      estimatedDeliveryDate: delivery.estimatedDeliveryDate,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
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
