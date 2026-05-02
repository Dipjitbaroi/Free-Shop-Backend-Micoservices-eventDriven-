import { Payment, PaymentMethod, PaymentStatus, Prisma } from '../../generated/client/client.js';
import {
  NotFoundError,
  BadRequestError,
  PaymentError,
  generateId,
  createPaginatedResponse,
  calculateOffset,
  IPaginatedResult,
} from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma.js';
import { eventPublisher } from '../lib/message-broker.js';
import { Events } from '@freeshop/shared-events';
import { bkashGateway } from '../gateways/bkash/bkash.gateway.js';
import { codGateway } from '../gateways/cod/cod.gateway.js';
import { epsGateway } from '../gateways/eps/eps.gateway.js';
import config from '../config/index.js';

interface CreatePaymentData {
  orderId: string;
  userId?: string;
  amount: number;
  method: PaymentMethod;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

interface PaymentFilters {
  userId?: string;
  orderId?: string;
  status?: PaymentStatus;
  method?: PaymentMethod;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

class PaymentService {
  async initiatePayment(data: CreatePaymentData): Promise<{
    payment: Payment;
    redirectUrl?: string;
    instructions?: string;
  }> {
    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId: data.orderId,
        userId: data.userId,
        amount: data.amount,
        method: data.method,
        status: PaymentStatus.PENDING,
        metadata: data.metadata as unknown as Prisma.InputJsonValue,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });

    let redirectUrl: string | undefined;
    let instructions: string | undefined;

    try {
      switch (data.method) {
        case PaymentMethod.BKASH: {
          const callbackUrl = `${config.callbacks.baseUrl}/payments/bkash/callback`;
          const result = await bkashGateway.createPayment(
            data.orderId,
            data.amount,
            callbackUrl
          );
          
          await prisma.payment.update({
            where: { id: payment.id },
            data: { 
              gatewayRef: result.paymentId,
              status: PaymentStatus.PROCESSING,
            },
          });
          
          redirectUrl = result.redirectUrl;
          break;
        }

        case PaymentMethod.EPS: {
          const callbackUrl = `${config.callbacks.baseUrl}/payments/eps/callback`;
          const failRedirect = `${process.env.FRONTEND_URL}/payment/failed?orderId=${data.orderId}`;
          const result = await epsGateway.createPayment(
            data.orderId,
            data.amount,
            callbackUrl,
            failRedirect
          );

          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              gatewayRef: result.paymentId,
              status: PaymentStatus.PROCESSING,
            },
          });

          redirectUrl = result.paymentUrl;
          break;
        }

        case PaymentMethod.COD: {
          const result = await codGateway.createPayment(data.orderId, data.amount);
          
          await prisma.payment.update({
            where: { id: payment.id },
            data: { gatewayRef: result.paymentId },
          });
          
          instructions = 'Please pay cash upon delivery. Keep exact change ready if possible.';
          break;
        }

