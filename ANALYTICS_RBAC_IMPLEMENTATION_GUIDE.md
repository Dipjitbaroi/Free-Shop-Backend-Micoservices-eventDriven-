# Analytics Role-Based Access Control - Implementation Guide

## Overview

This guide provides code examples and implementation patterns for enforcing role-based analytics access in the Free-Shop backend.

---

## 1. Permission Codes Definition

### Location: `packages/shared-types/src/permission-codes.ts`

```typescript
export const PERMISSION_CODES = {
  // ... existing codes ...
  
  // Analytics permissions (90xx series)
  ANALYTICS_CREATE: 90001,         // Can create analytics records (internal/service-to-service)
  ANALYTICS_READ: 90002,           // Can read analytics for their role
  ANALYTICS_DELETE: 90003,         // Can delete analytics records (ADMIN only)
  ANALYTICS_ADMIN: 90004,          // Full analytics admin access (SUPERADMIN only)
  
  // Analytics specific codes for different views
  ANALYTICS_VIEW_DASHBOARD: 90010,      // View platform dashboard
  ANALYTICS_VIEW_VENDORS: 90011,        // View vendor analytics
  ANALYTICS_VIEW_PRODUCTS: 90012,       // View product analytics
  ANALYTICS_VIEW_CUSTOMERS: 90013,      // View customer analytics
  ANALYTICS_VIEW_FINANCIAL: 90014,      // View financial metrics
  ANALYTICS_VIEW_SYSTEM: 90015,         // View system metrics
} as const;
```

---

## 2. Role-Based Permission Mapping

### Location: `packages/shared-types/src/rbac-defaults.ts`

```typescript
export const DEFAULT_ROLE_PERMISSIONS = {
  SUPERADMIN: [
    // ... existing permissions ...
    PERMISSION_CODES.ANALYTICS_ADMIN,
    PERMISSION_CODES.ANALYTICS_CREATE,
    PERMISSION_CODES.ANALYTICS_READ,
    PERMISSION_CODES.ANALYTICS_DELETE,
    PERMISSION_CODES.ANALYTICS_VIEW_DASHBOARD,
    PERMISSION_CODES.ANALYTICS_VIEW_VENDORS,
    PERMISSION_CODES.ANALYTICS_VIEW_PRODUCTS,
    PERMISSION_CODES.ANALYTICS_VIEW_CUSTOMERS,
    PERMISSION_CODES.ANALYTICS_VIEW_FINANCIAL,
    PERMISSION_CODES.ANALYTICS_VIEW_SYSTEM,
  ],
  
  ADMIN: [
    // ... existing permissions ...
    PERMISSION_CODES.ANALYTICS_READ,
    PERMISSION_CODES.ANALYTICS_VIEW_DASHBOARD,
    PERMISSION_CODES.ANALYTICS_VIEW_VENDORS,
    PERMISSION_CODES.ANALYTICS_VIEW_PRODUCTS,
    // Not: ANALYTICS_VIEW_FINANCIAL (no commission details)
  ],
  
  SELLER: [
    // ... existing permissions ...
    PERMISSION_CODES.ANALYTICS_READ,
    PERMISSION_CODES.ANALYTICS_VIEW_DASHBOARD,
    PERMISSION_CODES.ANALYTICS_VIEW_VENDORS,
    PERMISSION_CODES.ANALYTICS_VIEW_PRODUCTS,
    // Seller is employee: can see all vendors' data, but not commission details
  ],
  
  VENDOR: [
    // ... existing permissions ...
    PERMISSION_CODES.ANALYTICS_READ,
    PERMISSION_CODES.ANALYTICS_CREATE,
    // They only see their own data through endpoint filtering
  ],
  
  DELIVERY_MAN: [
    // ... existing permissions ...
    PERMISSION_CODES.ANALYTICS_READ,
    PERMISSION_CODES.ANALYTICS_CREATE,
    // They only see delivery-related metrics
  ],
  
  CUSTOMER: [
    // ... existing permissions ...
    // NO ANALYTICS ACCESS - customers do not have analytics
  ],
};
```

---

## 3. Analytics Authorization Middleware

### Location: `packages/shared-middleware/src/analytics.middleware.ts` (NEW FILE)

