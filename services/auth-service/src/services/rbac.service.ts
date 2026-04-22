/**
 * RBAC Service
 * Manages roles, permissions, and user-role assignments
 */

import {
  IRole,
  IPermission,
  ICreateRoleRequest,
  ICreatePermissionRequest,
  IAssignRoleRequest,
  DEFAULT_ROLES,
  ROLE_PERMISSIONS,
  PERMISSION_CODES,
  PermissionAction,
  IPermissionAuditLog,
} from '@freeshop/shared-types';
import { prisma } from '../lib/prisma.js';

export class RBACService {
  /**
   * Initialize default roles and permissions
   * Should be run once during system setup
   */
  static async initializeDefaultRoles(): Promise<void> {
    try {
      // This initializer is idempotent. It will upsert permissions and
      // reconcile role -> permission assignments even if roles exist.
      const permissionMap: Record<number, string> = {};

      // Upsert all permissions based on PERMISSION_CODES
      // Key principle: Each permissionCode is unique, even if multiple codes share the same (action, resource)
      // Example: PRODUCT_UPDATE (5003) and PRODUCT_UPDATE_PRICE (5005) both have action=UPDATE, resource=PRODUCT
      for (const [code, permCodeRaw] of Object.entries(PERMISSION_CODES)) {
        try {
          const permCode = Number(permCodeRaw as unknown as number);

          const specialPermission =
            code === 'USER_MANAGEMENT_UPDATE'
              ? { resource: 'USER', action: PermissionAction.UPDATE, description: 'Permission to update user profiles' }
              : code === 'USER_MANAGEMENT_DELETE'
                ? { resource: 'USER', action: PermissionAction.DELETE, description: 'Permission to delete user accounts' }
                : code === 'FREE_ITEM_CREATE'
                  ? { resource: 'FREE_ITEM', action: PermissionAction.CREATE, description: 'Create free items' }
                  : code === 'FREE_ITEM_READ'
                    ? { resource: 'FREE_ITEM', action: PermissionAction.READ, description: 'View free items' }
                    : code === 'FREE_ITEM_UPDATE'
                      ? { resource: 'FREE_ITEM', action: PermissionAction.UPDATE, description: 'Update free items' }
                      : code === 'FREE_ITEM_DELETE'
                        ? { resource: 'FREE_ITEM', action: PermissionAction.DELETE, description: 'Delete free items' }
                        : code === 'REPORT_EXPORT'
                          ? { resource: 'REPORT', action: PermissionAction.REJECT, description: 'Export reports' }
                          : code === 'ADMIN_PANEL_ACCESS'
                            ? { resource: 'ADMIN_PANEL', action: PermissionAction.APPROVE, description: 'Access admin panel' }
                            : null;

          if (specialPermission) {
            let permission = await prisma.permission.findUnique({ where: { permissionCode: permCode } });
            if (permission) {
              await prisma.permission.update({
                where: { id: permission.id },
                data: {
                  action: specialPermission.action as any,
                  resource: specialPermission.resource as any,
                  description: specialPermission.description,
                  active: true,
                },
              });
              permissionMap[permCode] = permission.id;
              console.log(`Updated existing permission ${code} (${permCode})`);
              continue;
            }

            permission = await prisma.permission.create({
              data: {
                permissionCode: permCode,
                action: specialPermission.action as any,
                resource: specialPermission.resource as any,
                description: specialPermission.description,
                active: true,
              },
            });

            permissionMap[permCode] = permission.id;
            console.log(`Created permission ${code} (${permCode})`);
            continue;
          }

          // Attempt to parse standard PATTERNS like PRODUCT_UPDATE or ORDER_APPROVE
          const parts = code.match(/([A-Z]+)_([A-Z]+)/);
          if (!parts) {
            console.debug(`Skipping ${code}: does not match standard pattern`);
            continue;
          }

          const resourceStr = parts[1];
          const actionStr = parts[2];

          // Map string to enum value
          const resource = resourceStr as any;
          const action = PermissionAction[actionStr as keyof typeof PermissionAction] as any;

          if (!action || !resource) {
            console.warn(`Unable to map ${code}: action=${actionStr}, resource=${resourceStr}`);
            continue;
          }

          // Check ONLY by permissionCode - each code is unique
          // Multiple codes can share the same (action, resource) but we create/update each independently
          let permission = await prisma.permission.findUnique({ where: { permissionCode: permCode } });
          if (permission) {
            await prisma.permission.update({
              where: { id: permission.id },
              data: { action, resource, description: `${action} ${resource}`, active: true }
            });
            permissionMap[permCode] = permission.id;
            console.log(`Updated existing permission ${code} (${permCode})`);
            continue;
          }

          // Create new permission - never skip based on (action, resource) because multiple codes can coexist
          permission = await prisma.permission.create({
            data: {
              permissionCode: permCode,
              action,
              resource,
              description: `${action} ${resource}`,
              active: true,
            },
          });

          permissionMap[permCode] = permission.id;
          console.log(`Created permission ${code} (${permCode})`);
        } catch (error) {
          console.error(`Error processing permission ${code}: ${error instanceof Error ? error.message : String(error)}`);
          // Continue to next permission instead of failing entire init
        }
      }

      // Ensure roles exist and reconcile their permissions
      const superadminUser = await prisma.user.findFirst({
        where: { email: process.env.SUPERADMIN_EMAIL || 'superadmin@freeshop.com' },
      });
      const systemUserId = superadminUser?.id || 'system';

      for (const [roleName, permissionCodes] of Object.entries(ROLE_PERMISSIONS)) {
        // find or create role
        let role = await prisma.role.findUnique({ where: { name: roleName } });
        if (!role) {
          role = await prisma.role.create({
            data: {
              name: roleName,
              description: `${roleName} role with default permissions`,
              createdBy: systemUserId,
            },
          });
          console.log(`Created role: ${roleName}`);
        }

        // Assign missing permissions to role
        let assigned = 0;
        for (const code of permissionCodes as number[]) {
          const permissionId = permissionMap[code];
          if (!permissionId) {
            console.warn(`Permission code ${code} not found in permissionMap, skipping assignment to ${roleName}`);
            continue;
          }

          // upsert rolePermission using composite unique key
          try {
            await prisma.rolePermission.upsert({
              where: { roleId_permissionId: { roleId: role.id, permissionId } },
              update: { revokedAt: null, revokedBy: null },
              create: { roleId: role.id, permissionId, grantedBy: systemUserId },
            });
            assigned += 1;
          } catch (err) {
            console.warn(`Failed assigning permission ${code} to role ${roleName}:`, err);
          }
        }

        console.log(`Reconciled role ${roleName}: assigned/verified ${assigned} permissions`);
      }

      console.log('Default roles and permissions initialized/reconciled successfully');
    } catch (error) {
      console.error('Error initializing default roles:', error);
      throw error;
    }
  }

