SELECT id, type, quantity, "previousStock", "newStock", reason, "createdAt"
FROM "StockMovement"
WHERE "inventoryId" = '46dffc36-1b9d-4203-a852-acbb3db0c053'
ORDER BY "createdAt";
