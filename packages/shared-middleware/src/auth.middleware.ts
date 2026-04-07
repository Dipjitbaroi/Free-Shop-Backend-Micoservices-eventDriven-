import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole, ITokenPayload } from '@freeshop/shared-types';
import { UnauthorizedError, ForbiddenError } from '@freeshop/shared-utils';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
      requestId?: string;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Extract token from request
 */
const extractToken = (req: Request): string | null => {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }

  // Check query params (for websockets)
  if (req.query?.token && typeof req.query.token === 'string') {
    return req.query.token;
  }

  return null;
};

/**
 * Verify JWT token
 */
const verifyToken = (token: string): ITokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as ITokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token');
    }
    throw new UnauthorizedError('Token verification failed');
  }
};

/**
 * Authentication middleware - requires valid token
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new UnauthorizedError('No authentication token provided');
    }

    const payload = verifyToken(token);
    req.user = { ...payload, id: payload.userId };
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication - attaches user if token exists but doesn't fail
 */
export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractToken(req);

    if (token) {
      const payload = verifyToken(token);
      req.user = { ...payload, id: payload.userId };
    }

    next();
  } catch (error) {
    // Token invalid but continue without user
    next();
  }
};



/**
 * Guest authentication - allows guests with guest token
 */
export const guestOrAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractToken(req);

    if (token) {
      const payload = verifyToken(token);
      req.user = { ...payload, id: payload.userId };
    }

    // Allow through even without token (guest)
    next();
  } catch (error) {
    // Token invalid but continue as guest
    next();
  }
};

/**
 * Authorization middleware - checks user roles
 */
export const authorize = (...args: ((UserRole | string) | (UserRole | string)[])[]) => {
  const allowedRoles = args.flat() as (UserRole | string)[];
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Self or Admin authorization - allows users to access their own resources
 */
export const selfOrAdmin = (userIdParam: string = 'userId') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const targetUserId = req.params[userIdParam] || req.body[userIdParam];
      
      // Allow if admin or own resource
      if (
        req.user.role === UserRole.ADMIN ||
        req.user.userId === targetUserId
      ) {
        next();
        return;
      }

      throw new ForbiddenError('Access denied');
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Vendor owner authorization - allows vendors to access their own resources
 */
export const vendorOwnerOrAdmin = (vendorIdParam: string = 'vendorId') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      // Get target vendor ID for future validation
      const targetVendorId = req.params[vendorIdParam] || req.body[vendorIdParam];

      // Allow admin and managers
      if ([UserRole.ADMIN, UserRole.MANAGER].includes(req.user.role)) {
        next();
        return;
      }

      // For vendors, check against their userId (vendor profile linked to user)
      // Note: In real implementation, you'd need to fetch the vendor profile to compare
      if (req.user.role === UserRole.VENDOR) {
        // Store targetVendorId for downstream use
        (req as any).targetVendorId = targetVendorId;
        next();
        return;
      }

      throw new ForbiddenError('Access denied');
    } catch (error) {
      next(error);
    }
  };
};

export { extractToken, verifyToken };
