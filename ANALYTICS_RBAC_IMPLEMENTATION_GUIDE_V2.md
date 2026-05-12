# Analytics Role-Based Access Control - Implementation Guide (Updated)

## Overview

This guide provides code examples for implementing 6 permission-gated analytics sections (90010-90015) with role-based filtering for the Free-Shop backend.

---

## 1. Permission Codes Definition

### Location: `packages/shared-types/src/permission-codes.ts`

```typescript
export const PERMISSION_CODES = {
  // Analytics section permissions (90010-90015)
  ANALYTICS_VIEW_PLATFORM_METRICS: 90010,    // Platform-wide metrics
  ANALYTICS_VIEW_VENDOR: 90011,              // Vendor analytics
  ANALYTICS_VIEW_PRODUCT: 90012,             // Product analytics
  ANALYTICS_VIEW_SALES_REPORT: 90013,        // Sales reports
  ANALYTICS_VIEW_DELIVERY: 90014,            // Delivery analytics
  ANALYTICS_VIEW_EXECUTIVE: 90015,           // Executive dashboard (SUPERADMIN)
} as const;

export const SECTION_PERMISSIONS = {
  PLATFORM_METRICS: 90010,
  VENDOR_ANALYTICS: 90011,
  PRODUCT_ANALYTICS: 90012,
  SALES_REPORT: 90013,
  DELIVERY_ANALYTICS: 90014,
  EXECUTIVE_DASHBOARD: 90015,
} as const;
```

---

## 2. Role-Based Permission Mapping

### Location: `packages/shared-types/src/rbac-defaults.ts`

```typescript
export const DEFAULT_ROLE_PERMISSIONS = {
  SUPERADMIN: [
    PERMISSION_CODES.ANALYTICS_VIEW_PLATFORM_METRICS,    // 90010
    PERMISSION_CODES.ANALYTICS_VIEW_VENDOR,              // 90011
    PERMISSION_CODES.ANALYTICS_VIEW_PRODUCT,             // 90012
    PERMISSION_CODES.ANALYTICS_VIEW_SALES_REPORT,        // 90013
    PERMISSION_CODES.ANALYTICS_VIEW_DELIVERY,            // 90014
    PERMISSION_CODES.ANALYTICS_VIEW_EXECUTIVE,           // 90015
  ],

  ADMIN: [
    PERMISSION_CODES.ANALYTICS_VIEW_PLATFORM_METRICS,    // 90010
    PERMISSION_CODES.ANALYTICS_VIEW_VENDOR,              // 90011
    PERMISSION_CODES.ANALYTICS_VIEW_PRODUCT,             // 90012
    PERMISSION_CODES.ANALYTICS_VIEW_SALES_REPORT,        // 90013
    PERMISSION_CODES.ANALYTICS_VIEW_DELIVERY,            // 90014
    // NO 90015 - SUPERADMIN only
  ],

  VENDOR: [
    PERMISSION_CODES.ANALYTICS_VIEW_PLATFORM_METRICS,    // 90010 (limited)
    PERMISSION_CODES.ANALYTICS_VIEW_VENDOR,              // 90011 (own only)
    PERMISSION_CODES.ANALYTICS_VIEW_PRODUCT,             // 90012 (own only)
  ],

  DELIVERY_MAN: [
    PERMISSION_CODES.ANALYTICS_VIEW_PLATFORM_METRICS,    // 90010 (limited)
    PERMISSION_CODES.ANALYTICS_VIEW_DELIVERY,            // 90014 (own only)
  ],

  SELLER: [
    // NO ANALYTICS PERMISSIONS - EMPTY ARRAY
  ],

  CUSTOMER: [
    // NO ANALYTICS PERMISSIONS - EMPTY ARRAY
  ],
};
```

---

## 3. Section-Based Middleware Authorization

### Location: `packages/shared-middleware/src/analytics-permissions.middleware.ts`

