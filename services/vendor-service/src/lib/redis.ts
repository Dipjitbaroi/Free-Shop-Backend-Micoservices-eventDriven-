import Redis from 'ioredis';
import { config } from '../config/index.js';
import { createServiceLogger } from '@freeshop/shared-utils';

const logger = createServiceLogger('vendor-service');

// Type assertion needed for ESM interop with CommonJS ioredis module
export const redis = new (Redis as any)({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  logger.info('Connected to Redis');
});

redis.on('error', (error: Error) => {
  logger.error('Redis connection error', { error: error.message });
});

export const CACHE_TTL = {
  Vendor_PROFILE: 3600,
  Vendor_STATS: 300,
  Vendor_LIST: 600,
};

