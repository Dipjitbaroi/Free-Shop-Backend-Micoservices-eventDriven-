# RBAC & Delivery System - Quick Reference Guide

## 📋 Permission Codes at a Glance

### Quick Lookup Table
| Action | Code | Example |
|--------|------|---------|
| CREATE | +01 | USER_CREATE = 1001 |
| READ | +02 | ORDER_READ = 4002 |
| UPDATE | +03 | DELIVERY_UPDATE = 6003 |
| DELETE | +04 | PRODUCT_DELETE = 5004 |
| APPROVE | +05 | ORDER_APPROVE = 4005 |
| REJECT | +06 | PAYMENT_REJECT = 8006 |

### Resource Code Families

```
10xx = USER operations
20xx = ROLE management
30xx = PERMISSION management
40xx = ORDER operations
50xx = PRODUCT operations  
60xx = DELIVERY operations
70xx = SELLER operations
80xx = PAYMENT operations
90xx = REPORT/Analytics
100x = SETTINGS
110x = ADMIN_PANEL access
```

---

## 👤 Default Roles Quick Reference

### SUPERADMIN
```
✅ Can create roles
✅ Can manage all permissions
✅ Can assign/revoke any role
✅ Full access to everything
Typical User: System Admin, Owner
```

### ADMIN
```
✅ Manage orders (all)
✅ Manage deliveries
✅ View users
✅ Approve sellers
✅ View reports
❌ Cannot create/modify roles or permissions
Typical User: Admin staff
```

### SELLER
```
✅ Create orders
✅ Update own orders
✅ Assign deliveries (in-house & 3rd party)
✅ View order analytics
❌ Cannot manage users or permissions
Typical User: Shop owner, sales staff
```

### DELIVERY_MAN
```
✅ View assigned deliveries
✅ Update delivery status
✅ View own performance metrics
❌ Cannot create orders or assignments
Typical User: Delivery staff
```

### CUSTOMER
```
✅ Create orders
✅ View own orders
✅ Make payments
✅ View products
❌ Cannot manage orders or deliveries
Typical User: Buyer
```

### VENDOR
```
✅ Manage products
✅ View order analytics
❌ Cannot manage users or deliveries
Typical User: Supplier
```

---

## 🚀 Common API Calls

### Initialize System (SuperAdmin Only)
```bash
curl -X POST http://localhost:3001/rbac/init \
  -H "Authorization: Bearer {superadmin_token}"
```

### Create Seller Account
```bash
# 1. User signs up (they're assigned CUSTOMER role)
# 2. Create seller profile
curl -X POST http://localhost:3008/sellers \
  -H "Authorization: Bearer {user_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "shopName": "MyShop",
    "shopSlug": "myshop",
    "phone": "+8801234567890"
  }'

# 3. Admin verifies (changes status to ACTIVE)
curl -X PUT http://localhost:3008/sellers/{userId}/verify \
  -H "Authorization: Bearer {admin_token}" \
  -d '{ "verified": true }'

# 4. Admin assigns SELLER role
curl -X POST http://localhost:3001/rbac/users/{userId}/roles \
  -H "Authorization: Bearer {admin_token}" \
  -d '{ "roleId": "{seller_role_id}" }'
```

### Create Delivery Man Account
```bash
# 1. User signs up
# 2. Create delivery profile through DeliveryMan table
# 3. Admin assigns DELIVERY_MAN role
curl -X POST http://localhost:3001/rbac/users/{userId}/roles \
  -H "Authorization: Bearer {admin_token}" \
  -d '{ "roleId": "{delivery_man_role_id}" }'
```

### Seller Creates Order
```bash
curl -X POST http://localhost:3004/orders \
  -H "Authorization: Bearer {seller_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "sellerId": "{logged_in_seller_id}",
    "userId": "{customer_user_id}",
    "items": [
      { "productId": "prod-1", "quantity": 2 }
    ],
    "shippingAddress": {
      "fullName": "Customer Name",
      "phone": "+8801234567890",
      "addressLine1": "123 Main Street",
      "city": "Dhaka"
    },
    "paymentMethod": "COD"
  }'
```

