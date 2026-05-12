# Analytics RBAC Visibility Guide - Permission-Based Sections

## Overview

Analytics are organized into **6 permission-gated sections**. Each section has a specific permission code (90010-90015) and distinct data models. Users can only access sections they have permission for.

**Critical Rule**: Vendors see calculations based on their **supplier price (cost price)**, NOT the retail selling price.

---

## 📊 Six Analytics Sections

| # | Section | Permission | Key Data | Access |
|---|---------|:---:|---|---|
| 1 | Platform Metrics | 90010 | Orders, trends, payment methods | SUPERADMIN, ADMIN, VENDOR, DELIVERY_MAN |
| 2 | Vendor Analytics | 90011 | Vendor revenue (supplier price), products | SUPERADMIN, ADMIN, VENDOR (own) |
| 3 | Product Analytics | 90012 | Views, conversions, inventory, ratings | SUPERADMIN, ADMIN, VENDOR (own) |
| 4 | Sales Report | 90013 | Sales breakdown, top vendors, growth | SUPERADMIN, ADMIN |
| 5 | Delivery Analytics | 90014 | Delivery performance, success rates | SUPERADMIN, ADMIN, DELIVERY_MAN (own) |
| 6 | Executive Dashboard | 90015 | Commissions, margins, profitability | SUPERADMIN ONLY |

---

## 💡 Key Pricing Concepts

### For VENDORS (Suppliers)
- **Supplier Price**: The cost price they paid to supply the product
- **Revenue Calculation**: Based on quantity sold × supplier price
- **What They See**: Revenue based on their cost
- **What They DON'T See**: Retail price set by admin, customer payments, platform margins, platform-wide averages

### For SELLER (Employee)
- **What They See**: NO ANALYTICS ACCESS - Order processing system only
- **What They DON'T See**: Analytics dashboards, financial data, vendor info, pricing

### For ADMIN/SUPERADMIN
- **Selling Price**: The retail price customers pay
- **Visibility**: Can see both supplier price AND selling price
- **Margin Calculation**: Selling price - Supplier price = Platform margin

### For CUSTOMERS
- **Visibility**: Cannot see any cost/supplier prices
- **Only See**: Order history in account section (NOT analytics)

---

## 📍 Section-Based Analytics Organization

### 1️⃣ SECTION: Platform Metrics (Permission: 90010)

**Purpose**: Global business health metrics - no sensitive financial data.

**Data Models**:
- PlatformDailyMetrics
- OrderTrends
- PaymentMethodDistribution
- RegionalSalesBreakdown
- TopProductsByVolume

**Metrics Included**:
- Total orders (count)
- Total customers (count)
- Average order value
- Payment methods distribution (COD, bKash, EPS, etc.)
- Regional sales breakdown
- Order growth rate
- New customer count
- Returning customer rate

**Access**:
- ✅ SUPERADMIN (full)
- ✅ ADMIN (full)
- ✅ VENDOR (own region/products only)
- ✅ DELIVERY_MAN (own region only)
- ❌ SELLER (NO access)
- ❌ CUSTOMER (NO access)

**API Endpoints**:
```
GET /analytics/section/platform/dashboard
GET /analytics/section/platform/orders/trend
GET /analytics/section/platform/payment-methods
GET /analytics/section/platform/regions
GET /analytics/section/platform/top-products
```

**Permission Code**: 90010

---

### 2️⃣ SECTION: Vendor Analytics (Permission: 90011)

**Purpose**: Vendor-specific performance data based on **supplier price** (cost).

**Data Models**:
- VendorDailyReport (supplier price basis)
- VendorProductMetrics
- VendorCustomerRatings
- VendorRevenueTrend
- VendorTopProducts

**Metrics Included** (For Each Vendor):
- Revenue (supplier price × quantity) ← **NOT retail price**
- Total products
- Product variants sold
- Customer ratings (average)
- Return rate
- Response time to customers
- Commission paid (SUPERADMIN only)
- Total orders

