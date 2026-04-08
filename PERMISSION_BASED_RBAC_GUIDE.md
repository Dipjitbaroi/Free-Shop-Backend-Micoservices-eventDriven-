# Permission-Based RBAC Implementation Guide

## Overview

The system has been refactored from **role-based authorization** to **permission-based authorization**. This enables dynamic role creation by admins with assigned permissions, rather than hardcoded roles.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Superadmin Creates Roles                    │
│  (RBAC System - Dynamic, Flexible, Database-Driven)      │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────┴─────────┐
        │                  │
   ┌────▼────┐      ┌─────▼──────┐
   │  Manager│      │  Delivery   │
   │         │      │  Coordinator│
   │ (Custom)│      │ (Custom)    │
   └────┬────┘      └─────┬──────┘
        │                 │
        └────────┬────────┘
                 │
        ┌────────▼──────────────────┐
        │  Check Permissions        │
        │  authorizePermission()     │
        └────────┬──────────────────┘
                 │
        ┌────────▼──────────────────┐
        │  Allow/Deny Access        │
        └────────────────────────────┘
```

## User Role Enum (Minimal)

Only essential bootstrap roles are in the enum:

```typescript
export enum UserRole {
  CUSTOMER = 'CUSTOMER',    // Default for new users
  VENDOR = 'VENDOR',        // Default for sellers
  ADMIN = 'ADMIN',          // Default admin role
}
```

**Why minimal?**
- Additional roles (MANAGER, SELLER, DELIVERY_MAN, etc.) are created dynamically via RBAC
- Enables business flexibility without code changes
- Supports unlimited custom roles

## Permission Codes

All permissions use numeric codes organized by resource:

```typescript
export const PERMISSION_CODES = {
  // Delivery permissions
  DELIVERY_CREATE: 6001,
  DELIVERY_READ: 6002,
  DELIVERY_UPDATE: 6003,
  DELIVERY_DELETE: 6004,
  DELIVERY_ASSIGN: 6005,
  
  // Order permissions
  ORDER_CREATE: 4001,
  ORDER_READ: 4002,
  ORDER_UPDATE: 4003,
  ORDER_APPROVE: 4005,
  // ... and more
};
```

## Authorization Pattern

### ❌ OLD (Role-Based)
```typescript
router.post('/orders/:id/approve',
  authenticate,
  authorize([UserRole.ADMIN, UserRole.MANAGER]),  // Fixed roles
  controller.approveOrder
);
```

**Problems:**
- Only predefined roles work
- Can't create "ProjectManager" role without code changes
- Inflexible for different organizational structures

### ✅ NEW (Permission-Based)
```typescript
router.post('/orders/:id/approve',
  authenticate,
  authorizePermission(PERMISSION_CODES.ORDER_APPROVE),  // Any role with permission
  controller.approveOrder
);
```

**Benefits:**
- Superadmin can create "ProjectManager" with ORDER_APPROVE permission
- Superadmin can create "Reviewer" with order read/approve permissions
- Unlimited flexibility
- No code changes needed for new roles

## Implementation Steps

### 1. Update Route Imports
```typescript
// OLD
import { authorize } from '@freeshop/shared-middleware';
import { UserRole } from '@freeshop/shared-types';

// NEW
import { authorizePermission } from '@freeshop/shared-middleware';
import { PERMISSION_CODES } from '@freeshop/shared-types';
```

### 2. Replace Route Authorization
```typescript
// OLD
router.put('/deliveries/:id/status',
  authenticate,
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  updateDeliveryStatus
);