### Assign Delivery (Inhouse)
```bash
curl -X POST http://localhost:3004/orders/{orderId}/assign-delivery-man \
  -H "Authorization: Bearer {seller_token}" \
  -d '{
    "deliveryManId": "{delivery_man_id}"
  }'
```

### Assign Delivery (3rd Party)
```bash
curl -X POST http://localhost:3004/orders/{orderId}/assign-provider \
  -H "Authorization: Bearer {seller_token}" \
  -d '{
    "provider": "STEADFAST",
    "trackingId": "SF-123456"
  }'
```

### Delivery Man Updates Status
```bash
curl -X PUT http://localhost:3004/deliveries/{deliveryId}/status \
  -H "Authorization: Bearer {delivery_man_token}" \
  -d '{
    "status": "OUT_FOR_DELIVERY",
    "notes": "Arriving at location"
  }'
```

### Check User Permissions
```bash
# Get all roles and permissions
curl http://localhost:3001/rbac/users/{userId}/roles \
  -H "Authorization: Bearer {token}"

# Response will include:
# {
#   "roleNames": ["SELLER"],
#   "permissionCodes": [4001, 4002, 4003, 6001, 6002, 6003, 6005, ...],
#   "roles": [...]
# }
```

---

## 🔐 Using RBAC in Your Code

### Backend Protection

```typescript
// Protect a route with permission
router.post('/orders',
  authenticate,
  requirePermission(4001),  // ORDER_CREATE
  orderController.create
);

// Or protect with role
router.post('/orders',
  authenticate,
  requireRole('SELLER', 'CUSTOMER'),
  orderController.create
);

// Or seller ownership (orders created by seller)
router.put('/orders/:orderId',
  authenticate,
  requireSellerOwnership('orderId'),
  orderController.update
);

// Or delivery man assignment
router.put('/deliveries/:deliveryId',
  authenticate,
  requireDeliveryManAssignment('deliveryId'),
  deliveryController.update
);
```

### Frontend Permission Check

```typescript
// Fetch user permissions
const response = await fetch('/rbac/users/{userId}/roles');
const data = await response.json();

// Check specific permission
const canCreateOrder = data.permissionCodes.includes(4001);
const isSeller = data.roleNames.includes('SELLER');

// Show/hide UI
{canCreateOrder && <CreateOrderButton />}
{isSeller && <SellerDashboard />}
```

### Check from Any Service

```typescript
// Using RBACService
const hasPermission = await RBACService.userHasPermission(
  userId, 
  4001  // ORDER_CREATE
);

const hasRole = await RBACService.userHasRole(
  userId,
  'SELLER'
);

const roles = await RBACService.getUserRolesAndPermissions(userId);
console.log(roles.permissionCodes);  // [4001, 4002, ...]
```

---

## 📊 Delivery Status Tracking

### Status Flow
```
PENDING
  ↓ (assign delivery man or provider)
ASSIGNED
  ↓ (pick up from seller)
PICKED_UP
  ↓ (en route)
IN_TRANSIT
  ↓ (reached area)
OUT_FOR_DELIVERY
  ↓ (delivered or failed)
DELIVERED / FAILED
```

### Common Status Updates

```bash
# Picked up
curl -X PUT http://localhost:3004/deliveries/{id}/status \
  -d '{ "status": "PICKED_UP" }'

# Out for delivery
curl -X PUT http://localhost:3004/deliveries/{id}/status \
  -d '{ "status": "OUT_FOR_DELIVERY", "notes": "Arriving soon" }'

# Delivered
curl -X PUT http://localhost:3004/deliveries/{id}/status \
  -d '{ "status": "DELIVERED" }'

# Failed attempt
curl -X POST http://localhost:3004/deliveries/{id}/failed-attempt \
  -d '{ "reason": "Customer not available" }'
```

---

## 📈 Analytics & Reports