**Access**:
- ✅ SUPERADMIN (all vendors + commissions)
- ✅ ADMIN (all vendors)
- ✅ VENDOR (only their own data - revenue on supplier price)
- ❌ SELLER (NO access)
- ❌ DELIVERY_MAN (NO access)
- ❌ CUSTOMER (NO access)

**API Endpoints**:
```
GET /analytics/section/vendor/dashboard
GET /analytics/section/vendor/:vendorId/dashboard
GET /analytics/section/vendor/:vendorId/products
GET /analytics/section/vendor/:vendorId/revenue/trend
GET /analytics/section/vendor/:vendorId/ratings
```

**Permission Code**: 90011

**CRITICAL FILTERING for VENDOR role**:
```typescript
// Only show THEIR OWN data
if (userRole === 'VENDOR') {
  WHERE vendorId = currentUser.vendorId
  
  // Show supplier price basis ONLY
  revenue = quantity × supplierPrice
  
  // HIDE these fields:
  // - retailPrice / sellingPrice
  // - customerPrice
  // - platformMargin
  // - commission
  // - platformProfit
}
```

---

### 3️⃣ SECTION: Product Analytics (Permission: 90012)

**Purpose**: Per-product performance metrics aggregated across vendors.

**Data Models**:
- ProductDailyMetrics
- ProductViewsAndConversions
- ProductInventoryMetrics
- ProductReturnMetrics
- ProductRatings

**Metrics Included**:
- Total views across all vendors
- Conversion rate (views → purchases)
- Total units sold (all vendors combined)
- Current inventory
- Return rate
- Average customer rating
- Number of vendors selling this product
- Price ranges by vendor

**Access**:
- ✅ SUPERADMIN (all products, all details)
- ✅ ADMIN (all products, all details)
- ✅ VENDOR (only their products)
- ❌ SELLER (NO access)
- ❌ DELIVERY_MAN (NO access)
- ❌ CUSTOMER (NO access)

**API Endpoints**:
```
GET /analytics/section/product/list
GET /analytics/section/product/:productId/metrics
GET /analytics/section/product/:productId/views-conversions
GET /analytics/section/product/:productId/inventory
GET /analytics/section/product/:productId/returns
GET /analytics/section/product/:productId/vendors
```

**Permission Code**: 90012

---

### 4️⃣ SECTION: Sales Report (Permission: 90013)

**Purpose**: Detailed sales data for management visibility.

**Data Models**:
- DailySalesReport
- MonthlySalesReport
- SalesGrowthMetrics
- TopVendorsReport
- SalesByCategory
- SalesByPaymentMethod

**Metrics Included**:
- Daily/monthly total sales (retail price basis)
- Sales breakdown by category
- Sales breakdown by payment method
- Top vendors (by volume)
- Sales growth rate (MoM, YoY)
- Order fulfillment rate
- Cancellation rate
- Return rate

**Access**:
- ✅ SUPERADMIN (full access)
- ✅ ADMIN (full access)
- ❌ VENDOR (NO access - use Vendor Analytics instead)
- ❌ SELLER (NO access)
- ❌ DELIVERY_MAN (NO access)
- ❌ CUSTOMER (NO access)

**API Endpoints**:
```
GET /analytics/section/sales/daily
GET /analytics/section/sales/monthly
GET /analytics/section/sales/by-category
GET /analytics/section/sales/by-payment-method
GET /analytics/section/sales/top-vendors
GET /analytics/section/sales/growth
```

**Permission Code**: 90013

---

### 5️⃣ SECTION: Delivery Analytics (Permission: 90014)

**Purpose**: Delivery performance and logistics metrics.

**Data Models**:
- DeliveryDailyMetrics
- DeliveryPersonPerformance
- DeliveryTimeMetrics
- DeliverySuccessRate
- RegionalDeliveryMetrics

