import { ReservationStatus, MovementType } from '../../generated/client/client.js';
import { prisma } from '../lib/prisma.js';
import { eventPublisher } from '../lib/message-broker.js';
import { Events } from '@freeshop/shared-events';
import { acquireLock, releaseLock } from '../lib/redis.js';
import { createServiceLogger } from '@freeshop/shared-utils';

const logger = createServiceLogger('inventory-cleanup');

export class CleanupService {
  /**
   * Release expired reservations (cron job)
   * Called periodically to clean up reservations that have exceeded expiresAt
   */
  async releaseExpiredReservations(): Promise<number> {
    logger.info('Starting expired reservations cleanup');

    const expiredReservations = await prisma.stockReservation.findMany({
      where: {
        status: ReservationStatus.PENDING,
        expiresAt: {
          lt: new Date(), // expiresAt is in the past
        },
      },
      include: { inventory: true },
    });

    if (expiredReservations.length === 0) {
      logger.info('No expired reservations found');
      return 0;
    }

    logger.info(`Found ${expiredReservations.length} expired reservations`, {
      count: expiredReservations.length,
    });

    let released = 0;

    for (const reservation of expiredReservations) {
      const lockKey = `inventory:${reservation.inventoryId}`;
      const locked = await acquireLock(lockKey, 30); // 30 second timeout for cleanup

      if (!locked) {
        logger.warn('Could not acquire lock for expired reservation release', {
          reservationId: reservation.id,
          orderId: reservation.orderId,
        });
        continue;
      }

      try {
        await prisma.$transaction([
          prisma.stockReservation.update({
            where: { id: reservation.id },
            data: {
              status: ReservationStatus.RELEASED,
              releasedAt: new Date(),
            },
          }),
          prisma.inventory.update({
            where: { id: reservation.inventoryId },
            data: {
              reservedStock: { decrement: reservation.quantity },
              availableStock: { increment: reservation.quantity },
              isOutOfStock: false,
              isLowStock: reservation.inventory.availableStock + reservation.quantity <= reservation.inventory.lowStockThreshold,
            },
          }),
        ]);

        // Record movement
        await prisma.stockMovement.create({
          data: {
            inventoryId: reservation.inventoryId,
            type: MovementType.RELEASE,
            quantity: reservation.quantity,
            reason: 'Reservation expired',
            reference: `ORDER:${reservation.orderId}`,
            previousStock: reservation.inventory.availableStock,
            newStock: reservation.inventory.availableStock + reservation.quantity,
            performedBy: 'SYSTEM:CLEANUP',
          },
        });

        logger.info('Released expired reservation', {
          reservationId: reservation.id,
          orderId: reservation.orderId,
          quantity: reservation.quantity,
        });

        released++;

        // Publish event
        await eventPublisher.publish(Events.INVENTORY_EXPIRED_RESERVATION_RELEASED, {
          orderId: reservation.orderId,
          reservationId: reservation.id,
          quantity: reservation.quantity,
          expiresAt: reservation.expiresAt,
        });
      } catch (error) {
        logger.error('Failed to release expired reservation', {
          error: error instanceof Error ? error.message : 'Unknown error',
          reservationId: reservation.id,
          orderId: reservation.orderId,
        });
      } finally {
        await releaseLock(lockKey);
      }
    }

    logger.info('Expired reservations cleanup completed', { released });
    return released;
  }

