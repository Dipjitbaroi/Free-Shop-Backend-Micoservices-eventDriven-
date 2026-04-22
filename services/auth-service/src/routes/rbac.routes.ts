/**
 * RBAC Routes
 * Endpoints for managing roles, permissions, and user assignments
 */

import { Router } from 'express';
import { authenticate, authorize, auditPermissionLog } from '@freeshop/shared-middleware';
import * as rbacController from '../controllers/rbac.controller.js';
import { PERMISSION_CODES } from '@freeshop/shared-types';
import RBACService from '../services/rbac.service.js';

const router: Router = Router();

// ── Public Routes ──────────────────────────────────────────────────────────────
/**
 * Initialize default roles and permissions
 * POST /auth/rbac/init
 * 
 * Authorization:
 * 1. If X-Admin-Secret-Key is valid → ALLOW (bypass all checks)
 * 2. If RBAC_INIT_OPEN=true → ALLOW any authenticated user (dev only)
 * 3. Otherwise require: SUPERADMIN role OR ROLE_CREATE permission
 * 
 * Admin Secret Key can be provided via:
 * - Header: `x-admin-secret` or `admin-secret`
 * - Request body: `{"adminSecretKey": "..."}`
 * - Query param: `?adminSecretKey=...`
 * 
 * Response:
 * - 200: Successfully initialized or already initialized
 * - 403: Forbidden (insufficient permissions or invalid secret key)
 * - 500: Initialization error
 */
router.post('/init', authenticate, async (req, res, next) => {
  try {
    // Check if admin secret key is provided and valid - if yes, allow
    if (isValidAdminSecretKey(req)) {
      return next();
    }

    // Check if RBAC init endpoint should be open (dev/testing only)
    const isOpenInit = process.env.RBAC_INIT_OPEN === 'true';
    
    if (isOpenInit) {
      // Development mode: allow any authenticated user
      return next();
    }

    // Production mode: require superadmin role OR ROLE_CREATE permission
    const userId = (req as any).user?.id;
    const isSuperadmin = await checkIfSuperadmin(userId);
    
    if (isSuperadmin) {
      return next();
    }

    // Check if user has ROLE_CREATE permission
    const hasRoleCreatePermission = await checkPermission(userId, PERMISSION_CODES.ROLE_CREATE);
    
    if (hasRoleCreatePermission) {
      return next();
    }

    // User doesn't have required authorization
    return res.status(403).json({ 
      error: 'FORBIDDEN', 
      message: 'Initialization requires: SUPERADMIN role, ROLE_CREATE permission, or valid Admin Secret Key (via header x-admin-secret, body adminSecretKey, or query param). Or set RBAC_INIT_OPEN=true for dev mode.' 
    });
  } catch (error) {
    console.error('Error during RBAC init authorization:', error);
    return res.status(500).json({
      error: 'AUTHORIZATION_ERROR',
      message: 'An error occurred during authorization'
    });
  }
}, rbacController.initializeRBAC);

// Get permission codes reference (no auth needed for reference)
router.get('/permission-codes', rbacController.getPermissionCodesReference);

// ── Role Management ──────────────────────────────────────────────────────────────

/**
 * Create a new role (SUPERADMIN only)
 * POST /rbac/roles
 */
router.post(
  '/roles',
  authenticate,
  authorizeWithAdminSecret(PERMISSION_CODES.ROLE_CREATE),
  auditPermissionLog('ROLE_CREATED'),
  rbacController.createRole
);

/**
 * Get all roles
 * GET /rbac/roles
 */
router.get(
  '/roles',
  authenticate,
  authorizeWithAdminSecret(PERMISSION_CODES.ROLE_READ),
  rbacController.getRoles
);

/**
 * Get role by ID
 * GET /rbac/roles/:roleId
 */
router.get('/roles/:roleId', authenticate, rbacController.getRoleById);

/**
 * Add permission to role
 * POST /rbac/roles/:roleId/permissions
 */
router.post(
  '/roles/:roleId/permissions',
  authenticate,
  authorizeWithAdminSecret(PERMISSION_CODES.PERMISSION_CREATE),
  auditPermissionLog('PERMISSION_GRANTED_TO_ROLE'),
  rbacController.addPermissionToRole
);

/**
 * Remove permission from role
 * DELETE /rbac/roles/:roleId/permissions/:permissionId
 */
router.delete(
  '/roles/:roleId/permissions/:permissionId',
  authenticate,
  authorizeWithAdminSecret(PERMISSION_CODES.PERMISSION_DELETE),
  auditPermissionLog('PERMISSION_REVOKED_FROM_ROLE'),
  rbacController.removePermissionFromRole
);

// ── Permission Management ──────────────────────────────────────────────────────────────

/**
 * Get all permissions
 * GET /rbac/permissions
 */
router.get(
  '/permissions',
  authenticate,
  authorizeWithAdminSecret(PERMISSION_CODES.PERMISSION_READ),
  rbacController.getPermissions
);

