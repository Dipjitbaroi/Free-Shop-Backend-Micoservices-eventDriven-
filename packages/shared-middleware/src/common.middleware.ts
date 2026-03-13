import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import hpp from 'hpp';
import onFinished from 'on-finished';

/**
 * Request ID middleware - adds unique ID to each request
 */
export const requestId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = req.headers['x-request-id'] as string || uuidv4();
  req.requestId = id;
  res.setHeader('X-Request-ID', id);
  next();
};

/**
 * Response time header middleware
 */
export const responseTime = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = process.hrtime();

  const originalEnd = res.end.bind(res) as typeof res.end;
  (res as any).end = function (...args: Parameters<typeof res.end>) {
    if (!res.headersSent) {
      const diff = process.hrtime(start);
      const time = diff[0] * 1e3 + diff[1] * 1e-6;
      res.setHeader('X-Response-Time', `${time.toFixed(2)}ms`);
    }
    return originalEnd.apply(res, args as any);
  };

  next();
};

/**
 * Security headers middleware using helmet
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

/**
 * CORS middleware configuration
 */
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    const rawOrigins = process.env.CORS_ORIGIN || '*';
    const allowedOrigins = rawOrigins.split(',').map(o => o.trim()).filter(Boolean);

    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Request-ID',
    'X-Guest-ID',
    'X-Correlation-ID',
  ],
  exposedHeaders: ['X-Request-ID', 'X-Response-Time', 'X-Total-Count'],
  maxAge: 86400, // 24 hours
});

/**
 * Compression middleware
 */
export const compressionMiddleware = compression({
  filter: (req: Request, res: Response): boolean => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 1024, // Only compress responses > 1KB
});

/**
 * HTTP Parameter Pollution protection
 */
export const hppMiddleware = hpp({
  whitelist: ['sort', 'filter', 'fields', 'page', 'limit'],
});

const SKIP_LOG_PATHS = new Set(['/health', '/ready', '/ping']);

const statusColor = (status: number): string => {
  if (status >= 500) return '\x1b[31m'; // red
  if (status >= 400) return '\x1b[33m'; // yellow
  if (status >= 300) return '\x1b[36m'; // cyan
  return '\x1b[32m';                    // green
};

/**
 * HTTP request logger.
 * Uses on-finished (socket-level) so it works correctly with reverse-proxy
 * middleware (http-proxy-middleware) where res.writeHead is never called
 * through Express, which breaks morgan's on-headers hook.
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Skip noisy health-check routes
  if (SKIP_LOG_PATHS.has(req.url)) {
    next();
    return;
  }

  const start = process.hrtime.bigint();
  const { method, originalUrl } = req;

  onFinished(res, () => {
    const ns = process.hrtime.bigint() - start;
    const ms = (Number(ns) / 1e6).toFixed(2);
    const status = res.statusCode;
    const contentLength = res.getHeader('content-length') ?? '-';
    const useColor = process.stdout.isTTY;
    const color  = useColor ? statusColor(status) : '';
    const reset  = useColor ? '\x1b[0m' : '';
    // eslint-disable-next-line no-console
    console.log(`${method} ${originalUrl} ${color}${status}${reset} ${contentLength} - ${ms} ms`);
  });

  next();
};

/** @deprecated Use requestLogger instead */
export const httpLogger = requestLogger;
/**
 * JSON body size limiter
 */
export const jsonSizeLimit = (limit: string = '10mb') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    const maxSize = parseSize(limit);

    if (contentLength > maxSize) {
      res.status(413).json({
        success: false,
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: `Request body exceeds maximum size of ${limit}`,
        },
      });
      return;
    }

    next();
  };
};

// Helper to parse size strings
const parseSize = (size: string): number => {
  const match = size.match(/^(\d+)(kb|mb|gb)?$/i);
  if (!match) return 0;

  const num = parseInt(match[1], 10);
  const unit = (match[2] || 'b').toLowerCase();

  const units: Record<string, number> = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
  };

  return num * (units[unit] || 1);
};
