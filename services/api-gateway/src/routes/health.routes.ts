import { Router, Request, Response } from 'express';
import axios from 'axios';
import config from '../config';

const router = Router();

interface ServiceHealth {
  name: string;
  status: 'healthy' | 'unhealthy';
  responseTime?: number;
  error?: string;
}

// Basic health check
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Readiness check (checks all downstream services)
router.get('/ready', async (_req: Request, res: Response) => {
  const services: ServiceHealth[] = [];
  
  for (const [key, service] of Object.entries(config.services)) {
    const startTime = Date.now();
    try {
      await axios.get(`${service.url}${service.healthCheck}`, {
        timeout: 5000,
      });
      services.push({
        name: key,
        status: 'healthy',
        responseTime: Date.now() - startTime,
      });
    } catch (error) {
      services.push({
        name: key,
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  const allHealthy = services.every(s => s.status === 'healthy');
  
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'ready' : 'not ready',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    dependencies: services,
  });
});

// Liveness probe
router.get('/live', (_req: Request, res: Response) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
});

export { router as healthRoutes };
