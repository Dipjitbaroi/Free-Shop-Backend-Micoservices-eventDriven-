import rateLimit, { RateLimitRequestHandler, Options } from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { createErrorResponse } from '@freeshop/shared-utils';
import { PERMISSION_CODES } from '@freeshop/shared-types';

// ---------------------------------------------------------------------------
// Tier classification
// ---------------------------------------------------------------------------
// Roles are NOT stored in the JWT (they live in the RBAC DB and change over
// time). The gateway therefore cannot read "this is an admin" from the token.
// Instead, every request whose user has been augmented with `req.user.permissions`
// is classified by the *highest* tier their permissions grant. Anonymous
// traffic falls into the `anonymous` tier.
//
// Tiers are ordered by expected workload. A user with permissions spanning
// multiple tiers (e.g. SUPERADMIN) always lands in the highest tier.

export type RateLimitTier = 'anonymous' | 'customer' | 'vendor' | 'manager' | 'admin';

const TIER_RANK: Record<RateLimitTier, number> = {
  anonymous: 0,
  customer: 1,
  vendor: 2,
  manager: 3,
  admin: 4,
};

// Permission codes that "promote" a user into a higher workload tier.
// Add codes here as you introduce new privileged roles — the rate limiter
// automatically adapts.
const TIER_PROMOTING_PERMISSIONS: Record<RateLimitTier, number[]> = {
  anonymous: [],
  customer: [],
  vendor: [
    PERMISSION_CODES.PRODUCT_CREATE,
    PERMISSION_CODES.ORDER_CREATE,
    PERMISSION_CODES.DELIVERY_CREATE,
  ],
  manager: [
    PERMISSION_CODES.ORDER_APPROVE,
    PERMISSION_CODES.PRODUCT_UPDATE_PRICE,
    PERMISSION_CODES.CATEGORY_CREATE,
    PERMISSION_CODES.BANNER_CREATE,
    PERMISSION_CODES.ANALYTICS_VIEW_PLATFORM_METRICS,
    PERMISSION_CODES.USER_READ,
  ],
  admin: [
    PERMISSION_CODES.ADMIN_PANEL_ACCESS,
    PERMISSION_CODES.USER_MANAGEMENT_DELETE,
    PERMISSION_CODES.ROLE_CREATE,
    PERMISSION_CODES.PERMISSION_CREATE,
    PERMISSION_CODES.SETTINGS_UPDATE,
  ],
};

/**
 * Determine the highest tier a user's permissions grant them.
 * Falls back to `anonymous` if no permissions are attached.
 */
export const classifyTier = (
  permissions: number[] | undefined
): RateLimitTier => {
  if (!permissions || permissions.length === 0) return 'anonymous';

  let best: RateLimitTier = 'customer';
  for (const tier of ['vendor', 'manager', 'admin'] as RateLimitTier[]) {
    const required = TIER_PROMOTING_PERMISSIONS[tier];
    const hasAny = required.some((code) => permissions.includes(code));
    if (hasAny && TIER_RANK[tier] > TIER_RANK[best]) {
      best = tier;
    }
  }
  return best;
};

// ---------------------------------------------------------------------------
// decodeJwtPayload — extract the JWT payload without verifying the signature
// ---------------------------------------------------------------------------
// The gateway's tier-aware rate limiter runs as a GLOBAL middleware, before
// the per-route `optionalAuth` that would normally populate `req.user`. To
// still recognize authenticated admins/manager/customers (and not collapse
// them into the anonymous bucket) we decode the bearer token's payload
// directly. This is safe for *bucket keying only* — the request body and
// payload are still verified by the downstream service that handles the
// call. A forged token will at worst give the caller a higher rate-limit
// cap; it cannot access protected data because downstream auth middleware
// will reject it.
function decodeJwtPayload(token: string): { userId?: string; type?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], 'base64url').toString('utf8');
    const json = JSON.parse(payload);
    if (typeof json !== 'object' || json === null) return null;
    return { userId: json.userId, type: json.type };
  } catch {
    return null;
  }
}

