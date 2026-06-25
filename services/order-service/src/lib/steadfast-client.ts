import config from '../config/index.js';
import { ServiceUnavailableError } from '@freeshop/shared-utils';

export interface SteadfastOrderPayload {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  district?: string;   // ← District should be sent separately
  thana?: string;      // ← Thana / upazila — Steadfast portal labels this "Thana"
  cod_amount: number;
  item_description?: string | null; // ← Product/item details (Steadfast "Item Description" field)
  note?: string | null; // ← Customer/delivery note
}

export interface SteadfastConsignment {
  consignment_id?: number | string;
  invoice?: string;
  tracking_code?: string;
  recipient_name?: string;
  recipient_phone?: string;
  recipient_address?: string;
  cod_amount?: number | string;
  note?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SteadfastCreateOrderResponse {
  status?: number;
  message?: string;
  consignment?: SteadfastConsignment;
  [key: string]: unknown;
}

export interface SteadfastTrackingResponse {
  status?: number;
  delivery_status?: string;
  [key: string]: unknown;
}

class SteadfastClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly secretKey: string;

  constructor() {
    this.baseUrl = config.steadfast.baseUrl.replace(/\/$/, '');
    this.apiKey = config.steadfast.apiKey;
    this.secretKey = config.steadfast.secretKey;
  }

  private ensureCredentials(): void {
    if (!this.apiKey || !this.secretKey) {
      throw new ServiceUnavailableError('Steadfast credentials are not configured');
    }
  }

  private buildHeaders(): HeadersInit {
    this.ensureCredentials();

    return {
      'Api-Key': this.apiKey,
      'Secret-Key': this.secretKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  private async parseJson(response: Response): Promise<any> {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  async placeOrder(payload: SteadfastOrderPayload): Promise<SteadfastCreateOrderResponse> {
    const response = await fetch(`${this.baseUrl}/create_order`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await this.parseJson(response);

    if (!response.ok) {
      const message = data?.message || data?.error || `HTTP ${response.status}`;
      throw new ServiceUnavailableError(`Steadfast booking failed: ${message}`, {
        status: response.status,
        response: data,
      });
    }

    if (data?.status && data.status !== 200 && data.status !== 'success') {
      const message = data?.message || 'Steadfast booking was rejected';
      throw new ServiceUnavailableError(message, { response: data });
    }

    return data as SteadfastCreateOrderResponse;
  }

  async getStatusByConsignmentId(consignmentId: string | number): Promise<SteadfastTrackingResponse> {
    const response = await fetch(`${this.baseUrl}/status_by_cid/${consignmentId}`, {
      method: 'GET',
      headers: this.buildHeaders(),
    });

    const data = await this.parseJson(response);

    if (!response.ok) {
      const message = data?.message || data?.error || `HTTP ${response.status}`;
      throw new ServiceUnavailableError(`Steadfast tracking lookup failed: ${message}`, {
        status: response.status,
        response: data,
      });
    }

    return data as SteadfastTrackingResponse;
  }

  async getStatusByTrackingCode(trackingCode: string): Promise<SteadfastTrackingResponse> {
    const response = await fetch(`${this.baseUrl}/status_by_trackingcode/${trackingCode}`, {
      method: 'GET',
      headers: this.buildHeaders(),
    });

    const data = await this.parseJson(response);

    if (!response.ok) {
      const message = data?.message || data?.error || `HTTP ${response.status}`;
      throw new ServiceUnavailableError(`Steadfast tracking lookup failed: ${message}`, {
        status: response.status,
        response: data,
      });
    }

    return data as SteadfastTrackingResponse;
  }
}

export const steadfastClient = new SteadfastClient();