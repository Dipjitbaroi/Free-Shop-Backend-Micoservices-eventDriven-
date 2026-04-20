import Redis from 'ioredis';
import config from '../config/index.js';
import { createServiceLogger } from '@freeshop/shared-utils';

const logger = createServiceLogger('payment-service');

export const redis = new (Redis as any)(config.redis.url, {
  maxRetriesPerRequest: 3,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('error', (err: Error) => {
  logger.error('Redis connection error', err);
});

redis.on('connect', () => {
  logger.info('Connected to Redis');
});

// Cache helpers
export const cacheGet = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const cacheSet = async (key: string, data: unknown, ttlSeconds?: number): Promise<void> => {
  try {
    if (ttlSeconds) {
      await redis.setex(key, ttlSeconds, JSON.stringify(data));
    } else {
      await redis.set(key, JSON.stringify(data));
    }
  } catch (err) {
    logger.error('Cache set error', err as Error);
  }
};

export const cacheDelete = async (key: string): Promise<void> => {
  try {
    await redis.del(key);
  } catch (err) {
    logger.error('Cache delete error', err as Error);
  }
};

// Token storage for payment gateways
export const storeGatewayToken = async (gateway: string, token: string, expiresIn: number): Promise<void> => {
  await redis.setex(`gateway:${gateway}:token`, expiresIn, token);
};

export const getGatewayToken = async (gateway: string): Promise<string | null> => {
  return redis.get(`gateway:${gateway}:token`);
};
