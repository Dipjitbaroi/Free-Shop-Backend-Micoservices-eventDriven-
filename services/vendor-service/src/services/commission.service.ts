import { prisma } from '../lib/prisma.js';
import { redis } from '../lib/redis.js';
import { messageBroker } from '../lib/message-broker.js';
import { EXCHANGES, getRoutingKey } from '@freeshop/shared-events';
import { CommissionStatus, WithdrawalStatus, WithdrawalMethod, Prisma } from '../../generated/client/client.js';
import { config } from '../config/index.js';
import { createServiceLogger, NotFoundError, BadRequestError } from '@freeshop/shared-utils';

const logger = createServiceLogger('vendor-service');

interface CreateCommissionInput {
  vendorId: string;
  orderId: string;
  orderItemId?: string;
  productId: string;
  orderAmount: number;
  commissionRate?: number;
}

interface RequestWithdrawalInput {
  vendorId: string,
  amount: number;
  method: WithdrawalMethod;
  accountDetails: Record<string, unknown>;
}

interface WithdrawalFilters {
  vendorId?: string;
  status?: WithdrawalStatus;
  method?: WithdrawalMethod;
  page?: number;
  limit?: number;
}

class CommissionService {
  async createCommission(input: CreateCommissionInput) {
    const vendor = await prisma.vendor.findUnique({
      where: { id: input.vendorId },
      select: { commissionRate: true },
    });

    if (!vendor) {
      throw new NotFoundError('vendor not found');
    }

    const commissionRate = input.commissionRate ?? Number(vendor.commissionRate);
    const commissionAmount = (input.orderAmount * commissionRate) / 100;
    const netAmount = input.orderAmount - commissionAmount;

    const commission = await prisma.commission.create({
      data: {
        vendorId: input.vendorId,
        orderId: input.orderId,
        orderItemId: input.orderItemId,
        productId: input.productId,
        orderAmount: input.orderAmount,
        commissionRate,
        commissionAmount,
        netAmount,
        status: 'PENDING',
      },
    });

    await redis.del(`vendor:stats:${input.vendorId}`);

    logger.info('Commission created', {
      commissionId: commission.id,
      vendorId: input.vendorId,
      orderId: input.orderId,
      amount: netAmount,
    });

    return commission;
  }

  async settleCommission(commissionId: string) {
    const commission = await prisma.commission.update({
      where: { id: commissionId },
      data: {
        status: 'SETTLED',
        settledAt: new Date(),
      },
    });

    await redis.del(`vendor:stats:${commission.vendorId}`);

    await messageBroker.publish(
      EXCHANGES.VENDOR,
      getRoutingKey('vendor', 'COMMISSION_SETTLED'),
      {
        commissionId: commission.id,
        vendorId: commission.vendorId,
        amount: commission.netAmount,
      }
    );

    return commission;
  }

  async settleCommissionsForOrder(orderId: string) {
    const commissions = await prisma.commission.updateMany({
      where: { orderId, status: 'PENDING' },
      data: {
        status: 'SETTLED',
        settledAt: new Date(),
      },
    });

    const updatedCommissions = await prisma.commission.findMany({
      where: { orderId },
    });

    const vendorIds = [...new Set(updatedCommissions.map(c => c.vendorId))];
    await Promise.all(vendorIds.map(id => redis.del(`vendor:stats:${id}`)));

    return commissions;
  }

  async cancelCommissionsForOrder(orderId: string) {
    const cancelledCommissions = await prisma.$transaction(async (tx) => {
      const pendingCommissions = await tx.commission.findMany({
        where: { orderId, status: 'PENDING' },
      });

      if (pendingCommissions.length > 0) {
        await tx.commission.updateMany({
          where: { id: { in: pendingCommissions.map((commission) => commission.id) } },
          data: { status: 'CANCELLED' },
        });
      }

      return pendingCommissions;
    });

    const vendorIds = [...new Set(cancelledCommissions.map(c => c.vendorId))];
    await Promise.all(vendorIds.map(id => redis.del(`vendor:stats:${id}`)));

    return cancelledCommissions;
  }

