SELECT id, "inventoryId", "orderId", type, quantity, "previousTotal", "newTotal", "previousReserved", "newReserved", "previousAvailable", "newAvailable", "createdAt"
FROM "StockMovement"
ORDER BY "createdAt" DESC
LIMIT 10;
