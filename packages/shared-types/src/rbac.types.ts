/**
 * RBAC (Role-Based Access Control) Types
 * Includes roles, permissions, and their numeric tracing codes
 */

// ── Permission Code Mapping ──
// Format: {RESOURCE_CODE}{ACTION_CODE}
// Resources:
export const PERMISSION_RESOURCE_CODES = {
  USER: 10,        // 10xx
  ROLE: 20,        // 20xx
  PERMISSION: 30,  // 30xx
  ORDER: 40,       // 40xx
  PRODUCT: 50,     // 50xx
  DELIVERY: 60,    // 60xx
  SELLER: 70,      // 70xx
  PAYMENT: 80,     // 80xx
  REPORT: 90,      // 90xx
  SETTINGS: 100,   // 100x
  ADMIN_PANEL: 110, // 110x
} as const;

// Actions:
export const PERMISSION_ACTION_CODES = {
  CREATE: 1,   // xx01
  READ: 2,     // xx02
  UPDATE: 3,   // xx03
  DELETE: 4,   // xx04
  APPROVE: 5,  // xx05
  REJECT: 6,   // xx06
} as const;

// Precomputed permission codes for easy reference
export const PERMISSION_CODES = {
  // User permissions
  USER_CREATE: 1001,
  USER_READ: 1002,
  USER_UPDATE: 1003,
  USER_DELETE: 1004,
  USER_APPROVE: 1005,
  USER_REJECT: 1006,

  // Role permissions
  ROLE_CREATE: 2001,
  ROLE_READ: 2002,
  ROLE_UPDATE: 2003,
  ROLE_DELETE: 2004,

  // Permission management
  PERMISSION_CREATE: 3001,
  PERMISSION_READ: 3002,
  PERMISSION_UPDATE: 3003,
  PERMISSION_DELETE: 3004,

  // Order permissions (Seller can create, read own orders)
  ORDER_CREATE: 4001,
  ORDER_READ: 4002,
  ORDER_UPDATE: 4003,
  ORDER_DELETE: 4004,
  ORDER_APPROVE: 4005,
  ORDER_REJECT: 4006,

  // Product permissions
  PRODUCT_CREATE: 5001,
  PRODUCT_READ: 5002,
  PRODUCT_UPDATE: 5003,
  PRODUCT_DELETE: 5004,

  // Review permissions
  REVIEW_CREATE: 5101,
  REVIEW_READ: 5102,
  REVIEW_UPDATE: 5103,
  REVIEW_DELETE: 5104,

  // Delivery permissions
  DELIVERY_CREATE: 6001,
  DELIVERY_READ: 6002,
  DELIVERY_UPDATE: 6003,
  DELIVERY_DELETE: 6004,
  DELIVERY_ASSIGN: 6005,

  // Inventory permissions
  INVENTORY_CREATE: 6101,
  INVENTORY_READ: 6102,
  INVENTORY_UPDATE: 6103,
  INVENTORY_DELETE: 6104,

  // Seller permissions
  SELLER_CREATE: 7001,
  SELLER_READ: 7002,
  SELLER_UPDATE: 7003,
  SELLER_DELETE: 7004,

  // Payment permissions
  PAYMENT_CREATE: 8001,
  PAYMENT_READ: 8002,
  PAYMENT_UPDATE: 8003,
  PAYMENT_REFUND: 8004,

  // Report permissions
  REPORT_READ: 9002,
  REPORT_EXPORT: 9003,

  // Settings permissions
  SETTINGS_READ: 10002,
  SETTINGS_UPDATE: 10003,

  // Admin panel permissions
  ADMIN_PANEL_ACCESS: 11001,

  // User Management permissions (specific to user update/delete operations)
  USER_MANAGEMENT_UPDATE: 11002,
  USER_MANAGEMENT_DELETE: 11003,
} as const;

