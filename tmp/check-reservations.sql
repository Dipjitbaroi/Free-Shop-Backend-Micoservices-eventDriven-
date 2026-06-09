SELECT id, "inventoryId", "orderId", quantity, status, "createdAt"
FROM "StockReservation"
ORDER BY "createdAt" DESC
LIMIT 20;
