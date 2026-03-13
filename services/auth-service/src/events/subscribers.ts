import { messageBroker } from '../lib/message-broker';
import { prisma } from '../lib/prisma';
import { EXCHANGES, getRoutingKey } from '@freeshop/shared-events';
import logger from '@freeshop/shared-utils';

interface SellerCreatedPayload {
  sellerId: string;
  userId: string;
  storeName?: string;
  storeSlug?: string;
}

interface SellerStatusChangedPayload {
  sellerId: string;
  userId: string;
  status: string;
  reason?: string;
}

/**
 * Subscribe to seller events so the auth-service can keep the user's role
 * in sync.
 *
 * SELLER.CREATED  → upgrade the user's role from CUSTOMER → SELLER
 * SELLER.STATUS_CHANGED (BANNED | CLOSED) → downgrade role back to CUSTOMER
 */
export const setupEventSubscribers = async (): Promise<void> => {
  // ── SELLER.CREATED ────────────────────────────────────────────────────────
  await messageBroker.subscribe<SellerCreatedPayload>(
    EXCHANGES.SELLER,
    'auth.seller_created',
    getRoutingKey('SELLER', 'CREATED'),
    async (payload) => {
      try {
        if (!payload.userId) {
          logger.warn('seller.created event missing userId', { payload });
          return;
        }

        await prisma.user.update({
          where: { id: payload.userId },
          data: { role: 'SELLER' },
        });

        logger.info('User role upgraded to SELLER', {
          userId: payload.userId,
          sellerId: payload.sellerId,
        });
      } catch (error) {
        logger.error('Failed to upgrade user role to SELLER', {
          userId: payload.userId,
          error: (error as Error).message,
        });
        throw error; // re-throw so the broker can nack/retry
      }
    }
  );

  // ── SELLER.STATUS_CHANGED ─────────────────────────────────────────────────
  await messageBroker.subscribe<SellerStatusChangedPayload>(
    EXCHANGES.SELLER,
    'auth.seller_status_changed',
    getRoutingKey('SELLER', 'STATUS_CHANGED'),
    async (payload) => {
      try {
        if (!payload.userId) {
          logger.warn('seller.status_changed event missing userId', { payload });
          return;
        }

        const revokeRoles = ['BANNED', 'CLOSED'];
        if (revokeRoles.includes(payload.status)) {
          await prisma.user.update({
            where: { id: payload.userId },
            data: { role: 'CUSTOMER' },
          });

          logger.info('User role downgraded to CUSTOMER (seller banned/closed)', {
            userId: payload.userId,
            sellerId: payload.sellerId,
            status: payload.status,
          });
        }
      } catch (error) {
        logger.error('Failed to handle seller status change', {
          userId: payload.userId,
          status: payload.status,
          error: (error as Error).message,
        });
        throw error;
      }
    }
  );

  logger.info('Auth service event subscribers registered');
};
