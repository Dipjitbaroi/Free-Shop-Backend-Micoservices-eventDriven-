import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, validate } from '@freeshop/shared-middleware';
import { authorizeAnalyticsSection, ANALYTICS_PERMISSIONS } from '../middleware/analytics-auth.middleware.js';

// Import new section-based controllers
import { platformMetricsController } from '../controllers/platform-metrics.controller.js';
import { vendorAnalyticsController } from '../controllers/vendor-analytics.controller.js';
import { productAnalyticsController } from '../controllers/product-analytics.controller.js';
import { salesReportController } from '../controllers/sales-report.controller.js';
import { deliveryAnalyticsController, executiveDashboardController } from '../controllers/executive-dashboard.controller.js';

// Import old controller for event tracking (keep only /events and /search endpoints)
import { analyticsController } from '../controllers/analytics.controller.js';

const router: Router = Router();

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 1: PLATFORM METRICS (90010)
// ═════════════════════════════════════════════════════════════════════════════

router.get(
  '/section/platform/dashboard',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.PLATFORM_METRICS),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  platformMetricsController.getDashboard
);

router.get(
  '/section/platform/orders/trend',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.PLATFORM_METRICS),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  platformMetricsController.getOrdersTrend
);

router.get(
  '/section/platform/payment-methods',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.PLATFORM_METRICS),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  platformMetricsController.getPaymentMethodDistribution
);

router.get(
  '/section/platform/regions',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.PLATFORM_METRICS),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  platformMetricsController.getRegionalBreakdown
);

router.get(
  '/section/platform/top-products',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.PLATFORM_METRICS),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  platformMetricsController.getTopProducts
);

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 2: VENDOR ANALYTICS (90011)
// ═════════════════════════════════════════════════════════════════════════════

router.get(
  '/section/vendor/dashboard',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.VENDOR_ANALYTICS),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  vendorAnalyticsController.getDashboard
);

router.get(
  '/section/vendor/:vendorId/dashboard',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.VENDOR_ANALYTICS),
  [
    param('vendorId').isUUID(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  vendorAnalyticsController.getVendorDashboard
);

router.get(
  '/section/vendor/:vendorId/products',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.VENDOR_ANALYTICS),
  [
    param('vendorId').isUUID(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  vendorAnalyticsController.getVendorProducts
);

router.get(
  '/section/vendor/:vendorId/revenue/trend',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.VENDOR_ANALYTICS),
  [
    param('vendorId').isUUID(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  vendorAnalyticsController.getRevenueTrend
);

router.get(
  '/section/vendor/:vendorId/ratings',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.VENDOR_ANALYTICS),
  [
    param('vendorId').isUUID(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  vendorAnalyticsController.getVendorRatings
);

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 3: PRODUCT ANALYTICS (90012)
// ═════════════════════════════════════════════════════════════════════════════

router.get(
  '/section/product/list',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.PRODUCT_ANALYTICS),
  [
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
  ],
  validate,
  productAnalyticsController.listProducts
);

router.get(
  '/section/product/:productId/metrics',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.PRODUCT_ANALYTICS),
  [
    param('productId').isUUID(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  productAnalyticsController.getProductMetrics
);

router.get(
  '/section/product/:productId/views-conversions',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.PRODUCT_ANALYTICS),
  [
    param('productId').isUUID(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  productAnalyticsController.getViewsAndConversions
);

router.get(
  '/section/product/:productId/inventory',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.PRODUCT_ANALYTICS),
  [param('productId').isUUID()],
  validate,
  productAnalyticsController.getInventory
);

router.get(
  '/section/product/:productId/returns',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.PRODUCT_ANALYTICS),
  [
    param('productId').isUUID(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  productAnalyticsController.getReturns
);

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 4: SALES REPORT (90013) - ADMIN/SUPERADMIN ONLY
// ═════════════════════════════════════════════════════════════════════════════

router.get(
  '/section/sales/daily',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.SALES_REPORT),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  salesReportController.getDailySalesReport
);

router.get(
  '/section/sales/monthly',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.SALES_REPORT),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  salesReportController.getMonthlySalesReport
);

router.get(
  '/section/sales/by-category',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.SALES_REPORT),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  salesReportController.getSalesByCategory
);

router.get(
  '/section/sales/by-payment-method',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.SALES_REPORT),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  salesReportController.getSalesByPaymentMethod
);

router.get(
  '/section/sales/top-vendors',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.SALES_REPORT),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  salesReportController.getTopVendors
);

router.get(
  '/section/sales/growth',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.SALES_REPORT),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  salesReportController.getSalesGrowth
);

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 5: DELIVERY ANALYTICS (90014)
// ═════════════════════════════════════════════════════════════════════════════

router.get(
  '/section/delivery/daily',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.DELIVERY_ANALYTICS),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  deliveryAnalyticsController.getDailyMetrics
);

router.get(
  '/section/delivery/persons/:personId/performance',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.DELIVERY_ANALYTICS),
  [
    param('personId').isUUID(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  deliveryAnalyticsController.getPersonPerformance
);

router.get(
  '/section/delivery/time-metrics',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.DELIVERY_ANALYTICS),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  deliveryAnalyticsController.getTimeMetrics
);

router.get(
  '/section/delivery/success-rate',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.DELIVERY_ANALYTICS),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  deliveryAnalyticsController.getSuccessRate
);

router.get(
  '/section/delivery/by-region',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.DELIVERY_ANALYTICS),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  deliveryAnalyticsController.getByRegion
);

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 6: EXECUTIVE DASHBOARD (90015) - SUPERADMIN ONLY
// ═════════════════════════════════════════════════════════════════════════════

router.get(
  '/section/executive/profitability',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.EXECUTIVE_DASHBOARD),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  executiveDashboardController.getProfitability
);

router.get(
  '/section/executive/commissions',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.EXECUTIVE_DASHBOARD),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  executiveDashboardController.getCommissions
);

router.get(
  '/section/executive/margins',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.EXECUTIVE_DASHBOARD),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  executiveDashboardController.getMargins
);

router.get(
  '/section/executive/vendor-payouts',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.EXECUTIVE_DASHBOARD),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  executiveDashboardController.getVendorPayouts
);

router.get(
  '/section/executive/financial-health',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.EXECUTIVE_DASHBOARD),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  executiveDashboardController.getFinancialHealth
);

router.get(
  '/section/executive/risk-metrics',
  authenticate,
  authorizeAnalyticsSection(ANALYTICS_PERMISSIONS.EXECUTIVE_DASHBOARD),
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  executiveDashboardController.getRiskMetrics
);

// ═════════════════════════════════════════════════════════════════════════════
// EVENT TRACKING (Kept for internal event logging)
// ═════════════════════════════════════════════════════════════════════════════

router.post(
  '/events',
  [
    body('eventType').notEmpty().withMessage('Event type is required'),
    body('eventName').notEmpty().withMessage('Event name is required'),
    body('sessionId').optional().isString(),
    body('entityType').optional().isString(),
    body('entityId').optional().isString(),
    body('metadata').optional().isObject(),
  ],
  validate,
  analyticsController.trackEvent
);

router.post(
  '/search',
  [
    body('query').notEmpty().withMessage('Search query is required'),
    body('resultsCount').isInt({ min: 0 }),
    body('clickedProductId').optional().isUUID(),
    body('sessionId').optional().isString(),
  ],
  validate,
  analyticsController.trackSearch
);

router.get(
  '/search/popular',
  [query('limit').optional().isInt({ min: 1, max: 100 })],
  validate,
  analyticsController.getPopularSearches
);

export default router;
