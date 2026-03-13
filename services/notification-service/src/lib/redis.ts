import Redis from 'ioredis';
import { config } from '../config';
import logger from '@freeshop/shared-utils';

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  logger.info('Connected to Redis');
});

redis.on('error', (error) => {
  logger.error('Redis connection error', { error: error.message });
});

export const CACHE_TTL = {
  TEMPLATE: 3600,
  PREFERENCE: 1800,
};
