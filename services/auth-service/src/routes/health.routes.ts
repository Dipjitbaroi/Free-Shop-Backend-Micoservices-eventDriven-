import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import { messageBroker } from '../lib/message-broker';

const router: Router = Router();

router.get('/health', async (_req: Request, res: Response) => {
  const checks = {
    database: false,
    redis: false,
    rabbitmq: false,
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch (e) {
    // Database unhealthy
  }

  try {
    await redis.ping();
    checks.redis = true;
  } catch (e) {
    // Redis unhealthy
  }

  checks.rabbitmq = messageBroker.isConnectedToBroker();

  const isHealthy = Object.values(checks).every(Boolean);

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    service: 'auth-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks,
  });
});

router.get('/ready', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ready',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
      error: 'Database not available',
    });
  }
});

export default router;
