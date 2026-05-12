# 📊 Analytics Data Organization - Divided by Permissions

## Architecture Overview

Organize analytics into **permission-gated sections**. Each section has:
- **Required Permission Code**
- **Data Models Included**
- **API Endpoints**
- **Accessible By** (roles)

---

## Section 1️⃣: PLATFORM METRICS (Permission: 90010)

### 📍 What Is It?
Global business health metrics - no sensitive financial data.

### 📊 Data Models
```typescript
- PlatformDailyMetrics
- TopProductsByRevenue
- OrderTrends
- PaymentMethodDistribution
- RegionalSalesBreakdown
```

### 📈 Metrics Included
- Total orders (count)
- Total customers (count)
- Average order value
- Payment methods used
- Regional distribution
- Top 10 products (by volume, not margin)

### 🔑 Accessible By
- ✅ SUPERADMIN
- ✅ ADMIN
- ✅ VENDOR (own region/products only)
- ✅ DELIVERY_MAN (own region only)
- ❌ SELLER
- ❌ CUSTOMER

### 🔐 Permission Code
```typescript
{
  permissionCode: 90010,
  description: "READ_PLATFORM_METRICS"
}
```

### 🛣️ API Endpoints
```
GET /analytics/platform/dashboard
GET /analytics/platform/orders/trend
GET /analytics/platform/payment-methods
GET /analytics/platform/regions
```

---

## Section 2️⃣: VENDOR ANALYTICS (Permission: 90011)

### 📍 What Is It?
Vendor-specific performance data based on **supplier price** (cost).

### 📊 Data Models
```typescript
- VendorDailyReport (supplier price basis)
- VendorProductMetrics
- VendorCustomerRatings
- VendorRevenueTrend
- VendorTopProducts
```

### 📈 Metrics Included
- Revenue (supplier price × quantity) ← **NOT retail price**
- Total products
- Product variants sold
- Customer ratings
- Return rate
- Response time

### 🔑 Accessible By
- ✅ SUPERADMIN
- ✅ ADMIN
- ✅ VENDOR (only their own vendor ID)
- ❌ SELLER
- ❌ DELIVERY_MAN
- ❌ CUSTOMER

### 🔐 Permission Code
```typescript
{
  permissionCode: 90011,
  description: "READ_VENDOR_ANALYTICS"
}
```

### 🛣️ API Endpoints
```
GET /analytics/vendors
GET /analytics/vendors/:vendorId/dashboard
GET /analytics/vendors/:vendorId/products
GET /analytics/vendors/:vendorId/revenue/trend
GET /analytics/vendors/:vendorId/ratings
```

### ⚠️ CRITICAL FILTERING
```typescript
// For VENDOR role - only return their data
if (userRole === VENDOR) {
  // Only show current vendor's data
  WHERE vendorId = currentUser.vendorId
  // Show supplier price, not retail price
  revenue = quantity * supplierPrice
}

// For ADMIN/SUPERADMIN - show all vendors but no margin
if (userRole === ADMIN || SUPERADMIN) {
  // Show all vendors
  // Still hide customer-specific data
}
```

---

## Section 3️⃣: PRODUCT ANALYTICS (Permission: 90012)

### 📍 What Is It?
Per-product performance metrics - aggregated across vendors.

### 📊 Data Models
```typescript
- ProductDailyMetrics
- ProductViewsAndConversions
- ProductInventoryMetrics
- ProductPriceHistory
- ProductReturnMetrics
```

### 📈 Metrics Included
- Total views
- Conversion rate
- Total sold (units)
- Current inventory
- Return rate
- Average rating
- Price ranges (by vendor)

### 🔑 Accessible By
- ✅ SUPERADMIN
- ✅ ADMIN
- ✅ VENDOR (only their products)
- ❌ SELLER
- ❌ DELIVERY_MAN
- ❌ CUSTOMER

### 🔐 Permission Code
```typescript
{
  permissionCode: 90012,
  description: "READ_PRODUCT_ANALYTICS"
}
```

### 🛣️ API Endpoints
```
GET /analytics/products
GET /analytics/products/:productId/metrics
GET /analytics/products/:productId/views-conversions
GET /analytics/products/:productId/inventory
GET /analytics/products/:productId/returns
```

---

## Section 4️⃣: SALES REPORT (Permission: 90013)

### 📍 What Is It?
Detailed sales data - for management visibility.

### 📊 Data Models
```typescript
- DailySalesReport
- MonthlySalesReport
- SalesGrowthMetrics
- TopVendorsReport
- SalesByCategory
- SalesByPaymentMethod
```

### 📈 Metrics Included
- Daily/monthly sales breakdown
- Sales by category
- Sales by payment method
- Top vendors (by volume)
- Growth rate (MoM, YoY)
- Order fulfillment rate

### 🔑 Accessible By
- ✅ SUPERADMIN
- ✅ ADMIN
- ❌ VENDOR
- ❌ SELLER
- ❌ DELIVERY_MAN
- ❌ CUSTOMER

