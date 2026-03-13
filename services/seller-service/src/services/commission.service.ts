import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import { messageBroker } from '../lib/message-broker';
import { EXCHANGES, getRoutingKey } from '@freeshop/shared-events';
import { CommissionStatus, WithdrawalStatus, WithdrawalMethod, Prisma } from '../../generated/prisma';
import { config } from '../config';
import logger, { NotFoundError, BadRequestError } from '@freeshop/shared-utils';

interface CreateCommissionInput {
  sellerId: string;
  orderId: string;
  orderItemId?: string;
  productId: string;
  orderAmount: number;
  commissionRate?: number;
}

interface RequestWithdrawalInput {
  sellerId: string;
  amount: number;
  method: WithdrawalMethod;
  accountDetails: Record<string, unknown>;
}

interface WithdrawalFilters {
  sellerId?: string;
  status?: WithdrawalStatus;
  method?: WithdrawalMethod;
  page?: number;
  limit?: number;
}

class CommissionService {
  async createCommission(input: CreateCommissionInput) {
    const seller = await prisma.seller.findUnique({
      where: { id: input.sellerId },
      select: { commissionRate: true },
    });

    if (!seller) {
      throw new NotFoundError('Seller not found');
    }

    const commissionRate = input.commissionRate ?? Number(seller.commissionRate);
    const commissionAmount = (input.orderAmount * commissionRate) / 100;
    const netAmount = input.orderAmount - commissionAmount;

    const commission = await prisma.commission.create({
      data: {
        sellerId: input.sellerId,
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

    await redis.del(`seller:stats:${input.sellerId}`);

    logger.info('Commission created', {
      commissionId: commission.id,
      sellerId: input.sellerId,
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

    await redis.del(`seller:stats:${commission.sellerId}`);

    await messageBroker.publish(
      EXCHANGES.SELLER,
      getRoutingKey('SELLER', 'COMMISSION_SETTLED'),
      {
        commissionId: commission.id,
        sellerId: commission.sellerId,
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

    const sellerIds = [...new Set(updatedCommissions.map(c => c.sellerId))];
    await Promise.all(sellerIds.map(id => redis.del(`seller:stats:${id}`)));

    return commissions;
  }

  async cancelCommissionsForOrder(orderId: string) {
    const commissions = await prisma.commission.updateMany({
      where: { orderId, status: 'PENDING' },
      data: { status: 'CANCELLED' },
    });

    const updatedCommissions = await prisma.commission.findMany({
      where: { orderId },
    });

    const sellerIds = [...new Set(updatedCommissions.map(c => c.sellerId))];
    await Promise.all(sellerIds.map(id => redis.del(`seller:stats:${id}`)));

    return commissions;
  }

  async getSellerCommissions(sellerId: string, filters: {
    status?: CommissionStatus;
    page?: number;
    limit?: number;
  }) {
    const { status, page = 1, limit = 20 } = filters;

    const where: Prisma.CommissionWhereInput = { sellerId };
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

  async getAvailableBalance(sellerId: string): Promise<number> {
    const result = await prisma.commission.aggregate({
      where: { sellerId, status: 'SETTLED' },
      _sum: { netAmount: true },
    });

    return Number(result._sum.netAmount || 0);
  }

  async requestWithdrawal(input: RequestWithdrawalInput) {
    const seller = await prisma.seller.findUnique({
      where: { id: input.sellerId },
      select: { minimumWithdrawal: true, userId: true },
    });

    if (!seller) {
      throw new NotFoundError('Seller not found');
    }

    if (input.amount < Number(seller.minimumWithdrawal)) {
      throw new BadRequestError(`Minimum withdrawal amount is ${seller.minimumWithdrawal}`);
    }

    const availableBalance = await this.getAvailableBalance(input.sellerId);
    if (input.amount > availableBalance) {
      throw new BadRequestError('Insufficient balance');
    }

    const fee = config.withdrawalProcessingFee;
    const netAmount = input.amount - fee;

    const withdrawal = await prisma.$transaction(async (tx) => {
      const settledCommissions = await tx.commission.findMany({
        where: { sellerId: input.sellerId, status: 'SETTLED' },
        orderBy: { createdAt: 'asc' },
      });

      let remainingAmount = input.amount;
      const commissionIds: string[] = [];

      for (const commission of settledCommissions) {
        if (remainingAmount <= 0) break;

        const commissionNet = Number(commission.netAmount);
        if (commissionNet <= remainingAmount) {
          commissionIds.push(commission.id);
          remainingAmount -= commissionNet;
        }
      }

      const newWithdrawal = await tx.withdrawal.create({
        data: {
          sellerId: input.sellerId,
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

    await redis.del(`seller:stats:${input.sellerId}`);

    await messageBroker.publish(
      EXCHANGES.SELLER,
      getRoutingKey('SELLER', 'WITHDRAWAL_REQUESTED'),
      {
        withdrawalId: withdrawal.id,
        sellerId: input.sellerId,
        userId: seller.userId,
        amount: input.amount,
        method: input.method,
      }
    );

    return withdrawal;
  }

  async processWithdrawal(withdrawalId: string, approved: boolean, adminId: string, transactionId?: string, reason?: string) {
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: { seller: true },
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
        EXCHANGES.SELLER,
        getRoutingKey('SELLER', 'WITHDRAWAL_PROCESSING'),
        {
          withdrawalId: updated.id,
          sellerId: updated.sellerId,
          userId: withdrawal.seller.userId,
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

      await redis.del(`seller:stats:${withdrawal.sellerId}`);

      await messageBroker.publish(
        EXCHANGES.SELLER,
        getRoutingKey('SELLER', 'WITHDRAWAL_REJECTED'),
        {
          withdrawalId: updated.id,
          sellerId: updated.sellerId,
          userId: withdrawal.seller.userId,
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
      include: { seller: true },
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

    await redis.del(`seller:stats:${withdrawal.sellerId}`);

    await messageBroker.publish(
      EXCHANGES.SELLER,
      getRoutingKey('SELLER', 'WITHDRAWAL_COMPLETED'),
      {
        withdrawalId: updated.id,
        sellerId: updated.sellerId,
        userId: withdrawal.seller.userId,
        amount: updated.netAmount,
        transactionId,
      }
    );

    return updated;
  }

  async listWithdrawals(filters: WithdrawalFilters) {
    const { sellerId, status, method, page = 1, limit = 20 } = filters;

    const where: Prisma.WithdrawalWhereInput = {};
    if (sellerId) where.sellerId = sellerId;
    if (status) where.status = status;
    if (method) where.method = method;

    const [withdrawals, total] = await Promise.all([
      prisma.withdrawal.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          seller: {
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
        seller: {
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
