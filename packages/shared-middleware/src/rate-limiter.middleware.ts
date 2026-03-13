import rateLimit, { RateLimitRequestHandler, Options } from 'express-rate-limit';
import { Request, Response } from 'express';
import { createErrorResponse } from '@freeshop/shared-utils';

/**
 * Create a rate limiter with custom options
 */
export const createRateLimiter = (options?: Partial<Options>): RateLimitRequestHandler => {
  return rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10), // 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: (_req: Request, res: Response) => {
      res.status(429).json(
        createErrorResponse(
          'RATE_LIMIT_EXCEEDED',
          'Too many requests, please try again later'
        )
      );
    },
    keyGenerator: (req: Request): string => {
      // Use user ID if authenticated, otherwise IP
      return req.user?.userId || req.ip || 'unknown';
    },
    skip: (req: Request): boolean => {
      // Skip rate limiting for health checks
      return req.path === '/health' || req.path === '/ready';
    },
    ...options,
  });
};

/**
 * Strict rate limiter for auth endpoints (login, register, password reset, etc.)
 * Skips read-only endpoints like /me and /refresh that are called frequently by clients.
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  skip: (req: Request): boolean => {
    // Skip rate limiting for read-only / token management endpoints
    const skipPaths = ['/me', '/refresh', '/verify-email', '/health', '/ready'];
    return req.method === 'GET' || skipPaths.some(p => req.path.endsWith(p));
  },
  message: (_req: Request, res: Response) => {
    res.status(429).json(
      createErrorResponse(
        'RATE_LIMIT_EXCEEDED',
        'Too many authentication attempts, please try again in 15 minutes'
      )
    );
  },
});

/**
 * API rate limiter for general endpoints
 */
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
});

/**
 * Strict rate limiter for sensitive operations
 */
export const strictRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
});

/**
 * Rate limiter for file uploads
 */
export const uploadRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
});

/**
 * Rate limiter for webhooks
 */
export const webhookRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  keyGenerator: (req: Request): string => {
    // Use webhook source identifier
    return req.headers['x-webhook-source'] as string || req.ip || 'unknown';
  },
});