  /**
   * Create a new custom role
   */
  static async createRole(
    data: ICreateRoleRequest,
    createdBy: string
  ): Promise<IRole> {
    try {
      // Check if role name already exists
      const existingRole = await prisma.role.findUnique({
        where: { name: data.name },
      });

      if (existingRole) {
        throw new Error(`Role with name "${data.name}" already exists`);
      }

      const role = await prisma.role.create({
        data: {
          name: data.name,
          description: data.description,
          createdBy,
          permissions: {
            create: data.permissionIds.map(permissionId => ({
              permission: { connect: { id: permissionId } },
              grantedBy: createdBy,
            })),
          },
        },
        include: {
          permissions: {
            where: { revokedAt: null },
            include: {
              permission: true,
            },
          },
        },
      });

      // Log audit
      await this.logAudit({
        userId: createdBy,
        roleId: role.id,
        action: 'ROLE_CREATED',
        details: { roleName: data.name },
      });

      return role as any;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  /**
   * Get all roles
   */
  static async getAllRoles(page = 1, limit = 20): Promise<{ roles: IRole[]; total: number }> {
    try {
      const roles = await prisma.role.findMany({
        include: {
          permissions: {
            where: { revokedAt: null },
            include: {
              permission: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      const total = await prisma.role.count();

      return { roles: roles as any, total };
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  /**
   * Get role by ID
   */
  static async getRoleById(roleId: string): Promise<IRole | null> {
    try {
      const role = await prisma.role.findUnique({
        where: { id: roleId },
        include: {
          permissions: {
            where: { revokedAt: null },
            include: {
              permission: true,
            },
          },
        },
      });

      return role as any;
    } catch (error) {
      console.error('Error fetching role:', error);
      throw error;
    }
  }

  /**
   * Add permission to role
   */
  static async addPermissionToRole(
    roleId: string,
    permissionId: string,
    grantedBy: string
  ): Promise<void> {
    try {
      // Check if already exists
      const existing = await prisma.rolePermission.findUnique({
        where: {
          roleId_permissionId: { roleId, permissionId },
        },
      });

      if (existing && !existing.revokedAt) {
        return;
      }

      // Create or update
      if (existing && existing.revokedAt) {
        // Restore revoked permission
        await prisma.rolePermission.update({
          where: { id: existing.id },
          data: {
            revokedAt: null,
            revokedBy: null,
          },
        });
      } else {
        await prisma.rolePermission.create({
          data: {
            roleId,
            permissionId,
            grantedBy,
          },
        });
      }

      // Log audit
      await this.logAudit({
        userId: grantedBy,
        roleId,
        permissionId,
        action: 'PERMISSION_GRANTED_TO_ROLE',
      });
    } catch (error) {
      console.error('Error adding permission to role:', error);
      throw error;
    }
  }

  /**
   * Remove permission from role
   */
  static async removePermissionFromRole(
    roleId: string,
    permissionId: string,
    revokedBy: string
  ): Promise<void> {
    try {
      const result = await prisma.rolePermission.updateMany({
        where: {
          roleId,
          permissionId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
          revokedBy,
        },
      });

      if (result.count === 0) {
        return;
      }

      // Log audit
      await this.logAudit({
        userId: revokedBy,
        roleId,
        permissionId,
        action: 'PERMISSION_REVOKED_FROM_ROLE',
      });
    } catch (error) {
      console.error('Error removing permission from role:', error);
      throw error;
    }
  }

  /**
   * Assign role to user
   */
  static async assignRoleToUser(
    userId: string,
    roleId: string,
    assignedBy: string
  ): Promise<void> {
    try {
      // Check if already assigned
      const existing = await prisma.userRole.findUnique({
        where: {
          userId_roleId: { userId, roleId },
        },
      });

      if (existing && !existing.revokedAt) {
        return;
      }

      if (existing && existing.revokedAt) {
        // Restore revoked role
        await prisma.userRole.update({
          where: { id: existing.id },
          data: {
            revokedAt: null,
            revokedBy: null,
          },
        });
      } else {
        await prisma.userRole.create({
          data: {
            userId,
            roleId,
            assignedBy,
          },
        });
      }

      // Log audit
      await this.logAudit({
        userId: assignedBy,
        targetUserId: userId,
        roleId,
        action: 'ROLE_ASSIGNED_TO_USER',
      });
    } catch (error) {
      console.error('Error assigning role to user:', error);
      throw error;
    }
  }

  /**
   * Remove role from user
   */
  static async removeRoleFromUser(
    userId: string,
    roleId: string,
    revokedBy: string
  ): Promise<void> {
    try {
      const result = await prisma.userRole.updateMany({
        where: {
          userId,
          roleId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
          revokedBy,
        },
      });

      if (result.count === 0) {
        return;
      }

      // Log audit
      await this.logAudit({
        userId: revokedBy,
        targetUserId: userId,
        roleId,
        action: 'ROLE_REVOKED_FROM_USER',
      });
    } catch (error) {
      console.error('Error removing role from user:', error);
      throw error;
    }
  }

  /**
   * Get all permissions
   */
  static async getAllPermissions(page = 1, limit = 50): Promise<{ permissions: IPermission[]; total: number }> {
    try {
      const permissions = await prisma.permission.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { permissionCode: 'asc' },
      });

      const total = await prisma.permission.count();

      return { permissions: permissions as any, total };
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  }

  /**
   * Get permission by code
   */
  static async getPermissionByCode(permissionCode: number): Promise<IPermission | null> {
    try {
      const permission = await prisma.permission.findUnique({
        where: { permissionCode },
      });

      return permission as any;
    } catch (error) {
      console.error('Error fetching permission:', error);
      throw error;
    }
  }

  /**
   * Get user's roles and permissions
   */
  static async getUserRolesAndPermissions(userId: string): Promise<{
    roles: IRole[];
    permissionCodes: number[];
    roleNames: string[];
  }> {
    try {
      const userRoles = await prisma.userRole.findMany({
        where: {
          userId,
          revokedAt: null,
        },
        include: {
          role: {
            include: {
              permissions: {
                where: { revokedAt: null },
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });

      const roles = userRoles.map((ur: any) => ur.role);
      const permissionCodes = new Set<number>();
      const roleNames = new Set<string>();

      userRoles.forEach((ur: any) => {
        roleNames.add(ur.role.name);
        ur.role.permissions.forEach((rp: any) => {
          permissionCodes.add(rp.permission.permissionCode);
        });
      });

      return {
        roles: roles as any,
        permissionCodes: Array.from(permissionCodes),
        roleNames: Array.from(roleNames),
      };
    } catch (error) {
      console.error('Error fetching user roles and permissions:', error);
      throw error;
    }
  }

  /**
   * Check if user has permission
   */
  static async userHasPermission(userId: string, permissionCode: number): Promise<boolean> {
    try {
      const { permissionCodes } = await this.getUserRolesAndPermissions(userId);
      return permissionCodes.includes(permissionCode);
    } catch (error) {
      console.error('Error checking permission:', error);
      throw error;
    }
  }

  /**
   * Check if user has role
   */
  static async userHasRole(userId: string, roleName: string): Promise<boolean> {
    try {
      const { roleNames } = await this.getUserRolesAndPermissions(userId);
      return roleNames.includes(roleName);
    } catch (error) {
      console.error('Error checking role:', error);
      throw error;
    }
  }

  /**
   * Get audit logs
   */
  static async getAuditLogs(
    filters?: { userId?: string; roleId?: string; action?: string },
    page = 1,
    limit = 50
  ): Promise<{ logs: IPermissionAuditLog[]; total: number }> {
    try {
      const logs = await prisma.permissionAuditLog.findMany({
        where: filters,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      const total = await prisma.permissionAuditLog.count({
        where: filters,
      });

      return { logs: logs as any, total };
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }

  /**
   * Log audit entry
   */
  private static async logAudit(data: {
    userId: string;
    roleId?: string;
    permissionId?: string;
    targetUserId?: string;
    action: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    try {
      await prisma.permissionAuditLog.create({
        data: {
          userId: data.userId,
          roleId: data.roleId,
          permissionId: data.permissionId,
          targetUserId: data.targetUserId,
          action: data.action,
          details: data.details,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });
    } catch (error) {
      console.error('Error logging audit entry:', error);
      // Don't throw - audit logging should not break the main operation
    }
  }
}

export default RBACService;