/**
 * Get permission by code
 * GET /rbac/permissions/:code
 */
router.get('/permissions/:code', authenticate, rbacController.getPermissionByCode);

// ── User Role Assignment ──────────────────────────────────────────────────────────────

/**
 * Assign role to user
 * POST /rbac/users/:userId/roles
 */
router.post(
  '/users/:userId/roles',
  authenticate,
  authorizeWithAdminSecret(PERMISSION_CODES.ROLE_CREATE),
  auditPermissionLog('ROLE_ASSIGNED_TO_USER'),
  rbacController.assignRoleToUser
);

/**
 * Remove role from user
 * DELETE /rbac/users/:userId/roles/:roleId
 */
router.delete(
  '/users/:userId/roles/:roleId',
  authenticate,
  authorizeWithAdminSecret(PERMISSION_CODES.ROLE_DELETE),
  auditPermissionLog('ROLE_REVOKED_FROM_USER'),
  rbacController.removeRoleFromUser
);

/**
 * Get user's roles and permissions
 * GET /rbac/users/:userId/roles
 */
router.get('/users/:userId/roles', authenticate, rbacController.getUserRolesAndPermissions);

/**
 * Check if user has permission
 * GET /rbac/users/:userId/permissions/:code/check
 */
router.get('/users/:userId/permissions/:code/check', authenticate, rbacController.checkUserPermission);

/**
 * Check if user has role
 * GET /rbac/users/:userId/roles/:roleName/check
 */
router.get('/users/:userId/roles/:roleName/check', authenticate, rbacController.checkUserRole);

// ── Audit Logs ──────────────────────────────────────────────────────────────────────

/**
 * Get permission audit logs
 * GET /rbac/audit-logs
 */
router.get(
  '/audit-logs',
  authenticate,
  authorizeWithAdminSecret(PERMISSION_CODES.REPORT_READ),
  rbacController.getAuditLogs
);

// ── Helper Functions ──────────────────────────────────────────────────────────────────

/**
 * Check if user is superadmin
 */
async function checkIfSuperadmin(userId: string): Promise<boolean> {
  try {
    if (!userId) return false;
    
    // Check if user has the SUPERADMIN role
    const { roleNames } = await RBACService.getUserRolesAndPermissions(userId);
    return roleNames.includes('SUPERADMIN');
  } catch (error) {
    console.error('Error checking superadmin status:', error);
    return false;
  }
}

/**
 * Check if user has a specific permission
 */
async function checkPermission(userId: string, permissionCode: number): Promise<boolean> {
  try {
    if (!userId || !permissionCode) return false;
    
    // Check if user has the required permission code
    const { permissionCodes } = await RBACService.getUserRolesAndPermissions(userId);
    return permissionCodes.includes(permissionCode);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

/**
 * Check if admin secret key is valid
 * Allows bypassing permission checks if admin secret key is provided and matches ENV variable
 * Supports multiple formats: header `x-admin-secret` or `admin-secret`, body `adminSecretKey`, or query param `adminSecretKey`
 */
function isValidAdminSecretKey(req: any): boolean {
  const secretKeyFromEnv = process.env.ADMIN_SECRET_KEY;
  
  // If no secret key in ENV, this feature is disabled
  if (!secretKeyFromEnv) {
    return false;
  }
  
  // Check multiple sources for the secret key
  const headerKey = (req.headers['x-admin-secret'] ?? req.headers['admin-secret']) as string | string[] | undefined;
  const bodyKey = req.body?.adminSecretKey ?? req.body?.ADMIN_SECRET_KEY;
  const queryKey = req.query?.adminSecretKey;
  
  // Get the actual value (handle array case for headers)
  const providedKey = Array.isArray(headerKey) ? headerKey[0] : headerKey ?? bodyKey ?? queryKey;
  
  // Check if header secret key matches ENV secret key
  return providedKey && String(providedKey) === String(secretKeyFromEnv);
}

/**
 * Middleware factory: Authorize with admin secret key OR permission code
 * If X-Admin-Secret-Key header is provided and valid, bypass permission check
 * Otherwise, check if user has the required permission code
 */
function authorizeWithAdminSecret(permissionCode: number) {
  return async (req: any, res: any, next: any) => {
    try {
      // Check if admin secret key is provided and valid
      if (isValidAdminSecretKey(req)) {
        // Admin secret key is valid, allow access
        return next();
      }

      // Otherwise, check permission code
      const userId = req.user?.id;
      const hasPermission = await checkPermission(userId, permissionCode);

      if (!hasPermission) {
        return res.status(403).json({
          error: 'FORBIDDEN',
          message: `Permission required: ${Object.entries(PERMISSION_CODES).find(([_, v]) => v === permissionCode)?.[0] || permissionCode}`,
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        error: 'AUTHORIZATION_ERROR',
        message: 'An error occurred during authorization',
      });
    }
  };
}

export default router;
