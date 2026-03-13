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

// Cache key generators
export const profileCacheKey = (userId: string) => `profile:${userId}`;
export const addressesCacheKey = (userId: string) => `addresses:${userId}`;
export const wishlistCacheKey = (userId: string) => `wishlist:${userId}`;
