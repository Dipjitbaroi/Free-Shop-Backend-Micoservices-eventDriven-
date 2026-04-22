import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { ITokenPayload, PERMISSION_CODES } from '@freeshop/shared-types';
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
 * Permission-based authorization middleware
 * Checks if user has required permission(s) from their assigned roles
 * RECOMMENDED: Use this for new endpoints
 * 
 * @param permissionCodes - One or more permission codes to check
 * @example
 *   authorizePermission(PERMISSION_CODES.ORDER_UPDATE)
 *   authorizePermission(PERMISSION_CODES.DELIVERY_CREATE, PERMISSION_CODES.DELIVERY_ASSIGN)
 */
export const authorizePermission = (...permissionCodes: number[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new UnauthorizedError('Authentication required');
      }

      const userId = req.user.id || req.user.userId;

      // Fetch user permissions from auth service
      try {
        const token = (req.headers.authorization || '').replace('Bearer ', '');
        const userRolesResponse = await axios.get(
          `${process.env.AUTH_SERVICE_URL || 'http://auth-service:3001'}/rbac/users/${userId}/roles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userPermissionCodes: number[] = userRolesResponse.data?.data?.permissionCodes || [];

        // Check if user has at least one of the required permissions
        const hasPermission = permissionCodes.some((code) =>
          userPermissionCodes.includes(code)
        );

        if (!hasPermission) {
          throw new ForbiddenError(
            `Permission denied. Required one of: [${permissionCodes.join(', ')}]`
          );
        }

        next();
      } catch (error: any) {
        if (error instanceof ForbiddenError) {
          throw error;
        }
        console.error('Failed to fetch user permissions:', error.message);
        throw new ForbiddenError('Unable to verify permissions');
      }
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Self or own resource authorization - allows users to access their own resources
 * Also allows users with USER_UPDATE or ADMIN_PANEL_ACCESS permissions
 * PERMISSION-BASED: Checks permissions, not role text
 */
export const selfOrAdmin = (userIdParam: string = 'userId') => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new UnauthorizedError('Authentication required');
      }

      const targetUserId = req.params[userIdParam] || req.body[userIdParam];
      const userId = req.user.id || req.user.userId;

      // Always allow if accessing own resource
      if (userId === targetUserId) {
        next();
        return;
      }

      // For other resources, check permissions
      try {
        const token = (req.headers.authorization || '').replace('Bearer ', '');
        const userRolesResponse = await axios.get(
          `${process.env.AUTH_SERVICE_URL || 'http://auth-service:3001'}/rbac/users/${userId}/roles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userPermissionCodes: number[] = userRolesResponse.data?.permissionCodes || [];

        // Allow if user has admin/management permissions
        const hasAdminPermission = userPermissionCodes.some((code) =>
          [PERMISSION_CODES.USER_UPDATE, PERMISSION_CODES.ADMIN_PANEL_ACCESS].includes(code as typeof PERMISSION_CODES.USER_UPDATE)
        );

        if (hasAdminPermission) {
          next();
          return;
        }

        throw new ForbiddenError('Access denied - insufficient permissions');
      } catch (error: any) {
        if (error instanceof ForbiddenError) {
          throw error;
        }
        console.error('Failed to verify permissions:', error.message);
        throw new ForbiddenError('Unable to verify permissions');
      }
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Vendor/Seller owner authorization - allows users to access their own resources
 * Also allows users with SELLER_UPDATE or ADMIN_PANEL_ACCESS permissions
 * PERMISSION-BASED: Checks permissions, not role text
 */
export const vendorOwnerOrAdmin = (vendorIdParam: string = 'vendorId') => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new UnauthorizedError('Authentication required');
      }

      // Get target vendor ID for validation
      const targetVendorId = req.params[vendorIdParam] || req.body[vendorIdParam];
      const userId = req.user.id || req.user.userId;

      // Store targetVendorId for downstream use
      (req as any).targetVendorId = targetVendorId;

      // Check permissions via auth service
      try {
        const token = (req.headers.authorization || '').replace('Bearer ', '');
        const userRolesResponse = await axios.get(
          `${process.env.AUTH_SERVICE_URL || 'http://auth-service:3001'}/rbac/users/${userId}/roles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userPermissionCodes: number[] = userRolesResponse.data?.permissionCodes || [];

        // Allow if user has seller/admin permissions
        const hasPermission = userPermissionCodes.some((code) =>
          [PERMISSION_CODES.SELLER_UPDATE, PERMISSION_CODES.SELLER_DELETE, PERMISSION_CODES.ADMIN_PANEL_ACCESS].includes(code as typeof PERMISSION_CODES.SELLER_UPDATE)
        );

        if (hasPermission) {
          next();
          return;
        }

        // Otherwise, vendor must be owner (userId should match vendor)
        // Note: In production, fetch vendor profile from user-service to verify ownership
        (req as any).vendorOwnerCheck = true;
        next();
      } catch (error: any) {
        if (error instanceof ForbiddenError) {
          throw error;
        }
        console.error('Failed to verify vendor permissions:', error.message);
        throw new ForbiddenError('Unable to verify permissions');
      }
    } catch (error) {
      next(error);
    }
  };
};

/**
 * DEPRECATED: Role-based authorization - use authorizePermission() instead
 * This throws an error directing users to migrate to permission-based RBAC
 * 
 * Migration required: Use permission codes instead of role names
 * OLD: authorize([UserRole.ADMIN])
 * NEW: authorizePermission(PERMISSION_CODES.ADMIN_PANEL_ACCESS)
 * 
 * See PERMISSION_BASED_RBAC_GUIDE.md for migration instructions
 */
export const authorize = (...args: any[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const migrationGuide = 'PERMISSION_BASED_RBAC_GUIDE.md';
    const error = new Error(
      `\n❌ DEPRECATED FUNCTION: authorize() is no longer supported!\n\n` +
      `The system now uses PERMISSION-BASED RBAC, not role-based authorization.\n\n` +
      `MIGRATION REQUIRED:\n` +
      `  OLD (❌): authorize([UserRole.ADMIN, UserRole.MANAGER])\n` +
      `  NEW (✅): authorizePermission(PERMISSION_CODES.ADMIN_PANEL_ACCESS)\n\n` +
      `See ${migrationGuide} for complete migration instructions.\n`
    );
    next(error);
  };
};

export { extractToken, verifyToken };