```typescript
import { Express, Request, Response, NextFunction } from 'express';
import { AuthService } from '@services/auth.service';

export async function authorizeAnalyticsSection(
  requiredPermissionCode: number
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get user permissions from auth service
      const authService = new AuthService();
      const userPermissions = await authService.getUserPermissions(userId);

      // Check if user has required permission
      if (!userPermissions.includes(requiredPermissionCode)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          requiredPermission: requiredPermissionCode,
        });
      }

      // Attach permission info to request
      req.analyticsPermission = requiredPermissionCode;
      next();
    } catch (error) {
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
}

// Usage in routes:
router.get(
  '/analytics/section/platform/dashboard',
  authorizeAnalyticsSection(90010),
  platformMetricsController.getDashboard
);

router.get(
  '/analytics/section/executive/profitability',
  authorizeAnalyticsSection(90015),  // SUPERADMIN only
  executiveDashboardController.getProfitability
);
```

---

## 4. Service Layer - Role-Based Filtering

### Location: `services/analytics/vendor-analytics.service.ts`

```typescript
import { PrismaClient } from '@prisma/client';

export class VendorAnalyticsService {
  constructor(private prisma: PrismaClient) {}

  async getVendorDashboard(vendorId: string, userId: string, userRole: string) {
    // AUTHORIZATION: Vendor can only see their own data
    if (userRole === 'VENDOR') {
      const userVendor = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { vendorId: true },
      });

      if (userVendor?.vendorId !== vendorId) {
        throw new ForbiddenError('Cannot view other vendor data');
      }
    }

    // Only SUPERADMIN and ADMIN can view all vendors
    if (userRole !== 'SUPERADMIN' && userRole !== 'ADMIN' && userRole !== 'VENDOR') {
      throw new ForbiddenError('Invalid role for vendor analytics');
    }

    // Get vendor data
    const vendorReport = await this.prisma.vendorReport.findFirst({
      where: {
        vendorId,
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      orderBy: { date: 'desc' },
    });

    // FILTERING: Hide restricted fields based on role
    return this.filterVendorReportByRole(vendorReport, userRole);
  }

  private filterVendorReportByRole(report: any, userRole: string) {
    if (userRole === 'VENDOR') {
      // VENDOR sees supplier price basis ONLY
      return {
        vendorId: report.vendorId,
        date: report.date,
        totalRevenue: report.totalRevenue, // qty × supplierPrice
        totalOrders: report.totalOrders,
        totalItems: report.totalItems,
        averageRating: report.averageRating,
        productViews: report.productViews,
        conversionRate: report.conversionRate,
        supplierPrice: report.supplierPrice,
        // EXCLUDED:
        // retailPrice: report.retailPrice
        // margin: report.margin
        // platformCommission: report.platformCommission
        // platformProfit: report.platformProfit
      };
    }

    if (userRole === 'ADMIN') {
      // ADMIN sees retail basis but not commission
      return {
        vendorId: report.vendorId,
        date: report.date,
        totalRevenue: report.totalRevenue, // retail basis
        vendorRevenue: report.totalRevenue, // supplier basis
        totalOrders: report.totalOrders,
        commission: report.platformCommission,
        supplierPrice: report.supplierPrice,
        retailPrice: report.retailPrice,
        margin: report.margin,
        // EXCLUDED: platformCommission details
      };
    }

    // SUPERADMIN sees everything
    if (userRole === 'SUPERADMIN') {
      return {
        ...report,
        // All fields visible
      };
    }

    throw new ForbiddenError('Invalid role');
  }
}
```

### Location: `services/analytics/product-analytics.service.ts`

```typescript
export class ProductAnalyticsService {
  constructor(private prisma: PrismaClient) {}

  async getProductAnalytics(productId: string, userId: string, userRole: string) {
    // AUTHORIZATION: Vendor can only see their products
    if (userRole === 'VENDOR') {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { vendorId: true },
      });

      const userVendor = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { vendorId: true },
      });

      if (product?.vendorId !== userVendor?.vendorId) {
        throw new ForbiddenError('Cannot view other vendors\' products');
      }
    }

    // Get product analytics
    const analytics = await this.prisma.productDailyMetrics.aggregate({
      where: { productId },
      _sum: { views: true, conversions: true, unitsSold: true },
    });

    return this.filterProductAnalyticsByRole(analytics, userRole);
  }

  private filterProductAnalyticsByRole(analytics: any, userRole: string) {
    if (userRole === 'VENDOR') {
      return {
        views: analytics._sum.views,
        conversions: analytics._sum.conversions,
        conversionRate:
          (analytics._sum.conversions / analytics._sum.views) * 100,
        unitsSold: analytics._sum.unitsSold,
        averageRating: analytics.averageRating,
        reviews: analytics.reviewCount,
        // EXCLUDED: retailPrice, margin, platformProfit
      };
    }

    // ADMIN and SUPERADMIN see all
    return analytics;
  }
}
```