**Metrics Included**:
- Orders delivered (count)
- Delivery person efficiency
- Average delivery time
- Success rate (completed/assigned)
- Failed/returned orders count
- Regional delivery performance
- On-time delivery percentage
- Customer satisfaction rating

**Access**:
- ✅ SUPERADMIN (all delivery staff)
- ✅ ADMIN (all delivery staff)
- ✅ DELIVERY_MAN (only their own metrics)
- ❌ VENDOR (NO access)
- ❌ SELLER (NO access)
- ❌ CUSTOMER (NO access)

**API Endpoints**:
```
GET /analytics/section/delivery/daily
GET /analytics/section/delivery/persons/:personId/performance
GET /analytics/section/delivery/time-metrics
GET /analytics/section/delivery/success-rate
GET /analytics/section/delivery/by-region
```

**Permission Code**: 90014

---

### 6️⃣ SECTION: Executive Dashboard (Permission: 90015)

**Purpose**: **SUPERADMIN ONLY** - Sensitive financial data including commissions, margins, profitability.

**Data Models**:
- PlatformProfitabilityReport
- CommissionReport
- MarginAnalysis
- VendorPayoutSummary
- FinancialDashboard

**Metrics Included**:
- Platform profit margin %
- Commission paid to vendors (total and per-vendor)
- Net revenue vs Gross revenue
- Vendor payout schedules
- Chargeback rate
- Refund rate %
- Risk indicators
- Operating costs vs revenue
- Cash flow

**Access**:
- ✅ SUPERADMIN ONLY
- ❌ ADMIN (NO access)
- ❌ VENDOR (NO access)
- ❌ SELLER (NO access)
- ❌ DELIVERY_MAN (NO access)
- ❌ CUSTOMER (NO access)

**API Endpoints**:
```
GET /analytics/section/executive/profitability
GET /analytics/section/executive/commissions
GET /analytics/section/executive/margins
GET /analytics/section/executive/vendor-payouts
GET /analytics/section/executive/financial-health
GET /analytics/section/executive/risk-metrics
```

**Permission Code**: 90015

---

## 🔒 Data Filtering Rules by Section
  - Total platform revenue
  - Total orders
  - Growth metrics
  - Conversion rates

- **Sales Reports** (same as SUPERADMIN)
  - Daily sales trends
  - Payment method breakdown
  - Order status distribution

- **Vendor Analytics** (LIMITED)
  - List of all vendors with summary stats
  - Each vendor's total orders (count only)
  - Each vendor's gross revenue (supplier price basis)
  - Vendor commission amounts
  - ❌ CANNOT: See individual vendor's cost breakdown
  - ❌ CANNOT: See platform margin calculations

- **Product Analytics** (LIMITED)
  - View all products
  - Product sales count
  - Product views
  - Product revenue (supplier price basis)
  - ❌ CANNOT: See supplier price details
  - ❌ CANNOT: See platform profit margins per product

- **Customer Analytics**
  - Total customer count
  - New customer rate
  - Returning customer rate
  - ❌ CANNOT: See individual customer behavior

- **Basic Financial Metrics**
  - Total revenue collected
  - Total commissions paid
  - ❌ CANNOT: See detailed margin calculations

#### ❌ CANNOT ACCESS:
- Vendor-specific commission details (use separate Vendor Management API)
- Payment processor account details
- Individual order financial breakdown
- Customer purchase history analysis

---

### 3. **SELLER/VENDOR** (70003 - SELLER_READ + 90002 - ANALYTICS_READ)

#### ✅ CAN ACCESS:

**Only Their Own Data**

- **Personal Dashboard**
  - Total orders (their products only)
  - Total revenue (based on SUPPLIER PRICE × quantity)
  - Average order value
  - New customer count (for their products)
  - Conversion rate (product views → purchases)

