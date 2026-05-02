/**
 * RBAC Controller
 * Handles HTTP endpoints for role and permission management
 */

import { Request, Response } from 'express';
import RBACService from '../services/rbac.service.js';
import { prisma } from '../lib/prisma.js';
import {
  ICreateRoleRequest,
  ICreatePermissionRequest,
  PERMISSION_CODES,
} from '@freeshop/shared-types';
import { successResponse } from '@freeshop/shared-utils';

// Helper: validate ADMIN_SECRET_KEY from header/body/query
const isValidAdminSecret = (req: Request) => {
  const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;
  if (!ADMIN_SECRET_KEY) return false;
  const headerKey = (req.headers['x-admin-secret'] ?? req.headers['admin-secret']) as string | string[] | undefined;
  const bodyKey = (req as any).body?.adminSecretKey ?? (req as any).body?.ADMIN_SECRET_KEY;
  const queryKey = (req.query as any)?.adminSecretKey;
  const providedKey = Array.isArray(headerKey) ? headerKey[0] : headerKey ?? bodyKey ?? queryKey;
  return providedKey && String(providedKey) === String(ADMIN_SECRET_KEY);
};

/**
 * Initialize default roles and permissions
 * POST /auth/rbac/init
 * Requires: Superadmin role or INIT_TOKEN header
 * Returns: Initialization status with role and permission counts
 */
export const initializeRBAC = async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    // Require ADMIN_SECRET_KEY (header `x-admin-secret` or `admin-secret`, body or query)
    const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;
    const headerKey = (req.headers['x-admin-secret'] ?? req.headers['admin-secret']) as string | string[] | undefined;
    const bodyKey = (req as any).body?.adminSecretKey ?? (req as any).body?.ADMIN_SECRET_KEY;
    const queryKey = (req.query as any)?.adminSecretKey;
    const providedKey = Array.isArray(headerKey) ? headerKey[0] : headerKey ?? bodyKey ?? queryKey;

    if (!ADMIN_SECRET_KEY || !providedKey || String(providedKey) !== String(ADMIN_SECRET_KEY)) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Missing or invalid ADMIN_SECRET_KEY',
      });
    }

    // Keep previous counts for status and observability
    const existingRolesCount = await prisma.role.count();
    const existingPermissionsCount = await prisma.permission.count();

    // Initialize/Reconcile RBAC (idempotent)
    await RBACService.initializeDefaultRoles();

    const rolesCount = await prisma.role.count();
    const permissionsCount = await prisma.permission.count();
    const status = existingRolesCount > 0 ? 'reconciled' : 'initialized';
    
    const duration = Date.now() - startTime;
    
    return res.status(200).json(
      successResponse(
        {
          rolesCount,
          permissionsCount,
          previousPermissionsCount: existingPermissionsCount,
          timestamp: new Date().toISOString(),
          durationMs: duration,
          status,
        },
        status === 'initialized'
          ? 'RBAC system initialized successfully'
          : 'RBAC system reconciled successfully'
      )
    );
  } catch (error: any) {
    console.error('RBAC initialization error:', error);
    return res.status(500).json({
      success: false,
      error: 'INITIALIZATION_FAILED',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Create a new role
 * POST /rbac/roles
 */
export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description, permissionIds } = req.body as ICreateRoleRequest;
    const userId = (req as any).user?.id;
    const adminSecret = isValidAdminSecret(req);

    if (!userId && !adminSecret) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

    if (!name || !permissionIds || !Array.isArray(permissionIds)) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Required fields: name (string), permissionIds (array)',
      });
    }

    const actorId = userId ?? (adminSecret ? 'admin-secret' : undefined);
    const role = await RBACService.createRole({ name, description, permissionIds }, actorId as any);

    return res.status(201).json(successResponse(role, 'Role created successfully'));
  } catch (error: any) {
    console.error('Role creation error:', error);
    return res.status(500).json({
      error: 'CREATION_FAILED',
      message: error.message,
    });
  }
};

/**
 * Get all roles
 * GET /rbac/roles?page=1&limit=20
 */
export const getRoles = async (req: Request, res: Response) => {
  try {
    const pageStr = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page);
    const limitStr = String(Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit);
    const page = parseInt(pageStr) || 1;
    const limit = parseInt(limitStr) || 20;

    const { roles, total } = await RBACService.getAllRoles(page, limit);

    return res.status(200).json(
      successResponse(
        {
          roles,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
        'Roles retrieved'
      )
    );
  } catch (error: any) {
    console.error('Error fetching roles:', error);
    return res.status(500).json({
      error: 'FETCH_FAILED',
      message: error.message,
    });
  }
};

/**
 * Get role by ID
 * GET /rbac/roles/:roleId
 */
