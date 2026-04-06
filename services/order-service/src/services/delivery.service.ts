import { Prisma } from '../../generated/prisma';
import { BadRequestError } from '@freeshop/shared-utils';
import { settingsService } from './settings.service';
import config from '../config';

export type DeliveryProvider = 'INHOUSE' | 'STEADFAST';
export type DispatchStatus = 'PENDING' | 'DISPATCHED' | 'FAILED';

interface DeliveryRoutingConfig {
  inhouseZones: string[];
  inhouseDistricts: string[];
  inhouseAreas: string[];
}

interface DeliveryDispatchResult {
  provider: DeliveryProvider;
  status: DispatchStatus;
  note: string;
  requestedAt: string;
  providerTrackingId?: string;
  rawResponse?: unknown;
}

interface SteadfastCreateConsignmentResponse {
  status?: number;
  message?: string;
  consignment?: {
    consignment_id?: string | number;
    tracking_code?: string;
  };
}

class DeliveryService {
  private normalize(value: unknown): string {
    return String(value || '').trim().toLowerCase();
  }

  private async getRoutingConfig(): Promise<DeliveryRoutingConfig> {
    const fallback: DeliveryRoutingConfig = {
      inhouseZones: [],
      inhouseDistricts: [],
      inhouseAreas: [],
    };

    const configured = await settingsService.get('deliveryRouting');
    if (!configured || typeof configured !== 'object') return fallback;

    const cfg = configured as Partial<DeliveryRoutingConfig>;
    return {
      inhouseZones: Array.isArray(cfg.inhouseZones) ? cfg.inhouseZones.map((z) => this.normalize(z)).filter(Boolean) : [],
      inhouseDistricts: Array.isArray(cfg.inhouseDistricts) ? cfg.inhouseDistricts.map((d) => this.normalize(d)).filter(Boolean) : [],
      inhouseAreas: Array.isArray(cfg.inhouseAreas) ? cfg.inhouseAreas.map((a) => this.normalize(a)).filter(Boolean) : [],
    };
  }

  private extractLocation(address: Record<string, unknown>): {
    zone: string;
    district: string;
    area: string;
  } {
    const zone = this.normalize(address.zone);
    const district = this.normalize(address.district || address.city);
    const area = this.normalize(address.area || address.thana || address.region);

    if (!zone) {
      throw new BadRequestError('shippingAddress.zone is required');
    }

    return { zone, district, area };
  }

  async resolveProvider(address: Record<string, unknown>): Promise<{
    provider: DeliveryProvider;
    matchedBy: 'ZONE' | 'DISTRICT' | 'AREA' | 'DEFAULT';
  }> {
    const routing = await this.getRoutingConfig();
    const location = this.extractLocation(address);

    if (routing.inhouseZones.includes(location.zone)) {
      return { provider: 'INHOUSE', matchedBy: 'ZONE' };
    }

    if (location.district && routing.inhouseDistricts.includes(location.district)) {
      return { provider: 'INHOUSE', matchedBy: 'DISTRICT' };
    }

    if (location.area && routing.inhouseAreas.includes(location.area)) {
      return { provider: 'INHOUSE', matchedBy: 'AREA' };
    }

    return { provider: 'STEADFAST', matchedBy: 'DEFAULT' };
  }

  async getPublicRoutingConfig(): Promise<DeliveryRoutingConfig> {
    return this.getRoutingConfig();
  }

  async dispatchOrder(input: {
    orderId: string;
    orderNumber: string;
    customerName?: string;
    customerPhone?: string;
    address: Record<string, unknown>;
    total: number;
    paymentMethod: string;
  }): Promise<DeliveryDispatchResult> {
    const resolved = await this.resolveProvider(input.address);

    if (resolved.provider === 'INHOUSE') {
      return {
        provider: 'INHOUSE',
        status: 'DISPATCHED',
        note: `Assigned to in-house delivery (${resolved.matchedBy.toLowerCase()} routing match).`,
        requestedAt: new Date().toISOString(),
      };
    }

    if (!config.steadfast.enabled) {
      return {
        provider: 'STEADFAST',
        status: 'FAILED',
        note: 'Steadfast dispatch is disabled by configuration.',
        requestedAt: new Date().toISOString(),
      };
    }

    if (!config.steadfast.apiKey || !config.steadfast.secretKey) {
      return {
        provider: 'STEADFAST',
        status: 'FAILED',
        note: 'Steadfast credentials are missing.',
        requestedAt: new Date().toISOString(),
      };
    }

    const phone = String(input.address.phone || input.customerPhone || '').trim();
    const name = String(input.address.recipientName || input.address.name || input.customerName || 'Customer').trim();
    const addressLine = [input.address.addressLine1, input.address.addressLine2, input.address.area, input.address.district]
      .map((v) => String(v || '').trim())
      .filter(Boolean)
      .join(', ');

    if (!phone || !addressLine) {
      return {
        provider: 'STEADFAST',
        status: 'FAILED',
        note: 'Shipping address is missing required contact data for Steadfast.',
        requestedAt: new Date().toISOString(),
      };
    }

    const body = {
      invoice: input.orderNumber,
      recipient_name: name,
      recipient_phone: phone,
      recipient_address: addressLine,
      cod_amount: input.paymentMethod === 'COD' ? Math.max(0, Math.round(input.total)) : 0,
      note: `Order ${input.orderNumber} from FreeShop`,
    };

    const endpoint = `${config.steadfast.baseUrl.replace(/\/$/, '')}/create_order`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.steadfast.timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Api-Key': config.steadfast.apiKey,
          'Secret-Key': config.steadfast.secretKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      const parsed = (await response.json()) as SteadfastCreateConsignmentResponse;
      const trackingId = parsed?.consignment?.tracking_code || String(parsed?.consignment?.consignment_id || '');

      if (!response.ok || !trackingId) {
        return {
          provider: 'STEADFAST',
          status: 'FAILED',
          note: parsed?.message || `Steadfast dispatch failed with status ${response.status}`,
          requestedAt: new Date().toISOString(),
          rawResponse: parsed,
        };
      }

      return {
        provider: 'STEADFAST',
        status: 'DISPATCHED',
        note: 'Forwarded to Steadfast successfully.',
        requestedAt: new Date().toISOString(),
        providerTrackingId: trackingId,
        rawResponse: parsed,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Steadfast error';
      return {
        provider: 'STEADFAST',
        status: 'FAILED',
        note: `Steadfast dispatch error: ${message}`,
        requestedAt: new Date().toISOString(),
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  attachDeliveryMeta(address: Record<string, unknown>, meta: Record<string, unknown>): Prisma.InputJsonValue {
    return {
      ...address,
      delivery: {
        ...(address.delivery && typeof address.delivery === 'object' ? (address.delivery as Record<string, unknown>) : {}),
        ...meta,
      },
    } as Prisma.InputJsonValue;
  }
}

export const deliveryService = new DeliveryService();