### Location: `services/analytics/delivery-analytics.service.ts`

```typescript
export class DeliveryAnalyticsService {
  constructor(private prisma: PrismaClient) {}

  async getDeliveryPersonMetrics(
    deliveryPersonId: string,
    userId: string,
    userRole: string
  ) {
    // AUTHORIZATION: Delivery person can only see their own metrics
    if (userRole === 'DELIVERY_MAN') {
      if (userId !== deliveryPersonId) {
        throw new ForbiddenError('Cannot view other delivery staff metrics');
      }
    }

    // Get delivery metrics
    const metrics = await this.prisma.deliveryDailyMetrics.findFirst({
      where: { deliveryPersonId },
      orderBy: { date: 'desc' },
    });

    return this.filterDeliveryMetricsByRole(metrics, userRole);
  }

  private filterDeliveryMetricsByRole(metrics: any, userRole: string) {
    if (userRole === 'DELIVERY_MAN') {
      return {
        ordersDelivered: metrics.ordersDelivered,
        averageDeliveryTime: metrics.averageDeliveryTime,
        successRate: metrics.successRate,
        onTimePercentage: metrics.onTimePercentage,
        rating: metrics.rating,
        // EXCLUDED: Other staff performance, financial data
      };
    }

    // ADMIN and SUPERADMIN see all
    return metrics;
  }
}
```

---

## 5. Routes - Applying Permission Middleware

### Location: `routes/analytics.routes.ts`

```typescript
import { Router } from 'express';
import { authorizeAnalyticsSection } from '@middleware/analytics-permissions';
import { platformMetricsController } from '@controllers/analytics/platform-metrics.controller';
import { vendorAnalyticsController } from '@controllers/analytics/vendor-analytics.controller';
import { productAnalyticsController } from '@controllers/analytics/product-analytics.controller';
import { salesReportController } from '@controllers/analytics/sales-report.controller';
import { deliveryAnalyticsController } from '@controllers/analytics/delivery-analytics.controller';
import { executiveDashboardController } from '@controllers/analytics/executive-dashboard.controller';

const router = Router();

// SECTION 1: Platform Metrics (90010)
router.get(
  '/analytics/section/platform/dashboard',
  authorizeAnalyticsSection(90010),
  platformMetricsController.getDashboard
);

router.get(
  '/analytics/section/platform/orders/trend',
  authorizeAnalyticsSection(90010),
  platformMetricsController.getOrdersTrend
);

// SECTION 2: Vendor Analytics (90011)
router.get(
  '/analytics/section/vendor/dashboard',
  authorizeAnalyticsSection(90011),
  vendorAnalyticsController.getDashboard
);

router.get(
  '/analytics/section/vendor/:vendorId/dashboard',
  authorizeAnalyticsSection(90011),
  vendorAnalyticsController.getVendorDashboard
);

router.get(
  '/analytics/section/vendor/:vendorId/products',
  authorizeAnalyticsSection(90011),
  vendorAnalyticsController.getVendorProducts
);

// SECTION 3: Product Analytics (90012)
router.get(
  '/analytics/section/product/:productId/metrics',
  authorizeAnalyticsSection(90012),
  productAnalyticsController.getProductMetrics
);

router.get(
  '/analytics/section/product/:productId/views-conversions',
  authorizeAnalyticsSection(90012),
  productAnalyticsController.getViewsAndConversions
);

// SECTION 4: Sales Report (90013)
router.get(
  '/analytics/section/sales/daily',
  authorizeAnalyticsSection(90013),
  salesReportController.getDailySalesReport
);

router.get(
  '/analytics/section/sales/by-category',
  authorizeAnalyticsSection(90013),
  salesReportController.getSalesByCategory
);

// SECTION 5: Delivery Analytics (90014)
router.get(
  '/analytics/section/delivery/daily',
  authorizeAnalyticsSection(90014),
  deliveryAnalyticsController.getDailyMetrics
);

router.get(
  '/analytics/section/delivery/persons/:personId/performance',
  authorizeAnalyticsSection(90014),
  deliveryAnalyticsController.getPersonPerformance
);

// SECTION 6: Executive Dashboard (90015) - SUPERADMIN ONLY
router.get(
  '/analytics/section/executive/profitability',
  authorizeAnalyticsSection(90015),
  executiveDashboardController.getProfitability
);

router.get(
  '/analytics/section/executive/commissions',
  authorizeAnalyticsSection(90015),
  executiveDashboardController.getCommissions
);

router.get(
  '/analytics/section/executive/margins',
  authorizeAnalyticsSection(90015),
  executiveDashboardController.getMargins
);

export default router;
```