- **Sales Report** (Their Products Only)
  - Daily sales trends
  - Payment method breakdown for their orders
  - Order status: completed, pending, cancelled
  - Revenue by day (supplier price basis)
  - Items sold by product
  - Top performing products (by supplier revenue)

- **Product Analytics**
  - Each product's metrics:
    - Views count
    - Click-through rate
    - Sales count
    - Revenue (supplier price × quantity)
    - Average rating
    - Number of reviews
  - ❌ CANNOT: See retail/selling price
  - ❌ CANNOT: See platform margin
  - ❌ CANNOT: See how much customers paid

- **Performance Metrics**
  - Average product rating
  - Total reviews count
  - Ratings distribution (1-5 stars)
  - Review sentiment (positive/negative)
  - Response time to customer messages
  - Cancellation rate of orders

- **Business Insights**
  - Top products by units sold
  - Low-stock alerts
  - Customer engagement (repeat purchase rate)
  - Seasonal trends in their sales
  - Revenue growth rate (week-over-week, month-over-month)

#### ❌ CANNOT ACCESS:
- Other vendors' data
- Retail/selling price of products
- Platform margins
- Admin-set pricing policies
- Commission calculation details
- Total platform metrics
- Other vendors' performance
- Customer list beyond order history
- Global product performance

**Example Calculation (VENDOR VIEW):**
```
Product: Organic Rice (1kg)
  Supplier Price (Vendor Cost): 100 BDT
  Units Sold: 500
  Revenue Shown to Vendor: 500 × 100 = 50,000 BDT

What the Vendor DOES NOT see:
  Selling Price (set by admin): 150 BDT
  Actual customers paid: 500 × 150 = 75,000 BDT
  Platform margin: (150 - 100) × 500 = 25,000 BDT
```

---

### 4. **SELLER** (Employee of FreeSHop)

#### ✅ CAN ACCESS:
- **Platform-wide Sales Dashboard**
  - Total platform revenue
  - Total orders count
  - Average order value
  - Revenue growth rate
  - Order growth rate
  - New customer metrics

- **All Vendor Analytics**
  - Each vendor's performance
  - Vendor commission tracking
  - Vendor revenue (supplier price basis)
  - Vendor product performance
  - Top vendors by revenue

- **All Product Analytics**
  - All products across all vendors
  - Product views and CTR
  - Conversion rates
  - Revenue per product
  - Stock levels

- **Customer Analytics**
  - User count and growth
  - Customer distribution
  - Purchase patterns

- **Sales Reports**
  - Daily sales trends
  - Payment method breakdown
  - Order status distribution

#### ❌ CANNOT ACCESS:
- Individual customer personal data (PII)
- Commission calculation details
- Platform margin calculations
- Financial/profitability data
- System metrics

**Note**: SELLER is an employee of FreeSHop managing sales and operations. They see aggregated business metrics but not sensitive financial or individual customer data.

---

### 5. **DELIVERY_MAN** (60002 - DELIVERY_READ)

#### ✅ CAN ACCESS:
- **Personal Delivery Metrics**
  - Deliveries assigned to them (count)
  - Completed deliveries (today, week, month)
  - Cancelled deliveries
  - Average delivery time
  - On-time delivery rate
  - Customer rating on deliveries

- **Performance Dashboard**
  - Their average rating
  - Success rate percentage
  - Number of positive vs negative reviews
  - Earnings (if gig-based):
    - Deliveries completed
    - Amount earned (commission/per-delivery rate)

#### ❌ CANNOT ACCESS:
- Order details (unless necessary for delivery)
- Customer contact (only delivery address)
- Product information
- Any financial metrics
- Other delivery staff performance
- Company-wide metrics

---

### 5. **CUSTOMER**

#### ✅ CAN ACCESS:
- **NO ANALYTICS ACCESS**
- Customers do not have access to any analytics section
- They can only view their order history in the order/account section

#### ❌ CANNOT ACCESS:
- Analytics dashboard
- Any analytics reports
- Metrics or data
- Pricing information
- Vendor information
- Platform metrics

