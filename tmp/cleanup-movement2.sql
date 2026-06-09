DELETE FROM "StockMovement" WHERE id = 'bf692c9f-07f9-435f-8897-e6edbfe0efcb';
SELECT COUNT(*) as movement_count FROM "StockMovement" WHERE "inventoryId" = '46dffc36-1b9d-4203-a852-acbb3db0c053' AND type = 'RESERVATION';