---

## 6. Database Queries - Vendor Revenue Calculation

### Location: `services/analytics/vendor-report.generator.ts`

```typescript
export class VendorReportGenerator {
  constructor(private prisma: PrismaClient) {}

  async generateVendorReport(vendorId: string, date: Date) {
    // CRITICAL: Revenue based on SUPPLIER PRICE, not retail price
    const report = await this.prisma.vendorReport.create({
      data: {
        vendorId,
        date,
        
        // Calculate revenue using SUPPLIER PRICE
        totalRevenue: await this.calculateVendorRevenue(vendorId, date),
        
        // Store related metrics
        totalOrders: await this.countVendorOrders(vendorId, date),
        totalItems: await this.countVendorItems(vendorId, date),
        
        // Customer engagement
        averageRating: await this.getVendorRating(vendorId),
        productViews: await this.sumProductViews(vendorId, date),
        conversionRate: await this.calculateConversionRate(vendorId, date),
        
        // Pricing data
        supplierPrice: await this.getAverageSupplierPrice(vendorId),
        retailPrice: await this.getAverageRetailPrice(vendorId),
        margin: await this.calculateMargin(vendorId),
        
        // Commission (for SUPERADMIN)
        platformCommission: await this.calculateCommission(vendorId, date),
      },
    });

    return report;
  }

  private async calculateVendorRevenue(vendorId: string, date: Date): Promise<number> {
    // CRITICAL: Use supplier price, NOT retail price
    const result = await this.prisma.$queryRaw<[{ total: BigInt }]>`
      SELECT SUM(oi.quantity * p."supplierPrice") as total
      FROM order_items oi
      JOIN products p ON oi."productId" = p.id
      JOIN orders o ON oi."orderId" = o.id
      WHERE p."vendorId" = ${vendorId}
        AND o.status IN ('COMPLETED', 'DELIVERED')
        AND DATE(o."createdAt") = ${date}
    `;

    return Number(result[0]?.total || 0);
  }

  private async calculateCommission(vendorId: string, date: Date): Promise<number> {
    // Calculate platform commission for SUPERADMIN view
    const result = await this.prisma.$queryRaw<[{ commission: number }]>`
      SELECT SUM((oi.quantity * p.price) * (ps."commissionRate" / 100)) as commission
      FROM order_items oi
      JOIN products p ON oi."productId" = p.id
      JOIN platform_settings ps ON true
      WHERE p."vendorId" = ${vendorId}
        AND DATE(oi."createdAt") = ${date}
    `;

    return result[0]?.commission || 0;
  }
}
```

---

## 7. Frontend - Permission Checks Before API Calls

### Location: `services/analytics-api.service.ts`

