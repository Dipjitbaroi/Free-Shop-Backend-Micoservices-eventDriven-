import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import app from './app.js';
import { createServiceLogger } from '@freeshop/shared-utils';
import { prisma } from './lib/prisma.js';
import { messageBroker } from './lib/message-broker.js';
import { setupEventSubscribers } from './events/subscribers.js';

const logger = createServiceLogger('user-service');
const PORT = process.env.USER_SERVICE_PORT || 3002;

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('Connected to PostgreSQL');

    await messageBroker.connect();
    logger.info('Connected to RabbitMQ');

    await setupEventSubscribers();
    logger.info('Event subscribers setup complete');

    app.listen(PORT, () => {
      logger.info(`User Service running on port ${PORT}`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully...`);
      await prisma.$disconnect();
      await messageBroker.close();
      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server', error as Error);
    process.exit(1);
  }
};

startServer();
