# Analytics Section - Role-Based Access Control (RBAC) Analysis - COMPLETE

## 📌 Executive Summary

I've completed a comprehensive analysis of the analytics section with role-based access control focusing on **vendor supplier pricing vs. retail pricing**. The vendor will see calculations based on their **supplier price (cost)**, NOT the retail selling price set by the admin.

---

## 📚 Documentation Created

### 1. **[ANALYTICS_RBAC_VISIBILITY_GUIDE.md](./ANALYTICS_RBAC_VISIBILITY_GUIDE.md)** - START HERE
   - **Purpose**: Complete overview of what each role can and cannot see
   - **Contains**:
     - Key pricing concepts explanation
     - Detailed role-by-role breakdown:
       - SUPERADMIN: Full access + commission details
       - ADMIN: Platform metrics (no commissions)
       - SELLER: All vendors' data (employee of FreeSHop)
       - VENDOR: Own data only, supplier price basis (individual supplier)
       - DELIVERY_MAN: Delivery metrics only
       - CUSTOMER: NO ANALYTICS ACCESS
     - Data models with field-level visibility
     - Critical security notes
     - Implementation checklist

### 2. **[ANALYTICS_RBAC_IMPLEMENTATION_GUIDE.md](./ANALYTICS_RBAC_IMPLEMENTATION_GUIDE.md)** - FOR DEVELOPERS
   - **Purpose**: Code implementation with TypeScript examples
   - **Contains**:
     - Permission codes definition (90001-90015)
     - Middleware for authorization
     - Analytics service with role-based filtering
     - Updated routes and controllers
     - Testing code examples
     - Deployment checklist

### 3. **[ANALYTICS_ROLE_MATRIX_QUICK_REFERENCE.md](./ANALYTICS_ROLE_MATRIX_QUICK_REFERENCE.md)** - QUICK LOOKUP
   - **Purpose**: Fast reference for role permissions
   - **Contains**:
     - Access matrix tables
     - Field visibility grids
     - Revenue calculation examples with real numbers
     - Permission codes reference
     - Authorization flow diagrams
     - API response examples
     - Implementation order

### 4. **[ANALYTICS_DATA_MODELS_SCHEMA.md](./ANALYTICS_DATA_MODELS_SCHEMA.md)** - DATABASE SCHEMA
   - **Purpose**: Prisma models and database design
   - **Contains**:
     - Complete Prisma schema definitions
     - Database indexes for performance
     - Event tracking integration
     - Dashboard aggregation queries
     - Test data seed script

---

## 🎯 Key Findings

### Vendor Revenue Calculation (CRITICAL)

```
CORRECT CALCULATION (What vendor sees):
  Revenue = Quantity Sold × Supplier Price
  Example: 500 units × 100 BDT = 50,000 BDT

WRONG CALCULATION (Never use):
  Revenue = Quantity Sold × Selling Price
  Example: 500 units × 150 BDT = 75,000 BDT (DO NOT SHOW TO VENDOR)

Platform Margin (SUPERADMIN ONLY):
  Margin = (Selling Price - Supplier Price) × Quantity
  Example: (150 - 100) × 500 = 25,000 BDT
```

### Role Access Matrix at a Glance

| Section | SUPERADMIN | ADMIN | VENDOR | SELLER | DELIVERY | CUSTOMER |
|---------|:---:|:---:|:---:|:---:|:---:|:---:|
| Dashboard | ✅ Full | ✅ Limited | ✅ Own | ❌ No | ✅ Own | ❌ |
| Sales Report | ✅ All | ✅ All | ❌ | ❌ No | ❌ | ❌ |
| Vendor Analytics | ✅ All+Commission | ✅ All (no comm) | ✅ Own only | ❌ No | ❌ | ❌ |
| Product Analytics | ✅ All | ✅ All | ✅ Own | ❌ No | ❌ | ❌ |
| Commission Details | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ | ❌ |

---

## 🔐 Role Hierarchy & Distinction

### SELLER (FreeSHop Order-Processing Employee)
- ❌ NO ANALYTICS ACCESS
- ✅ Sees order data through order management system
- ✅ Sees payment methods used
- ✅ Sees customer names and delivery addresses
- ✅ Sees order status
- ❌ Cannot see platform revenue
- ❌ Cannot see profits
- ❌ Cannot see vendor information
- ❌ Cannot see product performance
- Purpose: Process orders and manage customer support

### VENDOR (Individual Supplier)
- ✅ Can see ONLY their own products
- ✅ Can see their revenue (supplier price basis)
- ❌ Cannot see other vendors' data
- ❌ Cannot see retail prices or platform margins
- Purpose: Monitor their sales performance

