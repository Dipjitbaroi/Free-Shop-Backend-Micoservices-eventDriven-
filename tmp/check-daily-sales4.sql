SELECT id, date, "totalOrders", "completedOrders", "pendingOrders", "cancelledOrders", "totalRevenue", "totalItems", "averageOrderValue", "codOrders", "bkashOrders", "updatedAt"
FROM "DailySalesReport"
ORDER BY date DESC
LIMIT 10;