### 🔐 Permission Code
```typescript
{
  permissionCode: 90013,
  description: "READ_SALES_REPORT"
}
```

### 🛣️ API Endpoints
```
GET /analytics/sales/daily
GET /analytics/sales/monthly
GET /analytics/sales/by-category
GET /analytics/sales/by-payment-method
GET /analytics/sales/top-vendors
GET /analytics/sales/growth
```

---

## Section 5️⃣: DELIVERY ANALYTICS (Permission: 90014)

### 📍 What Is It?
Delivery performance and logistics metrics.

### 📊 Data Models
```typescript
- DeliveryDailyMetrics
- DeliveryPersonPerformance
- DeliveryTimeMetrics
- DeliverySuccessRate
- RegionalDeliveryMetrics
```

### 📈 Metrics Included
- Orders delivered (count)
- Delivery person efficiency
- Average delivery time
- Success rate
- Failed/returned orders
- Regional performance

### 🔑 Accessible By
- ✅ SUPERADMIN
- ✅ ADMIN
- ✅ DELIVERY_MAN (only own metrics)
- ❌ VENDOR
- ❌ SELLER
- ❌ CUSTOMER

### 🔐 Permission Code
```typescript
{
  permissionCode: 90014,
  description: "READ_DELIVERY_ANALYTICS"
}
```

### 🛣️ API Endpoints
```
GET /analytics/delivery/daily
GET /analytics/delivery/persons/:personId/performance
GET /analytics/delivery/time-metrics
GET /analytics/delivery/success-rate
GET /analytics/delivery/by-region
```

---

## Section 6️⃣: EXECUTIVE DASHBOARD (Permission: 90015)

### 📍 What Is It?
**SUPERADMIN ONLY** - Sensitive financial data including commissions, margins, profitability.

### 📊 Data Models
```typescript
- PlatformProfitabilityReport
- CommissionReport
- MarginAnalysis
- VendorPayoutSummary
- FinancialDashboard
- RiskMetrics
```

### 📈 Metrics Included
- Platform profit margin %
- Commission paid out
- Net revenue vs Gross revenue
- Vendor payout schedules
- Chargeback rate
- Refund rate %
- Risk indicators

### 🔑 Accessible By
- ✅ SUPERADMIN ONLY
- ❌ Everyone else

### 🔐 Permission Code
```typescript
{
  permissionCode: 90015,
  description: "READ_EXECUTIVE_DASHBOARD"
}
```

### 🛣️ API Endpoints
```
GET /analytics/executive/profitability
GET /analytics/executive/commissions
GET /analytics/executive/margins
GET /analytics/executive/vendor-payouts
GET /analytics/executive/financial-health
GET /analytics/executive/risk-metrics
```

---

## Implementation Pattern

### Step 1️⃣: Define Permission Guards

```typescript
// middleware/analytics-permissions.ts
export async function authorizeAnalyticsSection(
  requiredPermission: number,
  userId: string,
  userRole: string
) {
  // Get user permissions from auth-service
  const permissions = await authService.getUserPermissions(userId);
  
  if (!permissions.includes(requiredPermission)) {
    throw new ForbiddenError(`Insufficient permissions for section`);
  }
}
```

### Step 2️⃣: Organize Controllers by Section

```typescript
// controllers/analytics/
├── platform-metrics.controller.ts      // Permission 90010
├── vendor-analytics.controller.ts      // Permission 90011
├── product-analytics.controller.ts     // Permission 90012
├── sales-report.controller.ts          // Permission 90013
├── delivery-analytics.controller.ts    // Permission 90014
└── executive-dashboard.controller.ts   // Permission 90015
```

### Step 3️⃣: Apply Guards to Routes

```typescript
// routes/analytics.routes.ts
router.get(
  '/analytics/platform/dashboard',
  authorizeAnalyticsSection(90010),
  platformMetricsController.getDashboard
);

router.get(
  '/analytics/executive/profitability',
  authorizeAnalyticsSection(90015),
  onlySuperadmin,
  executiveDashboardController.getProfitability
);

router.get(
  '/analytics/vendors/:vendorId/dashboard',
  authorizeAnalyticsSection(90011),
  onlyVendorOrAdmin,
  vendorAnalyticsController.getVendorDashboard
);
```

### Step 4️⃣: Filter Data by Role

```typescript
// services/analytics/vendor-analytics.service.ts
async getVendorDashboard(vendorId: string, userRole: string, userId: string) {
  let query = VendorReport.where({ vendorId });
  
  if (userRole === 'VENDOR') {
    // Vendor can only see their own data
    if (userId.vendorId !== vendorId) {
      throw new ForbiddenError('Cannot view other vendor data');
    }
    // Calculate revenue on supplier price only
    return query.select([
      'id', 'vendorId', 'date', 'quantitySold',
      'supplierPrice', 'totalRevenue' // = qty × supplierPrice
      // Hidden: 'retailPrice', 'margin', 'platformCommission'
    ]);
  } else if (userRole === 'ADMIN' || 'SUPERADMIN') {
    // Admin/Superadmin see all vendors
    return query.select([
      'id', 'vendorId', 'date', 'quantitySold',
      'supplierPrice', 'totalRevenue',
      'retailPrice', 'margin'
      // Hidden from ADMIN (visible to SUPERADMIN only): 'platformCommission'
    ]);
  }
}
```