---

## 🔒 Data Filtering Rules

### Vendor Revenue Calculation
```typescript
// What gets calculated and stored for vendors
vendorRevenue = SUM(orderItem.quantity × product.supplierPrice)
              FOR orderItem.productId IN vendor.products
              WHERE orderStatus IN ['COMPLETED', 'DELIVERED']

// NOT based on retail price
NOT: SUM(orderItem.quantity × product.price)
```

### Vendor Cannot See These Fields
- `product.price` (retail selling price)
- `product.discountPrice` (customer discount)
- `product.flashSalePrice` (flash sale price)
- `order.totalPrice` (what customer paid)
- `order.payment.amount` (actual payment received)
- `commission.platformMargin`

### Vendor CAN See These Fields
- `product.supplierPrice` (their cost)
- `product.viewCount` (interest metric)
- `product.convertionRate` (views → sales)
- `productAnalytics.unitsSold` (quantity sold)
- `vendorReport.totalRevenue` (supplier price basis)
- `vendorReport.averageRating` (from customers)
- `vendorReport.conversionRate`

---

## � SELLER vs VENDOR - Important Distinction

**SELLER** = Employee of FreeSHop
- Role in company management
- Access: Platform-wide metrics (all vendors, all products)
- Purpose: Business operations and sales management
- Restrictions: No sensitive financial data, no PII

**VENDOR** = Individual Supplier/Business Partner
- Role: External supplier providing products
- Access: Only their own products and data
- Purpose: Monitor their sales performance
- Restrictions: Cannot see retail prices, platform margins, or other vendors' data
- Calculation: Revenue based on their supplier price (cost basis)

---

## 📊 Analytics Data Models by Role

### DailySalesReport (SUPERADMIN, ADMIN only - NOT for SELLER)
```typescript
interface DailySalesReport {
  id: string;
  date: Date;
  
  // Revenue metrics (retail price basis)
  totalRevenue: number;           // ✅ ADMIN, SUPERADMIN (❌ NOT SELLER)
  codRevenue?: number;             // ✅ ADMIN, SUPERADMIN (❌ NOT SELLER)
  bkashRevenue?: number;           // ✅ ADMIN, SUPERADMIN (❌ NOT SELLER)
  epsRevenue?: number;             // ✅ ADMIN, SUPERADMIN (❌ NOT SELLER)
  
  // Order metrics
  totalOrders: number;             // ✅ ADMIN, SUPERADMIN (❌ NOT SELLER - only their assignments)
  completedOrders: number;         // ✅ ADMIN, SUPERADMIN (❌ NOT SELLER)
  cancelledOrders: number;         // ✅ ADMIN, SUPERADMIN (❌ NOT SELLER)
  pendingOrders: number;           // ✅ ADMIN, SUPERADMIN (❌ NOT SELLER)
  
  // Customer metrics
  newCustomers: number;            // ✅ ADMIN, SUPERADMIN (❌ NOT SELLER)
  returningCustomers: number;      // ✅ ADMIN, SUPERADMIN (❌ NOT SELLER)
  
  // Breakdown
  codOrders: number;               // ✅ ADMIN, SUPERADMIN (❌ NOT SELLER)
  bkashOrders: number;             // ✅ ADMIN, SUPERADMIN (❌ NOT SELLER)
  epsOrders: number;               // ✅ ADMIN, SUPERADMIN (❌ NOT SELLER)
  
  averageOrderValue: number;       // ✅ ADMIN, SUPERADMIN (❌ NOT SELLER)
}
```

