import { prisma } from '../lib/prisma.js';
import { redis, CACHE_TTL } from '../lib/redis.js';
import { Prisma } from '../../generated/prisma/index.js';
import { createServiceLogger } from '@freeshop/shared-utils';

const logger = createServiceLogger('analytics-service');

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  newCustomers: number;
  conversionRate: number;
  revenueGrowth: number;
  orderGrowth: number;
}

interface TopProduct {
  productId: string;
  productName?: string;
  totalSales: number;
  revenue: number;
}

interface TopVendor {
  vendorId: string;
  storeName?: string;
  totalOrders: number;
  revenue: number;
}

class AnalyticsService {
  async getDashboardMetrics(dateRange: DateRange): Promise<DashboardMetrics> {
    const cacheKey = `dashboard:${dateRange.startDate.toISOString()}:${dateRange.endDate.toISOString()}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const currentPeriod = await prisma.dailySalesReport.aggregate({
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

    const daysDiff = Math.ceil(
      (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const previousStartDate = new Date(dateRange.startDate);
    previousStartDate.setDate(previousStartDate.getDate() - daysDiff);
    const previousEndDate = new Date(dateRange.startDate);
    previousEndDate.setDate(previousEndDate.getDate() - 1);

    const previousPeriod = await prisma.dailySalesReport.aggregate({
      where: {
        date: {
          gte: previousStartDate,
          lte: previousEndDate,
        },
      },
      _sum: {
        totalRevenue: true,
        totalOrders: true,
      },
    });

    const currentRevenue = Number(currentPeriod._sum.totalRevenue || 0);
    const previousRevenue = Number(previousPeriod._sum.totalRevenue || 0);
    const currentOrders = currentPeriod._sum.totalOrders || 0;
    const previousOrders = previousPeriod._sum.totalOrders || 0;

    const metrics: DashboardMetrics = {
      totalRevenue: currentRevenue,
      totalOrders: currentOrders,
      averageOrderValue: Number(currentPeriod._avg.averageOrderValue || 0),
      newCustomers: currentPeriod._sum.newCustomers || 0,
      conversionRate: 0,
      revenueGrowth: previousRevenue > 0 
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
        : 0,
      orderGrowth: previousOrders > 0 
        ? ((currentOrders - previousOrders) / previousOrders) * 100 
        : 0,
    };

    await redis.setex(cacheKey, CACHE_TTL.DASHBOARD, JSON.stringify(metrics));

    return metrics;
  }

  async getSalesReport(dateRange: DateRange) {
    const reports = await prisma.dailySalesReport.findMany({
      where: {
        date: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      orderBy: { date: 'asc' },
    });

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
        totalItems: true,
        completedOrders: true,
        cancelledOrders: true,
        newCustomers: true,
        codOrders: true,
        bkashOrders: true,
      },
      _avg: {
        averageOrderValue: true,
      },
    });

    return { reports, summary };
  }

  async getVendorReport(vendorId: string, dateRange: DateRange) {
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

    const summary = await prisma.vendorReport.aggregate({
      where: {
        vendorId: vendorId,
        date: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      _sum: {
        totalRevenue: true,
        totalOrders: true,
        totalItems: true,
        commission: true,
        netRevenue: true,
        productViews: true,
        newReviews: true,
      },
      _avg: {
        conversionRate: true,
        averageRating: true,
      },
    });

    return { reports, summary };
  }

  async getProductAnalytics(productId: string, dateRange: DateRange) {
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

    const summary = await prisma.productAnalytics.aggregate({
      where: {
        productId,
        date: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      _sum: {
        views: true,
        uniqueViews: true,
        addToCart: true,
        purchases: true,
        revenue: true,
        searchImpressions: true,
        searchClicks: true,
      },
      _avg: {
        conversionRate: true,
        bounceRate: true,
      },
    });

    return { analytics, summary };
  }

  async getTopProducts(dateRange: DateRange, limit = 10): Promise<TopProduct[]> {
    const cacheKey = `top-products:${dateRange.startDate.toISOString()}:${dateRange.endDate.toISOString()}:${limit}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const topProducts = await prisma.productAnalytics.groupBy({
      by: ['productId'],
      where: {
        date: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      _sum: {
        purchases: true,
        revenue: true,
      },
      orderBy: {
        _sum: {
          revenue: 'desc',
        },
      },
      take: limit,
    });

    const result: TopProduct[] = topProducts.map((p) => ({
      productId: p.productId,
      totalSales: p._sum.purchases || 0,
      revenue: Number(p._sum.revenue || 0),
    }));

    await redis.setex(cacheKey, CACHE_TTL.REPORTS, JSON.stringify(result));

    return result;
  }

  async getTopVendors(dateRange: DateRange, limit = 10): Promise<TopVendor[]> {
    const cacheKey = `top-vendors:${dateRange.startDate.toISOString()}:${dateRange.endDate.toISOString()}:${limit}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const topVendors = await prisma.vendorReport.groupBy({
      by: ['vendorId'],
      where: {
        date: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      _sum: {
        totalOrders: true,
        totalRevenue: true,
      },
      orderBy: {
        _sum: {
          totalRevenue: 'desc',
        },
      },
      take: limit,
    });

    const result: TopVendor[] = topVendors.map((s) => ({
      vendorId: s.vendorId,
      totalOrders: s._sum.totalOrders || 0,
      revenue: Number(s._sum.totalRevenue || 0),
    }));

    await redis.setex(cacheKey, CACHE_TTL.REPORTS, JSON.stringify(result));

    return result;
  }

  async getUserAnalytics(dateRange: DateRange) {
    const analytics = await prisma.userAnalytics.findMany({
      where: {
        date: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    const summary = await prisma.userAnalytics.aggregate({
      where: {
        date: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      _sum: {
        newRegistrations: true,
        activeUsers: true,
        totalSessions: true,
        mobileUsers: true,
        desktopUsers: true,
      },
      _avg: {
        avgSessionDuration: true,
        bounceRate: true,
      },
    });

    return { analytics, summary };
  }

  async trackEvent(data: {
    eventType: string;
    eventName: string;
    userId?: string;
    sessionId?: string;
    entityType?: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
    referer?: string;
  }) {
    return prisma.eventLog.create({
      data: {
        eventType: data.eventType,
        eventName: data.eventName,
        userId: data.userId,
        sessionId: data.sessionId,
        entityType: data.entityType,
        entityId: data.entityId,
        metadata: data.metadata as Prisma.InputJsonValue,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        referer: data.referer,
      },
    });
  }

  async trackSearch(data: {
    query: string;
    resultsCount: number;
    clickedProductId?: string;
    userId?: string;
    sessionId?: string;
  }) {
    return prisma.searchAnalytics.create({ data });
  }

  async getPopularSearches(limit = 20) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const searches = await prisma.searchAnalytics.groupBy({
      by: ['query'],
      where: {
        createdAt: { gte: oneWeekAgo },
      },
      _count: true,
      orderBy: {
        _count: {
          query: 'desc',
        },
      },
      take: limit,
    });

    return searches.map((s) => ({
      query: s.query,
      count: s._count,
    }));
  }

  async updateDailySalesReport(date: Date, data: Partial<{
    totalOrders: number;
    totalRevenue: number;
    totalItems: number;
    completedOrders: number;
    cancelledOrders: number;
    pendingOrders: number;
    newCustomers: number;
    returningCustomers: number;
    codOrders: number;
    bkashOrders: number;
    otherPayments: number;
  }>) {
    const dateOnly = new Date(date.toISOString().split('T')[0]);

    const report = await prisma.dailySalesReport.upsert({
      where: { date: dateOnly },
      create: {
        date: dateOnly,
        ...data,
        averageOrderValue: data.totalOrders && data.totalRevenue 
          ? data.totalRevenue / data.totalOrders 
          : 0,
      },
      update: {
        totalOrders: data.totalOrders !== undefined 
          ? { increment: data.totalOrders } 
          : undefined,
        totalRevenue: data.totalRevenue !== undefined 
          ? { increment: data.totalRevenue } 
          : undefined,
        totalItems: data.totalItems !== undefined 
          ? { increment: data.totalItems } 
          : undefined,
        completedOrders: data.completedOrders !== undefined 
          ? { increment: data.completedOrders } 
          : undefined,
        cancelledOrders: data.cancelledOrders !== undefined 
          ? { increment: data.cancelledOrders } 
          : undefined,
        pendingOrders: data.pendingOrders !== undefined
          ? { increment: data.pendingOrders }
          : undefined,
        newCustomers: data.newCustomers !== undefined 
          ? { increment: data.newCustomers } 
          : undefined,
        returningCustomers: data.returningCustomers !== undefined
          ? { increment: data.returningCustomers }
          : undefined,
        codOrders: data.codOrders !== undefined 
          ? { increment: data.codOrders } 
          : undefined,
        bkashOrders: data.bkashOrders !== undefined 
          ? { increment: data.bkashOrders } 
          : undefined,
        otherPayments: data.otherPayments !== undefined
          ? { increment: data.otherPayments }
          : undefined,
      },
    });

    await redis.del(`dashboard:*`);

    return report;
  }

  async updateVendorReport(vendorId: string, date: Date, data: Partial<{
    totalOrders: number;
    totalRevenue: number;
    totalItems: number;
    commission: number;
    netRevenue: number;
    productViews: number;
    newReviews: number;
  }>) {
    const dateOnly = new Date(date.toISOString().split('T')[0]);

    return prisma.vendorReport.upsert({
      where: { vendorId_date: { vendorId, date: dateOnly } },
      create: {
        vendorId,
        date: dateOnly,
        ...data,
      },
      update: {
        totalOrders: data.totalOrders !== undefined 
          ? { increment: data.totalOrders } 
          : undefined,
        totalRevenue: data.totalRevenue !== undefined 
          ? { increment: data.totalRevenue } 
          : undefined,
        totalItems: data.totalItems !== undefined 
          ? { increment: data.totalItems } 
          : undefined,
        commission: data.commission !== undefined 
          ? { increment: data.commission } 
          : undefined,
        netRevenue: data.netRevenue !== undefined 
          ? { increment: data.netRevenue } 
          : undefined,
        productViews: data.productViews !== undefined 
          ? { increment: data.productViews } 
          : undefined,
        newReviews: data.newReviews !== undefined 
          ? { increment: data.newReviews } 
          : undefined,
      },
    });
  }

  async updateProductAnalytics(productId: string, date: Date, data: Partial<{
    views: number;
    uniqueViews: number;
    addToCart: number;
    purchases: number;
    revenue: number;
    searchImpressions: number;
    searchClicks: number;
  }>) {
    const dateOnly = new Date(date.toISOString().split('T')[0]);

    return prisma.productAnalytics.upsert({
      where: { productId_date: { productId, date: dateOnly } },
      create: {
        productId,
        date: dateOnly,
        ...data,
      },
      update: {
        views: data.views !== undefined 
          ? { increment: data.views } 
          : undefined,
        uniqueViews: data.uniqueViews !== undefined 
          ? { increment: data.uniqueViews } 
          : undefined,
        addToCart: data.addToCart !== undefined 
          ? { increment: data.addToCart } 
          : undefined,
        purchases: data.purchases !== undefined 
          ? { increment: data.purchases } 
          : undefined,
        revenue: data.revenue !== undefined 
          ? { increment: data.revenue } 
          : undefined,
        searchImpressions: data.searchImpressions !== undefined 
          ? { increment: data.searchImpressions } 
          : undefined,
        searchClicks: data.searchClicks !== undefined 
          ? { increment: data.searchClicks } 
          : undefined,
      },
    });
  }
}

export const analyticsService = new AnalyticsService();