  async getVendorCommissions(vendorId: string, filters: {
    status?: CommissionStatus;
    page?: number;
    limit?: number;
  }) {
    const { status, page = 1, limit = 20 } = filters;

    const where: Prisma.CommissionWhereInput = { vendorId };
    if (status) where.status = status;

    const [commissions, total] = await Promise.all([
      prisma.commission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.commission.count({ where }),
    ]);

    return {
      commissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAvailableBalance(vendorId: string): Promise<number> {
    const result = await prisma.commission.aggregate({
      where: { vendorId, status: 'SETTLED' },
      _sum: { netAmount: true },
    });

    return Number(result._sum?.netAmount || 0);
  }

  async requestWithdrawal(input: RequestWithdrawalInput) {
    const vendor = await prisma.vendor.findUnique({
      where: { id: input.vendorId },
      select: { minimumWithdrawal: true, userId: true },
    });

    if (!vendor) {
      throw new NotFoundError('vendor not found');
    }

    if (input.amount < Number(vendor.minimumWithdrawal)) {
      throw new BadRequestError(`Minimum withdrawal amount is ${vendor.minimumWithdrawal}`);
    }

    const availableBalance = await this.getAvailableBalance(input.vendorId);
    if (input.amount > availableBalance) {
      throw new BadRequestError('Insufficient balance');
    }

    const fee = config.withdrawalProcessingFee;
    const netAmount = input.amount - fee;

    const withdrawal = await prisma.$transaction(async (tx) => {
      const settledCommissions = await tx.commission.findMany({
        where: { vendorId: input.vendorId, status: 'SETTLED' },
        orderBy: { createdAt: 'asc' },
      });

      let remainingAmount = input.amount;
      let coveredAmount = 0;
      const commissionIds: string[] = [];

      for (const commission of settledCommissions) {
        if (remainingAmount <= 0) break;

        const commissionNet = Number(commission.netAmount);
        if (commissionNet <= 0) {
          continue;
        }

        if (commissionNet <= remainingAmount || commissionIds.length === 0) {
          commissionIds.push(commission.id);
          remainingAmount -= commissionNet;
          coveredAmount += commissionNet;
        }
      }

      if (coveredAmount < input.amount) {
        throw new BadRequestError('Insufficient settled commission balance to back this withdrawal');
      }

      const newWithdrawal = await tx.withdrawal.create({
        data: {
          vendorId: input.vendorId,
          amount: input.amount,
          fee,
          netAmount,
          method: input.method,
          accountDetails: input.accountDetails as Prisma.InputJsonValue,
          status: 'PENDING',
        },
      });

      if (commissionIds.length > 0) {
        await tx.commission.updateMany({
          where: { id: { in: commissionIds } },
          data: { 
            status: 'WITHDRAWN',
            withdrawalId: newWithdrawal.id,
          },
        });
      }

      return newWithdrawal;
    });

    await redis.del(`vendor:stats:${input.vendorId}`);

    await messageBroker.publish(
      EXCHANGES.VENDOR,
      getRoutingKey('vendor', 'WITHDRAWAL_REQUESTED'),
      {
        withdrawalId: withdrawal.id,
        vendorId: input.vendorId,
        userId: vendor.userId,
        amount: input.amount,
        method: input.method,
      }
    );

    return withdrawal;
  }

  async processWithdrawal(withdrawalId: string, approved: boolean, adminId: string, transactionId?: string, reason?: string) {
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: { vendor: true },
    });

    if (!withdrawal) {
      throw new NotFoundError('Withdrawal not found');
    }

    if (withdrawal.status !== 'PENDING') {
      throw new BadRequestError('Withdrawal is not in pending status');
    }

    if (approved) {
      const updated = await prisma.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status: 'PROCESSING',
          processedBy: adminId,
        },
      });

      await messageBroker.publish(
        EXCHANGES.VENDOR,
        getRoutingKey('vendor', 'WITHDRAWAL_PROCESSING'),
        {
          withdrawalId: updated.id,
          vendorId: updated.vendorId,
          userId: withdrawal.vendor.userId,
          amount: updated.amount,
          method: updated.method,
        }
      );

      return updated;
    } else {
      const updated = await prisma.$transaction(async (tx) => {
        const result = await tx.withdrawal.update({
          where: { id: withdrawalId },
          data: {
            status: 'REJECTED',
            processedBy: adminId,
            processedAt: new Date(),
            rejectionReason: reason,
          },
        });

        await tx.commission.updateMany({
          where: { withdrawalId },
          data: { 
            status: 'SETTLED',
            withdrawalId: null,
          },
        });

        return result;
      });

      await redis.del(`vendor:stats:${withdrawal.vendorId}`);

      await messageBroker.publish(
        EXCHANGES.VENDOR,
        getRoutingKey('vendor', 'WITHDRAWAL_REJECTED'),
        {
          withdrawalId: updated.id,
          vendorId: updated.vendorId,
          userId: withdrawal.vendor.userId,
          amount: updated.amount,
          reason,
        }
      );

      return updated;
    }
  }

  async completeWithdrawal(withdrawalId: string, transactionId: string) {
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: { vendor: true },
    });

    if (!withdrawal) {
      throw new NotFoundError('Withdrawal not found');
    }

    const updated = await prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: 'COMPLETED',
        processedAt: new Date(),
        transactionId,
      },
    });

    await redis.del(`vendor:stats:${withdrawal.vendorId}`);

    await messageBroker.publish(
      EXCHANGES.VENDOR,
      getRoutingKey('vendor', 'WITHDRAWAL_COMPLETED'),
      {
        withdrawalId: updated.id,
        vendorId: updated.vendorId,
        userId: withdrawal.vendor.userId,
        amount: updated.netAmount,
        transactionId,
      }
    );

    return updated;
  }

  async listWithdrawals(filters: WithdrawalFilters) {
    const { vendorId, status, method, page = 1, limit = 20 } = filters;

    const where: Prisma.WithdrawalWhereInput = {};
    if (vendorId) where.vendorId = vendorId;
    if (status) where.status = status;
    if (method) where.method = method;

    const [withdrawals, total] = await Promise.all([
      prisma.withdrawal.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          vendor: {
            select: {
              id: true,
              storeName: true,
              userId: true,
            },
          },
        },
      }),
      prisma.withdrawal.count({ where }),
    ]);

    return {
      withdrawals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getWithdrawalById(id: string) {
    return prisma.withdrawal.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            id: true,
            storeName: true,
            userId: true,
            contactEmail: true,
          },
        },
        commissions: true,
      },
    });
  }
}

export const commissionService = new CommissionService();

