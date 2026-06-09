-- Delete the duplicate (older) reservation
DELETE FROM "StockReservation"
WHERE id = '7b9efd61-9766-4678-88f9-a3911e1d45c6';

-- Delete the duplicate (later) StockMovement RESERVATION entry
DELETE FROM "StockMovement"
WHERE "orderId" = '898f1fd3-2bf9-41f3-93df-09d51b94f1a8'
  AND type = 'RESERVATION'
  AND "newStock" = 94;

-- Reset inventory to correct state: reservedStock=3, availableStock=97
UPDATE "Inventory"
SET "reservedStock" = 3, "availableStock" = 97
WHERE id = '46dffc36-1b9d-4203-a852-acbb3db0c053';

-- Verify
SELECT id, "totalStock", "reservedStock", "availableStock" FROM "Inventory" WHERE id = '46dffc36-1b9d-4203-a852-acbb3db0c053';
SELECT COUNT(*) as reservation_count FROM "StockReservation" WHERE "orderId" = '898f1fd3-2bf9-41f3-93df-09d51b94f1a8';