  /**
   * Compensate (rollback) a failed multi-item order reservation
   * When one item in an order fails to reserve, this releases all previously reserved items
   */
  async compensateFailedReservation(orderId: string, reason: string = 'Partial reservation failure'): Promise<number> {
    logger.info('Starting compensation for failed reservation', {
      orderId,
      reason,
    });

    const reservations = await prisma.stockReservation.findMany({
      where: {
        orderId,
        status: ReservationStatus.PENDING,
      },
      include: { inventory: true },
    });

    if (reservations.length === 0) {
      logger.info('No pending reservations to compensate', { orderId });
      return 0;
    }

    let compensated = 0;

    for (const reservation of reservations) {
      const lockKey = `inventory:${reservation.inventoryId}`;
      const locked = await acquireLock(lockKey);

      if (!locked) {
        logger.warn('Could not acquire lock for compensation', {
          orderId,
          reservationId: reservation.id,
        });
        continue;
      }

      try {
        await prisma.$transaction([
          prisma.stockReservation.update({
            where: { id: reservation.id },
            data: {
              status: ReservationStatus.RELEASED,
              releasedAt: new Date(),
            },
          }),
          prisma.inventory.update({
            where: { id: reservation.inventoryId },
            data: {
              reservedStock: { decrement: reservation.quantity },
              availableStock: { increment: reservation.quantity },
              isOutOfStock: false,
              isLowStock: reservation.inventory.availableStock + reservation.quantity <= reservation.inventory.lowStockThreshold,
            },
          }),
        ]);

        // Record movement
        await prisma.stockMovement.create({
          data: {
            inventoryId: reservation.inventoryId,
            type: MovementType.COMPENSATION,
            quantity: reservation.quantity,
            reason: `Compensation: ${reason}`,
            reference: `ORDER:${orderId}`,
            previousStock: reservation.inventory.availableStock,
            newStock: reservation.inventory.availableStock + reservation.quantity,
            performedBy: 'SYSTEM:COMPENSATION',
          },
        });

        logger.info('Compensated reservation', {
          orderId,
          reservationId: reservation.id,
          quantity: reservation.quantity,
        });

        compensated++;
      } catch (error) {
        logger.error('Failed to compensate reservation', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId,
          reservationId: reservation.id,
        });
      } finally {
        await releaseLock(lockKey);
      }
    }

    logger.info('Compensation completed', { orderId, compensated });
    return compensated;
  }

  /**
   * Release inventory when payment is refunded
   */
  async handlePaymentRefund(orderId: string, refundAmount?: number): Promise<number> {
    logger.info('Processing refund for order', { orderId, refundAmount });

    const reservations = await prisma.stockReservation.findMany({
      where: {
        orderId,
        status: ReservationStatus.FULFILLED,
      },
      include: { inventory: true },
    });

    if (reservations.length === 0) {
      logger.info('No fulfilled reservations to refund', { orderId });
      return 0;
    }

    let refunded = 0;

    for (const reservation of reservations) {
      const lockKey = `inventory:${reservation.inventoryId}`;
      const locked = await acquireLock(lockKey);

      if (!locked) {
        logger.warn('Could not acquire lock for refund', {
          orderId,
          reservationId: reservation.id,
        });
        continue;
      }

      try {
        await prisma.$transaction([
          prisma.stockReservation.update({
            where: { id: reservation.id },
            data: {
              status: ReservationStatus.REFUNDED,
              releasedAt: new Date(),
            },
          }),
          prisma.inventory.update({
            where: { id: reservation.inventoryId },
            data: {
              totalStock: { increment: reservation.quantity },
              availableStock: { increment: reservation.quantity },
              isOutOfStock: false,
              isLowStock: reservation.inventory.availableStock + reservation.quantity <= reservation.inventory.lowStockThreshold,
            },
          }),
        ]);

        // Record movement
        await prisma.stockMovement.create({
          data: {
            inventoryId: reservation.inventoryId,
            type: MovementType.REFUND,
            quantity: reservation.quantity,
            reason: 'Payment refunded',
            reference: `ORDER:${orderId}`,
            previousStock: reservation.inventory.availableStock,
            newStock: reservation.inventory.availableStock + reservation.quantity,
            performedBy: 'SYSTEM:REFUND',
          },
        });

        logger.info('Refunded inventory for order', {
          orderId,
          reservationId: reservation.id,
          quantity: reservation.quantity,
        });

        refunded++;

        // Publish event
        await eventPublisher.publish(Events.INVENTORY_REFUNDED, {
          orderId,
          reservationId: reservation.id,
          quantity: reservation.quantity,
        });
      } catch (error) {
        logger.error('Failed to refund inventory', {
          error: error instanceof Error ? error.message : 'Unknown error',
          orderId,
          reservationId: reservation.id,
        });
      } finally {
        await releaseLock(lockKey);
      }
    }

    logger.info('Refund processing completed', { orderId, refunded });
    return refunded;
  }
}

export const cleanupService = new CleanupService();
