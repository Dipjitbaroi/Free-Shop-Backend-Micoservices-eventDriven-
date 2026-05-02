/**
 * RBAC Permission Checking Middleware
 * Validates user permissions based on roles assigned to them
 */

import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { PERMISSION_CODES, PermissionAction, PermissionResource } from '@freeshop/shared-types';

interface IUserWithRoles {
  id: string;
  email: string;
  roles?: Array<{ id: string; name: string; permissions: Array<{ permissionCode: number; action: PermissionAction; resource: PermissionResource }> }>;
  permissionCodes?: number[];
}

/**
 * Decorator to check if user has specific permission
 * Can check by permission code, resource+action, or resource only (any action)
 */
export const requirePermission = (
  permissionCodeOrResource: number | PermissionResource | PermissionAction,
  action?: PermissionAction,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUserWithRoles;

      if (!user || !user.id) {
        return res.status(401).json({ 
          error: 'UNAUTHORIZED',
          message: 'User not authenticated' 
        });
      }

      // Fetch user roles and permissions from auth service
      try {
        const userRolesResponse = await axios.get(
          `${process.env.AUTH_SERVICE_URL}/rbac/users/${user.id}/roles`,
          {
            headers: {
              Authorization: `Bearer ${req.headers.authorization?.split(' ')[1]}`,
            },
          }
        );

        user.permissionCodes = userRolesResponse.data.permissionCodes || [];
      } catch (error) {
        console.error('Failed to fetch user permissions:', error);
        return res.status(403).json({
          error: 'FORBIDDEN',
          message: 'Unable to verify permissions',
        });
      }

      // Check permission by code
      if (typeof permissionCodeOrResource === 'number') {
        if (!user.permissionCodes?.includes(permissionCodeOrResource)) {
          return res.status(403).json({
            error: 'FORBIDDEN',
            message: `Permission denied: code ${permissionCodeOrResource} required`,
            requiredPermissionCode: permissionCodeOrResource,
          });
        }
      } 
      // Check permission by resource and action
      else if (action) {
        // Generate permission code: RESOURCE_CODE * 100 + ACTION_CODE
        // This matches the format used in PERMISSION_CODES
        const requiredCode = generatePermissionCode(permissionCodeOrResource as PermissionResource, action);
        if (!user.permissionCodes?.includes(requiredCode)) {
          return res.status(403).json({
            error: 'FORBIDDEN',
            message: `Permission denied: ${action} on ${permissionCodeOrResource} required`,
            requiredPermissionCode: requiredCode,
          });
        }
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Error checking permissions',
      });
    }
  };
};

/**
 * Check if user has any of the specified roles
 */
export const requireRole = (...roleNames: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUserWithRoles;

      if (!user || !user.id) {
        return res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'User not authenticated',
        });
      }

      // Fetch user roles from auth service
      let userRoles: string[] = [];
      try {
        const rolesResponse = await axios.get(
          `${process.env.AUTH_SERVICE_URL}/rbac/users/${user.id}/roles`,
          {
            headers: {
              Authorization: `Bearer ${req.headers.authorization?.split(' ')[1]}`,
            },
          }
        );
        userRoles = rolesResponse.data?.data?.roleNames || [];
      } catch (error) {
        console.error('Failed to fetch user roles:', error);
        return res.status(403).json({
          error: 'FORBIDDEN',
          message: 'Unable to verify roles',
        });
      }

      const hasRole = roleNames.some(role => userRoles.includes(role));
      
      if (!hasRole) {
        return res.status(403).json({
          error: 'FORBIDDEN',
          message: `Required roles: ${roleNames.join(', ')}`,
          requiredRoles: roleNames,
          userRoles: userRoles,
        });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(500).json({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Error checking roles',
      });
    }
  };
};

/**
 * Check if user is a seller and owns the given order
 */
export const requireSellerOwnership = (orderIdParamName = 'orderId') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUserWithRoles;
      const orderId = req.params[orderIdParamName];

      if (!user || !user.id) {
        return res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'User not authenticated',
        });
      }

      if (!orderId) {
        return res.status(400).json({
          error: 'BAD_REQUEST',
          message: `Missing parameter: ${orderIdParamName}`,
        });
      }

      // Check if user is seller first
      const roleCheck = await requireRole('SELLER')(req, res, () => {});
      if (res.statusCode >= 400) return;

      // Verify ownership
      try {
        const orderResponse = await axios.get(
          `${process.env.ORDER_SERVICE_URL}/orders/${orderId}`,
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          }
        );

        if (orderResponse.data.sellerId !== user.id) {
          return res.status(403).json({
            error: 'FORBIDDEN',
            message: 'You do not own this order',
          });
        }
      } catch (error) {
        console.error('Failed to verify order ownership:', error);
        return res.status(403).json({
          error: 'FORBIDDEN',
          message: 'Unable to verify order ownership',
        });
      }

      next();
    } catch (error) {
      console.error('Seller ownership check error:', error);
      return res.status(500).json({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Error checking seller ownership',
      });
    }
  };
};