function getBearerUserId(req: Request): string | undefined {
  if (req.user?.userId) return req.user.userId;
  const header = (req.headers.authorization || '') as string;
  if (!header.startsWith('Bearer ')) return undefined;
  const payload = decodeJwtPayload(header.slice(7));
  if (!payload?.userId || payload.type === 'guest') return undefined;
  return payload.userId;
}

// ---------------------------------------------------------------------------
// attachPermissions — non-blocking middleware
// ---------------------------------------------------------------------------
// Populates `req.user.permissions` with the user's permission codes by
// calling the auth-service RBAC endpoint. Failures are non-fatal: the
// request still proceeds but lands in the `customer` tier. This keeps
// a flaky auth-service from locking everyone out.
//
// If `req.user` is undefined (the route didn't mount `optionalAuth`),
// we still attempt to look up the userId from the raw bearer token so
// authenticated requests on routes like `/api/v1/products` get their
// correct tier instead of falling into the anonymous bucket.

export const attachPermissions = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = getBearerUserId(req);
  if (!userId) {
    next();
    return;
  }
  // Make sure req.user exists so downstream code (and the rate limiter)
  // can rely on it.
  if (!req.user) {
    (req as any).user = { userId };
  }
  // Already populated by an earlier middleware in the chain.
  if ((req.user as any).permissions) {
    next();
    return;
  }
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    const url = `${process.env.AUTH_SERVICE_URL || 'http://auth-service:3001'}/rbac/users/${userId}/roles`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 500,
    });
    const codes: number[] = res.data?.data?.permissionCodes || [];
    (req.user as any).permissions = codes;
    (req.user as any).tier = classifyTier(codes);
  } catch {
    // On failure, do not block the request. Use empty permissions.
    (req.user as any).permissions = [];
    (req.user as any).tier = 'customer';
  }
  next();
};

// ---------------------------------------------------------------------------
// Per-tier limits (env-overridable)
// ---------------------------------------------------------------------------
const TIER_MAX_REQUESTS: Record<RateLimitTier, number> = {
  anonymous: parseInt(process.env.RATE_LIMIT_ANONYMOUS_MAX || '300', 10),
  customer: parseInt(process.env.RATE_LIMIT_CUSTOMER_MAX || '300', 10),
  vendor: parseInt(process.env.RATE_LIMIT_VENDOR_MAX || '600', 10),
  manager: parseInt(process.env.RATE_LIMIT_MANAGER_MAX || '1500', 10),
  admin: parseInt(process.env.RATE_LIMIT_ADMIN_MAX || '3000', 10),
};

const TIER_WINDOW_MS = parseInt(
  process.env.RATE_LIMIT_WINDOW_MS || '60000',
  10
);

// ---------------------------------------------------------------------------
// createRateLimiter — the underlying factory
// ---------------------------------------------------------------------------
export const createRateLimiter = (
  options?: Partial<Options>
): RateLimitRequestHandler => {
  return rateLimit({
    windowMs: TIER_WINDOW_MS,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '300', 10),
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
      // Namespace by tier first, then by identity. Two anonymous users on the
      // same NAT get ONE bucket; an admin in the same office gets a SEPARATE
      // admin bucket. A customer logged in is isolated from both.
      const tier = resolveTier(req);
      const userId = getBearerUserId(req);
      if (userId) return `${tier}:user:${userId}`;
      const xff = (req.headers['x-forwarded-for'] as string) || '';
      const clientIp =
        xff.split(',')[0]?.trim() ||
        req.ip ||
        req.socket?.remoteAddress ||
        'unknown';
      return `${tier}:ip:${clientIp}`;
    },
    // Tier-aware limit: pick the per-tier cap on every request.
    ...options,
  });
};

// ---------------------------------------------------------------------------
// resolveTier — pick the best tier for a request
// ---------------------------------------------------------------------------
// Priority: req.user.tier (set by attachPermissions) > decoded token userId
// (still classified as `customer` because we have no permissions yet) >
// `anonymous` if no bearer token.
function resolveTier(req: Request): RateLimitTier {
  const userId = getBearerUserId(req);
  if (!userId) return 'anonymous';
  const declared = (req.user as any)?.tier as RateLimitTier | undefined;
  if (declared && TIER_RANK[declared] >= TIER_RANK.customer) return declared;
  // No RBAC info yet — assume the most common authenticated tier.
  return 'customer';
}