// ── Role Definitions ──
export interface IRole {
  id: string;
  name: string; // SUPERADMIN, SELLER, DELIVERY_MAN, CUSTOMER, VENDOR, ADMIN
  description?: string;
  roleNumber: number; // Sequential number for tracing
  permissions: IPermission[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPermission {
  id: string;
  permissionCode: number; // Numeric code for tracing
  action: PermissionAction;
  resource: PermissionResource;
  description?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  assignmentNumber: number; // Sequential number for this assignment
  grantedBy: string;
  grantedAt: Date;
  revokedAt?: Date;
  revokedBy?: string;
}

export interface IUserRole {
  id: string;
  userId: string;
  roleId: string;
  assignmentNumber: number; // Sequential number for this assignment
  assignedBy: string;
  assignedAt: Date;
  revokedAt?: Date;
  revokedBy?: string;
}

export interface IPermissionAuditLog {
  id: string;
  auditNumber: number; // Sequential number for tracing
  userId: string;
  roleId?: string;
  permissionId?: string;
  action: string; // ROLE_CREATED, PERMISSION_GRANTED, etc.
  targetUserId?: string;
  details?: Record<string, string>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// ── Request/Response Interfaces ──
export interface ICreateRoleRequest {
  name: string;
  description?: string;
  permissionIds: string[];
}

export interface ICreatePermissionRequest {
  action: PermissionAction;
  resource: PermissionResource;
  description?: string;
}

export interface IAssignRoleRequest {
  roleId: string;
}

export interface IAssignPermissionToRoleRequest {
  permissionId: string;
}

export interface IRoleWithDetails extends IRole {
  userCount: number;
  permissionCount: number;
}

export interface IPermissionCheckRequest {
  userId: string;
  permissionCode: number | PermissionResource | PermissionAction;
}

export interface IPermissionCheckResponse {
  hasPermission: boolean;
  permissionCode: number;
  action?: PermissionAction;
  resource?: PermissionResource;
}

// ── Delivery Related ──
export interface IDeliveryMan {
  id: string;
  userId: string;
  licenseNumber?: string;
  vehicleType?: string;
  vehicleId?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  isAvailable: boolean;
  currentOrders: number;
  totalDeliveries: number;
  rating?: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISellerProfile {
  id: string;
  userId: string;
  shopName: string;
  shopSlug: string;
  shopDescription?: string;
  shopLogo?: string;
  shopBanner?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'ONBOARDING';
  isVerified: boolean;
  rating?: number;
  ratingCount: number;
  totalOrders: number;
  totalRevenue: number;
  completionRate?: number;
  returnRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ── Enums ──
export enum PermissionAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

export enum PermissionResource {
  USER = 'USER',
  ROLE = 'ROLE',
  PERMISSION = 'PERMISSION',
  ORDER = 'ORDER',
  PRODUCT = 'PRODUCT',
  REVIEW = 'REVIEW',
  DELIVERY = 'DELIVERY',
  INVENTORY = 'INVENTORY',
  SELLER = 'SELLER',
  PAYMENT = 'PAYMENT',
  REPORT = 'REPORT',
  SETTINGS = 'SETTINGS',
  ADMIN_PANEL = 'ADMIN_PANEL',
}

export enum DeliveryProvider {
  INHOUSE = 'INHOUSE',
  STEADFAST = 'STEADFAST',
  PATHAO = 'PATHAO',
  REDX = 'REDX',
  SUNDARBAN = 'SUNDARBAN',
  OTHER = 'OTHER',
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

// ── Default Roles & Permissions Setup ──
export const DEFAULT_ROLES = {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  SELLER: 'SELLER',
  DELIVERY_MAN: 'DELIVERY_MAN',
  CUSTOMER: 'CUSTOMER',
  VENDOR: 'VENDOR',
} as const;

export const ROLE_PERMISSIONS = {
  SUPERADMIN: [
    PERMISSION_CODES.USER_CREATE,
    PERMISSION_CODES.USER_READ,
    PERMISSION_CODES.USER_UPDATE,
    PERMISSION_CODES.USER_DELETE,
    PERMISSION_CODES.ROLE_CREATE,
    PERMISSION_CODES.ROLE_READ,
    PERMISSION_CODES.ROLE_UPDATE,
    PERMISSION_CODES.ROLE_DELETE,
    PERMISSION_CODES.PERMISSION_CREATE,
    PERMISSION_CODES.PERMISSION_READ,
    PERMISSION_CODES.PERMISSION_UPDATE,
    PERMISSION_CODES.PERMISSION_DELETE,
    PERMISSION_CODES.ADMIN_PANEL_ACCESS,
  ],
  ADMIN: [
    PERMISSION_CODES.USER_READ,
    PERMISSION_CODES.USER_UPDATE,
    PERMISSION_CODES.USER_MANAGEMENT_UPDATE,
    PERMISSION_CODES.USER_MANAGEMENT_DELETE,
    PERMISSION_CODES.ORDER_READ,
    PERMISSION_CODES.ORDER_UPDATE,
    PERMISSION_CODES.ORDER_APPROVE,
    PERMISSION_CODES.DELIVERY_READ,
    PERMISSION_CODES.DELIVERY_UPDATE,
    PERMISSION_CODES.DELIVERY_ASSIGN,
    PERMISSION_CODES.REPORT_READ,
    PERMISSION_CODES.ADMIN_PANEL_ACCESS,
  ],
  MANAGER: [
    PERMISSION_CODES.USER_READ,
    PERMISSION_CODES.USER_MANAGEMENT_UPDATE,
    PERMISSION_CODES.USER_MANAGEMENT_DELETE,
    PERMISSION_CODES.ORDER_READ,
    PERMISSION_CODES.ORDER_UPDATE,
    PERMISSION_CODES.DELIVERY_READ,
    PERMISSION_CODES.DELIVERY_CREATE,
    PERMISSION_CODES.DELIVERY_UPDATE,
    PERMISSION_CODES.DELIVERY_ASSIGN,
    PERMISSION_CODES.PRODUCT_READ,
    PERMISSION_CODES.PRODUCT_CREATE,
    PERMISSION_CODES.PRODUCT_UPDATE,
    PERMISSION_CODES.PAYMENT_READ,
    PERMISSION_CODES.REPORT_READ,
  ],
  SELLER: [
    PERMISSION_CODES.ORDER_CREATE,
    PERMISSION_CODES.ORDER_READ,
    PERMISSION_CODES.ORDER_UPDATE,
    PERMISSION_CODES.DELIVERY_READ,
    PERMISSION_CODES.DELIVERY_CREATE,
    PERMISSION_CODES.DELIVERY_UPDATE,
    PERMISSION_CODES.DELIVERY_ASSIGN,
    PERMISSION_CODES.PRODUCT_READ,
    PERMISSION_CODES.PRODUCT_CREATE,
    PERMISSION_CODES.PAYMENT_READ,
    PERMISSION_CODES.REPORT_READ,
  ],
  DELIVERY_MAN: [
    PERMISSION_CODES.ORDER_READ,
    PERMISSION_CODES.DELIVERY_READ,
    PERMISSION_CODES.DELIVERY_UPDATE,
    PERMISSION_CODES.REPORT_READ,
  ],
  CUSTOMER: [
    PERMISSION_CODES.ORDER_CREATE,
    PERMISSION_CODES.ORDER_READ,
    PERMISSION_CODES.PRODUCT_READ,
    PERMISSION_CODES.PAYMENT_CREATE,
    PERMISSION_CODES.REPORT_READ,
  ],
  VENDOR: [
    PERMISSION_CODES.ORDER_READ,
    PERMISSION_CODES.PRODUCT_CREATE,
    PERMISSION_CODES.PRODUCT_READ,
    PERMISSION_CODES.PRODUCT_UPDATE,
    PERMISSION_CODES.REPORT_READ,
  ],
} as const;
