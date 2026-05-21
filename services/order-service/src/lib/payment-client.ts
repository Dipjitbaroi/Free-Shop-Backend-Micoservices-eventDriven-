import { BadRequestError } from '@freeshop/shared-utils';
import config from '../config/index.js';

/**
 * Complete a COD payment for an order
 * Calls the payment service to mark a pending COD payment as completed
 */
export async function completeCODPayment(
  orderId: string,
  amount: number,
  transactionId?: string
): Promise<{ success: boolean; paymentId?: string; error?: string }> {
  const paymentServiceUrl = config.paymentServiceUrl;
  
  if (!paymentServiceUrl) {
    console.warn('⚠ PAYMENT_SERVICE_URL not configured, cannot complete COD payment');
    return { success: false, error: 'Payment service URL not configured' };
  }

  const serviceToken = process.env.SERVICE_AUTH_TOKEN;
  if (!serviceToken) {
    console.warn('⚠ SERVICE_AUTH_TOKEN not configured, cannot complete COD payment');
    return { success: false, error: 'Service auth token not configured' };
  }

  const url = `${paymentServiceUrl}/payments/cod/complete`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceToken}`,
      },
      body: JSON.stringify({
        orderId,
        amount,
        transactionId: transactionId || `COD_${orderId}_${Date.now()}`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `HTTP ${response.status}`;
      console.error(`Failed to complete COD payment: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }

    const data = await response.json();
    return {
      success: true,
      paymentId: data.payment?.id,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error calling payment service for COD completion: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

/**
 * Get payment status for an order
 */
export async function getOrderPaymentStatus(
  orderId: string
): Promise<{ method?: string; status?: string; error?: string }> {
  const paymentServiceUrl = config.paymentServiceUrl;
  
  if (!paymentServiceUrl) {
    return { error: 'Payment service URL not configured' };
  }

  const serviceToken = process.env.SERVICE_AUTH_TOKEN;
  if (!serviceToken) {
    return { error: 'Service auth token not configured' };
  }

  const url = `${paymentServiceUrl}/payments/order/${orderId}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${serviceToken}`,
      },
    });

    if (!response.ok) {
      return { error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    return {
      method: data.payment?.method,
      status: data.payment?.status,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { error: errorMessage };
  }
}