```typescript
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '@freeshop/shared-utils';
import { PERMISSION_CODES } from '@freeshop/shared-types';
import axios from 'axios';

/**
 * Verify user has analytics read permission
 */
export const authorizeAnalyticsRead = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedError('Authentication required');
    }

    const permissionCodes: number[] = req.user?.permissionCodes || [];
    
    if (!permissionCodes.includes(PERMISSION_CODES.ANALYTICS_READ)) {
      throw new ForbiddenError('You do not have permission to access analytics');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verify user has admin-level analytics access
 */
export const authorizeAnalyticsAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedError('Authentication required');
    }

    const permissionCodes: number[] = req.user?.permissionCodes || [];
    const hasAdminAccess = 
      permissionCodes.includes(PERMISSION_CODES.ANALYTICS_ADMIN) ||
      permissionCodes.includes(PERMISSION_CODES.ADMIN_PANEL_ACCESS);

    if (!hasAdminAccess) {
      throw new ForbiddenError('Admin access required for analytics');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Enforce that vendor/seller only sees their own analytics
 * Also attach vendorId to request for use in service layer
 */
export const enforceVendorAnalyticsOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedError('Authentication required');
    }

    const userId = req.user.id;
    const requestedVendorId = req.params.vendorId || req.query.vendorId;
    const permissionCodes: number[] = req.user?.permissionCodes || [];

    // ADMIN and SUPERADMIN can view any vendor
    const hasAdminAccess = 
      permissionCodes.includes(PERMISSION_CODES.ANALYTICS_ADMIN) ||
      permissionCodes.includes(PERMISSION_CODES.ADMIN_PANEL_ACCESS);
    
    if (hasAdminAccess) {
      next();
      return;
    }

    // For VENDOR/SELLER, fetch their vendor ID and verify it matches
    try {
      const token = (req.headers.authorization || '').replace('Bearer ', '');
      const userResponse = await axios.get(
        `${process.env.USER_SERVICE_URL || 'http://user-service:3002'}/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userVendorId = userResponse.data?.vendorId;

      if (!userVendorId) {
        throw new ForbiddenError('User is not a vendor');
      }

      // Verify vendor IDs match
      if (requestedVendorId && userVendorId !== requestedVendorId) {
        throw new ForbiddenError('Cannot access other vendors\' analytics');
      }

      // Attach vendor ID to request for service layer
      (req as any).vendorId = userVendorId;
      (req as any).isVendor = true;

      next();
    } catch (error) {
      if (error instanceof ForbiddenError) throw error;
      throw new ForbiddenError('Unable to verify vendor ownership');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Attach user's role info to request for filtering
 */
export const attachUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      next();
      return;
    }

    const userRoles = req.user?.roles || [];
    
    (req as any).userRole = userRoles[0] || 'CUSTOMER'; // Attach primary role
    (req as any).userRoles = userRoles;

    next();
  } catch (error) {
    next(error);
  }
};
```

---

## 4. Analytics Service with Role-Based Filtering

### Location: `services/analytics-service/src/services/analytics.service.ts`

```typescript
import { prisma } from '../lib/prisma.js';
import { redis, CACHE_TTL } from '../lib/redis.js';
import { createServiceLogger } from '@freeshop/shared-utils';

const logger = createServiceLogger('analytics-service');

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface AnalyticsContext {
  userRole?: string;
  userId?: string;
  vendorId?: string;
  isVendor?: boolean;
  permissionCodes?: number[];
}

class AnalyticsService {
  /**
   * Get vendor report with role-based filtering
   * VENDOR: Only own data, based on supplier price
   * ADMIN: Own vendor data or others, but no commission details
   * SUPERADMIN: All data including commissions
   */
  async getVendorReport(
    vendorId: string,
    dateRange: DateRange,
    context: AnalyticsContext
  ) {
    // Authorization check
    this.validateVendorAccess(vendorId, context);

    const cacheKey = `vendor-report:${vendorId}:${dateRange.startDate.getTime()}:${dateRange.endDate.getTime()}`;
    
    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return this.filterVendorReportByRole(JSON.parse(cached), context);
    }

