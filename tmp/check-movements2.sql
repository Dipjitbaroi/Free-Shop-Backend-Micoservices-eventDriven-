SELECT id, "inventoryId", type, quantity, reason, reference, "previousStock", "newStock", "createdAt"
FROM "StockMovement"
ORDER BY "createdAt" DESC
LIMIT 10;