---

## Database Schema Organization

```sql
-- Section 1: Platform Metrics
CREATE TABLE platform_daily_metrics (
  id UUID PRIMARY KEY,
  date DATE NOT NULL,
  total_orders INT,
  total_customers INT,
  avg_order_value DECIMAL,
  created_at TIMESTAMP
);

-- Section 2: Vendor Analytics
CREATE TABLE vendor_report (
  id UUID PRIMARY KEY,
  vendor_id UUID NOT NULL,
  date DATE NOT NULL,
  quantity_sold INT,
  supplier_price DECIMAL,         -- Cost price
  total_revenue DECIMAL,          -- qty × supplierPrice
  retail_price DECIMAL,           -- Hidden from vendor
  margin DECIMAL,                 -- Hidden from vendor
  platform_commission DECIMAL,    -- Hidden from vendor
  created_at TIMESTAMP
);

-- Section 3: Product Analytics
CREATE TABLE product_daily_metrics (
  id UUID PRIMARY KEY,
  product_id UUID NOT NULL,
  date DATE NOT NULL,
  views INT,
  conversions INT,
  units_sold INT,
  current_inventory INT,
  created_at TIMESTAMP
);

-- Section 4: Sales Reports
CREATE TABLE daily_sales_report (
  id UUID PRIMARY KEY,
  date DATE NOT NULL,
  total_sales DECIMAL,
  by_category JSONB,
  by_payment_method JSONB,
  created_at TIMESTAMP
);

-- Section 5: Delivery Analytics
CREATE TABLE delivery_daily_metrics (
  id UUID PRIMARY KEY,
  delivery_person_id UUID,
  date DATE NOT NULL,
  orders_delivered INT,
  avg_delivery_time INT,
  success_rate DECIMAL,
  created_at TIMESTAMP
);

-- Section 6: Executive Dashboard (SUPERADMIN)
CREATE TABLE profitability_report (
  id UUID PRIMARY KEY,
  date DATE NOT NULL,
  gross_revenue DECIMAL,
  platform_commission DECIMAL,
  refunds DECIMAL,
  net_revenue DECIMAL,
  operating_costs DECIMAL,
  profit DECIMAL,
  profit_margin DECIMAL,
  created_at TIMESTAMP
);
```

---

## Frontend Organization

### Dashboard Component Structure

```typescript
// components/analytics/
├── PlatformMetricsDashboard.tsx       // Permission 90010
├── VendorAnalyticsDashboard.tsx       // Permission 90011
├── ProductAnalyticsDashboard.tsx      // Permission 90012
├── SalesReportDashboard.tsx           // Permission 90013
├── DeliveryAnalyticsDashboard.tsx     // Permission 90014
└── ExecutiveDashboard.tsx             // Permission 90015 (SUPERADMIN)

// Each component conditionally renders based on user permission
```

### UI Layout by Role

```
SUPERADMIN sees:
├── Platform Metrics Dashboard
├── Vendor Analytics (all vendors)
├── Product Analytics (all products)
├── Sales Report
├── Delivery Analytics
└── Executive Dashboard ← HIDDEN FROM OTHERS

ADMIN sees:
├── Platform Metrics Dashboard
├── Vendor Analytics (all vendors)
├── Product Analytics (all products)
├── Sales Report
└── Delivery Analytics

VENDOR sees:
├── Platform Metrics (own region only)
└── Vendor Analytics (own data only)

DELIVERY_MAN sees:
├── Platform Metrics (own region)
└── Delivery Analytics (own performance)

SELLER sees:
└── ❌ NO ANALYTICS (order management only)

CUSTOMER sees:
└── ❌ NO ANALYTICS (order history only)
```

---

## Summary: Six Permission-Based Sections

| Section | Permission | Accessible To | Main Data |
|---------|:---:|---|---|
| 1. Platform Metrics | 90010 | SUPERADMIN, ADMIN, VENDOR, DELIVERY | Orders, trends, payment methods |
| 2. Vendor Analytics | 90011 | SUPERADMIN, ADMIN, VENDOR | Vendor revenue (supplier price), products |
| 3. Product Analytics | 90012 | SUPERADMIN, ADMIN, VENDOR | Views, conversions, inventory, ratings |
| 4. Sales Report | 90013 | SUPERADMIN, ADMIN | Sales breakdown, top vendors, growth |
| 5. Delivery Analytics | 90014 | SUPERADMIN, ADMIN, DELIVERY_MAN | Delivery performance, success rates |
| 6. Executive Dashboard | 90015 | SUPERADMIN | Commissions, margins, profitability |

Each section is **gated by permission code** and **filtered by user role**.