---

## 🔐 What Vendors CAN and CANNOT See

### ✅ VENDOR CAN SEE
- Their supplier price (cost per unit)
- Units sold per product
- Total revenue (cost × quantity)
- Product views and click-through rates
- Conversion rate (views → sales)
- Average product rating
- Customer reviews (anonymized)
- Sales trends (daily/weekly)
- Performance growth rate

### ❌ VENDOR CANNOT SEE
- Selling price (what customers paid)
- Customer discounts applied
- Actual customer payment amounts
- Flash sale prices
- Platform margin
- Commission details
- Admin-set pricing rules
- Other vendors' data
- Customer personal information

---

## 👥 Role-Based Data Visibility

### SUPERADMIN
```
✅ Platform revenue (selling price basis): 5,000,000 BDT
✅ Vendor costs (supplier price basis): 3,500,000 BDT
✅ Platform margin: 1,500,000 BDT
✅ Commission paid: 1,200,000 BDT
✅ Net profit: 300,000 BDT
✅ All vendor analytics with commission
✅ All customer behavior data
```

### ADMIN
```
✅ Platform revenue: 5,000,000 BDT
✅ Total orders: 50,000
✅ Average order value: 100 BDT
✅ New customers: 1,500
✅ All vendor summary stats (no commission)
✅ All product performance
❌ Commission details
❌ Platform margin calculations
❌ Individual customer data
```

### SELLER (FreeSHop Order-Processing Employee)
```
✅ Order data through order management system
✅ Customer names and delivery addresses
✅ Order status (pending, processing, shipped, delivered)
✅ Payment methods used
✅ Order items and quantities
❌ NO ANALYTICS ACCESS
❌ No platform revenue
❌ No vendor information
❌ No product performance
❌ No profits or margins
❌ No financial data
```

### VENDOR (Individual Supplier)
```
✅ Their own products' analytics
✅ Revenue (supplier price): 50,000 BDT (not 75,000!)
✅ Units sold: 500
✅ Product views: 2,500
✅ Conversion rate: 20%
✅ Average rating: 4.5
✅ Customer reviews
❌ Selling price: 150 BDT
❌ What customers paid: 135 BDT
❌ Platform margin: 25,000 BDT
❌ Other vendors' data
```

---

## 🔄 Implementation Phases

### Phase 1: Permission Codes (Auth Service)
```
Define permission codes 90001-90015 in auth-service
Assign to role defaults
```

### Phase 2: Middleware (Shared Middleware)
```
Create analytics authorization middleware
Add role attachment
Enforce vendor ownership
```

### Phase 3: Service Layer (Analytics Service)
```
Implement role-based filtering
Add access validation
Calculate revenue using supplier price
Filter sensitive fields by role
```

### Phase 4: Routes & Controllers
```
Update all analytics endpoints
Apply middleware
Add permission checks
```

### Phase 5: Testing & Validation
```
Test each role separately
Test unauthorized access denial
Verify data filtering
```

### Phase 6: Deployment
```
Deploy to production
Update API documentation
Train team on changes
Monitor for issues
```

---

## 📊 Real-World Example

### Scenario: Organic Rice Product

**Admin Setup:**
- Supplier Price: 100 BDT (vendor cost)
- Selling Price: 150 BDT (customer pays)
- Discount: 10% off
- Final Customer Price: 135 BDT

**In One Month - 500 Units Sold**

#### What VENDOR Sees:
```json
{
  "totalRevenue": 50000,
  "note": "Based on your supplier price"
}
```
*Vendor thinks they earned 50,000 BDT*

#### What ADMIN Sees:
```json
{
  "totalRevenue": 50000,
  "totalOrders": 500,
  "views": 2500,
  "conversionRate": 0.20
}
```
*Admin sees platform metrics from cost basis*

#### What SUPERADMIN Calculates:
```
Customer Total Paid:     500 × 135 = 67,500 BDT
Vendor Revenue:          500 × 100 = 50,000 BDT
Platform Revenue:        67,500 - 50,000 = 17,500 BDT
Commission (10%):        50,000 × 10% = 5,000 BDT
Net Platform Gain:       17,500 - 5,000 = 12,500 BDT
```

#### What CUSTOMER Sees:
```
Order History:
  - 135 BDT (Delivered)
  - 135 BDT (Pending)
```
*No cost information visible*

---

## 🚀 API Endpoints Summary

