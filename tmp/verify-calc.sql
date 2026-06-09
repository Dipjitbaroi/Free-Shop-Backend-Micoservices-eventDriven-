-- Verify stock math
SELECT
  id,
  "totalStock"              AS total,
  "reservedStock"           AS reserved,
  "availableStock"          AS available,
  ("totalStock" - "reservedStock") AS expected_available,
  ("availableStock" = ("totalStock" - "reservedStock")) AS math_correct
FROM "Inventory"
WHERE id = '46dffc36-1b9d-4203-a852-acbb3db0c053';

-- Per-reservation status (verifies no duplicate, no leftover from delivered order)
SELECT
  sr."orderId",
  sr.quantity,
  sr.status,
  o.status AS order_status
FROM "StockReservation" sr
LEFT JOIN "Order" o ON o.id::text = sr."orderId"
ORDER BY sr."createdAt";
