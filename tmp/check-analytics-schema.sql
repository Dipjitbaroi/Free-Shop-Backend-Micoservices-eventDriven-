-- Check analytics schema
\echo '=== DailySalesReport columns ==='
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'DailySalesReport'
ORDER BY ordinal_position;

\echo '=== VendorReport data ==='
SELECT date, "vendorId", "totalOrders", "totalRevenue", "totalItems"
FROM "VendorReport"
ORDER BY date DESC
LIMIT 20;

\echo '=== ProductAnalytics data ==='
SELECT date, "productId", views, purchases, revenue
FROM "ProductAnalytics"
ORDER BY date DESC
LIMIT 20;
