import axios from 'axios';
import config from '../../config/index.js';
import { storeGatewayToken, getGatewayToken } from '../../lib/redis.js';
import { logger } from '@freeshop/shared-utils';

interface BkashTokenResponse {
  statusCode: string;
  statusMessage: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

interface BkashCreatePaymentResponse {
  paymentID: string;
  bkashURL: string;
  callbackURL: string;
  successCallbackURL: string;
  failureCallbackURL: string;
  cancelledCallbackURL: string;
  amount: string;
  intent: string;
  currency: string;
  paymentCreateTime: string;
  transactionStatus: string;
  merchantInvoiceNumber: string;
}

interface BkashExecuteResponse {
  paymentID: string;
  trxID: string;
  transactionStatus: string;
  amount: string;
  currency: string;
  intent: string;
  payerReference: string;
  customerMsisdn: string;
  merchantInvoiceNumber: string;
  paymentExecuteTime: string;
  statusCode: string;
  statusMessage: string;
}

export class BkashGateway {
  private baseUrl: string;
  private appKey: string;
  private appSecret: string;
  private username: string;
  private password: string;

  constructor() {
    this.baseUrl = config.bkash.baseUrl;
    this.appKey = config.bkash.appKey;
    this.appSecret = config.bkash.appSecret;
    this.username = config.bkash.username;
    this.password = config.bkash.password;
  }

  private async getToken(): Promise<string> {
    // Check cached token
    const cachedToken = await getGatewayToken('bkash');
    if (cachedToken) return cachedToken;

    try {
      const response = await axios.post<BkashTokenResponse>(
        `${this.baseUrl}/tokenized/checkout/token/grant`,
        {
          app_key: this.appKey,
          app_secret: this.appSecret,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            username: this.username,
            password: this.password,
          },
        }
      );

      const token = response.data.id_token;
      // Store token with slight early expiry
      await storeGatewayToken('bkash', token, response.data.expires_in - 60);
      
      return token;
    } catch (error) {
      logger.error('bKash token grant failed', error as Error);
      throw new Error('Failed to authenticate with bKash');
    }
  }

  async createPayment(
    orderId: string,
    amount: number,
    callbackUrl: string,
    payerReference?: string
  ): Promise<{ paymentId: string; redirectUrl: string }> {
    const token = await this.getToken();

    try {
      const response = await axios.post<BkashCreatePaymentResponse>(
        `${this.baseUrl}/tokenized/checkout/create`,
        {
          mode: '0011',
          payerReference: payerReference || orderId,
          callbackURL: callbackUrl,
          amount: amount.toString(),
          currency: 'BDT',
          intent: 'sale',
          merchantInvoiceNumber: orderId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: token,
            'X-APP-Key': this.appKey,
          },
        }
      );

      return {
        paymentId: response.data.paymentID,
        redirectUrl: response.data.bkashURL,
      };
    } catch (error) {
      logger.error('bKash create payment failed', error as Error);
      throw new Error('Failed to create bKash payment');
    }
  }

  async executePayment(paymentId: string): Promise<{
    success: boolean;
    transactionId?: string;
    customerMsisdn?: string;
    amount?: string;
    message?: string;
  }> {
    const token = await this.getToken();

    try {
      const response = await axios.post<BkashExecuteResponse>(
        `${this.baseUrl}/tokenized/checkout/execute`,
        { paymentID: paymentId },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: token,
            'X-APP-Key': this.appKey,
          },
        }
      );

      if (response.data.statusCode === '0000' && response.data.transactionStatus === 'Completed') {
        return {
          success: true,
          transactionId: response.data.trxID,
          customerMsisdn: response.data.customerMsisdn,
          amount: response.data.amount,
        };
      }

      return {
        success: false,
        message: response.data.statusMessage || 'Payment execution failed',
      };
    } catch (error) {
      logger.error('bKash execute payment failed', error as Error);
      throw new Error('Failed to execute bKash payment');
    }
  }

  async queryPayment(paymentId: string): Promise<{
    paymentId: string;
    status: string;
    transactionId?: string;
    amount?: string;
  }> {
    const token = await this.getToken();

    try {
      const response = await axios.post(
        `${this.baseUrl}/tokenized/checkout/payment/status`,
        { paymentID: paymentId },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: token,
            'X-APP-Key': this.appKey,
          },
        }
      );

      return {
        paymentId: response.data.paymentID,
        status: response.data.transactionStatus,
        transactionId: response.data.trxID,
        amount: response.data.amount,
      };
    } catch (error) {
      logger.error('bKash query payment failed', error as Error);
      throw new Error('Failed to query bKash payment');
    }
  }

  async refundPayment(
    paymentId: string,
    transactionId: string,
    amount: number,
    reason: string
  ): Promise<{ success: boolean; refundId?: string; message?: string }> {
    const token = await this.getToken();

    try {
      const response = await axios.post(
        `${this.baseUrl}/tokenized/checkout/payment/refund`,
        {
          paymentID: paymentId,
          trxID: transactionId,
          amount: amount.toString(),
          reason,
          sku: 'refund',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: token,
            'X-APP-Key': this.appKey,
          },
        }
      );

      if (response.data.statusCode === '0000') {
        return {
          success: true,
          refundId: response.data.refundTrxID,
        };
      }

      return {
        success: false,
        message: response.data.statusMessage || 'Refund failed',
      };
    } catch (error) {
      logger.error('bKash refund failed', error as Error);
      throw new Error('Failed to refund bKash payment');
    }
  }
}

export const bkashGateway = new BkashGateway();
