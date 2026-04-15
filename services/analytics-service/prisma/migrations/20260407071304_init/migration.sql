-- CreateTable
CREATE TABLE "DailySalesReport" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalItems" INTEGER NOT NULL DEFAULT 0,
    "averageOrderValue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "completedOrders" INTEGER NOT NULL DEFAULT 0,
    "cancelledOrders" INTEGER NOT NULL DEFAULT 0,
    "pendingOrders" INTEGER NOT NULL DEFAULT 0,
    "newCustomers" INTEGER NOT NULL DEFAULT 0,
    "returningCustomers" INTEGER NOT NULL DEFAULT 0,
    "codOrders" INTEGER NOT NULL DEFAULT 0,
    "bkashOrders" INTEGER NOT NULL DEFAULT 0,
    "otherPayments" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailySalesReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorReport" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalItems" INTEGER NOT NULL DEFAULT 0,
    "commission" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "netRevenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "productViews" INTEGER NOT NULL DEFAULT 0,
    "productClickRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "newReviews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAnalytics" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "uniqueViews" INTEGER NOT NULL DEFAULT 0,
    "addToCart" INTEGER NOT NULL DEFAULT 0,
    "purchases" INTEGER NOT NULL DEFAULT 0,
    "revenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bounceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "searchImpressions" INTEGER NOT NULL DEFAULT 0,
    "searchClicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryAnalytics" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "productViews" INTEGER NOT NULL DEFAULT 0,
    "purchases" INTEGER NOT NULL DEFAULT 0,
    "revenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "topProductIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoryAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnalytics" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "newRegistrations" INTEGER NOT NULL DEFAULT 0,
    "activeUsers" INTEGER NOT NULL DEFAULT 0,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "avgSessionDuration" INTEGER NOT NULL DEFAULT 0,
    "bounceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mobileUsers" INTEGER NOT NULL DEFAULT 0,
    "desktopUsers" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventLog" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchAnalytics" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "resultsCount" INTEGER NOT NULL DEFAULT 0,
    "clickedProductId" TEXT,
    "userId" TEXT,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailySalesReport_date_idx" ON "DailySalesReport"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DailySalesReport_date_key" ON "DailySalesReport"("date");

-- CreateIndex
CREATE INDEX "VendorReport_vendorId_idx" ON "VendorReport"("vendorId");

-- CreateIndex
CREATE INDEX "VendorReport_date_idx" ON "VendorReport"("date");

-- CreateIndex
CREATE UNIQUE INDEX "VendorReport_vendorId_date_key" ON "VendorReport"("vendorId", "date");

-- CreateIndex
CREATE INDEX "ProductAnalytics_productId_idx" ON "ProductAnalytics"("productId");

-- CreateIndex
CREATE INDEX "ProductAnalytics_date_idx" ON "ProductAnalytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAnalytics_productId_date_key" ON "ProductAnalytics"("productId", "date");

-- CreateIndex
CREATE INDEX "CategoryAnalytics_categoryId_idx" ON "CategoryAnalytics"("categoryId");

-- CreateIndex
CREATE INDEX "CategoryAnalytics_date_idx" ON "CategoryAnalytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryAnalytics_categoryId_date_key" ON "CategoryAnalytics"("categoryId", "date");

-- CreateIndex
CREATE INDEX "UserAnalytics_date_idx" ON "UserAnalytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "UserAnalytics_date_key" ON "UserAnalytics"("date");

-- CreateIndex
CREATE INDEX "EventLog_eventType_idx" ON "EventLog"("eventType");

-- CreateIndex
CREATE INDEX "EventLog_eventName_idx" ON "EventLog"("eventName");

-- CreateIndex
CREATE INDEX "EventLog_userId_idx" ON "EventLog"("userId");

-- CreateIndex
CREATE INDEX "EventLog_entityType_entityId_idx" ON "EventLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "EventLog_createdAt_idx" ON "EventLog"("createdAt");

-- CreateIndex
CREATE INDEX "SearchAnalytics_query_idx" ON "SearchAnalytics"("query");

-- CreateIndex
CREATE INDEX "SearchAnalytics_createdAt_idx" ON "SearchAnalytics"("createdAt");
