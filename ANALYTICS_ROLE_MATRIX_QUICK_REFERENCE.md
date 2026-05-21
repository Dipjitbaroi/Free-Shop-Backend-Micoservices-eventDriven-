# Analytics Role Matrix - Quick Reference

## � Role Definitions

**SUPERADMIN** = System owner, full access including financial secrets
**ADMIN** = Platform administrator, broad access but not financial details
**SELLER** = FreeSHop order-processing employee (NO analytics access)
**VENDOR** = Individual/business supplier providing products
**DELIVERY_MAN** = Delivery staff member
**CUSTOMER** = ❌ NO ANALYTICS ACCESS - Only order history in account section

---

## �📊 Role Access Matrix

| Analytics Section | SUPERADMIN | ADMIN | VENDOR | SELLER | DELIVERY_MAN | CUSTOMER |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Dashboard** | ✅ Full | ✅ Limited | ✅ Own | ❌ No | ✅ Own | ❌ No Access |
| **Sales Report** | ✅ All | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No Access |
| **Vendor Analytics** | ✅ All+Commission | ✅ All (no commission) | ✅ Own only | ❌ No | ❌ No | ❌ No Access |
| **Product Analytics** | ✅ All | ✅ All | ✅ Own products | ❌ No | ❌ No | ❌ No Access |
| **Top Products** | ✅ All | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No Access |
| **Top Vendors** | ✅ All | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No Access |
| **Financial/Commission** | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No Access |
| **Delivery Metrics** | ✅ All | ✅ All | ❌ No | ❌ No | ✅ Own | ❌ No |
| **System Metrics** | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |

---

## 🔍 Detailed Field Visibility

### Dashboard Metrics

| Field | SUPERADMIN | ADMIN | SELLER | VENDOR | DELIVERY_MAN | CUSTOMER |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| totalRevenue | ✅ Selling price | ✅ Selling price | ✅ Selling price | ✅ **Supplier price** | ❌ | ❌ |
| totalOrders | ✅ | ✅ | ✅ | ✅ | ✅ Own | ❌ |
| averageOrderValue | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| newCustomers | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| conversionRate | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| revenueGrowth | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| orderGrowth | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **commission** | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ | ❌ |
| **platformMargin** | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ | ❌ |

---

### Vendor Report Fields

| Section | SUPERADMIN | ADMIN | VENDOR (Own) | VENDOR (Others) | SELLER |
|---|:---:|:---:|:---:|:---:|:---:|
| vendorId | ✅ | ✅ | ✅ | ❌ | ✅ |
| date | ✅ | ✅ | ✅ | ❌ | ✅ |
| totalRevenue | ✅ | ✅ | ✅ (supplier price) | ❌ | ✅ |
| totalOrders | ✅ | ✅ | ✅ | ❌ | ✅ |
| totalItems | ✅ | ✅ | ✅ | ❌ | ✅ |
| productViews | ✅ | ✅ | ✅ | ❌ | ✅ |
| productClickRate | ✅ | ✅ | ✅ | ❌ | ✅ |
| conversionRate | ✅ | ✅ | ✅ | ❌ | ✅ |
| averageRating | ✅ | ✅ | ✅ | ❌ | ✅ |
| newReviews | ✅ | ✅ | ✅ | ❌ | ✅ |
| **commission** | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |
| **netRevenue** | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |

---

### Product Analytics Fields

| Field | SUPERADMIN | ADMIN | VENDOR (Own) | VENDOR (Others) |
|---|:---:|:---:|:---:|:---:|
| productId | ✅ | ✅ | ✅ | ❌ |
| vendorId | ✅ | ✅ | ✅ | ❌ |
| date | ✅ | ✅ | ✅ | ❌ |
| views | ✅ | ✅ | ✅ | ❌ |
| clicks | ✅ | ✅ | ✅ | ❌ |
| clickRate | ✅ | ✅ | ✅ | ❌ |
| unitsSold | ✅ | ✅ | ✅ | ❌ |
| revenue | ✅ All | ✅ Supplier price | ✅ Supplier price | ❌ |
| averageRating | ✅ | ✅ | ✅ | ❌ |
| newReviews | ✅ | ✅ | ✅ | ❌ |
| **retailPrice** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **platformMargin** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **discountPrice** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |

---

## 💰 Revenue Calculation Examples

### Product: Organic Rice (1kg)

**Pricing Setup:**
- Supplier Price (Vendor Cost): **100 BDT**
- Selling Price (Admin Set): **150 BDT**
- Customer Discount: 10% off
- Final Customer Price: **135 BDT**

