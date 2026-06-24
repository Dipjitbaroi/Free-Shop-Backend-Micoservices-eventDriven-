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
import RBACService from './services/rbac.service.js';

const logger = createServiceLogger('auth-service');
const PORT = process.env.AUTH_SERVICE_PORT || 3001;

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await prisma.$connect();
    logger.info('Connected to PostgreSQL');

    // Initialize RBAC FIRST (creates default roles & permissions if not already present)
    // This is database-only work and must complete before message broker connection
    // so the auth-service can start even if RabbitMQ is temporarily unavailable.
    try {
      await RBACService.initializeDefaultRoles();
      logger.info('RBAC system initialized');
    } catch (err: any) {
      logger.warn('RBAC initialization warning', { message: err?.message });
    }

    // Connect to message broker (non-fatal: service can run without events for RBAC)
    try {
      await messageBroker.connect();
      logger.info('Connected to RabbitMQ');
    } catch (err: any) {
      logger.warn('Message broker connection failed; continuing without events', { message: err?.message });
    }

    // Register event subscribers
    await setupEventSubscribers();

    // Start server
    app.listen(PORT, () => {
      logger.info(`Auth Service running on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully...`);
      await prisma.$disconnect();
      await messageBroker.close();
      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', reason as Error, { promise: String(promise) });
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', error);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server', error as Error);
    process.exit(1);
  }
};

startServer();
