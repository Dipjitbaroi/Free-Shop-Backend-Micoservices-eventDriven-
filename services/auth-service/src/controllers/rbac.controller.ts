/**
 * RBAC Controller
 * Handles HTTP endpoints for role and permission management
 */

import { Request, Response } from 'express';
import RBACService from '../services/rbac.service.js';
import {
  ICreateRoleRequest,
  ICreatePermissionRequest,
  PERMISSION_CODES,
} from '@freeshop/shared-types';

/**
 * Initialize default roles and permissions
 * POST /rbac/init
 */
export const initializeRBAC = async (req: Request, res: Response) => {
  try {
    await RBACService.initializeDefaultRoles();
    return res.status(200).json({
      message: 'RBAC system initialized successfully',
    });
  } catch (error: any) {
    console.error('RBAC initialization error:', error);
    return res.status(500).json({
      error: 'INITIALIZATION_FAILED',
      message: error.message,
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

    if (!userId) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

    if (!name || !permissionIds || !Array.isArray(permissionIds)) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Required fields: name (string), permissionIds (array)',
      });
    }

    const role = await RBACService.createRole({ name, description, permissionIds }, userId);

    return res.status(201).json({
      message: 'Role created successfully',
      role,
    });
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

    return res.status(200).json({
      roles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
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

    return res.status(200).json(role);
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

    if (!userId) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

    if (!permissionId) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Required field: permissionId',
      });
    }

    await RBACService.addPermissionToRole(roleId, permissionId, userId);

    return res.status(200).json({
      message: 'Permission added to role successfully',
    });
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

    if (!userId) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

    await RBACService.removePermissionFromRole(roleId, permissionId, userId);

    return res.status(200).json({
      message: 'Permission removed from role successfully',
    });
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

    return res.status(200).json({
      permissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
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

    return res.status(200).json(permission);
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

    if (!requesterId) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

    if (!roleId) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Required field: roleId',
      });
    }

    await RBACService.assignRoleToUser(userId, roleId, requesterId);

    return res.status(200).json({
      message: 'Role assigned to user successfully',
    });
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

    if (!requesterId) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

    await RBACService.removeRoleFromUser(userId, roleId, requesterId);

    return res.status(200).json({
      message: 'Role removed from user successfully',
    });
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

    return res.status(200).json(result);
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

    return res.status(200).json({
      userId,
      permissionCode,
      hasPermission,
    });
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

    return res.status(200).json({
      userId,
      roleName,
      hasRole,
    });
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

    return res.status(200).json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
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
  return res.status(200).json({
    message: 'Permission codes reference',
    permissionCodes: PERMISSION_CODES,
  });
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
