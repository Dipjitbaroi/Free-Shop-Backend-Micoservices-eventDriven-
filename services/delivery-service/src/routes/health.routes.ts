import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/health', async (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'delivery-service' });
});

router.get('/ready', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: 'ready',
      service: 'delivery-service',
      connections: {
        database: 'connected',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      service: 'delivery-service',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/live', (_req: Request, res: Response) => {
  res.json({ status: 'alive', service: 'delivery-service' });
});

export default router;