export const getRoleById = async (req: Request, res: Response) => {
  try {
    const roleId = Array.isArray(req.params.roleId) ? req.params.roleId[0] : req.params.roleId;

    const role = await RBACService.getRoleById(roleId);

    if (!role) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Role not found',
      });
    }

    return res.status(200).json(successResponse(role, 'Role retrieved'));
  } catch (error: any) {
    console.error('Error fetching role:', error);
    return res.status(500).json({
      error: 'FETCH_FAILED',
      message: error.message,
    });
  }
};

/**
 * Add permission to role
 * POST /rbac/roles/:roleId/permissions
 */
export const addPermissionToRole = async (req: Request, res: Response) => {
  try {
    const roleId = Array.isArray(req.params.roleId) ? req.params.roleId[0] : req.params.roleId;
    const { permissionId } = req.body;
    const userId = (req as any).user?.id;
    const adminSecret = isValidAdminSecret(req);

    if (!userId && !adminSecret) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

    if (!permissionId) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Required field: permissionId',
      });
    }

    const actorId = userId ?? (adminSecret ? 'admin-secret' : undefined);
    await RBACService.addPermissionToRole(roleId, permissionId, actorId as any);
    // Return updated role with permissions
    const updatedRole = await RBACService.getRoleById(roleId);
    return res.status(200).json(successResponse(updatedRole, 'Permission added to role successfully'));
  } catch (error: any) {
    console.error('Error adding permission to role:', error);
    return res.status(500).json({
      error: 'UPDATE_FAILED',
      message: error.message,
    });
  }
};

/**
 * Remove permission from role
 * DELETE /rbac/roles/:roleId/permissions/:permissionId
 */
export const removePermissionFromRole = async (req: Request, res: Response) => {
  try {
    const roleId = Array.isArray(req.params.roleId) ? req.params.roleId[0] : req.params.roleId;
    const permissionId = Array.isArray(req.params.permissionId) ? req.params.permissionId[0] : req.params.permissionId;
    const userId = (req as any).user?.id;
        const adminSecret = isValidAdminSecret(req);

        if (!userId && !adminSecret) {
          return res.status(401).json({ error: 'UNAUTHORIZED' });
        }

        const actorId = userId ?? (adminSecret ? 'admin-secret' : undefined);
        await RBACService.removePermissionFromRole(roleId, permissionId, actorId as any);
    // Return updated role after removal
    const updatedRole = await RBACService.getRoleById(roleId);
    return res.status(200).json(successResponse(updatedRole, 'Permission removed from role successfully'));
  } catch (error: any) {
    console.error('Error removing permission from role:', error);
    return res.status(500).json({
      error: 'DELETE_FAILED',
      message: error.message,
    });
  }
};

/**
 * Get all permissions
 * GET /rbac/permissions?page=1&limit=50
 */
export const getPermissions = async (req: Request, res: Response) => {
  try {
    const pageStr = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page);
    const limitStr = String(Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit);
    const page = parseInt(pageStr) || 1;
    const limit = parseInt(limitStr) || 50;

    const { permissions, total } = await RBACService.getAllPermissions(page, limit);

    return res.status(200).json(
      successResponse(
        {
          permissions,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
        'Permissions retrieved'
      )
    );
  } catch (error: any) {
    console.error('Error fetching permissions:', error);
    return res.status(500).json({
      error: 'FETCH_FAILED',
      message: error.message,
    });
  }
};

/**
 * Get permission by code
 * GET /rbac/permissions/:code
 */
export const getPermissionByCode = async (req: Request, res: Response) => {
  try {
    const code = Array.isArray(req.params.code) ? req.params.code[0] : req.params.code;
    const permissionCode = parseInt(code);

    const permission = await RBACService.getPermissionByCode(permissionCode);

    if (!permission) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Permission not found',
      });
    }

    return res.status(200).json(successResponse(permission, 'Permission retrieved'));
  } catch (error: any) {
    console.error('Error fetching permission:', error);
    return res.status(500).json({
      error: 'FETCH_FAILED',
      message: error.message,
    });
  }
};

/**
 * Assign role to user
 * POST /rbac/users/:userId/roles
 */
export const assignRoleToUser = async (req: Request, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const { roleId } = req.body;
    const requesterId = (req as any).user?.id;
    const adminSecret = isValidAdminSecret(req);

    if (!requesterId && !adminSecret) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

    if (!roleId) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Required field: roleId',
      });
    }

    const actorId = requesterId ?? (adminSecret ? 'admin-secret' : undefined);
    await RBACService.assignRoleToUser(userId, roleId, actorId as any);
    // Return the user's current roles and permission snapshot
    const result = await RBACService.getUserRolesAndPermissions(userId);
    return res.status(200).json(
      successResponse(
        { roles: result.roles, roleNames: result.roleNames, permissionCodes: result.permissionCodes },
        'Role assigned to user successfully'
      )
    );
  } catch (error: any) {
    console.error('Error assigning role to user:', error);
    return res.status(500).json({
      error: 'ASSIGNMENT_FAILED',
      message: error.message,
    });
  }
};

