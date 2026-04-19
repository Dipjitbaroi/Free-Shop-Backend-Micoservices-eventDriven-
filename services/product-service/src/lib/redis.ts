import Redis from 'ioredis';
import config from '../config/index.js';
import { createServiceLogger } from '@freeshop/shared-utils';

const logger = createServiceLogger('product-service');

// Type assertion needed for ESM interop with CommonJS ioredis module
export const redis = new (Redis as any)({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password || undefined,
});

redis.on('connect', () => {
  logger.info('Connected to Redis');
});

redis.on('error', (error: Error) => {
  logger.error('Redis error', error);
});

// Cache helpers
export const cacheGet = async <T>(key: string): Promise<T | null> => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const cacheSet = async (key: string, value: unknown, ttl: number): Promise<void> => {
  await redis.setex(key, ttl, JSON.stringify(value));
};

export const cacheDelete = async (key: string): Promise<void> => {
  await redis.del(key);
};

export const cacheDeletePattern = async (pattern: string): Promise<void> => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};

// Product cache keys
export const productCacheKey = (id: string) => `product:${id}`;
export const productSlugCacheKey = (slug: string) => `product:slug:${slug}`;
export const categoryCacheKey = (id: string) => `category:${id}`;
export const categoryListCacheKey = () => `categories:list`;
