INSERT INTO "Zone" (id, name, price, "createdAt", "updatedAt")
VALUES (
  'a1111111-1111-4111-8111-111111111111',
  'Test Zone - Dhaka',
  60.00,
  NOW(),
  NOW()
)
RETURNING id, name, price;