### VENDOR Endpoints
```
GET /analytics/dashboard              # Own dashboard
GET /analytics/vendors/me/report      # Own sales report
GET /analytics/vendors/me/products    # Own products analytics
GET /analytics/vendors/me/products/:id # Specific product
GET /analytics/vendors/me/performance # Performance metrics
```

### ADMIN Endpoints
```
GET /analytics/dashboard              # Platform dashboard
GET /analytics/sales-report           # Sales by date
GET /analytics/vendors                # All vendors
GET /analytics/vendors/:id/report     # Vendor details
GET /analytics/products/:id/analytics # Product analytics
```

### SUPERADMIN Endpoints (All above + Additional)
```
GET /analytics/financial-summary      # Margins, commissions
GET /analytics/system-metrics         # System health
GET /analytics/vendors/:id/commission # Commission details
```

---

## ⚠️ Critical Implementation Rules

1. **VENDOR REVENUE ALWAYS**: `quantity × supplierPrice` (NEVER retail price)
2. **VENDOR ISOLATION**: Each vendor can only see their own data
3. **COMMISSION CONFIDENTIALITY**: SUPERADMIN only
4. **PRICING PROTECTION**: Hide retail price, discounts, and flash sale prices from vendors
5. **ACCESS LOGGING**: All analytics access must be logged for audit trail
6. **VALIDATION**: Always validate vendor ownership server-side, never trust client

---

## 📋 Quick Implementation Checklist

- [ ] Define permission codes 90001-90015
- [ ] Implement analytics middleware with role checks
- [ ] Update VendorReport calculations to use supplier price
- [ ] Update ProductAnalytics calculations to use supplier price
- [ ] Add role-based filtering in analytics service
- [ ] Filter response fields based on user role
- [ ] Add permission checks in all routes
- [ ] Create audit logging for analytics access
- [ ] Test vendor cannot access other vendors' data
- [ ] Test vendor revenue is based on supplier price
- [ ] Test admin cannot see commission details
- [ ] Test superadmin can see everything
- [ ] Deploy to production
- [ ] Update API documentation
- [ ] Train team

---

## 📞 Document Index

1. **Read First**: [ANALYTICS_RBAC_VISIBILITY_GUIDE.md](./ANALYTICS_RBAC_VISIBILITY_GUIDE.md)
2. **For Implementation**: [ANALYTICS_RBAC_IMPLEMENTATION_GUIDE.md](./ANALYTICS_RBAC_IMPLEMENTATION_GUIDE.md)
3. **For Quick Reference**: [ANALYTICS_ROLE_MATRIX_QUICK_REFERENCE.md](./ANALYTICS_ROLE_MATRIX_QUICK_REFERENCE.md)
4. **For Database**: [ANALYTICS_DATA_MODELS_SCHEMA.md](./ANALYTICS_DATA_MODELS_SCHEMA.md)

---

## 🎓 Key Takeaways

### The Vendor Pricing Principle
- **Vendors see their cost basis**: What they paid for the product
- **They do NOT see retail basis**: What the platform sells it for
- **This protects margins**: Platform's profit is hidden from vendors

### The Role Principle
- **SUPERADMIN**: God-mode access including financial details
- **ADMIN**: Business operations without commission secrets
- **SELLER**: Order-processing employee (NO analytics - see order system only)
- **VENDOR**: Individual supplier - only their own data, cost-basis calculations
- **DELIVERY_MAN**: Delivery operations only
- **CUSTOMER**: NO ANALYTICS ACCESS (only order history in account section)

### The Security Principle
- **Always validate server-side**: Never trust client role claims
- **Always filter responses**: Never expose data based on trust alone
- **Always log access**: Track who accessed what and when
- **Always use supplier price**: For vendor calculations

---

## Next Steps

1. Review the [ANALYTICS_RBAC_VISIBILITY_GUIDE.md](./ANALYTICS_RBAC_VISIBILITY_GUIDE.md) to understand the full scope
2. Use [ANALYTICS_RBAC_IMPLEMENTATION_GUIDE.md](./ANALYTICS_RBAC_IMPLEMENTATION_GUIDE.md) for coding details
3. Reference [ANALYTICS_ROLE_MATRIX_QUICK_REFERENCE.md](./ANALYTICS_ROLE_MATRIX_QUICK_REFERENCE.md) during implementation
4. Consult [ANALYTICS_DATA_MODELS_SCHEMA.md](./ANALYTICS_DATA_MODELS_SCHEMA.md) for database setup
5. Begin implementation with Phase 1 (Permission codes)
6. Test thoroughly before deployment
