-- Find and delete duplicate StockMovement
SELECT id, type, quantity, "newStock", "createdAt" FROM "StockMovement" WHERE "inventoryId" = '46dffc36-1b9d-4203-a852-acbb3db0c053' AND type = 'RESERVATION' ORDER BY "createdAt";
