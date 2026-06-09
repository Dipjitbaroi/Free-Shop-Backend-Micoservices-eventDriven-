-- FINAL VERIFICATION: totalStock and availableStock calculations

\echo '=== 1. CURRENT INVENTORY STATE ==='
SELECT
  i.id,
  i."totalStock",
  i."reservedStock",
  i."availableStock",
  (i."totalStock" - i."reservedStock") AS computed_available,
  (i."availableStock" = (i."totalStock" - i."reservedStock")) AS math_correct
FROM "Inventory" i
WHERE i.id = '46dffc36-1b9d-4203-a852-acbb3db0c053';

\echo ''
\echo '=== 2. STOCK MOVEMENT HISTORY (proves how totalStock got to 97) ==='
SELECT
  type,
  "previousStock",
  "newStock",
  quantity,
  "createdAt",
  reason
FROM "StockMovement"
WHERE "inventoryId" = '46dffc36-1b9d-4203-a852-acbb3db0c053'
ORDER BY "createdAt" ASC;

\echo ''
\echo '=== 3. CALCULATION SUMMARY ==='
SELECT
  'Initial totalStock' AS metric, 100::int AS value
UNION ALL
SELECT 'Sold via delivery (order 318e84ca...)', -3
UNION ALL
SELECT 'Final totalStock (100 - 3)', 97
UNION ALL
SELECT 'Pending reservation (order 898f1fd3...)', 3
UNION ALL
SELECT 'Final reservedStock', 3
UNION ALL
SELECT 'Final availableStock (97 - 3)', 94;
