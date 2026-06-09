-- Create a test vendor
INSERT INTO "Vendor" (id, "userId", "storeName", "storeSlug", "contactEmail", status, "verificationStatus", "createdAt", "updatedAt")
VALUES (
  'b1111111-1111-4111-8111-111111111111',
  '4d27efbf-5b4b-4f95-bd0c-a1eca8ece111',
  'Test Vendor Store',
  'test-vendor-store',
  'vendor@test.local',
  'ACTIVE',
  'VERIFIED',
  NOW(),
  NOW()
)
ON CONFLICT ("userId") DO UPDATE
  SET "storeName" = EXCLUDED."storeName",
      status = 'ACTIVE',
      "verificationStatus" = 'VERIFIED',
      "updatedAt" = NOW()
RETURNING id, "storeName", status, "verificationStatus";