**In One Month - 500 Units Sold**

#### What VENDOR Sees:
```
Total Revenue: 500 × 100 = 50,000 BDT
Units Sold: 500
Average Units/Day: ~16
Top Engagement: Week 2
Revenue Growth: +15%
```
*They think they earned 50,000 BDT*

#### What ADMIN Sees:
```
Total Revenue (for this vendor product): 500 × 100 = 50,000 BDT
Total Orders: 500
Views: 2,500
Conversion Rate: 20%
Product Rating: 4.5/5

BUT ADMIN CANNOT SEE:
- Commission details
- Platform margin (50 BDT × 500 = 25,000 BDT)
- Actual customer payment (135 BDT × 500 = 67,500 BDT)
```

#### What SUPERADMIN Sees:
```
VENDOR PERSPECTIVE:
  Revenue: 50,000 BDT (supplier price basis)

PLATFORM PERSPECTIVE:
  Customer Payment: 67,500 BDT (actual charged)
  Vendor Payment: 50,000 BDT (supplier price)
  Platform Revenue: 67,500 - 50,000 = 17,500 BDT
  Commission Paid: See commission rules (varies)

MARGIN BREAKDOWN:
  Per Unit: 150 (customer paid) - 100 (supplier cost) = 50 BDT
  Total: 50 × 500 = 25,000 BDT potential margin
```

#### What CUSTOMER Sees:
```
Order History:
  - Order 1: 135 BDT (Delivered)
  - Order 2: 135 BDT (Pending)
  - Order 3: 135 BDT (Cancelled - Refunded)
  
Total Spent: 270 BDT (from completed orders)

They NEVER see:
  - Supplier price (100 BDT)
  - Wholesale price
  - Any vendor cost information
```

---

## 📋 Permission Codes

| Code | Permission | Who Has It | Usage |
|---|---|---|---|
| 90001 | ANALYTICS_CREATE | Services, VENDOR, SELLER | Track analytics events |
| 90002 | ANALYTICS_READ | All authenticated users | Read own/allowed analytics |
| 90003 | ANALYTICS_DELETE | ADMIN, SUPERADMIN | Delete old analytics |
| 90004 | ANALYTICS_ADMIN | SUPERADMIN only | Admin-level analytics access |
| 90010 | ANALYTICS_VIEW_DASHBOARD | ADMIN, SUPERADMIN | View dashboard |
| 90011 | ANALYTICS_VIEW_VENDORS | ADMIN, SUPERADMIN | View vendor analytics |
| 90012 | ANALYTICS_VIEW_PRODUCTS | ADMIN, SUPERADMIN | View product analytics |
| 90013 | ANALYTICS_VIEW_CUSTOMERS | ADMIN, SUPERADMIN | View customer analytics |
| 90014 | ANALYTICS_VIEW_FINANCIAL | SUPERADMIN only | View commission/margin details |
| 90015 | ANALYTICS_VIEW_SYSTEM | SUPERADMIN only | View system metrics |

---

## 🔐 Authorization Checks

### Endpoint: GET /analytics/dashboard
```
authenticate (required)
  ↓
authorizeAnalyticsRead (required: ANALYTICS_READ permission)
  ↓
attachUserRole (attach user's primary role)
  ↓
Service: getDashboardMetrics(dateRange, context)
  - Returns different data based on context.userRole
  - VENDOR: Own products only
  - ADMIN: Platform data (limited)
  - SUPERADMIN: Full data with commissions
  - etc.
```

### Endpoint: GET /analytics/vendors/:vendorId/report
```
authenticate (required)
  ↓
authorizeAnalyticsRead (required: ANALYTICS_READ permission)
  ↓
enforceVendorAnalyticsOwnership
  - ADMIN/SUPERADMIN: allowed
  - VENDOR: only if vendorId matches their own
  ↓
Service: getVendorReport(vendorId, dateRange, context)
  - Filter fields based on role
  - Hide commission/margin fields from non-SUPERADMIN
```

### Endpoint: GET /analytics/vendors/me/report
```
authenticate (required)
  ↓
authorizeAnalyticsRead (required: ANALYTICS_READ permission)
  ↓
Controller: Attach vendor ID from authenticated user
  ↓
Service: getVendorReport(userVendorId, dateRange, context)
  - Always returns their own data
  - Revenue based on supplier price
  - Commission/margin fields filtered
```

---

## ⚠️ Security Rules

### 1. Vendor Data Isolation
```
VENDOR user_123 can view:
  ✅ their own vendorId data only
  ❌ other vendors' data
  ❌ their SELLER account's data (if they have one)
```

