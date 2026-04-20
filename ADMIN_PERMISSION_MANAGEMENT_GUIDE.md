# Admin Permission Management Guide

## Overview

Your system has a complete **Role-Based Access Control (RBAC)** system. The admin account (`admin@freeshop.com`) has the `SUPERADMIN` role, which grants **ALL 41 permissions**.

---

## 1. Current Admin Account Status

**Email:** `admin@freeshop.com`  
**Password:** `Str0ng!Pass`  
**Role:** `SUPERADMIN`  
**Permissions:** All 41 permissions (complete access)

---

## 2. Available Roles (Pre-defined)

| Role | Purpose | Key Permissions |
|------|---------|-----------------|
| **SUPERADMIN** | Full system access | All 41 permissions |
| **ADMIN** | System management | User, Role, Permission, Order, Product, Payment management |
| **MANAGER** | Operational control | Read + Update on User, Order, Product, Delivery, Inventory |
| **SELLER** | Product selling | Product Create/Read/Update, Order/Inventory read |
| **VENDOR** | Alternative seller | Same as SELLER |
| **DELIVERY_MAN** | Delivery operations | Read + Update deliveries, Create reports |
| **CUSTOMER** | End user | Review read, Profile management |

---

## 3. How Admin Assigns Permissions to Others

### **Method 1: Assign Pre-defined Role (RECOMMENDED)**

#### Step 1: Get Admin Login Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@freeshop.com",
    "password": "Str0ng!Pass"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### Step 2: Get Available Roles

```bash
curl -X GET http://localhost:3000/api/v1/auth/rbac/roles \
  -H "Authorization: Bearer {accessToken}"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "role-uuid-1",
      "name": "SUPERADMIN",
      "description": "Super administrator with all permissions",
      "permissionCount": 41
    },
    {
      "id": "role-uuid-2",
      "name": "ADMIN",
      "description": "Administrator with managing permissions",
      "permissionCount": 25
    },
    {
      "id": "role-uuid-3",
      "name": "MANAGER",
      "description": "Manager with operational permissions",
      "permissionCount": 12
    },
    {
      "id": "role-uuid-4",
      "name": "SELLER",
      "description": "Seller/Vendor account",
      "permissionCount": 10
    }
  ]
}
```

#### Step 3: Assign Role to User

```bash
curl -X POST http://localhost:3000/api/v1/auth/rbac/users/{userId}/roles \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "roleId": "role-uuid-2"  # Assign ADMIN role
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Role assigned successfully",
  "data": {
    "userId": "user-uuid",
    "roleId": "role-uuid-2",
    "roleNames": ["ADMIN"]
  }
}
```

---

### **Method 2: View User's Permissions**

#### Get User's Roles and All Permissions

```bash
curl -X GET http://localhost:3000/api/v1/auth/rbac/users/{userId}/roles \
  -H "Authorization: Bearer {accessToken}"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user-uuid",
    "roleNames": ["ADMIN"],
    "permissionCodes": [
      1002,  # USER_READ
      1003,  # USER_UPDATE
      2001,  # ROLE_CREATE
      2002,  # ROLE_READ
      2003,  # ROLE_UPDATE
      2004,  # ROLE_DELETE
      3001,  # PERMISSION_CREATE
      3002,  # PERMISSION_READ
      3003,  # PERMISSION_UPDATE
      3004,  # PERMISSION_DELETE
      4001,  # ORDER_CREATE
      4002,  # ORDER_READ
      4003,  # ORDER_UPDATE
      // ... and more
    ]
  }
}
```

---

### **Method 3: Check Specific Permission**

#### Verify User Has Specific Permission

```bash
curl -X GET http://localhost:3000/api/v1/auth/rbac/users/{userId}/permissions/1002/check \
  -H "Authorization: Bearer {accessToken}"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user-uuid",
    "permissionCode": 1002,
    "hasPermission": true
  }
}
```

---

### **Method 4: Create Custom Role (Advanced)**

#### Step 1: Create New Custom Role

```bash
curl -X POST http://localhost:3000/api/v1/auth/rbac/roles \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CONTENT_MANAGER",
    "description": "Can manage products and reviews only"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new-role-uuid",
    "name": "CONTENT_MANAGER",
    "description": "Can manage products and reviews only"
  }
}
```