### VendorReport (VENDOR sees their own, ADMIN/SUPERADMIN see all - NOT SELLER)
```typescript
interface VendorReport {
  id: string;
  vendorId: string;
  date: Date;
  
  // Revenue (SUPPLIER PRICE BASIS for VENDOR)
  totalRevenue: number;            // ✅ VENDOR (their own), ADMIN, SUPERADMIN (❌ NOT SELLER)
  totalOrders: number;             // ✅ VENDOR, ADMIN, SUPERADMIN (❌ NOT SELLER)
  totalItems: number;              // ✅ VENDOR, ADMIN, SUPERADMIN (❌ NOT SELLER)
  
  // Commission (only SUPERADMIN)
  commission: number;              // ✅ SUPERADMIN only
  netRevenue: number;              // ✅ SUPERADMIN only
  
  // Engagement
  productViews: number;            // ✅ VENDOR, ADMIN, SUPERADMIN (❌ NOT SELLER)
  productClickRate: number;        // ✅ VENDOR, ADMIN, SUPERADMIN (❌ NOT SELLER)
  conversionRate: number;          // ✅ VENDOR, ADMIN, SUPERADMIN (❌ NOT SELLER)
  
  // Rating
  averageRating: number;           // ✅ VENDOR, ADMIN, SUPERADMIN (❌ NOT SELLER)
  newReviews: number;              // ✅ VENDOR, ADMIN, SUPERADMIN (❌ NOT SELLER)
}
```

### ProductAnalytics (VENDOR sees own products, ADMIN/SUPERADMIN see all - NOT SELLER)
```typescript
interface ProductAnalytics {
  id: string;
  productId: string;
  vendorId: string;
  date: Date;
  
  // Engagement
  views: number;                   // ✅ VENDOR, ADMIN, SUPERADMIN (❌ NOT SELLER)
  clicks: number;                  // ✅ VENDOR, ADMIN, SUPERADMIN (❌ NOT SELLER)
  clickRate: number;               // ✅ VENDOR, ADMIN, SUPERADMIN (❌ NOT SELLER)
  
  // Sales
  unitsSold: number;               // ✅ VENDOR, ADMIN, SUPERADMIN (❌ NOT SELLER)
  revenue: number;                 // ✅ VENDOR (supplier price), ADMIN, SUPERADMIN (❌ NOT SELLER)
  
  // Product specific
  averageRating: number;           // ✅ VENDOR, ADMIN, SELLER, SUPERADMIN
  newReviews: number;              // ✅ VENDOR, ADMIN, SELLER, SUPERADMIN
  
  // Hidden from VENDOR
  retailPrice: number;             // ❌ VENDOR cannot see
  platformMargin: number;          // ❌ VENDOR cannot see
  customerPrice: number;           // ❌ VENDOR cannot see
}
```

---

## 🔐 Implementation Checklist

### Backend - Permission Codes
- [ ] Define permission code `90002` = ANALYTICS_READ
- [ ] Define permission code `90001` = ANALYTICS_CREATE (for event tracking)
- [ ] Define permission code `90003` = ANALYTICS_DELETE
- [ ] Define permission code `90004` = ANALYTICS_ADMIN (SUPERADMIN only)

### Backend - Middleware
- [ ] Create `authorizeAnalyticsRole()` middleware
- [ ] Filter vendor data in analytics endpoints based on user role
- [ ] Ensure vendors only see their own data
- [ ] Hide `price`, `discountPrice`, `flashSalePrice` from vendor analytics responses

### Backend - Services
- [ ] Add role-based filtering in `analyticsService.getVendorReport()`
- [ ] Add vendor ID validation before returning analytics
- [ ] Calculate revenue using `supplierPrice` for vendors
- [ ] Add permission checks in all analytics endpoints

### Backend - Database Queries
- [ ] Verify VendorReport revenue calculations use `supplierPrice`
- [ ] Ensure ProductAnalytics revenue is based on supplier price
- [ ] Create indexes for: `VendorReport.vendorId + date`
- [ ] Create indexes for: `ProductAnalytics.vendorId + date`