### 2. Pricing Information Protection
```
VENDOR users CANNOT see:
  ❌ product.price (retail selling price)
  ❌ product.discountPrice
  ❌ product.flashSalePrice
  ❌ order.totalPrice (what customer paid)
  ❌ platformMargin calculations
  
VENDOR users CAN see:
  ✅ product.supplierPrice (their cost)
  ✅ units sold
  ✅ their revenue (cost × quantity)
  ✅ customer ratings and reviews
  ✅ product performance metrics
```

### 3. Commission Confidentiality
```
SUPERADMIN ONLY can see:
  ✅ Commission amounts paid to vendors
  ✅ Platform margins
  ✅ Net revenue calculations
  ✅ Payment processing fees
  
ADMIN CANNOT see:
  ❌ Commission details
  ❌ Margin calculations
  ❌ Platform profitability
```

### 4. Customer Privacy
```
All users (except customer themselves) CANNOT see:
  ❌ Customer payment method details
  ❌ Customer address in analytics
  ❌ Customer behavioral data
  
CUSTOMER can see:
  ✅ Their own orders
  ✅ Order amounts paid
  ✅ Delivery status
  ✅ Their own spending summary
```

### 5. Access Logging
```
All analytics queries should be logged with:
  - User ID
  - User Role
  - Endpoint accessed
  - Data requested (what vendorId, productId, etc.)
  - Timestamp
  - Result (success/failure)
  
Alert on:
  - VENDOR trying to access other vendor's data
  - ADMIN trying to access commission details
  - Unusual access patterns
  - Repeated 403 Forbidden responses
```

---

## 🚀 API Response Examples

### VENDOR Dashboard Response
```json
{
  "success": true,
  "data": {
    "totalRevenue": 50000,
    "totalOrders": 500,
    "productViews": 2500,
    "averageConversionRate": 0.20,
    "averageRating": 4.5,
    "note": "Revenue is calculated based on your supplier price"
  }
}
```

### ADMIN Dashboard Response
```json
{
  "success": true,
  "data": {
    "totalRevenue": 5000000,
    "totalOrders": 50000,
    "averageOrderValue": 100,
    "newCustomers": 1500,
    "conversionRate": 0.15,
    "revenueGrowth": 12.5,
    "orderGrowth": 8.2
  }
}
```

### SUPERADMIN Dashboard Response
```json
{
  "success": true,
  "data": {
    "totalRevenue": 5000000,
    "totalOrders": 50000,
    "averageOrderValue": 100,
    "newCustomers": 1500,
    "conversionRate": 0.15,
    "revenueGrowth": 12.5,
    "orderGrowth": 8.2,
    "totalVendorCosts": 3500000,
    "platformMargin": 1500000,
    "commissionsPaid": 1200000,
    "netProfit": 300000
  }
}
```

### VENDOR Tries to Access Other Vendor's Data
```json
{
  "success": false,
  "error": "Cannot access other vendors' analytics",
  "code": "FORBIDDEN_VENDOR_ACCESS"
}
```

---

## 📝 Implementation Order

1. **Phase 1: Permissions**
   - Add permission codes to auth-service
   - Assign to role defaults

2. **Phase 2: Middleware**
   - Create analytics authorization middleware
   - Add role attachment middleware
   - Add vendor ownership enforcement

3. **Phase 3: Service Layer**
   - Add role-based filtering in analytics service
   - Implement field filtering logic
   - Add access validation

4. **Phase 4: Controllers & Routes**
   - Update controller endpoints
   - Add new endpoints as needed
   - Apply middleware to routes

5. **Phase 5: Testing**
   - Test each role separately
   - Test unauthorized access denial
   - Test data filtering

6. **Phase 6: Documentation & Deployment**
   - Update API docs
   - Train team
   - Deploy to production

---

## ✅ Verification Checklist

- [ ] VENDOR cannot see other vendors' data
- [ ] VENDOR revenue is based on supplier price
- [ ] VENDOR cannot see retail price fields
- [ ] ADMIN cannot see commission details
- [ ] ADMIN cannot see margin calculations
- [ ] SUPERADMIN can see all sensitive data
- [ ] CUSTOMER sees only own order history
- [ ] DELIVERY_MAN sees only delivery metrics
- [ ] All access is properly logged
- [ ] Audit logs track unauthorized attempts
- [ ] API documentation updated
- [ ] Permission codes defined in auth-service
- [ ] Middleware properly deployed
- [ ] Database indexes created for performance
- [ ] Rate limiting applied to analytics endpoints