/**
 * Check if user is delivery man assigned to delivery
 */
export const requireDeliveryManAssignment = (deliveryIdParamName = 'deliveryId') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUserWithRoles;
      const deliveryId = req.params[deliveryIdParamName];

      if (!user || !user.id) {
        return res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'User not authenticated',
        });
      }

      if (!deliveryId) {
        return res.status(400).json({
          error: 'BAD_REQUEST',
          message: `Missing parameter: ${deliveryIdParamName}`,
        });
      }

      // Check if user is delivery man
      const roleCheck = await requireRole('DELIVERY_MAN')(req, res, () => {});
      if (res.statusCode >= 400) return;

      // Verify assignment
      try {
        const deliveryResponse = await axios.get(
          `${process.env.ORDER_SERVICE_URL}/deliveries/${deliveryId}`,
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          }
        );

        if (deliveryResponse.data.deliveryManId !== user.id) {
          return res.status(403).json({
            error: 'FORBIDDEN',
            message: 'You are not assigned to this delivery',
          });
        }
      } catch (error) {
        console.error('Failed to verify delivery assignment:', error);
        return res.status(403).json({
          error: 'FORBIDDEN',
          message: 'Unable to verify delivery assignment',
        });
      }

      next();
    } catch (error) {
      console.error('Delivery assignment check error:', error);
      return res.status(500).json({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Error checking delivery assignment',
      });
    }
  };
};

/**
 * Audit log middleware - logs permission-related actions
 */
export const auditPermissionLog = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUserWithRoles;

    // Store in response locals for later logging
    res.locals.auditLog = {
      userId: user?.id,
      action,
      targetUserId: req.body?.userId || req.params?.userId,
      roleId: req.body?.roleId || req.params?.roleId,
      permissionId: req.body?.permissionId || req.params?.permissionId,
      details: req.body,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    };

    // Send audit log to auth service asynchronously
    setImmediate(() => {
      if (!user?.id) return;
      
      axios.post(
        `${process.env.AUTH_SERVICE_URL}/audit/logs`,
        res.locals.auditLog,
        {
          headers: {
            Authorization: req.headers.authorization,
          },
        }
      ).catch((error: any) => {
        console.error('Failed to store audit log:', error);
      });
    });

    next();
  };
};

/**
 * Helper function to generate permission code
 * Based on PERMISSION_CODES structure
 */
function generatePermissionCode(resource: PermissionResource, action: PermissionAction): number {
  const resourceMap: Record<PermissionResource, number> = {
    [PermissionResource.USER]: 10,
    [PermissionResource.ROLE]: 20,
    [PermissionResource.PERMISSION]: 30,
    [PermissionResource.ORDER]: 40,
    [PermissionResource.PRODUCT]: 50,
    [PermissionResource.REVIEW]: 51,
    [PermissionResource.FREE_ITEM]: 120,
    [PermissionResource.DELIVERY]: 60,
    [PermissionResource.INVENTORY]: 61,
    [PermissionResource.SELLER]: 70,
    [PermissionResource.PAYMENT]: 80,
    [PermissionResource.REPORT]: 90,
    [PermissionResource.SETTINGS]: 100,
    [PermissionResource.ADMIN_PANEL]: 110,
    [PermissionResource.COUPON]: 130,
  };

  const actionMap: Record<PermissionAction, number> = {
    [PermissionAction.CREATE]: 1,
    [PermissionAction.READ]: 2,
    [PermissionAction.UPDATE]: 3,
    [PermissionAction.DELETE]: 4,
    [PermissionAction.APPROVE]: 5,
    [PermissionAction.REJECT]: 6,
  };

  // Multiply resource by 100 and add action
  return resourceMap[resource] * 100 + actionMap[action];
}

export default {
  requirePermission,
  requireRole,
  requireSellerOwnership,
  requireDeliveryManAssignment,
  auditPermissionLog,
};
