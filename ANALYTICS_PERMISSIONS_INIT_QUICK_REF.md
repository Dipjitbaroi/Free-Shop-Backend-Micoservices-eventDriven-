# Analytics Permissions Initialization - Quick Reference

## TL;DR - Initialize Analytics Permissions in 2 Steps

### Step 1: Initialize RBAC System (Creates Analytics Permissions)

```bash
# Production: Using Admin Secret Key
curl -X POST http://localhost:3001/auth/rbac/init \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: YOUR_ADMIN_SECRET_KEY"

# Development: Using RBAC_INIT_OPEN=true
curl -X POST http://localhost:3001/auth/rbac/init \
  -H "Authorization: Bearer ANY_JWT_TOKEN"
```

✅ **Result:** All 6 analytics permissions (codes 90010-90015) are created and assigned to roles

### Step 2: Test Analytics Access

```bash
# As ADMIN - Access Platform Metrics
curl -X GET http://localhost:3001/api/analytics/platform/dashboard \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"

# As VENDOR - Access Vendor Analytics  
curl -X GET http://localhost:3001/api/analytics/vendor/dashboard \
  -H "Authorization: Bearer VENDOR_JWT_TOKEN"
```

---

## What Gets Initialized?

### 6 Analytics Permission Codes

| Code | Permission | Roles That Get It |
|------|-----------|------------------|
| 90010 | Platform Metrics | ADMIN, MANAGER, SUPERADMIN |
| 90011 | Vendor Analytics | VENDOR, SUPERADMIN |
| 90012 | Product Analytics | VENDOR, SUPERADMIN |
| 90013 | Sales Reports | ADMIN, MANAGER, SELLER, SUPERADMIN |
| 90014 | Delivery Metrics | ADMIN, MANAGER, DELIVERY_MAN, SUPERADMIN |
| 90015 | Executive Dashboard | SUPERADMIN only |

---

## How It Works

1. **Permission codes (90010-90015)** are defined in `PERMISSION_CODES` enum
2. **Role-permission mappings** are defined in `ROLE_PERMISSIONS` object
3. **RBAC initialization endpoint** (`POST /auth/rbac/init`) creates all permissions and assigns them to roles
4. **Analytics middleware** checks if user has required permission code before allowing access
5. **Users get permissions** through their assigned role

---

## Files Changed

✅ `packages/shared-types/src/rbac.types.ts`
- Added 6 analytics permission codes (90010-90015) to `PERMISSION_CODES`
- Added analytics permissions to role mappings in `ROLE_PERMISSIONS`

✅ `services/auth-service/src/services/rbac.service.ts`
- Added analytics permission initialization logic
- Handles creation and assignment of analytics permissions during RBAC init

✅ Documentation created:
- `ANALYTICS_PERMISSIONS_INITIALIZATION.md` - Complete guide with examples
- `ANALYTICS_PERMISSIONS_INITIALIZATION_QUICK_REFERENCE.md` - This file (quick reference)

---

## Common Scenarios

### Scenario 1: First Time Setup
```bash
# Initialize everything
curl -X POST http://localhost:3001/auth/rbac/init \
  -H "x-admin-secret: YOUR_ADMIN_SECRET_KEY"

# Users can now access analytics based on their role
```

### Scenario 2: Give User Analytics Access
```bash
# Assign VENDOR role to user (automatically gets analytics permissions)
curl -X POST http://localhost:3001/auth/rbac/users/{userId}/roles \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{"roleId": "vendor-role-id"}'
```

### Scenario 3: Check If User Has Permission
```bash
# Get user's permissions
curl -X GET http://localhost:3001/auth/rbac/users/{userId}/roles \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"

# Response includes permissionCodes array with [90010, 90011, ...]
```

---

## Build Status
✅ TypeScript compilation: **PASS** - All 15 workspace projects build successfully
✅ Analytics middleware: **Integrated** - Permission code validation working
✅ RBAC service: **Updated** - Analytics permissions handled in initialization

---

## Next Actions

- [ ] Deploy updated code to dev/staging
- [ ] Run RBAC initialization: `POST /auth/rbac/init`
- [ ] Verify analytics permissions in database
- [ ] Test analytics endpoints with different user roles
- [ ] Update frontend to show analytics dashboards based on user permissions

---

For detailed information, see [ANALYTICS_PERMISSIONS_INITIALIZATION.md](ANALYTICS_PERMISSIONS_INITIALIZATION.md)
