# Analytics RBAC Visibility Guide - Permission-Based Sections (Updated)

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

### Filtering by Section - General Rules

```typescript
async getAnalyticsSection(sectionId: string, userId: string, userRole: string) {
  // 1. Check permission code for section
  const requiredPermission = SECTION_PERMISSIONS[sectionId];
  if (!hasPermission(userId, requiredPermission)) {
    throw new ForbiddenError(`No access to ${sectionId}`);
  }
  
  // 2. Apply role-specific filtering
  return applyRoleFiltering(sectionId, userRole, userId);
}

function applyRoleFiltering(sectionId, userRole, userId) {
  switch(sectionId) {
    case 'PLATFORM_METRICS':
      if (userRole === 'VENDOR') return filterByVendorId(userId);
      if (userRole === 'DELIVERY_MAN') return filterByDeliveryPersonId(userId);
      return allData;
    
    case 'VENDOR_ANALYTICS':
      if (userRole === 'VENDOR') return filterByVendorId(userId) + hideRetailPrice();
      return allVendors;
    
    case 'PRODUCT_ANALYTICS':
      if (userRole === 'VENDOR') return filterByVendorId(userId);
      return allProducts;
    
    case 'SALES_REPORT':
      if (userRole !== 'SUPERADMIN' && userRole !== 'ADMIN') {
        throw new ForbiddenError('Access denied');
      }
      return allData;
    
    case 'DELIVERY_ANALYTICS':
      if (userRole === 'DELIVERY_MAN') return filterByDeliveryPersonId(userId);
      return allDeliveryData;
    
    case 'EXECUTIVE_DASHBOARD':
      if (userRole !== 'SUPERADMIN') {
        throw new ForbiddenError('SUPERADMIN access required');
      }
      return allData;
  }
}
```

### Section 2: Vendor Analytics - CRITICAL FILTERING

```typescript
// Step 1: Validate vendor ownership
if (userRole === 'VENDOR' && requestedVendorId !== currentUser.vendorId) {
  throw new ForbiddenError('Cannot view other vendor data');
}

// Step 2: Calculate revenue on SUPPLIER PRICE ONLY
vendorReport.totalRevenue = SUM(
  orderItem.quantity × product.supplierPrice
) WHERE product.vendorId = vendor.id

// Step 3: HIDE from VENDOR response
EXCLUDE: price, discountPrice, flashSalePrice, 
         order.totalPrice, platformCommission, platformMargin, retailPrice
```

**Vendor Sees**:
```json
{
  "totalRevenue": 50000,     // qty × supplierPrice
  "totalOrders": 500,
  "averageRating": 4.5,
  "productViews": 5000,
  "supplierPrice": 100
}
```

**ADMIN/SUPERADMIN See**:
```json
{
  "totalRevenue": 75000,     // retail basis
  "vendorRevenue": 50000,    // supplier basis
  "commission": 7500,        // (SUPERADMIN only)
  "margin": 25000,           // (SUPERADMIN only)
  "supplierPrice": 100,
  "retailPrice": 150
}
```

---

## 🧮 Vendor Revenue Example

**Scenario**: Product sold 500 units
- Supplier Cost: 100 BDT
- Retail Price: 150 BDT  
- Platform Commission: 10%

**Calculations**:
- Gross Revenue: 500 × 150 = 75,000 BDT
- Vendor Sees: 500 × 100 = 50,000 BDT (supplier basis)
- Platform Profit: 75,000 - 50,000 = 25,000 BDT (hidden from vendor)

---

## ✅ Implementation Checklist

### Backend
- [ ] Define permission codes 90010-90015
- [ ] Add permission checks to all /analytics/section/* endpoints
- [ ] Implement role-based filtering in services
- [ ] Use supplier price for vendor revenue calculations
- [ ] Hide retail pricing from vendor responses
- [ ] Create database indexes on (vendorId, date), (deliveryPersonId, date)

### Testing
- [ ] ✅ VENDOR cannot access other vendor data
- [ ] ✅ VENDOR sees supplier price only
- [ ] ✅ Retail price hidden from vendor
- [ ] ✅ DELIVERY_MAN sees only own metrics
- [ ] ✅ SELLER has NO analytics access
- [ ] ✅ SUPERADMIN can access all sections
- [ ] ✅ Permission errors properly returned
