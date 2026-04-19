import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { redis } from '../lib/redis.js';
import { messageBroker } from '../lib/message-broker.js';

const router: Router = Router();

router.get('/health', async (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'vendor-service' });
});

router.get('/ready', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await redis.ping();
    const rabbitmqConnected = messageBroker.isConnectedToBroker();

    if (!rabbitmqConnected) {
      throw new Error('RabbitMQ not connected');
    }

    res.json({ 
      status: 'ready', 
      service: 'vendor-service',
      connections: {
        database: 'connected',
        redis: 'connected',
        rabbitmq: 'connected',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      service: 'vendor-service',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/live', (_req: Request, res: Response) => {
  res.json({ status: 'alive', service: 'vendor-service' });
});

export default router;

