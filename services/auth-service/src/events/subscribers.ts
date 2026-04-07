import { messageBroker } from '../lib/message-broker';
import { prisma } from '../lib/prisma';
import { EXCHANGES, getRoutingKey } from '@freeshop/shared-events';
import logger from '@freeshop/shared-utils';

interface VendorCreatedPayload {
  vendorId: string;
  userId: string;
  storeName?: string;
  storeSlug?: string;
}

interface VendorStatusChangedPayload {
  vendorId: string;
  userId: string;
  status: string;
  reason?: string;
}

/**
 * Subscribe to Vendor events so the auth-service can keep the user's role
 * in sync.
 *
 * Vendor.CREATED  → upgrade the user's role from CUSTOMER → Vendor
 * Vendor.STATUS_CHANGED (BANNED | CLOSED) → downgrade role back to CUSTOMER
 */
export const setupEventSubscribers = async (): Promise<void> => {
  // ── Vendor.CREATED ────────────────────────────────────────────────────────
  await messageBroker.subscribe<VendorCreatedPayload>(
    EXCHANGES.VENDOR,
    'auth.Vendor_created',
    getRoutingKey('Vendor', 'CREATED'),
    async (payload) => {
      try {
        if (!payload.userId) {
          logger.warn('Vendor.created event missing userId', { payload });
          return;
        }

        await prisma.user.update({
          where: { id: payload.userId },
          data: { role: 'VENDOR' },
        });

        logger.info('User role upgraded to Vendor', {
          userId: payload.userId,
          vendorId: payload.vendorId,
        });
      } catch (error) {
        logger.error('Failed to upgrade user role to Vendor', {
          userId: payload.userId,
          error: (error as Error).message,
        });
        throw error; // re-throw so the broker can nack/retry
      }
    }
  );

  // ── Vendor.STATUS_CHANGED ─────────────────────────────────────────────────
  await messageBroker.subscribe<VendorStatusChangedPayload>(
    EXCHANGES.VENDOR,
    'auth.Vendor_status_changed',
    getRoutingKey('Vendor', 'STATUS_CHANGED'),
    async (payload) => {
      try {
        if (!payload.userId) {
          logger.warn('Vendor.status_changed event missing userId', { payload });
          return;
        }

        const revokeRoles = ['BANNED', 'CLOSED'];
        if (revokeRoles.includes(payload.status)) {
          await prisma.user.update({
            where: { id: payload.userId },
            data: { role: 'CUSTOMER' },
          });

          logger.info('User role downgraded to CUSTOMER (Vendor banned/closed)', {
            userId: payload.userId,
            vendorId: payload.vendorId,
            status: payload.status,
          });
        }
      } catch (error) {
        logger.error('Failed to handle Vendor status change', {
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