// ---------------------------------------------------------------------------
// tierAwareRateLimiter — the limiter you actually want for general routes
// ---------------------------------------------------------------------------
/**
 * Drop-in replacement for `apiRateLimiter`. Buckets are tiered:
 *   anonymous → RATE_LIMIT_ANONYMOUS_MAX
 *   customer  → RATE_LIMIT_CUSTOMER_MAX
 *   vendor    → RATE_LIMIT_VENDOR_MAX
 *   manager   → RATE_LIMIT_MANAGER_MAX
 *   admin     → RATE_LIMIT_ADMIN_MAX
 *
 * Works whether or not `attachPermissions` ran earlier: authenticated
 * requests get at minimum the `customer` bucket and (when permissions are
 * available) are promoted to the correct privileged tier.
 */
export const tierAwareRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: TIER_WINDOW_MS,
  // The `max` here is the per-key ceiling; we override per-tier via the
  // dynamic `max` callback (express-rate-limit v7+).
  max: (req: Request): number => {
    return TIER_MAX_REQUESTS[resolveTier(req)];
  },
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
    const tier = resolveTier(req);
    const userId = getBearerUserId(req);
    if (userId) return `${tier}:user:${userId}`;
    const xff = (req.headers['x-forwarded-for'] as string) || '';
    const clientIp =
      xff.split(',')[0]?.trim() ||
      req.ip ||
      req.socket?.remoteAddress ||
      'unknown';
    return `${tier}:ip:${clientIp}`;
  },
});

// Backwards-compatible alias for any existing import.
export const apiRateLimiter = tierAwareRateLimiter;

// ---------------------------------------------------------------------------
// Strict limiters (unchanged semantics, env-driven limits)
// ---------------------------------------------------------------------------
export const adminRateLimiter = createRateLimiter({
  windowMs: parseInt(process.env.ADMIN_RATE_LIMIT_WINDOW_MS || '60000', 10),
  max: parseInt(process.env.ADMIN_RATE_LIMIT_MAX_REQUESTS || '3000', 10),
  keyGenerator: (req: Request): string => {
    if (req.user?.userId) return `admin:${req.user.userId}`;
    const xff = (req.headers['x-forwarded-for'] as string) || '';
    return `admin:ip:${
      xff.split(',')[0]?.trim() || req.ip || req.socket?.remoteAddress || 'unknown'
    }`;
  },
});

export const strictRateLimiter = createRateLimiter({
  windowMs: parseInt(process.env.STRICT_RATE_LIMIT_WINDOW_MS || '3600000', 10),
  max: parseInt(process.env.STRICT_RATE_LIMIT_MAX_REQUESTS || '5', 10),
});

export const uploadRateLimiter = createRateLimiter({
  windowMs: parseInt(process.env.UPLOAD_RATE_LIMIT_WINDOW_MS || '3600000', 10),
  max: parseInt(process.env.UPLOAD_RATE_LIMIT_MAX_REQUESTS || '200', 10),
});

export const authRateLimiter = createRateLimiter({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '20', 10),
  skip: (req: Request): boolean => {
    const skipPaths = ['/me', '/refresh', '/verify-email', '/health', '/ready'];
    return req.method === 'GET' || skipPaths.some((p) => req.path.endsWith(p));
  },
  message: (_req: Request, res: Response) => {
    res.status(429).json(
      createErrorResponse(
        'RATE_LIMIT_EXCEEDED',
        'Too many authentication attempts, please try again later'
      )
    );
  },
});

export const webhookRateLimiter = createRateLimiter({
  windowMs: parseInt(process.env.WEBHOOK_RATE_LIMIT_WINDOW_MS || '60000', 10),
  max: parseInt(process.env.WEBHOOK_RATE_LIMIT_MAX_REQUESTS || '300', 10),
  keyGenerator: (req: Request): string => {
    return (
      (req.headers['x-webhook-source'] as string) || req.ip || 'unknown'
    );
  },
});
