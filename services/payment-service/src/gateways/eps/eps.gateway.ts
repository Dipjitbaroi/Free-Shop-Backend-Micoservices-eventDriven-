import axios from 'axios';
import config from '../../config/index.js';
import { logger } from '@freeshop/shared-utils';

interface EpsCreateResponse {
  success: boolean;
  paymentUrl?: string;
  paymentId?: string;
  errorMessage?: string;
}

interface EpsQueryResponse {
  success: boolean;
  status?: string;
  transactionId?: string;
  amount?: number;
  errorMessage?: string;
}

export class EpsGateway {
  private baseUrl: string;
  private merchantId: string;
  private apiKey: string;
  private secretKey: string;

  constructor() {
    this.baseUrl = config.eps.baseUrl;
    this.merchantId = config.eps.merchantId;
    this.apiKey = config.eps.apiKey;
    this.secretKey = config.eps.secretKey;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-API-KEY': this.apiKey,
      'X-SECRET-KEY': this.secretKey,
      'X-MERCHANT-ID': this.merchantId,
    };
  }

  async createPayment(
    orderId: string,
    amount: number,
    returnUrl: string,
    cancelUrl?: string,
    customerName?: string,
    customerEmail?: string,
    customerPhone?: string
  ): Promise<{ paymentUrl: string; paymentId: string }> {
    try {
      const payload = {
        merchantId: this.merchantId,
        orderId,
        amount,
        currency: 'BDT',
        returnUrl,
        cancelUrl,
        customerName,
        customerEmail,
        customerPhone,
      };

      const response = await axios.post<EpsCreateResponse>(
        `${this.baseUrl}/payments/initiate`,
        payload,
        { headers: this.getHeaders() }
      );

      if (response.data && response.data.success) {
        return {
          paymentUrl: response.data.paymentUrl || '',
          paymentId: response.data.paymentId || '',
        };
      }

      throw new Error(response.data.errorMessage || 'EPS initiation failed');
    } catch (error) {
      logger.error('EPS create payment failed', error as Error);
      throw new Error('Failed to create EPS payment');
    }
  }

  async queryPayment(paymentId: string): Promise<EpsQueryResponse> {
    try {
      const payload = { merchantId: this.merchantId, paymentId };
      const response = await axios.post<EpsQueryResponse>(
        `${this.baseUrl}/payments/status`,
        payload,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      logger.error('EPS query payment failed', error as Error);
      throw new Error('Failed to query EPS payment');
    }
  }

  async refundPayment(paymentId: string, transactionId: string, amount: number, reason: string) {
    try {
      const payload = {
        merchantId: this.merchantId,
        paymentId,
        transactionId,
        amount,
        reason,
      };

      const response = await axios.post<any>(
        `${this.baseUrl}/payments/refund`,
        payload,
        { headers: this.getHeaders() }
      );

      if (response.data && (response.data.success === true || response.data.status === 'OK')) {
        return { success: true, refundId: response.data.refundId };
      }

      return { success: false, message: response.data?.errorMessage || 'Refund failed' };
    } catch (error) {
      logger.error('EPS refund failed', error as Error);
      throw new Error('Failed to refund EPS payment');
    }
  }
}

export const epsGateway = new EpsGateway();