#### Step 2: Get Permission Codes Reference

```bash
curl -X GET http://localhost:3000/api/v1/auth/rbac/permission-codes
```

**Response:**
```json
{
  "success": true,
  "data": {
    "USER_CREATE": 1001,
    "USER_READ": 1002,
    "USER_UPDATE": 1003,
    "USER_DELETE": 1004,
    "USER_APPROVE": 1005,
    "USER_REJECT": 1006,
    "ROLE_CREATE": 2001,
    "ROLE_READ": 2002,
    "ROLE_UPDATE": 2003,
    "ROLE_DELETE": 2004,
    "PERMISSION_CREATE": 3001,
    "PERMISSION_READ": 3002,
    "PERMISSION_UPDATE": 3003,
    "PERMISSION_DELETE": 3004,
    "ORDER_CREATE": 4001,
    "ORDER_READ": 4002,
    "ORDER_UPDATE": 4003,
    "ORDER_DELETE": 4004,
    "ORDER_APPROVE": 4005,
    "ORDER_REJECT": 4006,
    "PRODUCT_CREATE": 5001,
    "PRODUCT_READ": 5002,
    "PRODUCT_UPDATE": 5003,
    "PRODUCT_DELETE": 5004,
    // ... and 27 more permission codes
  }
}
```

#### Step 3: Add Specific Permissions to Custom Role

```bash
# Add PRODUCT_CREATE (5001)
curl -X POST http://localhost:3000/api/v1/auth/rbac/roles/{newRoleId}/permissions \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "permissionCode": 5001
  }'

# Add PRODUCT_READ (5002)
curl -X POST http://localhost:3000/api/v1/auth/rbac/roles/{newRoleId}/permissions \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "permissionCode": 5002
  }'

# Add REVIEW_CREATE (5101)
curl -X POST http://localhost:3000/api/v1/auth/rbac/roles/{newRoleId}/permissions \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "permissionCode": 5101
  }'
```

#### Step 4: Assign Custom Role to User

```bash
curl -X POST http://localhost:3000/api/v1/auth/rbac/users/{userId}/roles \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "roleId": "new-role-uuid"
  }'
```

---

### **Method 5: Remove Role from User**

```bash
curl -X DELETE http://localhost:3000/api/v1/auth/rbac/users/{userId}/roles/{roleId} \
  -H "Authorization: Bearer {accessToken}"
```

**Response:**
```json
{
  "success": true,
  "message": "Role removed successfully"
}
```

---

## 4. Complete Permission Codes Reference

### User Permissions (1000-1099)
- `1001` - USER_CREATE: Create new users
- `1002` - USER_READ: View user details
- `1003` - USER_UPDATE: Update user information
- `1004` - USER_DELETE: Delete users
- `1005` - USER_APPROVE: Approve user registrations
- `1006` - USER_REJECT: Reject user registrations

### Role Permissions (2000-2099)
- `2001` - ROLE_CREATE: Create new roles
- `2002` - ROLE_READ: View roles
- `2003` - ROLE_UPDATE: Update role definitions
- `2004` - ROLE_DELETE: Delete roles

### Permission Management (3000-3099)
- `3001` - PERMISSION_CREATE: Create new permissions
- `3002` - PERMISSION_READ: View permissions
- `3003` - PERMISSION_UPDATE: Update permissions
- `3004` - PERMISSION_DELETE: Delete permissions

### Order Permissions (4000-4099)
- `4001` - ORDER_CREATE: Create orders
- `4002` - ORDER_READ: View orders
- `4003` - ORDER_UPDATE: Update orders
- `4004` - ORDER_DELETE: Delete orders
- `4005` - ORDER_APPROVE: Approve orders
- `4006` - ORDER_REJECT: Reject orders

### Product Permissions (5000-5099)
- `5001` - PRODUCT_CREATE: Create products
- `5002` - PRODUCT_READ: View products
- `5003` - PRODUCT_UPDATE: Update products
- `5004` - PRODUCT_DELETE: Delete products

