# Analytics Permissions Initialization Guide

## Overview

Analytics permissions are initialized through the existing RBAC (Role-Based Access Control) system. When you run the RBAC initialization endpoint, all analytics permissions are automatically created and assigned to appropriate roles.

## Analytics Permission Codes

All analytics permissions are section-based, allowing granular access control:

| Code | Permission | Description | Access Level |
|------|-----------|-------------|--------------|
| 90010 | `ANALYTICS_VIEW_PLATFORM_METRICS` | View platform-wide business metrics (orders, revenue, trends) | ADMIN, MANAGER, SUPERADMIN |
| 90011 | `ANALYTICS_VIEW_VENDOR` | View vendor performance analytics (revenue, products, ratings) | VENDOR, SUPERADMIN |
| 90012 | `ANALYTICS_VIEW_PRODUCT` | View product analytics (sales, views, inventory, returns) | VENDOR, SUPERADMIN |
| 90013 | `ANALYTICS_VIEW_SALES_REPORT` | View admin sales reports (by category, payment method, growth) | ADMIN, MANAGER, SELLER, SUPERADMIN |
| 90014 | `ANALYTICS_VIEW_DELIVERY` | View delivery metrics (person performance, time, success rate) | ADMIN, MANAGER, DELIVERY_MAN, SUPERADMIN |
| 90015 | `ANALYTICS_VIEW_EXECUTIVE` | View executive dashboard (profitability, commissions, financial health) | SUPERADMIN only |

## Step 1: Initialize RBAC with Analytics Permissions

### Using Admin Secret Key (Recommended for Production)

```bash
curl -X POST http://localhost:3001/auth/rbac/init \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: YOUR_ADMIN_SECRET_KEY" \
  -d '{}'
```

### Using RBAC_INIT_OPEN Environment Variable (Development)

Set the environment variable in your `.env` file:
```env
RBAC_INIT_OPEN=true
```

Then call the endpoint with any authenticated user:
```bash
curl -X POST http://localhost:3001/auth/rbac/init \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{}'
```

### Using SUPERADMIN Role (Already Authenticated)

If you're already logged in as SUPERADMIN with the `ROLE_CREATE` permission:
```bash
curl -X POST http://localhost:3001/auth/rbac/init \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPERADMIN_JWT_TOKEN" \
  -d '{}'
```

## Expected Response

```json
{
  "success": true,
  "message": "RBAC initialized successfully",
  "status": 200,
  "data": {
    "rolesCount": 7,
    "permissionsCount": 47,
    "durationMs": 234,
    "timestamp": "2024-04-22T10:30:00.000Z"
  }
}
```

The response confirms:
- ✅ All 7 roles created/updated (SUPERADMIN, ADMIN, MANAGER, VENDOR, SELLER, DELIVERY_MAN, CUSTOMER)
- ✅ All 47 permissions created (including 6 new analytics permissions 90010-90015)
- ✅ Permissions automatically assigned to appropriate roles

## Automatic Role-Permission Assignment

After initialization, analytics permissions are automatically assigned to roles as follows:

### SUPERADMIN
- ✅ All analytics permissions (90010, 90011, 90012, 90013, 90014, 90015)
- Access to all analytics dashboards and reports

### ADMIN
- ✅ Platform metrics (90010) - view business KPIs
- ✅ Sales reports (90013) - view sales analytics
- ✅ Delivery metrics (90014) - view delivery performance
- ✗ Vendor/Product analytics (restricted to VENDOR role)
- ✗ Executive dashboard (SUPERADMIN only)

### MANAGER
- ✅ Platform metrics (90010) - view business KPIs
- ✅ Sales reports (90013) - view sales analytics
- ✅ Delivery metrics (90014) - view delivery performance
- Similar access as ADMIN for analytics

### VENDOR
- ✅ Vendor analytics (90011) - view own vendor performance
- ✅ Product analytics (90012) - view own product performance
- ✗ Platform metrics (ADMIN/MANAGER only)
- ✗ Executive dashboard (SUPERADMIN only)

### SELLER
- ✅ Sales reports (90013) - view sales tracking
- ✗ Platform/Vendor/Delivery analytics

