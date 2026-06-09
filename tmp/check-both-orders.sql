SELECT "orderId", COUNT(*) as reservation_count, SUM(quantity) as total_qty
FROM "StockReservation"
WHERE status = 'PENDING'
GROUP BY "orderId"
ORDER BY "orderId";