### Frontend - API Layer
- [ ] Create endpoint: `GET /analytics/dashboard` (ADMIN/SUPERADMIN)
- [ ] Create endpoint: `GET /analytics/vendor/me` (VENDOR - own data)
- [ ] Create endpoint: `GET /analytics/vendor/:id` (ADMIN/SUPERADMIN)
- [ ] Create endpoint: `GET /analytics/products/:id` (VENDOR own, ADMIN/SUPERADMIN all)
- [ ] Add permission check before calling each endpoint

### Frontend - UI Components
- [ ] Dashboard component (ADMIN/SUPERADMIN version)
- [ ] Vendor dashboard component (VENDOR version with supplier price metrics)
- [ ] Hide pricing fields based on role
- [ ] Show only relevant metrics for each role

### Testing
- [ ] Test vendor cannot access other vendors' data
- [ ] Test vendor sees supplier price calculations
- [ ] Test admin sees global metrics
- [ ] Test superadmin sees commission details
- [ ] Test customer sees only their order history
- [ ] Test delivery person sees only delivery metrics

---

## 📋 API Endpoints Summary

### SUPERADMIN Access
```
GET /analytics/dashboard                    # Global metrics
GET /analytics/sales-report                 # Sales by date
GET /analytics/vendors                      # All vendors
GET /analytics/vendors/:id/report           # Specific vendor (full)
GET /analytics/products/:id/analytics       # Any product
GET /analytics/customers                    # All customers
GET /analytics/financial-summary            # All margins & commissions
```

### ADMIN Access
```
GET /analytics/dashboard                    # Global metrics (limited)
GET /analytics/sales-report                 # Sales by date
GET /analytics/vendors                      # All vendors (summary)
GET /analytics/vendors/:id/report           # Specific vendor (summary)
GET /analytics/products/:id/analytics       # Any product (summary)
```

### VENDOR Access
```
GET /analytics/vendor/me                    # Own dashboard
GET /analytics/vendor/me/products           # Own products analytics
GET /analytics/vendor/me/products/:id       # Specific product
GET /analytics/vendor/me/sales-report       # Own sales by date
GET /analytics/vendor/me/performance        # Performance metrics
GET /analytics/vendor/me/top-products       # Top products (own)
```

### CUSTOMER Access
```
GET /analytics/user/me/orders               # Own orders
GET /analytics/user/me/spending-summary     # Own spending
```

### DELIVERY_MAN Access
```
GET /analytics/delivery/me                  # Own delivery metrics
GET /analytics/delivery/me/performance      # Performance stats
GET /analytics/delivery/me/earnings         # Earnings (if gig-based)
```

---

## ⚠️ Critical Security Notes

1. **Never expose supplier price to customers**
   - Filter it from product responses for customer role

2. **Always validate vendor ID matches authenticated user**
   - Prevent vendor from accessing other vendors' data

3. **Calculate vendor revenue server-side**
   - Never trust client-side calculations
   - Always use supplier price from database

4. **Audit all analytics access**
   - Log who accessed what analytics data
   - Monitor for suspicious patterns

5. **Commission calculations are SUPERADMIN only**
   - Never expose to ADMIN or VENDOR
   - This is sensitive financial data

6. **Validate date ranges**
   - Prevent excessive queries (no data mining)
   - Implement rate limiting on analytics endpoints

---

## 🚀 Migration Steps

1. **Phase 1**: Add permission codes to auth-service
2. **Phase 2**: Implement role-based filtering in analytics service
3. **Phase 3**: Add permission checks in middleware
4. **Phase 4**: Update all analytics endpoints
5. **Phase 5**: Test thoroughly with different roles
6. **Phase 6**: Deploy and monitor

---

## 📝 Notes

- All revenue figures for vendors are calculated on **supplier price**, not retail price
- Vendor sees their cost basis, not platform's selling basis
- Admin sees global metrics, but not sensitive commission details
- Superadmin has complete visibility including margins and commissions
- Regular audits should verify data integrity and access patterns