/**
 * Remove role from user
 * DELETE /rbac/users/:userId/roles/:roleId
 */
export const removeRoleFromUser = async (req: Request, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const roleId = Array.isArray(req.params.roleId) ? req.params.roleId[0] : req.params.roleId;
    const requesterId = (req as any).user?.id;
    const adminSecret = isValidAdminSecret(req);

    if (!requesterId && !adminSecret) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

    const actorId = requesterId ?? (adminSecret ? 'admin-secret' : undefined);
    await RBACService.removeRoleFromUser(userId, roleId, actorId as any);
    // Return the user's updated roles and permission snapshot
    const result = await RBACService.getUserRolesAndPermissions(userId);
    return res.status(200).json(
      successResponse(
        { roles: result.roles, roleNames: result.roleNames, permissionCodes: result.permissionCodes },
        'Role removed from user successfully'
      )
    );
  } catch (error: any) {
    console.error('Error removing role from user:', error);
    return res.status(500).json({
      error: 'DELETION_FAILED',
      message: error.message,
    });
  }
};

/**
 * Get user's roles and permissions
 * GET /rbac/users/:userId/roles
 */
export const getUserRolesAndPermissions = async (req: Request, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

    const result = await RBACService.getUserRolesAndPermissions(userId);

    return res.status(200).json(successResponse(result, "User's roles and permissions retrieved"));
  } catch (error: any) {
    console.error('Error fetching user roles and permissions:', error);
    return res.status(500).json({
      error: 'FETCH_FAILED',
      message: error.message,
    });
  }
};

/**
 * Check if user has permission
 * GET /rbac/users/:userId/permissions/:code/check
 */
export const checkUserPermission = async (req: Request, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const code = Array.isArray(req.params.code) ? req.params.code[0] : req.params.code;
    const permissionCode = parseInt(code);

    const hasPermission = await RBACService.userHasPermission(userId, permissionCode);

    return res.status(200).json(
      successResponse({ userId, permissionCode, hasPermission }, 'Permission check result')
    );
  } catch (error: any) {
    console.error('Error checking permission:', error);
    return res.status(500).json({
      error: 'CHECK_FAILED',
      message: error.message,
    });
  }
};

/**
 * Check if user has role
 * GET /rbac/users/:userId/roles/:roleName/check
 */
export const checkUserRole = async (req: Request, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const roleName = Array.isArray(req.params.roleName) ? req.params.roleName[0] : req.params.roleName;

    const hasRole = await RBACService.userHasRole(userId, roleName);

    return res.status(200).json(successResponse({ userId, roleName, hasRole }, 'Role check result'));
  } catch (error: any) {
    console.error('Error checking role:', error);
    return res.status(500).json({
      error: 'CHECK_FAILED',
      message: error.message,
    });
  }
};

/**
 * Get audit logs
 * GET /rbac/audit-logs?userId=...&roleId=...&action=...&page=1&limit=50
 */
export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const pageStr = String(Array.isArray(req.query.page) ? req.query.page[0] : req.query.page);
    const limitStr = String(Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit);
    const page = parseInt(pageStr) || 1;
    const limit = parseInt(limitStr) || 50;
    const filters: any = {};

    const userId = Array.isArray(req.query.userId) ? req.query.userId[0] : req.query.userId;
    const roleId = Array.isArray(req.query.roleId) ? req.query.roleId[0] : req.query.roleId;
    const action = Array.isArray(req.query.action) ? req.query.action[0] : req.query.action;

    if (userId) filters.userId = userId;
    if (roleId) filters.roleId = roleId;
    if (action) filters.action = action;

    const { logs, total } = await RBACService.getAuditLogs(filters, page, limit);

    return res.status(200).json(
      successResponse(
        {
          logs,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
        'Audit logs retrieved'
      )
    );
  } catch (error: any) {
    console.error('Error fetching audit logs:', error);
    return res.status(500).json({
      error: 'FETCH_FAILED',
      message: error.message,
    });
  }
};

/**
 * Get permission code reference
 * GET /rbac/permission-codes
 */
export const getPermissionCodesReference = async (req: Request, res: Response) => {
  return res.status(200).json(successResponse({ permissionCodes: PERMISSION_CODES }, 'Permission codes reference'));
};

export default {
  initializeRBAC,
  createRole,
  getRoles,
  getRoleById,
  addPermissionToRole,
  removePermissionFromRole,
  getPermissions,
  getPermissionByCode,
  assignRoleToUser,
  removeRoleFromUser,
  getUserRolesAndPermissions,
  checkUserPermission,
  checkUserRole,
  getAuditLogs,
  getPermissionCodesReference,
};