        case PaymentMethod.NAGAD:
        case PaymentMethod.ROCKET:
        case PaymentMethod.CARD:
        case PaymentMethod.BANK_TRANSFER:
          // Placeholder for other payment methods
          instructions = `${data.method} payment initiated. Please follow the instructions sent to your registered contact.`;
          break;
      }
    } catch (error) {
      // Update payment status to failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: { 
          status: PaymentStatus.FAILED,
          gatewayResponse: { error: (error as Error).message },
        },
      });
      // Wrap raw gateway errors so they produce a meaningful response (402) instead of 500
      if (error instanceof PaymentError) throw error;
      throw new PaymentError(`Payment gateway error: ${(error as Error).message}`);
    }

    const updatedPayment = await prisma.payment.findUnique({
      where: { id: payment.id },
    });

    return {
      payment: updatedPayment!,
      redirectUrl,
      instructions,
    };
  }

  async handleBkashCallback(paymentId: string, status: string): Promise<Payment> {
    const payment = await prisma.payment.findFirst({
      where: { gatewayRef: paymentId },
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    if (status === 'success') {
      // Execute the payment
      const result = await bkashGateway.executePayment(paymentId);
      
      if (result.success) {
        const updatedPayment = await this.completePayment(
          payment.id,
          result.transactionId!,
          { customerMsisdn: result.customerMsisdn }
        );
        return updatedPayment;
      } else {
        return this.failPayment(payment.id, result.message);
      }
    } else {
      return this.failPayment(payment.id, 'Payment cancelled or failed by user');
    }
  }

  async handleEpsCallback(paymentId: string, status?: string): Promise<Payment> {
    const payment = await prisma.payment.findFirst({
      where: { gatewayRef: paymentId },
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    // Query EPS for authoritative status
    const result = await epsGateway.queryPayment(paymentId);

    const epsStatus = result.status || (result.success ? 'Completed' : 'Failed');

    if (result.success || epsStatus === 'Completed') {
      const txId = result.transactionId || `EPS_${payment.orderId}_${Date.now()}`;
      const updatedPayment = await this.completePayment(payment.id, txId, {
        provider: 'EPS',
        raw: result,
      });
      return updatedPayment;
    }

    return this.failPayment(payment.id, result.errorMessage || 'EPS payment failed');
  }

  async completePayment(
    paymentId: string, 
    transactionId: string,
    gatewayResponse?: Record<string, unknown>
  ): Promise<Payment> {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.COMPLETED,
        transactionId,
        paidAt: new Date(),
        gatewayResponse: (gatewayResponse || undefined) as unknown as Prisma.InputJsonValue,
      },
    });

    // Publish payment completed event
    await eventPublisher.publish(Events.PAYMENT_RECEIVED, {
      paymentId: payment.id,
      orderId: payment.orderId,
      userId: payment.userId,
      amount: payment.amount,
      method: payment.method,
      transactionId,
    });

    return payment;
  }

  async failPayment(paymentId: string, reason?: string): Promise<Payment> {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.FAILED,
        gatewayResponse: reason ? { failureReason: reason } : undefined,
      },
    });

    // Publish payment failed event
    await eventPublisher.publish(Events.PAYMENT_FAILED, {
      paymentId: payment.id,
      orderId: payment.orderId,
      userId: payment.userId,
      reason,
    });

    return payment;
  }

  async getPaymentById(id: string): Promise<Payment> {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { refunds: true },
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    return payment;
  }

  async getPaymentByOrder(orderId: string): Promise<Payment | null> {
    return prisma.payment.findFirst({
      where: { orderId },
      include: { refunds: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPayments(filters: PaymentFilters): Promise<IPaginatedResult<Payment>> {
    const { userId, orderId, status, method, startDate, endDate, page = 1, limit = 20 } = filters;

    const where: Prisma.PaymentWhereInput = {};

    if (userId) where.userId = userId;
    if (orderId) where.orderId = orderId;
    if (status) where.status = status;
    if (method) where.method = method;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: { refunds: true },
        skip: calculateOffset(page, limit),
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payment.count({ where }),
    ]);

    return createPaginatedResponse(payments, total, page, limit);
  }

  async initiateRefund(
    paymentId: string,
    amount: number,
    reason: string,
    processedBy: string
  ): Promise<Payment> {
    const payment = await this.getPaymentById(paymentId);

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestError('Can only refund completed payments');
    }

    const totalRefunded = payment.refundedAmount + amount;
    if (totalRefunded > payment.amount) {
      throw new BadRequestError('Refund amount exceeds payment amount');
    }

    // Create refund record
    const refund = await prisma.refund.create({
      data: {
        paymentId,
        amount,
        reason,
        processedBy,
      },
    });

    // Process refund based on payment method
    let refundSuccess = false;
    let gatewayRefundRef: string | undefined;

    try {
      switch (payment.method) {
        case PaymentMethod.BKASH:
          if (payment.gatewayRef && payment.transactionId) {
            const result = await bkashGateway.refundPayment(
              payment.gatewayRef,
              payment.transactionId,
              amount,
              reason
            );
            refundSuccess = result.success;
            gatewayRefundRef = result.refundId;
          }
          break;

        case PaymentMethod.EPS:
          if (payment.gatewayRef && payment.transactionId) {
            const result = await epsGateway.refundPayment(
              payment.gatewayRef,
              payment.transactionId,
              amount,
              reason
            );
            refundSuccess = result.success;
            gatewayRefundRef = result.refundId;
          }
          break;

        case PaymentMethod.COD:
          // COD refunds are manual - just mark as processed
          refundSuccess = true;
          break;

        default:
          // Other methods - placeholder
          refundSuccess = true;
          break;
      }
    } catch (error) {
      // Update refund as failed
      await prisma.refund.update({
        where: { id: refund.id },
        data: { 
          status: 'FAILED',
          gatewayResponse: { error: (error as Error).message },
        },
      });
      throw error;
    }

    if (refundSuccess) {
      // Update refund record
      await prisma.refund.update({
        where: { id: refund.id },
        data: {
          status: 'COMPLETED',
          gatewayRef: gatewayRefundRef,
          processedAt: new Date(),
        },
      });

      // Update payment
      const newStatus = totalRefunded >= payment.amount 
        ? PaymentStatus.REFUNDED 
        : PaymentStatus.PARTIALLY_REFUNDED;

      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          refundedAmount: totalRefunded,
          refundReason: reason,
          refundedAt: new Date(),
          status: newStatus,
        },
        include: { refunds: true },
      });

      // Publish refund event
      await eventPublisher.publish(Events.PAYMENT_REFUNDED, {
        paymentId,
        orderId: payment.orderId,
        refundAmount: amount,
        totalRefunded,
        reason,
      });

      return updatedPayment;
    }

    throw new PaymentError('Refund processing failed');
  }

  // Verify payment status with gateway
  async verifyPayment(paymentId: string): Promise<{
    verified: boolean;
    status: string;
    transactionId?: string;
  }> {
    const payment = await this.getPaymentById(paymentId);

    if (!payment.gatewayRef) {
      return { verified: false, status: payment.status };
    }

    switch (payment.method) {
      case PaymentMethod.BKASH: {
        const result = await bkashGateway.queryPayment(payment.gatewayRef);
        return {
          verified: result.status === 'Completed',
          status: result.status,
          transactionId: result.transactionId,
        };
      }

      case PaymentMethod.EPS: {
        const result = await epsGateway.queryPayment(payment.gatewayRef);
        return {
          verified: result.success === true || result.status === 'Completed',
          status: result.status || (result.success ? 'Completed' : 'FAILED'),
          transactionId: result.transactionId,
        };
      }

      default:
        return { verified: payment.status === PaymentStatus.COMPLETED, status: payment.status };
    }
  }

  // COD specific - confirm payment collection
  async confirmCodPayment(
    paymentId: string,
    collectedAmount: number,
    collectedBy: string
  ): Promise<Payment> {
    const payment = await this.getPaymentById(paymentId);

    if (payment.method !== PaymentMethod.COD) {
      throw new BadRequestError('This is not a COD payment');
    }

    if (payment.status === PaymentStatus.COMPLETED) {
      throw new BadRequestError('Payment already confirmed');
    }

    if (collectedAmount < payment.amount) {
      throw new BadRequestError('Collected amount is less than order amount');
    }

    const transactionId = `COD_${payment.orderId}_${Date.now()}`;

    return this.completePayment(payment.id, transactionId, {
      collectedAmount,
      collectedBy,
      collectedAt: new Date().toISOString(),
    });
  }

  // Auto-complete COD payment when delivery is marked as delivered
  async completeCODPaymentForDelivery(
    orderId: string,
    amount: number,
    transactionId?: string
  ): Promise<Payment> {
    // Find or create payment for this order
    let payment = await prisma.payment.findFirst({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });

    if (!payment) {
      // Create payment if it doesn't exist
      payment = await prisma.payment.create({
        data: {
          orderId,
          amount,
          method: PaymentMethod.COD,
          status: PaymentStatus.PENDING,
        },
      });
    }

    if (payment.method !== PaymentMethod.COD) {
      throw new BadRequestError('Order payment method is not COD');
    }

    if (payment.status === PaymentStatus.COMPLETED) {
      return payment; // Already completed, just return it
    }

    const txId = transactionId || `COD_${orderId}_${Date.now()}`;

    return this.completePayment(payment.id, txId, {
      autoCompleted: true,
      autoCompletedAt: new Date().toISOString(),
      deliveryCompleted: true,
    });
  }
}

export const paymentService = new PaymentService();
