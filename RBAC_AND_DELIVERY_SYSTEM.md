# Role-Based Access Control (RBAC) & Delivery Management System

## Table of Contents
1. [System Overview](#system-overview)
2. [Permission Codes & Tracing](#permission-codes--tracing)
3. [Roles & Permissions](#roles--permissions)
4. [Default Roles](#default-roles)
5. [API Endpoints](#api-endpoints)
6. [Delivery System](#delivery-system)
7. [Seller Management](#seller-management)
8. [Delivery Man Management](#delivery-man-management)
9. [Implementation Examples](#implementation-examples)
10. [Database Schemas](#database-schemas)

---

## System Overview

### Architecture
The RBAC system uses **numeric permission codes** for precise tracing and auditing of all role and permission assignments. Every permission has:
- A **unique numeric code** (e.g., 1001 for USER.CREATE)
- Resource and Action enums for programmatic access
- Audit trail with sequential tracking numbers

### Key Features
- ✅ Superadmin can create custom roles and manage permissions
- ✅ Numeric permission codes for audit tracing
- ✅ Permission audit logs with sequential numbers
- ✅ Support for Seller role (company staff managing orders)
- ✅ Support for DeliveryMan role (in-house delivery staff)
- ✅ Integration with 3rd party delivery providers (Steadfast, Pathao, RedX, etc.)
- ✅ Seller can create orders for customers
- ✅ Orders can be assigned to in-house delivery men or 3rd party providers

---

## Permission Codes & Tracing

### Permission Code Structure
Format: `{RESOURCE_CODE}{ACTION_CODE}`

**Resource Codes:**
- USER: 10
- ROLE: 20
- PERMISSION: 30
- ORDER: 40
- PRODUCT: 50
- DELIVERY: 60
- SELLER: 70
- PAYMENT: 80
- REPORT: 90
- SETTINGS: 100
- ADMIN_PANEL: 110

**Action Codes:**
- CREATE: 01
- READ: 02
- UPDATE: 03
- DELETE: 04
- APPROVE: 05
- REJECT: 06

### Examples
| Permission | Code | Meaning |
|-----------|------|---------|
| USER_CREATE | 1001 | Create user (1000 + 1) |
| USER_READ | 1002 | Read user (1000 + 2) |
| ORDER_CREATE | 4001 | Create order (4000 + 1) |
| DELIVERY_ASSIGN | 6005 | Assign delivery (6000 + 5) |
| PERMISSION_CREATE | 3001 | Create permission (3000 + 1) |

### Tracing Numbers
Each assignment has sequential audit numbers:
- `Role.roleNumber`: Unique sequential ID for role creation tracking
- `RolePermission.assignmentNumber`: Tracks when permission was added to role
- `UserRole.assignmentNumber`: Tracks when role was assigned to user
- `PermissionAuditLog.auditNumber`: Tracks all permission-related actions

---

## Roles & Permissions

### Role Hierarchy

```
SUPERADMIN
├── Full system access
├── Can create/manage all roles
└── Can grant/revoke any permission

ADMIN
├── Manage orders and deliveries
├── Manage users (read/update)
├── Approve sellers
└── View reports

SELLER
├── Create orders
├── Manage own orders
├── Assign to delivery providers
├── View deliveries
└── View reports

DELIVERY_MAN
├── View assigned deliveries
├── Update delivery status
└── View reports

CUSTOMER
├── Create orders
├── View own orders
├── View products
├── Make payments

VENDOR
├── Manage products
├── View orders (for own products)
└── View reports
```

### Permission Matrix

| Permission | SuperAdmin | Admin | Seller | DeliveryMan | Customer | Vendor |
|-----------|:----------:|:-----:|:------:|:-----------:|:--------:|:------:|
| USER_CREATE | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| USER_READ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| ROLE_CREATE | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| ORDER_CREATE | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| ORDER_READ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| DELIVERY_CREATE | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| DELIVERY_ASSIGN | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| DELIVERY_UPDATE | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| PRODUCT_CREATE | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| REPORT_READ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Default Roles

### SUPERADMIN
```json
{
  "name": "SUPERADMIN",
  "description": "Full system access - manage all roles and permissions",
  "permissions": [
    1001, 1002, 1003, 1004,  // USER permissions
    2001, 2002, 2003, 2004,  // ROLE permissions
    3001, 3002, 3003, 3004,  // PERMISSION permissions
    11001                      // ADMIN_PANEL_ACCESS
  ]
}
```

### SELLER
```json
{
  "name": "SELLER",
  "description": "Company staff - can create/manage orders and handle deliveries",
  "permissions": [
    4001, 4002, 4003,        // ORDER: CREATE, READ, UPDATE
    6001, 6002, 6003, 6005,  // DELIVERY: CREATE, READ, UPDATE, ASSIGN
    5002, 5001,              // PRODUCT: READ, CREATE
    8002,                    // PAYMENT: READ
    9002                     // REPORT: READ
  ]
}
```

### DELIVERY_MAN
```json
{
  "name": "DELIVERY_MAN",
  "description": "In-house delivery staff",
  "permissions": [
    4002,                    // ORDER: READ
    6002, 6003,              // DELIVERY: READ, UPDATE
    9002                     // REPORT: READ
  ]
}
```

---

## API Endpoints

### RBAC Management (Auth Service)

#### Initialize RBAC
```
POST /rbac/init
Authorization: Bearer {token}

Response:
{
  "message": "RBAC system initialized successfully"
}
```

#### Create Role
```
POST /rbac/roles
Authorization: Bearer {superadmin_token}
Content-Type: application/json

Request:
{
  "name": "SELLER",
  "description": "Company employees managing orders",
  "permissionIds": ["perm-id-1", "perm-id-2", ...]
}

Response:
{
  "message": "Role created successfully",
  "role": {
    "id": "role-123",
    "name": "SELLER",
    "roleNumber": 5,        // Sequential tracking number
    "description": "...",
    "permissions": [...],
    "createdBy": "admin-id",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get All Roles
```
GET /rbac/roles?page=1&limit=20
Authorization: Bearer {token}

Response:
{
  "roles": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "pages": 1
  }
}
```

#### Get All Permissions
```
GET /rbac/permissions?page=1&limit=50
Authorization: Bearer {token}

Response:
{
  "permissions": [
    {
      "id": "perm-123",
      "permissionCode": 1001,    // USER.CREATE
      "action": "CREATE",
      "resource": "USER",
      "description": "Create user",
      "active": true
    },
    ...
  ]
}
```

#### Get Permission Codes Reference
```
GET /rbac/permission-codes
Authorization: Optional

Response:
{
  "message": "Permission codes reference",
  "permissionCodes": {
    "USER_CREATE": 1001,
    "USER_READ": 1002,
    "ORDER_CREATE": 4001,
    "DELIVERY_ASSIGN": 6005,
    ...
  }
}
```

#### Assign Role to User
```
POST /rbac/users/{userId}/roles
Authorization: Bearer {superadmin_token}
Content-Type: application/json

Request:
{
  "roleId": "role-123"
}

Response:
{
  "message": "Role assigned to user successfully",
  "auditNumber": 42  // Sequential assignment tracker
}
```

#### Get User's Roles and Permissions
```
GET /rbac/users/{userId}/roles
Authorization: Bearer {token}

Response:
{
  "roles": [
    {
      "id": "role-123",
      "name": "SELLER",
      "permissions": [...]
    }
  ],
  "roleNames": ["SELLER"],
  "permissionCodes": [4001, 4002, 4003, 6001, 6002, 6003, 6005, 5001, 5002, 9002]
}
```

#### Check User Permission
```
GET /rbac/users/{userId}/permissions/{permissionCode}/check
Authorization: Bearer {token}

Response:
{
  "userId": "user-123",
  "permissionCode": 4001,
  "hasPermission": true
}
```

#### Get Audit Logs
```
GET /rbac/audit-logs?userId={id}&roleId={id}&action=ROLE_CREATED&page=1&limit=50
Authorization: Bearer {token}

Response:
{
  "logs": [
    {
      "id": "log-123",
      "auditNumber": 1001,     // Sequential audit tracker
      "userId": "admin-id",
      "action": "ROLE_CREATED",
      "roleId": "role-123",
      "targetUserId": null,
      "details": {...},
      "ipAddress": "192.168.1.1",
      "userAgent": "...",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### Seller Management (User Service)

#### Create Seller Profile
```
POST /sellers
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "shopName": "Ahmed Electronics",
  "shopSlug": "ahmed-electronics",
  "shopDescription": "Electronics and gadgets",
  "phone": "+8801234567890",
  "email": "shop@example.com",
  "address": "123 Main Street",
  "city": "Dhaka",
  "postalCode": "1000"
}

Response:
{
  "message": "Seller profile created successfully",
  "seller": {
    "id": "seller-123",
    "userId": "user-id",
    "shopName": "Ahmed Electronics",
    "shopSlug": "ahmed-electronics",
    "status": "ONBOARDING",
    "isVerified": false,
    "rating": 5.0,
    "ratingCount": 0,
    "totalOrders": 0,
    "totalRevenue": 0,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Seller Profile
```
GET /sellers/{userId}
Authorization: Optional

Response:
{
  "id": "seller-123",
  "shopName": "Ahmed Electronics",
  "status": "ACTIVE",
  "isVerified": true,
  "rating": 4.8,
  "totalOrders": 156,
  "totalRevenue": 450000,
  ...
}
```

#### Get Seller by Shop Slug
```
GET /sellers/shop/{shopSlug}
Authorization: Optional

Response: { seller profile object }
```

#### Update Seller Profile
```
PUT /sellers/{userId}
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "shopDescription": "Updated description",
  "phone": "+8801987654321"
}
```

#### Verify Seller (Admin)
```
PUT /sellers/{userId}/verify
Authorization: Bearer {admin_token}
Content-Type: application/json

Request:
{
  "verified": true
}

Response:
{
  "message": "Seller verified successfully",
  "seller": {
    "isVerified": true,
    "status": "ACTIVE"
  }
}
```

#### Get All Sellers
```
GET /sellers?page=1&limit=20&status=ACTIVE&verified=true
Authorization: Bearer {admin_token}

Response:
{
  "sellers": [...],
  "pagination": {...}
}
```

### Delivery Management (Order Service)

#### Create Delivery for Order
```
POST /orders/{orderId}/delivery
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "provider": "INHOUSE",  // or STEADFAST, PATHAO, REDX, etc.
  "weight": 2.5,
  "fragile": false,
  "estimatedDeliveryDate": "2024-01-05T00:00:00Z"
}

Response:
{
  "message": "Delivery created successfully",
  "delivery": {
    "id": "delivery-123",
    "orderId": "order-456",
    "provider": "INHOUSE",
    "status": "PENDING",
    "weight": 2.5,
    "fragile": false,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Assign Delivery Man (Inhouse)
```
POST /orders/{orderId}/assign-delivery-man
Authorization: Bearer {seller_or_admin_token}
Content-Type: application/json

Request:
{
  "deliveryManId": "deliveryman-789"
}

Response:
{
  "message": "Delivery man assigned successfully",
  "delivery": {
    "id": "delivery-123",
    "status": "ASSIGNED",
    "deliveryManId": "deliveryman-789"
  }
}
```

#### Assign to Third-Party Provider
```
POST /orders/{orderId}/assign-provider
Authorization: Bearer {seller_or_admin_token}
Content-Type: application/json

Request:
{
  "provider": "STEADFAST",
  "trackingId": "SF-12345678",
  "apiRef": "api-ref-123"
}

Response:
{
  "message": "Provider assigned successfully",
  "delivery": {
    "provider": "STEADFAST",
    "externalTrackingId": "SF-12345678",
    "status": "ASSIGNED"
  }
}
```

#### Update Delivery Status
```
PUT /deliveries/{deliveryId}/status
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "status": "OUT_FOR_DELIVERY",
  "notes": "Out for delivery, will arrive by 5 PM"
}

Response:
{
  "message": "Delivery status updated successfully",
  "delivery": {
    "status": "OUT_FOR_DELIVERY",
    "outForDeliveryAt": "2024-01-02T09:30:00Z",
    "notes": "..."
  }
}
```

### Delivery Status Flow

```
PENDING
  ↓
ASSIGNED (either to delivery man or provider)
  ↓
PICKED_UP
  ↓
IN_TRANSIT
  ↓
OUT_FOR_DELIVERY
  ↓
DELIVERED or FAILED or CANCELLED
```

#### Delivery Man Views Assigned Deliveries
```
GET /deliveries/delivery-man/{deliveryManId}?status=ASSIGNED&page=1&limit=20
Authorization: Bearer {deliveryman_token}

Response:
{
  "deliveries": [
    {
      "id": "delivery-123",
      "order": {
        "orderNumber": "ORD-001",
        "total": 5000,
        "shippingAddress": {...}
      },
      "status": "ASSIGNED",
      "estimatedDeliveryDate": "2024-01-03T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

#### Get Delivery Statistics
```
GET /deliveries/stats
Authorization: Bearer {admin_token}

Response:
{
  "message": "Delivery statistics",
  "stats": {
    "total": 1250,
    "byStatus": {
      "PENDING": 50,
      "ASSIGNED": 200,
      "DELIVERED": 1000,
      "FAILED": 10,
      "CANCELLED": 5
    },
    "byProvider": {
      "INHOUSE": 400,
      "STEADFAST": 300,
      "PATHAO": 250,
      "REDX": 200,
      "OTHER": 100
    }
  }
}
```

---

## Delivery System

### In-House Delivery Flow

1. **Seller creates order** and chooses in-house delivery
2. **System creates delivery** with `provider: INHOUSE`
3. **Seller/Admin assigns delivery man** → delivery status becomes `ASSIGNED`
4. **Delivery man receives notification** and can see order details
5. **Delivery man updates status**:
   - `PICKED_UP` → picked up from warehouse
   - `IN_TRANSIT` → on the way
   - `OUT_FOR_DELIVERY` → at customer's area
   - `DELIVERED` → successfully delivered
   - OR `FAILED` → failed delivery attempt

### Third-Party Provider Flow

1. **Seller/Admin chooses provider** (Steadfast, Pathao, RedX, etc.)
2. **System integrates with provider API** and creates tracking
3. **Delivery gets `externalTrackingId`** for customer tracking
4. **System polls provider API** to update delivery status
5. **Customer can track** via external provider's system

### Supported Third-Party Providers

| Provider | Integration | Status |
|----------|-------------|--------|
| Steadfast | API | Ready |
| Pathao | API | Ready |
| RedX | API | Ready |
| Sundarban | API | Ready |
| Custom | Custom API | Ready |

---

## Seller Management

### Seller Workflow

1. **User signs up** → given CUSTOMER role by default
2. **User applies to become seller** → creates SellerProfile with status `ONBOARDING`
3. **Admin verifies seller** → changes status to `ACTIVE` and sets `isVerified: true`
4. **Seller can now**:
   - Create orders for customers
   - Manage own orders
   - Assign deliveries
   - View analytics

### Seller Profile Fields

```typescript
{
  id: string;
  userId: string;              // Reference to auth user
  shopName: string;            // e.g., "Ahmed Electronics"
  shopSlug: string;            // Unique URL slug
  shopDescription?: string;
  shopLogo?: string;           // Shop logo URL
  shopBanner?: string;         // Shop banner URL
  phone?: string;
  email?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ONBOARDING';
  isVerified: boolean;
  
  // Performance metrics
  rating?: number;             // Average rating (1-5)
  ratingCount: number;
  totalOrders: number;
  totalRevenue: number;        // Decimal for precise calculations
  completionRate?: number;     // Orders delivered on time %
  returnRate?: number;         // Return rate %
  
  // Operating information
  operatingHours?: Json;       // e.g., { "monday": { "open": "09:00", "close": "21:00" } }
  bankDetails?: Json;          // Encrypted bank account details
  
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

---

## Delivery Man Management

### Delivery Man Workflow

1. **User signs up** → given CUSTOMER role
2. **User applies as delivery staff** → system creates `DeliveryMan` profile
3. **Admin approves** → user's role changes to `DELIVERY_MAN`
4. **Delivery man can**:
   - View assigned deliveries
   - Update delivery status
   - Track performance metrics
   - Earn ratings from customers

### Delivery Man Profile Fields

```typescript
{
  id: string;
  userId: string;              // Reference to auth user
  licenseNumber?: string;      // Driver's license
  vehicleType?: string;        // Bike, Car, Van, etc.
  vehicleId?: string;          // Vehicle registration
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  isAvailable: boolean;
  phone?: string;
  address?: string;
  city?: string;
  
  // Performance metrics
  currentOrders: number;
  totalDeliveries: number;
  rating?: number;             // Average rating (1-5)
  ratingCount: number;
  
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

---

## Implementation Examples

### For Frontend: Using Permission Codes

```typescript
// Check if user can create orders
const userPermissions = await getUserPermissions(userId);
const canCreateOrder = userPermissions.includes(4001); // ORDER_CREATE

if (canCreateOrder) {
  // Show "Create Order" button
} else {
  // Hide button, show "Permission Denied" message
}
```

### For Backend: Middleware Usage

```typescript
// Protect route with permission
router.post('/orders',
  authenticate,
  requirePermission(4001),  // ORDER_CREATE
  createOrder
);

// Or with role-based check
router.post('/orders',
  authenticate,
  requireRole('SELLER', 'ADMIN', 'CUSTOMER'),
  createOrder
);

// Check seller ownership
router.put('/orders/:orderId',
  authenticate,
  requireSellerOwnership('orderId'),
  updateOrder
);
```

### Creating an Order as Seller

```bash
# 1. Seller logs in and gets token
curl -X POST http://localhost:3001/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@shop.com",
    "password": "password"
  }'

# Response:
# {
#   "tokens": {
#     "accessToken": "jwt-token..."
#   }
# }

# 2. Create order for customer
curl -X POST http://localhost:3004/orders \
  -H "Authorization: Bearer jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "sellerId": "seller-user-id",
    "userId": "customer-user-id",
    "items": [...],
    "shippingAddress": {...},
    "paymentMethod": "COD"
  }'

# 3. Assign to delivery man
curl -X POST http://localhost:3004/orders/{orderId}/assign-delivery-man \
  -H "Authorization: Bearer jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "deliveryManId": "dm-123"
  }'
```

---

## Database Schemas

### Auth Service - RBAC Tables

#### roles
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  roleNumber INT UNIQUE AUTO_INCREMENT,
  createdBy UUID NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### permissions
```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY,
  permissionCode INT UNIQUE NOT NULL,
  action VARCHAR(50) NOT NULL,
  resource VARCHAR(50) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  UNIQUE(action, resource)
);
```

#### role_permissions
```sql
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY,
  roleId UUID NOT NULL REFERENCES roles(id),
  permissionId UUID NOT NULL REFERENCES permissions(id),
  assignmentNumber INT UNIQUE AUTO_INCREMENT,
  grantedBy UUID NOT NULL,
  grantedAt TIMESTAMP DEFAULT NOW(),
  revokedAt TIMESTAMP,
  revokedBy UUID,
  UNIQUE(roleId, permissionId)
);
```

#### user_roles
```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  userId UUID NOT NULL REFERENCES users(id),
  roleId UUID NOT NULL REFERENCES roles(id),
  assignmentNumber INT UNIQUE AUTO_INCREMENT,
  assignedBy UUID NOT NULL,
  assignedAt TIMESTAMP DEFAULT NOW(),
  revokedAt TIMESTAMP,
  revokedBy UUID,
  UNIQUE(userId, roleId)
);
```

#### permission_audit_logs
```sql
CREATE TABLE permission_audit_logs (
  id UUID PRIMARY KEY,
  auditNumber INT UNIQUE AUTO_INCREMENT,
  userId UUID NOT NULL REFERENCES users(id),
  roleId UUID REFERENCES roles(id),
  permissionId UUID REFERENCES permissions(id),
  action VARCHAR(100) NOT NULL,
  targetUserId UUID,
  details JSONB,
  ipAddress VARCHAR(45),
  userAgent TEXT,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

#### delivery_men
```sql
CREATE TABLE delivery_men (
  id UUID PRIMARY KEY,
  userId UUID UNIQUE NOT NULL REFERENCES users(id),
  licenseNumber VARCHAR(255) UNIQUE,
  vehicleType VARCHAR(100),
  vehicleId VARCHAR(255),
  status VARCHAR(50) DEFAULT 'ACTIVE',
  isAvailable BOOLEAN DEFAULT true,
  currentOrders INT DEFAULT 0,
  totalDeliveries INT DEFAULT 0,
  rating FLOAT,
  ratingCount INT DEFAULT 0,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### User Service - Seller Table

#### seller_profiles
```sql
CREATE TABLE seller_profiles (
  id UUID PRIMARY KEY,
  userId UUID UNIQUE NOT NULL REFERENCES users(id),
  shopName VARCHAR(255) NOT NULL,
  shopSlug VARCHAR(255) UNIQUE NOT NULL,
  shopDescription TEXT,
  shopLogo VARCHAR(500),
  shopBanner VARCHAR(500),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  postalCode VARCHAR(20),
  businessLicense VARCHAR(255),
  nidNumber VARCHAR(50),
  tin VARCHAR(50),
  status VARCHAR(50) DEFAULT 'ONBOARDING',
  isVerified BOOLEAN DEFAULT false,
  documentVerified BOOLEAN DEFAULT false,
  rating FLOAT,
  ratingCount INT DEFAULT 0,
  totalOrders INT DEFAULT 0,
  totalRevenue DECIMAL(15,2) DEFAULT 0,
  completionRate FLOAT,
  returnRate FLOAT,
  operatingHours JSONB,
  bankDetails JSONB,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Order Service - Delivery Table

#### delivery_infos
```sql
CREATE TABLE delivery_infos (
  id UUID PRIMARY KEY,
  orderId UUID UNIQUE NOT NULL REFERENCES orders(id),
  provider VARCHAR(50) NOT NULL,
  deliveryManId UUID,
  externalTrackingId VARCHAR(255),
  externalProvider VARCHAR(100),
  externalApiRef VARCHAR(255),
  shippingAddress JSONB,
  status VARCHAR(50) DEFAULT 'PENDING',
  trackingNumber VARCHAR(255),
  carrier VARCHAR(100),
  estimatedDeliveryDate TIMESTAMP,
  actualDeliveryDate TIMESTAMP,
  weight FLOAT,
  dimensions JSONB,
  fragile BOOLEAN DEFAULT false,
  deliveryCharge DECIMAL(10,2),
  discountApplied DECIMAL(10,2),
  pickedUpAt TIMESTAMP,
  inTransitAt TIMESTAMP,
  outForDeliveryAt TIMESTAMP,
  failedAttempts INT DEFAULT 0,
  lastFailureReason TEXT,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

---

## Migration Steps

1. **Run database migrations**:
   ```bash
   # Auth service
   cd services/auth-service
   npx prisma migrate dev --name add_rbac_system

   # User service
   cd services/user-service
   npx prisma migrate dev --name add_seller_profiles

   # Order service
   cd services/order-service
   npx prisma migrate dev --name add_delivery_system
   ```

2. **Initialize RBAC**:
   ```bash
   curl -X POST http://localhost:3001/rbac/init \
     -H "Authorization: Bearer superadmin-token"
   ```

3. **Create test users with roles**:
   ```bash
   # Assign SELLER role
   curl -X POST http://localhost:3001/rbac/users/{userId}/roles \
     -H "Authorization: Bearer superadmin-token" \
     -d '{ "roleId": "seller-role-id" }'

   # Assign DELIVERY_MAN role
   curl -X POST http://localhost:3001/rbac/users/{userId}/roles \
     -H "Authorization: Bearer superadmin-token" \
     -d '{ "roleId": "delivery-man-role-id" }'
   ```

---

## Security Considerations

1. **Permission Checking**: Always verify permissions server-side, not just frontend
2. **Audit Logging**: All permission changes are logged with user ID and timestamp
3. **Role Revocation**: When roles are revoked, all associated permissions are removed immediately
4. **Delivery Man Access**: Delivery men can only see their assigned deliveries
5. **Seller Verification**: Sellers must be verified by admin before going ACTIVE
6. **Bank Details**: Seller bank details are stored in encrypted JSON field

---

## Troubleshooting

### Permission Denied Errors
- Check user's assigned roles: `GET /rbac/users/{userId}/roles`
- Verify permission code in request
- Check audit logs for role assignment history

### Delivery Not Found
- Ensure delivery was created before assigning
- Verify order exists first

### Third-Party Integration Issues
- Check external tracking ID format
- Verify provider API credentials
- Monitor delivery status updates from provider

---

Created: January 2024
Last Updated: January 2024
