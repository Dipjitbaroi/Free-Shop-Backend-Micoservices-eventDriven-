-- Check DailySalesReport data and schema
\echo '=== DailySalesReport data ==='
SELECT date,
       "totalOrders",
       "totalRevenue",
       "totalItems",
       "completedOrders",
       "cancelledOrders",
       "pendingOrders",
       "newCustomers",
       "averageOrderValue",
       "codOrders",
       "bkashOrders"
FROM "DailySalesReport"
ORDER BY date DESC
LIMIT 20;