### Review Permissions (5100-5199)
- `5101` - REVIEW_CREATE: Create reviews
- `5102` - REVIEW_READ: View reviews
- `5103` - REVIEW_UPDATE: Update reviews
- `5104` - REVIEW_DELETE: Delete reviews

### Delivery Permissions (6000-6099)
- `6001` - DELIVERY_CREATE: Create deliveries
- `6002` - DELIVERY_READ: View deliveries
- `6003` - DELIVERY_UPDATE: Update deliveries
- `6004` - DELIVERY_DELETE: Delete deliveries
- `6005` - DELIVERY_APPROVE: Assign delivery personnel

### Inventory Permissions (6100-6199)
- `6101` - INVENTORY_CREATE: Create inventory entries
- `6102` - INVENTORY_READ: View inventory
- `6103` - INVENTORY_UPDATE: Update inventory
- `6104` - INVENTORY_DELETE: Delete inventory

### Seller/Vendor Permissions (7000-7099)
- `7001` - SELLER_CREATE: Register seller
- `7002` - SELLER_READ: View seller profile
- `7003` - SELLER_UPDATE: Update seller profile
- `7004` - SELLER_DELETE: Deactivate seller

### Payment Permissions (8000-8099)
- `8001` - PAYMENT_CREATE: Create payment records
- `8002` - PAYMENT_READ: View payment details
- `8003` - PAYMENT_UPDATE: Update payment status
- `8004` - PAYMENT_DELETE: Delete payment records

### Report Permissions (9000-9099)
- `9001` - REPORT_CREATE: Generate reports
- `9002` - REPORT_READ: View reports
- `9003` - REPORT_UPDATE: Update reports
- `9004` - REPORT_DELETE: Delete reports

### Admin Panel (10000-10099)
- `10001` - ADMIN_PANEL_ACCESS: Access admin dashboard

---

## 5. Workflow Examples

### Example 1: Create a Manager Account

```bash
# 1. Login as admin
LOGIN_TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@freeshop.com","password":"Str0ng!Pass"}' \
  | jq -r '.data.tokens.accessToken')

# 2. Get MANAGER role ID
MANAGER_ROLE_ID=$(curl -s -X GET http://localhost:3000/api/v1/auth/rbac/roles \
  -H "Authorization: Bearer $LOGIN_TOKEN" \
  | jq -r '.data[] | select(.name=="MANAGER") | .id')

# 3. Create new manager user (via auth service or user service)
# ... user creation endpoint ...

# 4. Assign MANAGER role to user
curl -X POST http://localhost:3000/api/v1/auth/rbac/users/{newUserId}/roles \
  -H "Authorization: Bearer $LOGIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"roleId\": \"$MANAGER_ROLE_ID\"}"
```

### Example 2: Create Limited Access Role for Content Team

```bash
# 1. Create custom role
ROLE_ID=$(curl -s -X POST http://localhost:3000/api/v1/auth/rbac/roles \
  -H "Authorization: Bearer $LOGIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CONTENT_TEAM",
    "description": "Can create and manage products, view orders"
  }' | jq -r '.data.id')

# 2. Add specific permissions
for PERM in 5001 5002 5003 5101 5102 4002; do
  curl -X POST http://localhost:3000/api/v1/auth/rbac/roles/$ROLE_ID/permissions \
    -H "Authorization: Bearer $LOGIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"permissionCode\": $PERM}"
done

# 3. Assign to content team members
curl -X POST http://localhost:3000/api/v1/auth/rbac/users/{userId}/roles \
  -H "Authorization: Bearer $LOGIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"roleId\": \"$ROLE_ID\"}"
```

---

## 6. Key Points

✅ **Admin is SUPERADMIN** - Has all 41 permissions  
✅ **Assign pre-defined roles** - Fastest way to grant permissions  
✅ **Create custom roles** - For specific permission combinations  
✅ **Check permissions** - Verify user access before taking action  
✅ **Audit logged** - All permission changes are tracked  
✅ **Can assign multiple roles** - User can have multiple role assignments  

---

## 7. API Base URL

```
Local: http://localhost:3000/api/v1/auth/rbac/
```

All endpoints require `Authorization: Bearer {accessToken}` header.