```typescript
export class AnalyticsApiService {
  async getPlatformMetrics(): Promise<void> {
    // Check permission before calling API
    const hasPermission = await this.checkPermission(90010);
    if (!hasPermission) {
      throw new Error('No permission to access platform metrics');
    }

    return await fetch('/analytics/section/platform/dashboard').then(
      (r) => r.json()
    );
  }

  async getVendorAnalytics(vendorId: string): Promise<void> {
    const hasPermission = await this.checkPermission(90011);
    if (!hasPermission) {
      throw new Error('No permission to access vendor analytics');
    }

    return await fetch(`/analytics/section/vendor/${vendorId}/dashboard`).then(
      (r) => r.json()
    );
  }

  async getExecutiveDashboard(): Promise<void> {
    const hasPermission = await this.checkPermission(90015);
    if (!hasPermission) {
      throw new Error('SUPERADMIN access required');
    }

    return await fetch('/analytics/section/executive/profitability').then(
      (r) => r.json()
    );
  }

  private async checkPermission(permissionCode: number): Promise<boolean> {
    const user = await this.authService.getCurrentUser();
    return user.permissions.includes(permissionCode);
  }
}
```

---

## 8. Database Schema - Organized by Section

```sql
-- Create analytics sections reference
CREATE TABLE analytics_section (
  id SERIAL PRIMARY KEY,
  code INT UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

INSERT INTO analytics_section (code, name, description) VALUES
  (90010, 'PLATFORM_METRICS', 'Platform-wide metrics'),
  (90011, 'VENDOR_ANALYTICS', 'Vendor-specific analytics'),
  (90012, 'PRODUCT_ANALYTICS', 'Product-level analytics'),
  (90013, 'SALES_REPORT', 'Sales reports and trends'),
  (90014, 'DELIVERY_ANALYTICS', 'Delivery performance'),
  (90015, 'EXECUTIVE_DASHBOARD', 'Executive financial dashboard');

-- SECTION 2: Vendor Analytics data
CREATE TABLE vendor_report (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  date DATE NOT NULL,
  quantity_sold INT NOT NULL DEFAULT 0,
  supplier_price DECIMAL(12, 2) NOT NULL,
  total_revenue DECIMAL(14, 2) NOT NULL,
  retail_price DECIMAL(12, 2),
  margin DECIMAL(12, 2),
  platform_commission DECIMAL(12, 2),
  average_rating DECIMAL(3, 2),
  product_views INT DEFAULT 0,
  conversion_rate DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (vendor_id) REFERENCES vendors(id),
  CONSTRAINT vendor_report_unique UNIQUE(vendor_id, date),
  INDEX idx_vendor_date (vendor_id, date)
);

-- SECTION 5: Delivery Analytics data
CREATE TABLE delivery_daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_person_id UUID NOT NULL,
  date DATE NOT NULL,
  orders_delivered INT DEFAULT 0,
  average_delivery_time INT,
  success_rate DECIMAL(5, 2),
  on_time_percentage DECIMAL(5, 2),
  rating DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (delivery_person_id) REFERENCES users(id),
  INDEX idx_delivery_date (delivery_person_id, date)
);

-- Performance indexes
CREATE INDEX idx_vendor_report_date ON vendor_report(date);
CREATE INDEX idx_vendor_report_vendor ON vendor_report(vendor_id);
CREATE INDEX idx_delivery_metrics_date ON delivery_daily_metrics(date);
```

---

## ✅ Implementation Checklist

### Phase 1: Backend Setup
- [ ] Define permission codes 90010-90015
- [ ] Update role permission mappings
- [ ] Create `authorizeAnalyticsSection` middleware
- [ ] Create service layer with filtering logic
- [ ] Update routes with permission middleware
- [ ] Update database schema with indexes

### Phase 2: Service Implementation
- [ ] Implement `VendorAnalyticsService` with vendor filtering
- [ ] Implement `ProductAnalyticsService` with vendor filtering
- [ ] Implement `DeliveryAnalyticsService` with person filtering
- [ ] Add supplier price revenue calculation
- [ ] Add field filtering by role
- [ ] Add response formatting

### Phase 3: Testing
- [ ] Test VENDOR sees only their data
- [ ] Test VENDOR revenue is supplier price based
- [ ] Test retail price hidden from VENDOR
- [ ] Test DELIVERY_MAN sees only their metrics
- [ ] Test SELLER has NO access (403)
- [ ] Test ADMIN/SUPERADMIN can access their sections
- [ ] Test permission denied for missing permissions

### Phase 4: Deployment
- [ ] Deploy permission codes to production
- [ ] Enable permission checks in middleware
- [ ] Monitor analytics access logs
- [ ] Verify role-based filtering working correctly
