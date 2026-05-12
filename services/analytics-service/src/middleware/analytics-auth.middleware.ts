import { Request, Response, NextFunction } from 'express';
import { PERMISSION_CODES } from '@freeshop/shared-types';

/**
 * Middleware to check if user has permission to access analytics sections
 * Access is determined by permission codes (90010-90015), not by role.
 * If a user has the required permission code, they can access the API.
 */
export function authorizeAnalyticsSection(requiredPermissionCode: number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const permissions = (req.user as any)?.permissions || [];

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized - User ID not found',
        });
      }

      // Check if user has the required permission code
      // Access is PERMISSION-BASED, not role-based
      if (!permissions.includes(requiredPermissionCode)) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          requiredPermission: requiredPermissionCode,
          userPermissions: permissions,
        });
      }

      // Attach permission info to request for use in controllers
      (req as any).analyticsPermission = requiredPermissionCode;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Permission check failed',
      });
    }
  };
}

/**
 * Check specific analytics section access
 * Note: Permission codes are assigned to users to grant access.
 * These constants document the permission code for each section.
 */
export const ANALYTICS_PERMISSIONS = {
  PLATFORM_METRICS: 90010,
  VENDOR_ANALYTICS: 90011,
  PRODUCT_ANALYTICS: 90012,
  SALES_REPORT: 90013,
  DELIVERY_ANALYTICS: 90014,
  EXECUTIVE_DASHBOARD: 90015,
} as const;

/**
 * Typical role access mapping (for reference/documentation).
 * Actual access is determined by permission codes in user.permissions array.
 * This shows which sections each role typically has access to via permission assignments.
 */
export const ROLE_ANALYTICS_ACCESS: Record<string, number[]> = {
  SUPERADMIN: [90010, 90011, 90012, 90013, 90014, 90015],
  ADMIN: [90010, 90011, 90012, 90013, 90014],
  VENDOR: [90010, 90011, 90012], // Must verify own data in controllers
  DELIVERY_MAN: [90010, 90014], // Must verify own data in controllers
  SELLER: [], // No analytics permission codes assigned by default
  CUSTOMER: [], // No analytics permission codes assigned by default
};