// NEW
router.put('/deliveries/:id/status',
  authenticate,
  authorizePermission(PERMISSION_CODES.DELIVERY_UPDATE),
  updateDeliveryStatus
);
```

### 3. Multiple Permissions (OR Logic)
```typescript
// User must have at least ONE of these permissions
router.delete('/orders/:id',
  authenticate,
  authorizePermission(
    PERMISSION_CODES.ORDER_DELETE,
    PERMISSION_CODES.ADMIN_PANEL_ACCESS
  ),
  deleteOrder
);
```

## Permission Code Reference

| Resource | Codes |
|----------|-------|
| USER | 1001-1006 |
| ROLE | 2001-2004 |
| PERMISSION | 3001-3004 |
| ORDER | 4001-4006 |
| PRODUCT | 5001-5004 |
| DELIVERY | 6001-6005 |
| SELLER | 7001-7004 |
| PAYMENT | 8001-8004 |
| REPORT | 9002-9003 |
| SETTINGS | 10002-10003 |
| ADMIN_PANEL | 11001 |

## Default Roles (Created by RBAC Service)

These are created in the database with specific permissions:

| Role | Permissions Count | Scope |
|------|-------------------|-------|
| SUPERADMIN | 13 | Full system control |
| ADMIN | 10 | Platform management |
| MANAGER | 12 | Ops/Sales (CUSTOM) |
| SELLER | 11 | Order fulfillment |
| DELIVERY_MAN | 4 | Delivery execution |
| CUSTOMER | 5 | Shopping |
| VENDOR | 5 | Product management |

## Middleware Signature

```typescript
/**
 * Permission-based authorization middleware
 * @param permissionCodes - One or more permission codes to check
 * @example
 *   authorizePermission(PERMISSION_CODES.ORDER_UPDATE)
 *   authorizePermission(PERMISSION_CODES.DELIVERY_CREATE, PERMISSION_CODES.DELIVERY_ASSIGN)
 */
export const authorizePermission = (...permissionCodes: number[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Fetches user permissions from auth service
    // Checks if user has at least ONE required permission
    // Throws ForbiddenError if none match
  };
};
```

## Flow Diagram

```
Request comes in with JWT token
         │
         ▼
  authenticate() checks JWT
         │
         ▼
  Extract user ID from token
         │
         ▼
authorizePermission(PERMISSION_CODES.DELIVERY_UPDATE)
         │
         ▼
  Call Auth Service GET /auth/users/{userId}/roles
         │
         ▼
  Get array of user's permission codes
         │
         ▼
  Check if user has DELIVERY_UPDATE (6003) permission
         │
         ├─ YES → next() ✅
         │
         └─ NO → throw ForbiddenError ❌
```

## Backward Compatibility

The old `authorize([UserRole.ADMIN])` still works for non-RBAC endpoints, but is **deprecated**.

```typescript
// DEPRECATED but still works
router.get('/admin/stats',
  authenticate,
  authorize([UserRole.ADMIN]),  // Old way
  getStats
);

// RECOMMENDED
router.get('/admin/stats',
  authenticate,
  authorizePermission(PERMISSION_CODES.ADMIN_PANEL_ACCESS),  // New way
  getStats
);
```

## Testing Permission-Based Roles

```bash
# Create a custom "ProjectManager" role with specific permissions
POST /auth/rbac/roles
{
  "name": "ProjectManager",
  "description": "Can create and manage orders",
  "permissionIds": ["<id-for-ORDER_CREATE>", "<id-for-ORDER_UPDATE>"]
}

# Assign to user
POST /auth/rbac/users/:userId/roles
{
  "roleId": "<projectmanager-role-id>"
}

# User can now access ORDER_CREATE endpoints
POST /orders { "items": [...] }  ✅ Allowed

# But cannot access ADMIN_PANEL endpoints
GET /admin/dashboard  ❌ Forbidden
```

## Migration Checklist

- [ ] Update UserRole enum (done ✅)
- [ ] Create authorizePermission middleware (done ✅)
- [ ] Fix auth.middleware imports (done ✅)
- [ ] Update delivery routes (done ✅)
- [ ] Update product routes
- [ ] Update order routes
- [ ] Update payment routes
- [ ] Update inventory routes
- [ ] Update user service routes
- [ ] Update auth service routes
- [ ] Test RBAC initialization
- [ ] Verify permission checks work
- [ ] Test custom role creation
- [ ] Document new endpoints

## Summary

✅ **Dynamic Roles**: Superadmin creates roles on-the-fly
✅ **Permission-Based**: Check capabilities, not fixed identities
✅ **Flexible**: Unlimited custom roles possible
✅ **Enterprise-Grade**: True RBAC/ABAC pattern
✅ **Scalable**: Works for organizations of any size