    // Fetch vendor report
    const reports = await prisma.vendorReport.findMany({
      where: {
        vendorId: vendorId,
        date: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    // Fetch summary
    const summary = await prisma.vendorReport.aggregate({
      where: {
        vendorId: vendorId,
        date: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      _sum: {
        totalRevenue: true,      // This is supplier price basis
        totalOrders: true,
        totalItems: true,
        productViews: true,
        newReviews: true,
        commission: true,        // Only for SUPERADMIN
      },
      _avg: {
        conversionRate: true,
        averageRating: true,
      },
    });

    const data = { reports, summary };

    // Cache the result
    await redis.setex(cacheKey, CACHE_TTL.VENDOR_REPORT, JSON.stringify(data));

    // Filter based on role
    return this.filterVendorReportByRole(data, context);
  }

  /**
   * Filter vendor report response based on user role
   */
  private filterVendorReportByRole(data: any, context: AnalyticsContext) {
    const { userRole, permissionCodes } = context;

    // SUPERADMIN gets everything
    const isSuperAdmin = permissionCodes?.includes(90004); // ANALYTICS_ADMIN
    if (isSuperAdmin) {
      return data;
    }

    // ADMIN gets no commission details
    if (userRole === 'ADMIN' || userRole === 'SUPERADMIN') {
      return {
        reports: data.reports.map((report: any) => this.filterReportFields(report, false)),
        summary: this.filterSummaryFields(data.summary, false),
      };
    }

    // VENDOR gets only their own data (already checked in validateVendorAccess)
    // Remove commission fields
    return {
      reports: data.reports.map((report: any) => this.filterReportFields(report, true)),
      summary: this.filterSummaryFields(data.summary, true),
    };
  }

  /**
   * Remove sensitive fields based on role
   */
  private filterReportFields(report: any, isVendor: boolean) {
    if (isVendor) {
      // VENDOR: Remove commission and net revenue
      const { commission, netRevenue, ...filtered } = report;
      return filtered;
    }

    // ADMIN: Keep all but commission calculation details
    return report;
  }

  /**
   * Remove sensitive summary fields
   */
  private filterSummaryFields(summary: any, isVendor: boolean) {
    if (isVendor) {
      // VENDOR: Keep basic totals, remove commission
      const {
        _sum: { commission, ...sumFiltered },
        ...rest
      } = summary;
      return {
        ...rest,
        _sum: sumFiltered,
      };
    }

    return summary;
  }

  /**
   * Get product analytics with role-based filtering
   */
  async getProductAnalytics(
    productId: string,
    dateRange: DateRange,
    context: AnalyticsContext
  ) {
    // Get product vendor ID first
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { vendorId: true },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Check if vendor can access this product's analytics
    if (context.isVendor && product.vendorId !== context.vendorId) {
      throw new Error('Cannot access other vendors\' product analytics');
    }

    const analytics = await prisma.productAnalytics.findMany({
      where: {
        productId,
        date: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    // Filter response based on role
    return this.filterProductAnalyticsByRole(analytics, context);
  }

  /**
   * Filter product analytics to hide pricing from vendors
   * Vendors should NOT see: price, discountPrice, flashSalePrice, platformMargin
   */
  private filterProductAnalyticsByRole(analytics: any[], context: AnalyticsContext) {
    const { userRole, isVendor } = context;

    if (isVendor) {
      // VENDOR: Remove retail pricing information
      return analytics.map((item) => {
        const filtered = { ...item };
        // These fields should never be in analytics for vendor
        delete filtered.retailPrice;
        delete filtered.platformMargin;
        delete filtered.customerPrice;
        delete filtered.discountPrice;
        delete filtered.flashSalePrice;
        return filtered;
      });
    }

    // ADMIN and SUPERADMIN: Keep all fields
    return analytics;
  }

  /**
   * Get dashboard metrics - role specific
   */
  async getDashboardMetrics(dateRange: DateRange, context: AnalyticsContext) {
    const { userRole, isVendor, vendorId } = context;

    if (isVendor && vendorId) {
      // VENDOR: Personal dashboard based on their products
      return this.getVendorDashboard(vendorId, dateRange);
    }

    if (userRole === 'DELIVERY_MAN') {
      // DELIVERY_MAN: Delivery-specific metrics
      return this.getDeliveryDashboard(context.userId!, dateRange);
    }

    if (userRole === 'CUSTOMER') {
      // CUSTOMER: Their order summary
      return this.getCustomerDashboard(context.userId!, dateRange);
    }

    // ADMIN/SUPERADMIN: Platform-wide dashboard
    return this.getAdminDashboard(dateRange, context);
  }

  /**
   * Vendor dashboard - based on supplier price
   */
  private async getVendorDashboard(vendorId: string, dateRange: DateRange) {
    const summary = await prisma.vendorReport.aggregate({
      where: {
        vendorId,
        date: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      _sum: {
        totalRevenue: true,        // Supplier price basis
        totalOrders: true,
        totalItems: true,
        productViews: true,
      },
      _avg: {
        conversionRate: true,
        averageRating: true,
      },
    });

    return {
      totalRevenue: summary._sum?.totalRevenue || 0,  // Supplier price basis
      totalOrders: summary._sum?.totalOrders || 0,
      totalItems: summary._sum?.totalItems || 0,
      productViews: summary._sum?.productViews || 0,
      averageConversionRate: summary._avg?.conversionRate || 0,
      averageRating: summary._avg?.averageRating || 0,
      message: 'Revenue based on your supplier price, not retail price',
    };
  }

  /**
   * Admin dashboard - platform wide but no commissions
   */
  private async getAdminDashboard(
    dateRange: DateRange,
    context: AnalyticsContext
  ) {
    const summary = await prisma.dailySalesReport.aggregate({
      where: {
        date: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      _sum: {
        totalRevenue: true,
        totalOrders: true,
        newCustomers: true,
      },
      _avg: {
        averageOrderValue: true,
      },
    });

    // ADMIN doesn't see commission details
    const isSuperAdmin = context.permissionCodes?.includes(90004);

    return {
      totalRevenue: summary._sum?.totalRevenue || 0,
      totalOrders: summary._sum?.totalOrders || 0,
      newCustomers: summary._sum?.newCustomers || 0,
      averageOrderValue: summary._avg?.averageOrderValue || 0,
      ...(isSuperAdmin && { commissionDetails: 'Available to SUPERADMIN' }),
    };
  }

  /**
   * Delivery person dashboard
   */
  private async getDeliveryDashboard(userId: string, dateRange: DateRange) {
    // Query delivery metrics for this user
    // Implementation depends on delivery data model
    return {
      deliveriesCompleted: 0,
      averageDeliveryTime: 0,
      onTimeRate: 0,
      customerRating: 0,
    };
  }

  /**
   * Customer dashboard
   */
  private async getCustomerDashboard(userId: string, dateRange: DateRange) {
    // Query customer's own orders
    const orders = await prisma.order.findMany({
      where: {
        userId,
        createdAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      select: {
        totalPrice: true,
        status: true,
      },
    });

    const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    return {
      totalOrdersPlaced: orders.length,
      totalSpent: totalSpent,
      averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0,
    };
  }

  /**
   * Validate if user can access vendor analytics
   */
  private validateVendorAccess(vendorId: string, context: AnalyticsContext) {
    const permissionCodes = context.permissionCodes || [];
    const isAdmin =
      permissionCodes.includes(90004) || // ANALYTICS_ADMIN
      permissionCodes.includes(91100);   // ADMIN_PANEL_ACCESS

    if (context.isVendor) {
      // VENDOR can only see their own data
      if (context.vendorId !== vendorId) {
        throw new Error('Cannot access other vendors\' analytics');
      }
      return;
    }

    if (!isAdmin) {
      throw new Error('Insufficient permissions to access vendor analytics');
    }
  }
}

export const analyticsService = new AnalyticsService();
```

---

## 5. Updated Analytics Routes

### Location: `services/analytics-service/src/routes/analytics.routes.ts`

```typescript
import { Router } from 'express';
import { query, param } from 'express-validator';
import {
  authenticate,
  validate,
  authorizePermission,
  optionalAuth,
} from '@freeshop/shared-middleware';
import {
  authorizeAnalyticsRead,
  authorizeAnalyticsAdmin,
  enforceVendorAnalyticsOwnership,
  attachUserRole,
} from '../middleware/analytics.middleware.js';
import { analyticsController } from '../controllers/analytics.controller.js';
import { PERMISSION_CODES } from '@freeshop/shared-types';

const router: Router = Router();

// Apply auth and role attachment to all routes
router.use(optionalAuth);
router.use(attachUserRole);

// Dashboard - different logic based on role
router.get(
  '/dashboard',
  authenticate,
  authorizeAnalyticsRead,
  [
    query('startDate').optional().isISO8601().toDate(),
    query('endDate').optional().isISO8601().toDate(),
  ],
  validate,
  analyticsController.getDashboard
);

// Sales report - ADMIN/SUPERADMIN only
router.get(
  '/sales-report',
  authenticate,
  authorizeAnalyticsAdmin,
  [
    query('startDate').optional().isISO8601().toDate(),
    query('endDate').optional().isISO8601().toDate(),
  ],
  validate,
  analyticsController.getSalesReport
);

// Vendor analytics - vendor sees own, admin sees all
router.get(
  '/vendors/me/report',
  authenticate,
  authorizeAnalyticsRead,
  [
    query('startDate').optional().isISO8601().toDate(),
    query('endDate').optional().isISO8601().toDate(),
  ],
  validate,
  analyticsController.getMyVendorReport  // Vendor's own
);

router.get(
  '/vendors/:vendorId/report',
  authenticate,
  authorizeAnalyticsRead,
  enforceVendorAnalyticsOwnership,
  [
    param('vendorId').isUUID(),
    query('startDate').optional().isISO8601().toDate(),
    query('endDate').optional().isISO8601().toDate(),
  ],
  validate,
  analyticsController.getVendorReport
);

// Product analytics - vendor sees own products, admin sees all
router.get(
  '/products/:productId/analytics',
  authenticate,
  authorizeAnalyticsRead,
  [
    param('productId').isUUID(),
    query('startDate').optional().isISO8601().toDate(),
    query('endDate').optional().isISO8601().toDate(),
  ],
  validate,
  analyticsController.getProductAnalytics
);

// Top vendors - ADMIN/SUPERADMIN only
router.get(
  '/top-vendors',
  authenticate,
  authorizeAnalyticsAdmin,
  [query('limit').optional().isInt({ min: 1, max: 100 }).toInt()],
  validate,
  analyticsController.getTopVendors
);

// Top products - ADMIN/SUPERADMIN only
router.get(
  '/top-products',
  authenticate,
  authorizeAnalyticsAdmin,
  [query('limit').optional().isInt({ min: 1, max: 100 }).toInt()],
  validate,
  analyticsController.getTopProducts
);

// Customer analytics - ADMIN/SUPERADMIN only
router.get(
  '/customers',
  authenticate,
  authorizeAnalyticsAdmin,
  [
    query('startDate').optional().isISO8601().toDate(),
    query('endDate').optional().isISO8601().toDate(),
  ],
  validate,
  analyticsController.getUserAnalytics
);

// Event tracking - all authenticated users can track
router.post(
  '/events/track',
  authenticate,
  authorizePermission(PERMISSION_CODES.ANALYTICS_CREATE),
  analyticsController.trackEvent
);

export default router;
```

---

## 6. Updated Analytics Controller

### Location: `services/analytics-service/src/controllers/analytics.controller.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service.js';
import { ApiResponse } from '@freeshop/shared-types';

const parseDateRange = (req: Request) => {
  const endDate = req.query.endDate
    ? new Date(req.query.endDate as string)
    : new Date();
  const startDate = req.query.startDate
    ? new Date(req.query.startDate as string)
    : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  return { startDate, endDate };
};

/**
 * Build analytics context from request
 */
const buildAnalyticsContext = (req: any) => ({
  userRole: req.userRole,
  userId: req.user?.id,
  vendorId: req.vendorId,
  isVendor: req.isVendor || false,
  permissionCodes: req.user?.permissionCodes || [],
});

export const analyticsController = {
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const context = buildAnalyticsContext(req);
      const metrics = await analyticsService.getDashboardMetrics(dateRange, context);

      res.json({
        success: true,
        data: metrics,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getSalesReport(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const report = await analyticsService.getSalesReport(dateRange);

      res.json({
        success: true,
        data: report,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getVendorReport(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const context = buildAnalyticsContext(req);
      const report = await analyticsService.getVendorReport(
        req.params.vendorId as string,
        dateRange,
        context
      );

      res.json({
        success: true,
        data: report,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getMyVendorReport(req: Request, res: Response, next: NextFunction) {
    try {
      const context = buildAnalyticsContext(req);

      if (!context.vendorId) {
        return res.status(403).json({
          success: false,
          error: 'User is not a vendor',
        });
      }

      const dateRange = parseDateRange(req);
      const report = await analyticsService.getVendorReport(
        context.vendorId,
        dateRange,
        context
      );

      res.json({
        success: true,
        data: report,
        note: 'Revenue is calculated based on your supplier price, not the selling price',
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getProductAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRange = parseDateRange(req);
      const context = buildAnalyticsContext(req);
      const analytics = await analyticsService.getProductAnalytics(
        req.params.productId as string,
        dateRange,
        context
      );

      res.json({
        success: true,
        data: analytics,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // ... rest of controller methods
};
```

---

## 7. Key Implementation Points

### Authorization Layers

```
Route -> Middleware (auth + role check) -> Controller -> Service -> Database
                    ↓
            (enforce access rules)
                    ↓
            Filter response by role
```

### Vendor Revenue Calculation

Always use SUPPLIER PRICE:
```typescript
// CORRECT for vendors
vendorRevenue = SUM(quantity × supplierPrice)

// WRONG for vendors
vendorRevenue = SUM(quantity × price)  // price is retail selling price
```

### Data Flow for Vendor Analytics Request

```
1. Request: GET /analytics/vendors/me/report
2. Middleware: Check ANALYTICS_READ permission ✅
3. Middleware: Attach user's vendorId ✅
4. Controller: Build context with role info
5. Service: Query VendorReport for vendorId
6. Service: Calculate revenue from supplier price
7. Service: Filter commission fields
8. Response: Return vendor-safe analytics data
```

---

## 8. Testing Checklist

```typescript
// Test: VENDOR cannot see other vendors' analytics
it('should deny vendor access to other vendor analytics', async () => {
  const res = await request(app)
    .get('/analytics/vendors/other-vendor-id/report')
    .set('Authorization', `Bearer ${vendorToken}`);
  
  expect(res.status).toBe(403);
  expect(res.body.error).toContain('Cannot access other vendors');
});

// Test: VENDOR sees supplier price revenue, not retail
it('should show vendor revenue based on supplier price', async () => {
  const res = await request(app)
    .get('/analytics/vendors/me/report')
    .set('Authorization', `Bearer ${vendorToken}`);
  
  expect(res.status).toBe(200);
  expect(res.body.data.summary._sum.totalRevenue).toBe(50000); // supplier price * qty
  expect(res.body.data).not.toHaveProperty('platformMargin');
});

// Test: ADMIN cannot see commission details
it('should not show commission to admin', async () => {
  const res = await request(app)
    .get('/analytics/vendors/some-id/report')
    .set('Authorization', `Bearer ${adminToken}`);
  
  expect(res.status).toBe(200);
  expect(res.body.data.summary._sum).not.toHaveProperty('commission');
});

// Test: SUPERADMIN can see everything
it('should show all details to superadmin', async () => {
  const res = await request(app)
    .get('/analytics/vendors/some-id/report')
    .set('Authorization', `Bearer ${superadminToken}`);
  
  expect(res.status).toBe(200);
  expect(res.body.data.summary._sum).toHaveProperty('commission');
  expect(res.body.data.summary._sum).toHaveProperty('totalRevenue');
});
```

---

## 9. Deployment Checklist

- [ ] Update permission codes in auth-service
- [ ] Deploy updated analytics middleware
- [ ] Deploy updated analytics service with filtering logic
- [ ] Update analytics routes with new endpoints
- [ ] Run database migrations if schema changes
- [ ] Test all role combinations
- [ ] Monitor analytics API for unauthorized access attempts
- [ ] Update API documentation with role-based notes
- [ ] Train admin team on analytics role differences
