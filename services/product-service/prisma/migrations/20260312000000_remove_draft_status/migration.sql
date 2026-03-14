-- First, convert the column to text to safely handle enum values
ALTER TABLE "products" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "products" ALTER COLUMN "status" TYPE TEXT;

-- Migrate any existing DRAFT products to PENDING_APPROVAL
UPDATE "products" SET "status" = 'PENDING_APPROVAL' WHERE "status" = 'DRAFT';

-- Create the new enum type without DRAFT
CREATE TYPE "ProductStatus_new" AS ENUM ('PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'REJECTED');

-- Convert the column back to the new enum
ALTER TABLE "products" ALTER COLUMN "status" TYPE "ProductStatus_new" USING "status"::text::"ProductStatus_new";

-- Drop the old enum
DROP TYPE "ProductStatus";

-- Rename the new enum
ALTER TYPE "ProductStatus_new" RENAME TO "ProductStatus";

-- Set the new default
ALTER TABLE "products" ALTER COLUMN "status" SET DEFAULT 'PENDING_APPROVAL';