### DELIVERY_MAN
- ✅ Delivery metrics (90014) - view own delivery performance
- ✗ Other analytics sections

### CUSTOMER
- ✗ No analytics permissions

## Step 2: Verify Permissions Were Created

### Check if Permissions Exist in Database

```bash
# Connect to auth-service database
psql -U freeshop_user -d freeshop_auth -c "
  SELECT id, permissionCode, resource, action, description 
  FROM permissions 
  WHERE permissionCode BETWEEN 90010 AND 90015 
  ORDER BY permissionCode;
"
```

Expected output:
```
                  id                  | permissionCode | resource | action | description
--------------------------------------+----------------+----------+--------+------------------------------------------
 uuid-1                               |          90010 | ANALYTICS| READ   | View platform-wide metrics...
 uuid-2                               |          90011 | ANALYTICS| READ   | View vendor performance analytics
 uuid-3                               |          90012 | ANALYTICS| READ   | View product analytics...
 uuid-4                               |          90013 | ANALYTICS| READ   | View admin sales reports...
 uuid-5                               |          90014 | ANALYTICS| READ   | View delivery metrics...
 uuid-6                               |          90015 | ANALYTICS| READ   | View executive dashboard...
```

### Check Role-Permission Assignments

```bash
psql -U freeshop_user -d freeshop_auth -c "
  SELECT r.name as role, p.permissionCode, p.description
  FROM role_permissions rp
  JOIN roles r ON rp.roleId = r.id
  JOIN permissions p ON rp.permissionId = p.id
  WHERE p.permissionCode BETWEEN 90010 AND 90015
  ORDER BY r.name, p.permissionCode;
"
```

## Step 3: Test Analytics Access

Once permissions are initialized, users can access analytics endpoints based on their role.

### Example: Admin Testing Platform Metrics (90010)

```bash
curl -X GET http://localhost:3001/api/analytics/platform/dashboard \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "totalOrders": 1523,
    "totalRevenue": 2450000,
    "activeVendors": 48,
    "deliverySuccessRate": 98.5
  }
}
```

### Example: Vendor Testing Vendor Analytics (90011)

```bash
curl -X GET http://localhost:3001/api/analytics/vendor/dashboard \
  -H "Authorization: Bearer YOUR_VENDOR_JWT_TOKEN"
```

### Example: Insufficient Permissions (403 Error)

If a user without permission 90010 tries to access platform metrics:

```bash
curl -X GET http://localhost:3001/api/analytics/platform/dashboard \
  -H "Authorization: Bearer VENDOR_JWT_TOKEN"
```

Expected error response:
```json
{
  "success": false,
  "error": "Insufficient permissions",
  "statusCode": 403
}
```

## Step 4: Assign Analytics Permissions to Existing Users

If you need to manually assign analytics permissions to specific users after initialization:

### Get User's Current Roles

```bash
curl -X GET http://localhost:3001/auth/rbac/users/{userId}/roles \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Assign Role with Analytics Permissions

For example, to give a user vendor analytics access, assign them the VENDOR role:

```bash
curl -X POST http://localhost:3001/auth/rbac/users/{userId}/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "roleId": "VENDOR_ROLE_ID"
  }'
