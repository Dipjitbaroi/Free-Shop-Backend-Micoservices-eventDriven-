# Analytics RBAC - Data Models & Schema

## ⚠️ Important Role Clarification

**SELLER** = Employee of FreeSHop (can see all vendors' data)
**VENDOR** = Individual supplier/business partner (can only see their own data)

These are NOT the same. SELLER is an internal role, VENDOR is an external/partner role.

---

## 📊 Prisma Schema Updates

### Current Analytics Models

The following models should already exist in your Prisma schema. Verify they have these fields:

#### DailySalesReport
```prisma
model DailySalesReport {
  id                 String   @id @default(cuid())
  date               DateTime @unique
  
  // Revenue metrics (retail price basis for platform)
  totalRevenue       Float
  codRevenue         Float?
  bkashRevenue       Float?
  epsRevenue         Float?
  
  // Order metrics
  totalOrders        Int
  completedOrders    Int
  cancelledOrders    Int
  pendingOrders      Int
  
  // Customer metrics
  newCustomers       Int
  returningCustomers Int
  
  // Payment breakdown
  codOrders          Int
  bkashOrders        Int
  epsOrders          Int
  
  averageOrderValue  Float
  
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  
  @@index([date])
  @@index([createdAt])
}
```

#### VendorReport
```prisma
model VendorReport {
  id                String   @id @default(cuid())
  vendorId          String
  vendor            Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  date              DateTime
  
  // Revenue metrics (SUPPLIER PRICE BASIS - what vendor earned)
  totalRevenue      Float    // quantity × supplierPrice
  totalOrders       Int
  totalItems        Int
  
  // Commission (SUPERADMIN only - hidden from vendor and admin)
  commission        Float?   // Amount paid to vendor as commission
  netRevenue        Float?   // totalRevenue - commission
  
  // Engagement
  productViews      Int      // Product page views
  productClickRate  Float?   // Percentage of viewers who clicked
  conversionRate    Float    // views → purchases percentage
  
  // Ratings & Reviews
  averageRating     Float?   // Average product rating
  newReviews        Int
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@unique([vendorId, date])
  @@index([vendorId])
  @@index([date])
  @@index([vendorId, date])
  @@index([createdAt])
}
```

#### ProductAnalytics
```prisma
model ProductAnalytics {
  id               String   @id @default(cuid())
  productId        String
  product          Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  vendorId         String
  vendor           Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  date             DateTime
  
  // Engagement metrics
  views            Int      // Product page views
  clicks           Int      // Number of clicks
  clickRate        Float    // Percentage (clicks / views)
  
  // Sales metrics (SUPPLIER PRICE BASIS for vendor visibility)
  unitsSold        Int
  revenue          Float    // unitsSold × supplierPrice (for vendor)
                            // For admin: showing via supplier price
                            // For superadmin: can calculate both
  
  // Product quality
  averageRating    Float?
  newReviews       Int
  
  // HIDDEN FIELDS (calculated, not stored, but filtered from vendor responses)
  // retailRevenue        Float  // unitsSold × price (calculated, never sent to vendor)
  // platformMargin       Float  // retailRevenue - revenue (calculated, never sent to vendor)
  // discountApplied      Float? // Total discounts applied
  
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  
  @@unique([productId, date])
  @@index([productId])
  @@index([vendorId])
  @@index([date])
  @@index([productId, date])
  @@index([vendorId, date])
  @@index([createdAt])
}
```

#### AnalyticsEvent
```prisma
model AnalyticsEvent {
  id               String   @id @default(cuid())
  eventType        String   // 'view', 'click', 'purchase', 'review', etc.
  eventName        String   // Human readable: 'Product Viewed', 'Order Completed'
  
  userId           String?  // User who triggered event (optional for anonymous)
  sessionId        String?  // Session ID for tracking
  
  entityType       String   // 'Product', 'Vendor', 'Order', etc.
  entityId         String   // ID of entity (productId, vendorId, orderId)
  
  // Context
  metadata         Json?    // Extra data specific to event
  ipAddress        String?
  userAgent        String?
  referer          String?
  
  createdAt        DateTime @default(now())
  
  @@index([eventType])
  @@index([userId])
  @@index([entityType, entityId])
  @@index([createdAt])
  @@index([sessionId])
}
```

#### SearchAnalytics
```prisma
model SearchAnalytics {
  id                   String   @id @default(cuid())
  query                String   // Search term
  resultsCount         Int      // How many results returned
  
  userId               String?  // User who searched
  sessionId            String?
  
  clickedProductId     String?  // Which product they clicked (if any)
  clickPosition        Int?     // Position in search results (1st, 2nd, etc.)
  
  conversionToCart     Boolean  @default(false)
  conversionToOrder    Boolean  @default(false)
  
  createdAt            DateTime @default(now())
  
  @@index([query])
  @@index([userId])
  @@index([sessionId])
  @@index([createdAt])
  @@index([conversionToOrder])
}
```

### Related Models to Update

#### Product Model
```prisma
model Product {
  id                 String   @id @default(uuid())
  vendorId           String
  vendor             Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  
  // EXISTING FIELDS
  name               String
  slug               String
  description        String?
  sku                String   @unique
  
  // PRICING FIELDS
  supplierPrice      Float    // Cost to vendor - VENDOR CAN SEE
  price              Float    // Retail selling price - VENDOR CANNOT SEE
  discountPrice      Float?   // Discounted price - VENDOR CANNOT SEE
  discountType       String?  // 'PERCENTAGE' or 'FIXED_AMOUNT'
  discountValue      Float?
  
  // Flash sale pricing
  flashSalePrice     Float?   // VENDOR CANNOT SEE
  isFlashSale        Boolean  @default(false)
  flashSaleStartDate DateTime?
  flashSaleEndDate   DateTime?
  
  // Stock
  stock              Int
  reservedStock      Int      @default(0)
  lowStockThreshold  Int?
  
  // Analytics relation
  analytics          ProductAnalytics[]
  
  // ... other existing fields
  
  @@index([vendorId])
  @@unique([vendorId, slug])
}
```

#### Vendor Model
```prisma
model Vendor {
  id                 String   @id @default(uuid())
  userId             String   @unique
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  storeSlug          String   @unique
  storeName          String
  description        String?
  
  // Analytics
  totalProducts      Int      @default(0)
  totalOrders        Int      @default(0)
  totalRevenue       Float    @default(0)  // Based on supplier price
  rating             Float?
  totalReviews       Int      @default(0)
  
  // Relations
  products           Product[]
  reports            VendorReport[]
  analytics          ProductAnalytics[]
  
  // ... other existing fields
  
  @@index([storeSlug])
  @@index([userId])
}
```

---

## 🔄 Data Flow Diagrams

### Vendor Revenue Calculation Flow

```
Order Created with Item
  ↓
OrderItem: {
  productId: "prod-123",
  quantity: 2,
  price: 135 BDT (what customer paid)
}
  ↓
Product lookup: {
  supplierPrice: 100 BDT,
  price: 150 BDT,
  vendorId: "vendor-456"
}
  ↓
Calculate Vendor Revenue = quantity × supplierPrice
                        = 2 × 100 = 200 BDT
  ↓
Update VendorReport:
  totalRevenue += 200 BDT (stored)
  
When Vendor Requests Analytics:
  ✅ Show totalRevenue = 200 BDT
  ✅ Show unitsSold = 2
  ❌ Hide: price (150), customer payment (135 × 2 = 270)
  ❌ Hide: platformMargin = (150 - 100) × 2 = 100 BDT
```

### Analytics Access Control Flow

```
GET /analytics/vendors/:vendorId/report
  ↓
Authentication Check
  ├─ Success: Continue
  └─ Fail: 401 Unauthorized
  ↓
Permission Check (ANALYTICS_READ)
  ├─ Success: Continue
  └─ Fail: 403 Forbidden
  ↓
Role-Based Authorization
  ├─ SUPERADMIN: Allow all data
  ├─ ADMIN: Allow, filter commission/margin
  ├─ VENDOR: Check ownership
  │  ├─ Own vendor: Allow
  │  └─ Other vendor: 403 Forbidden
  └─ Other roles: 403 Forbidden
  ↓
Query Database
  SELECT * FROM VendorReport
  WHERE vendorId = $1 AND date BETWEEN $2 AND $3
  ↓
Filter Response Fields
  ├─ SUPERADMIN: All fields
  ├─ ADMIN: Remove commission, netRevenue
  └─ VENDOR: Remove commission, netRevenue
  ↓
Return JSON Response
```

---

## 📈 Query Performance Considerations

### Indexes Required

```prisma
// For fast vendor report lookups
model VendorReport {
  @@index([vendorId, date])  // Most common query: vendor + date range
  @@index([date])            // For dashboard aggregations
  @@index([vendorId])        // List all vendor's reports
}

// For fast product analytics lookups
model ProductAnalytics {
  @@index([vendorId, date])  // Vendor specific analytics
  @@index([productId, date]) // Product specific analytics
  @@index([date])            // Daily aggregations
}

// For fast event lookups
model AnalyticsEvent {
  @@index([eventType])       // Query by event type
  @@index([entityType, entityId])  // Find events for entity
  @@index([userId])          // User's events
  @@index([createdAt])       // Time-range queries
}
```

### Aggregation Query Example

```typescript
// Get vendor dashboard metrics - efficiently calculated
const metrics = await prisma.vendorReport.aggregate({
  where: {
    vendorId: vendorId,
    date: {
      gte: startDate,
      lte: endDate,
    },
  },
  _sum: {
    totalRevenue: true,    // Supplier price basis
    totalOrders: true,
    totalItems: true,
    productViews: true,
  },
  _avg: {
    conversionRate: true,
    averageRating: true,
  },
  _max: {
    date: true,
  },
});

// Result: Single database round-trip (fast)
// No need to fetch individual records and calculate in app
```

---

## 🔄 Event Tracking Integration

### Events to Track

```typescript
enum AnalyticsEventType {
  // Product events
  PRODUCT_VIEWED = 'product.viewed',
  PRODUCT_CLICKED = 'product.clicked',
  PRODUCT_SEARCHED = 'product.searched',
  
  // Purchase events
  ADDED_TO_CART = 'cart.add',
  ORDER_CREATED = 'order.created',
  ORDER_COMPLETED = 'order.completed',
  ORDER_CANCELLED = 'order.cancelled',
  
  // Review events
  REVIEW_CREATED = 'review.created',
  REVIEW_UPDATED = 'review.updated',
  
  // Vendor events
  VENDOR_PROFILE_VIEWED = 'vendor.viewed',
  VENDOR_FOLLOWED = 'vendor.followed',
  
  // Payment events
  PAYMENT_INITIATED = 'payment.initiated',
  PAYMENT_COMPLETED = 'payment.completed',
  PAYMENT_FAILED = 'payment.failed',
}

// Event structure
interface AnalyticsEventPayload {
  eventType: AnalyticsEventType;
  userId?: string;           // Optional for anonymous tracking
  sessionId: string;
  entityType: 'Product' | 'Vendor' | 'Order' | 'Review';
  entityId: string;
  metadata?: {
    [key: string]: any;
  };
  ipAddress?: string;
  userAgent?: string;
  referer?: string;
}
```

### Event Publishing from Order Service

```typescript
// When order is created
await analyticsService.trackEvent({
  eventType: 'order.created',
  userId: req.user.id,
  sessionId: req.body.sessionId,
  entityType: 'Order',
  entityId: orderId,
  metadata: {
    totalAmount: order.totalPrice,
    itemCount: order.items.length,
    paymentMethod: order.paymentMethod,
    // These are INTERNAL metrics
    // Vendor sees supplier price basis
    // Platform sees actual amount
  },
});

// When order is completed
await analyticsService.trackEvent({
  eventType: 'order.completed',
  userId: req.user.id,
  sessionId: req.body.sessionId,
  entityType: 'Order',
  entityId: orderId,
  metadata: {
    totalAmount: order.totalPrice,
    deliveredAt: new Date(),
  },
});
```

---

## 📊 Dashboard Aggregation Queries

### Vendor Dashboard Query

```typescript
// Vendor wants to see their dashboard
const vendorDashboard = await prisma.vendorReport.aggregate({
  where: {
    vendorId: vendorId,
    date: {
      gte: startDate,
      lte: endDate,
    },
  },
  _sum: {
    totalRevenue: true,      // ✅ Based on supplier price
    totalOrders: true,
    totalItems: true,
    productViews: true,
  },
  _avg: {
    conversionRate: true,
    averageRating: true,
  },
});

// Response (what vendor sees):
{
  _sum: {
    totalRevenue: 50000,     // Supplier price × quantity
    totalOrders: 500,
    totalItems: 500,
    productViews: 2500,
  },
  _avg: {
    conversionRate: 0.20,    // 20% of viewers purchased
    averageRating: 4.5,
  },
}
```

### Admin Dashboard Query

```typescript
// Admin wants platform-wide metrics
const adminDashboard = await prisma.dailySalesReport.aggregate({
  where: {
    date: {
      gte: startDate,
      lte: endDate,
    },
  },
  _sum: {
    totalRevenue: true,      // Platform revenue (what customers paid)
    totalOrders: true,
    newCustomers: true,
  },
  _avg: {
    averageOrderValue: true,
  },
});

// Response (filtered for admin - no commission):
{
  _sum: {
    totalRevenue: 5000000,   // Customer payment total
    totalOrders: 50000,
    newCustomers: 1500,
  },
  _avg: {
    averageOrderValue: 100,
  },
  // HIDDEN: commission, margin, vendor costs
}
```

### Superadmin Dashboard Query

```typescript
// Superadmin wants everything
const vendorCosts = await prisma.vendorReport.aggregate({
  where: {
    date: {
      gte: startDate,
      lte: endDate,
    },
  },
  _sum: {
    totalRevenue: true,      // Total vendor supplier price
  },
});

const adminDashboard = await prisma.dailySalesReport.aggregate({
  where: {
    date: {
      gte: startDate,
      lte: endDate,
    },
  },
  _sum: {
    totalRevenue: true,
  },
});

// Calculated response:
{
  totalPlatformRevenue: 5000000,          // What customers paid
  totalVendorCosts: 3500000,              // Total supplier price basis
  platformMargin: 1500000,                // Theoretical margin
  commissionsPaid: 1200000,               // Actual paid to vendors
  netProfit: 300000,                      // 1500000 - 1200000
}
```

---

## 🧪 Test Data Setup

### Seed Script for Testing

```typescript
// scripts/seed-analytics.ts

async function seedAnalyticsTestData() {
  // Create vendor
  const vendor = await prisma.vendor.create({
    data: {
      userId: 'vendor-user-1',
      storeSlug: 'test-vendor',
      storeName: 'Test Vendor Store',
      totalProducts: 5,
      totalOrders: 100,
      totalRevenue: 50000, // supplier price basis
      rating: 4.5,
    },
  });

  // Create product
  const product = await prisma.product.create({
    data: {
      vendorId: vendor.id,
      name: 'Organic Rice',
      slug: 'organic-rice',
      sku: 'RICE-001',
      supplierPrice: 100,      // Vendor cost
      price: 150,              // Customer pays this
      stock: 1000,
    },
  });

  // Create vendor report for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.vendorReport.create({
    data: {
      vendorId: vendor.id,
      date: today,
      totalRevenue: 5000,      // 50 units × 100 (supplier price)
      totalOrders: 50,
      totalItems: 50,
      productViews: 500,
      productClickRate: 0.10,
      conversionRate: 0.10,
      averageRating: 4.5,
      newReviews: 5,
      commission: 500,         // 10% commission
      netRevenue: 4500,
    },
  });

  // Create product analytics
  await prisma.productAnalytics.create({
    data: {
      productId: product.id,
      vendorId: vendor.id,
      date: today,
      views: 500,
      clicks: 50,
      clickRate: 0.10,
      unitsSold: 50,
      revenue: 5000,            // 50 × 100 (supplier price)
      averageRating: 4.5,
      newReviews: 5,
    },
  });

  console.log('Analytics test data seeded successfully');
}

seedAnalyticsTestData();
```

---

## 📋 Migration Checklist

- [ ] Verify all analytics models exist in Prisma schema
- [ ] Create database indexes for performance
- [ ] Verify VendorReport uses supplier price in revenue calculations
- [ ] Verify ProductAnalytics uses supplier price in revenue calculations
- [ ] Add analytics event tracking throughout services
- [ ] Test aggregation queries with date ranges
- [ ] Verify vendor-owned analytics calculation
- [ ] Set up analytics data retention policy
- [ ] Create monitoring for analytics query performance
- [ ] Add logging for all analytics access
