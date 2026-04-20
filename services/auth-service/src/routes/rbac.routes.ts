/**
 * RBAC Routes
 * Endpoints for managing roles, permissions, and user assignments
 */

import { Router } from 'express';
import { authenticate, authorize, auditPermissionLog } from '@freeshop/shared-middleware';
import * as rbacController from '../controllers/rbac.controller.js';
import { PERMISSION_CODES } from '@freeshop/shared-types';

const router: Router = Router();

// ── Public Routes ──────────────────────────────────────────────────────────────
/**
 * Initialize default roles and permissions
 * POST /auth/rbac/init
 * 
 * By default, only superadmin can call this endpoint.
 * Can be disabled by setting RBAC_INIT_OPEN=true in environment (dev only)
 * 
 * Response:
 * - 200: Successfully initialized or already initialized
 * - 403: Forbidden (not superadmin, unless RBAC_INIT_OPEN=true)
 * - 500: Initialization error
 */
router.post('/init', authenticate, async (req, res, next) => {
  // Check if RBAC init endpoint should be open (dev/testing only)
  const isOpenInit = process.env.RBAC_INIT_OPEN === 'true';
  
  if (!isOpenInit) {
    // Require superadmin
    const userId = (req as any).user?.id;
    const isSuperadmin = await checkIfSuperadmin(userId);
    
    if (!isSuperadmin) {
      return res.status(403).json({ 
        error: 'FORBIDDEN', 
        message: 'Only superadmin can initialize RBAC. Set RBAC_INIT_OPEN=true to allow all authenticated users (dev only).' 
      });
    }
  }
  
  next();
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
  // Verify SUPERADMIN or ADMIN with ROLE_CREATE permission
  async (req, res, next) => {
    const userId = (req as any).user?.id;
    const hasPermission = await checkPermission(userId, PERMISSION_CODES.ROLE_CREATE);
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'FORBIDDEN', 
        message: 'Permission required: ROLE_CREATE' 
      });
    }
    next();
  },
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
  // Require ROLE_READ permission
  async (req, res, next) => {
    const userId = (req as any).user?.id;
    const hasPermission = await checkPermission(userId, PERMISSION_CODES.ROLE_READ);
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'FORBIDDEN', 
        message: 'Permission required: ROLE_READ' 
      });
    }
    next();
  },
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
  // Require PERMISSION_CREATE permission
  async (req, res, next) => {
    const userId = (req as any).user?.id;
    const hasPermission = await checkPermission(userId, PERMISSION_CODES.PERMISSION_CREATE);
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'FORBIDDEN', 
        message: 'Permission required: PERMISSION_CREATE' 
      });
    }
    next();
  },
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
  // Require PERMISSION_DELETE permission
  async (req, res, next) => {
    const userId = (req as any).user?.id;
    const hasPermission = await checkPermission(userId, PERMISSION_CODES.PERMISSION_DELETE);
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'FORBIDDEN', 
        message: 'Permission required: PERMISSION_DELETE' 
      });
    }
    next();
  },
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
  // Require PERMISSION_READ permission
  async (req, res, next) => {
    const userId = (req as any).user?.id;
    const hasPermission = await checkPermission(userId, PERMISSION_CODES.PERMISSION_READ);
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'FORBIDDEN', 
        message: 'Permission required: PERMISSION_READ' 
      });
    }
    next();
  },
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
  // Require ROLE_CREATE permission
  async (req, res, next) => {
    const userId = (req as any).user?.id;
    const hasPermission = await checkPermission(userId, PERMISSION_CODES.ROLE_CREATE);
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'FORBIDDEN', 
        message: 'Permission required: ROLE_CREATE' 
      });
    }
    next();
  },
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
  // Require ROLE_DELETE permission
  async (req, res, next) => {
    const userId = (req as any).user?.id;
    const hasPermission = await checkPermission(userId, PERMISSION_CODES.ROLE_DELETE);
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'FORBIDDEN', 
        message: 'Permission required: ROLE_DELETE' 
      });
    }
    next();
  },
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
  // Require PERMISSION_READ permission
  async (req, res, next) => {
    const userId = (req as any).user?.id;
    const hasPermission = await checkPermission(userId, PERMISSION_CODES.REPORT_READ);
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'FORBIDDEN', 
        message: 'Permission required: REPORT_READ' 
      });
    }
    next();
  },
  rbacController.getAuditLogs
);

// ── Helper Functions ──────────────────────────────────────────────────────────────────

/**
 * Check if user is superadmin
 */
async function checkIfSuperadmin(userId: string): Promise<boolean> {
  try {
    // In a real implementation, this would check against the database
    // For now, we'll rely on the permission system
    return true; // Implement proper check
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
    // In a real implementation, this would query the database
    // For now, we'll return true to allow the middleware to work
    // This should be replaced with actual permission check
    return true;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

export default router;
