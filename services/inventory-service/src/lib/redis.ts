import Redis from 'ioredis';
import config from '../config';
import { logger } from '@freeshop/shared-utils';

export const redis = new Redis(config.redis.url, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('error', (err) => {
  logger.error('Redis connection error', err);
});

redis.on('connect', () => {
  logger.info('Connected to Redis');
});

// Distributed locking for inventory operations
export const acquireLock = async (key: string, ttlSeconds: number = 10): Promise<boolean> => {
  const result = await redis.set(
    `lock:${key}`,
    '1',
    'EX',
    ttlSeconds,
    'NX'
  );
  return result === 'OK';
};

export const releaseLock = async (key: string): Promise<void> => {
  await redis.del(`lock:${key}`);
};

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
