SELECT id, "inventoryId", "orderId", quantity, status, "variantId", "createdAt"
FROM "StockReservation"
WHERE "orderId" = '898f1fd3-2bf9-41f3-93df-09d51b94f1a8'
ORDER BY "createdAt";