```

The user will automatically receive all permissions of the VENDOR role, including analytics permissions 90011 and 90012.

## Implementation Details

### Permission Codes Location
- File: [packages/shared-types/src/rbac.types.ts](packages/shared-types/src/rbac.types.ts)
- The analytics permission codes (90010-90015) are defined in `PERMISSION_CODES` enum

### Role-Permission Mappings
- File: [packages/shared-types/src/rbac.types.ts](packages/shared-types/src/rbac.types.ts)
- The `ROLE_PERMISSIONS` object maps each role to its assigned permission codes
- Analytics permissions are now included in the role mappings

### RBAC Initialization Service
- File: [services/auth-service/src/services/rbac.service.ts](services/auth-service/src/services/rbac.service.ts)
- Method: `RBACService.initializeDefaultRoles()`
- Creates all permissions from `PERMISSION_CODES` 
- Assigns permissions to roles based on `ROLE_PERMISSIONS`
- For analytics permissions, they are created with resource='ANALYTICS', action='READ'

### RBAC Initialization Endpoint
- File: [services/auth-service/src/routes/rbac.routes.ts](services/auth-service/src/routes/rbac.routes.ts)
- Endpoint: `POST /auth/rbac/init`
- Auth middleware checks: `ADMIN_SECRET_KEY` OR `RBAC_INIT_OPEN=true` OR `SUPERADMIN + ROLE_CREATE permission`
- Calls `RBACService.initializeDefaultRoles()` internally

### Analytics Permission Middleware
- File: [services/analytics-service/src/middleware/analytics-auth.middleware.ts](services/analytics-service/src/middleware/analytics-auth.middleware.ts)
- Function: `authorizeAnalyticsSection(requiredPermissionCode)`
- Validates user has required permission code (90010-90015)
- Returns 401 if user not authenticated, 403 if permission missing

### Analytics Routes
- File: [services/analytics-service/src/routes/analytics.routes.ts](services/analytics-service/src/routes/analytics.routes.ts)
- All 26 analytics endpoints are protected by permission-code middleware
- Example: Platform metrics endpoints require permission 90010

## Troubleshooting

### Error: "Insufficient permissions" at /auth/rbac/init

**Cause:** Your account doesn't have permission to initialize RBAC

**Solution:**
1. Check if `ADMIN_SECRET_KEY` environment variable is set correctly
2. Verify you're using SUPERADMIN account with ROLE_CREATE permission
3. Ensure `RBAC_INIT_OPEN=true` is set in dev mode

### Error: "Permission not found" when accessing analytics endpoint

**Cause:** Analytics permissions haven't been initialized yet

**Solution:**
1. Run RBAC initialization: `POST /auth/rbac/init`
2. Verify permissions were created: Check database query above
3. Log out and log in again to refresh JWT token

### Error: User has role but still gets 403 on analytics endpoint

**Cause:** The RBAC initialization may have failed or been partial

**Solution:**
1. Re-run RBAC initialization: `POST /auth/rbac/init`
2. Verify all 47 permissions were created
3. Check user's JWT token contains permission code array in the payload

### Permission Codes Not in User JWT Token

**Cause:** Token generated before RBAC initialization or role assignment

**Solution:**
1. User needs to log out and log in again
2. New JWT will include updated permissions from database

## Migration from Manual Permission Assignment

If you were manually managing analytics permissions before:

1. **Backup current data:**
   ```bash
   pg_dump -U freeshop_user -d freeshop_auth > backup_rbac.sql
   ```

2. **Run RBAC initialization:**
   ```bash
   curl -X POST http://localhost:3001/auth/rbac/init \
     -H "x-admin-secret: YOUR_ADMIN_SECRET_KEY"
   ```

3. **Verify existing user permissions still work:**
   ```bash
   # Test with existing users to ensure no access is broken
   curl -X GET http://localhost:3001/api/analytics/platform/dashboard \
     -H "Authorization: Bearer EXISTING_USER_JWT_TOKEN"
   ```

## Next Steps

After initializing analytics permissions:

1. **For Users:** Users can now access analytics dashboards based on their role
2. **For Admins:** Configure custom role-permission mappings if needed (beyond default setup)
3. **For Developers:** Integrate analytics API responses with frontend dashboards
4. **For DevOps:** Add RBAC initialization to deployment pipeline/Helm charts

## Environment Variables

Add these to your `.env` for auth-service:

```env
# RBAC Configuration
RBAC_INIT_OPEN=false                          # Set to true in dev mode to allow any authenticated user to init RBAC
ADMIN_SECRET_KEY=your-secure-admin-key        # Used for production RBAC init
SUPERADMIN_EMAIL=superadmin@freeshop.com      # Email of superadmin user
```

## References

- [RBAC Implementation Documentation](SERVICE_AUTH_ARCHITECTURE.md)
- [Analytics Service API Documentation](README.md#analytics-endpoints)
- [Permission-Based Access Control Guide](PERMISSION_BASED_RBAC_GUIDE.md)