### Get Delivery Statistics
```bash
curl http://localhost:3004/deliveries/stats \
  -H "Authorization: Bearer {admin_token}"

# Response:
# {
#   "total": 1250,
#   "byStatus": {
#     "DELIVERED": 1000,
#     "PENDING": 100,
#     "ASSIGNED": 150,
#     "FAILED": 10,
#     "CANCELLED": 5
#   },
#   "byProvider": {
#     "INHOUSE": 400,
#     "STEADFAST": 300,
#     "PATHAO": 250,
#     "REDX": 200
#   }
# }
```

### Get Seller Performance
```bash
curl http://localhost:3008/sellers/{userId} \
  -H "Authorization: Bearer {admin_token}"

# Includes:
# - rating, ratingCount
# - totalOrders, totalRevenue
# - completionRate, returnRate
# - status, isVerified
```

### Get Delivery Man Performance
```bash
curl http://localhost:3001/rbac/users/{deliveryManId}/roles \
  -H "Authorization: Bearer {token}"

# Then check DeliveryMan profile:
# - currentOrders
# - totalDeliveries
# - rating, ratingCount
```

---

## 🔄 Real-World Workflow

### 1️⃣ Customer Calls Shop
```
Customer: "Hey, I want to order 2 phones"
Seller: Uses app to create order
Order.sellerId = seller's user ID
Order.userId = customer's user ID
Order.status = PENDING
```

### 2️⃣ Seller Chooses Delivery
```
Option A: In-House
  - Seller assigns delivery man
  - DeliveryMan gets notification
  - Delivery.provider = "INHOUSE"
  - Delivery.deliveryManId = assigned person

Option B: 3rd Party
  - Seller chooses "Steadfast"
  - System calls Steadfast API
  - System gets tracking ID
  - Delivery.provider = "STEADFAST"
  - Delivery.externalTrackingId = "SF-12345"
```

### 3️⃣ Delivery Updates Status
```
Delivery Man:
  1. Picks up order → PICKED_UP
  2. Leaves warehouse → IN_TRANSIT
  3. Reaches area → OUT_FOR_DELIVERY
  4. Delivers → DELIVERED
  
If problem:
  - Record failed attempt
  - Try again or return to seller
```

### 4️⃣ Customer Receives
```
Customer: Gets delivery
App: Shows "Delivered" status
Rating: Customer rates seller & delivery man
Metrics: Updated automatically
```

---

## ⚠️ Important Notes

### Security
- ✅ **Always verify permissions server-side** - Don't trust frontend
- ✅ **Log all permission changes** - Audit trail is automatic
- ✅ **Use HTTPS in production** - Tokens are sensitive

### Delivery Workflow
- ✅ **Create delivery before assigning** - Check delivery exists
- ✅ **Can only assign one provider per order** - Can't have dual delivery
- ✅ **Status updates are permanent** - No going backwards
- ✅ **Track failed attempts** - Retry logic in your app

### Seller Management
- ✅ **Verify seller before going ACTIVE** - Security check
- ✅ **Can suspend seller anytime** - For rule violations
- ✅ **Update metrics automatically** - From order/delivery events
- ✅ **Bank details are encrypted** - Stored as JSONB

---

## 🐛 Debugging Tips

### Check User Permissions
```bash
curl http://localhost:3001/rbac/users/{userId}/roles

# Look for:
# - roleNames: Should include SELLER, DELIVERY_MAN, etc.
# - permissionCodes: Should include relevant codes
```

### Check Audit Logs
```bash
curl "http://localhost:3001/rbac/audit-logs?userId={userId}&action=ROLE_ASSIGNED"

# Look for:
# - auditNumber: Sequential tracker
# - action: What happened
# - createdAt: When it happened
```

### Get Permission Reference
```bash
curl http://localhost:3001/rbac/permission-codes

# Returns all permission codes:
# {
#   "USER_CREATE": 1001,
#   "ORDER_CREATE": 4001,
#   ...
# }
```

---

## 📚 Full Documentation

See `RBAC_AND_DELIVERY_SYSTEM.md` for:
- Complete API endpoint documentation
- Database schema details
- Migration instructions
- Implementation examples
- Troubleshooting guide

---

**Version:** 1.0  
**Last Updated:** January 2024  
**Author:** System Design Team
