import { messageBroker } from '../lib/message-broker';
import { Events, Queues, IUserCreatedEvent, IUserDeletedEvent } from '@freeshop/shared-events';
import { prisma } from '../lib/prisma';
import { logger } from '@freeshop/shared-utils';

export async function setupEventSubscribers(): Promise<void> {
  // Subscribe to user created events from auth service
  await messageBroker.subscribe<IUserCreatedEvent>(
    Queues.USER_EVENTS,
    Events.USER_CREATED,
    async (event) => {
      logger.info('User service received user created event', { userId: event.userId });
      
      // Create user profile automatically
      await prisma.userProfile.create({
        data: {
          userId: event.userId,
          email: event.email,
          firstName: event.firstName,
          lastName: event.lastName,
          phone: event.phone ?? undefined,
          avatar: event.avatar ?? undefined,
        },
      }).catch(err => {
        // Profile might already exist
        logger.warn('Failed to create user profile', { 
          userId: event.userId, 
          error: err.message 
        });
      });
    }
  );

  // Subscribe to user deleted events
  await messageBroker.subscribe<IUserDeletedEvent>(
    Queues.USER_EVENTS,
    Events.USER_DELETED,
    async (event) => {
      logger.info('User service received user deleted event', { userId: event.userId });
      
      // Delete user profile and related data
      const profile = await prisma.userProfile.findUnique({
        where: { userId: event.userId },
      });

      if (profile) {
        await prisma.userProfile.delete({
          where: { id: profile.id },
        }).catch(err => {
          logger.error('Failed to delete user profile', { 
            userId: event.userId, 
            error: err.message 
          });
        });
      }

      // Clean up recently viewed
      await prisma.recentlyViewed.deleteMany({
        where: { userId: event.userId },
      }).catch(err => {
        logger.error('Failed to delete recently viewed', { 
          userId: event.userId, 
          error: err.message 
        });
      });
    }
  );

  logger.info('User service event subscribers initialized');
}
