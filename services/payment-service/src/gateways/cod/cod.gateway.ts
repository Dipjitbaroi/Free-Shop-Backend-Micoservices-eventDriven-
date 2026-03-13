// COD (Cash on Delivery) gateway - mainly for record keeping
// No external integration needed, just confirms when delivery is complete

import { logger } from '@freeshop/shared-utils';

export class CodGateway {
  async createPayment(orderId: string, amount: number): Promise<{
    paymentId: string;
    status: string;
  }> {
    // COD payments are created as pending until delivery
    logger.info('COD payment created', { orderId, amount });
    
    return {
      paymentId: `COD_${orderId}_${Date.now()}`,
      status: 'PENDING',
    };
  }

  async confirmPayment(paymentId: string, collectedAmount: number): Promise<{
    success: boolean;
    message?: string;
  }> {
    logger.info('COD payment confirmed', { paymentId, collectedAmount });
    
    return {
      success: true,
    };
  }

  async cancelPayment(paymentId: string, reason: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    logger.info('COD payment cancelled', { paymentId, reason });
    
    return {
      success: true,
    };
  }
}

export const codGateway = new CodGateway();
