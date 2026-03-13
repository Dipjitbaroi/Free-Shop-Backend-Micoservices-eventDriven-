import Redis from 'ioredis';
import config from '../config';
import { createServiceLogger } from '@freeshop/shared-utils';

const logger = createServiceLogger('auth-service');

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password || undefined,
  retryStrategy: (times) => {
    if (times > 3) {
      logger.error('Redis connection failed after 3 retries');
      return null;
    }
    return Math.min(times * 100, 3000);
  },
});

redis.on('connect', () => {
  logger.info('Connected to Redis');
});

redis.on('error', (error) => {
  logger.error('Redis error', error);
});

// Token blacklist operations
export const blacklistToken = async (token: string, expiresIn: number): Promise<void> => {
  await redis.setex(`blacklist:${token}`, expiresIn, '1');
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const result = await redis.get(`blacklist:${token}`);
  return result === '1';
};

// Rate limiting
export const checkRateLimit = async (key: string, limit: number, window: number): Promise<boolean> => {
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, window);
  }
  return current <= limit;
};

// Session management
export const storeSession = async (userId: string, sessionId: string, ttl: number): Promise<void> => {
  await redis.setex(`session:${userId}:${sessionId}`, ttl, '1');
  await redis.sadd(`user_sessions:${userId}`, sessionId);
  await redis.expire(`user_sessions:${userId}`, ttl);
};

export const invalidateSession = async (userId: string, sessionId: string): Promise<void> => {
  await redis.del(`session:${userId}:${sessionId}`);
  await redis.srem(`user_sessions:${userId}`, sessionId);
};

export const invalidateAllSessions = async (userId: string): Promise<void> => {
  const sessions = await redis.smembers(`user_sessions:${userId}`);
  for (const sessionId of sessions) {
    await redis.del(`session:${userId}:${sessionId}`);
  }
  await redis.del(`user_sessions:${userId}`);
};
