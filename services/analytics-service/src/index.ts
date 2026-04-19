import app from './app.js';
import { config } from './config/index.js';
import { prisma } from './lib/prisma.js';
import { messageBroker } from './lib/message-broker.js';
import { redis } from './lib/redis.js';
import { setupEventSubscribers } from './events/subscribers.js';
import { createServiceLogger } from '@freeshop/shared-utils';

const logger = createServiceLogger('analytics-service');

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('Connected to PostgreSQL database');

    await messageBroker.connect();
    logger.info('Connected to RabbitMQ');

    await redis.ping();
    logger.info('Connected to Redis');

    await setupEventSubscribers();
    logger.info('Event subscribers initialized');

    app.listen(config.port, () => {
      logger.info(`Analytics Service running on port ${config.port}`, {
        environment: config.nodeEnv,
        service: 'analytics-service',
      });
    });
  } catch (error) {
    logger.error('Failed to start Analytics Service', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
};

const shutdown = async (): Promise<void> => {
  logger.info('Shutting down Analytics Service...');

  try {
    await prisma.$disconnect();
    await messageBroker.close();
    await redis.quit();
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', { reason });
});
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message });
  process.exit(1);
});

startServer();
