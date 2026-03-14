-- Migrate any existing DRAFT products to PENDING_APPROVAL
UPDATE "products" SET "status" = 'PENDING_APPROVAL' WHERE "status" = 'DRAFT';

-- Change the column default
ALTER TABLE "products" ALTER COLUMN "status" SET DEFAULT 'PENDING_APPROVAL';

-- Recreate the enum without DRAFT (PostgreSQL does not support DROP VALUE on enums)
CREATE TYPE "ProductStatus_new" AS ENUM ('PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'REJECTED');

ALTER TABLE "products"
  ALTER COLUMN "status" TYPE "ProductStatus_new"
  USING ("status"::text::"ProductStatus_new");

DROP TYPE "ProductStatus";

ALTER TYPE "ProductStatus_new" RENAME TO "ProductStatus";
