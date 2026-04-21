-- Add new address columns expected by the application
ALTER TABLE "Address" ADD COLUMN "addressLine" TEXT;
ALTER TABLE "Address" ADD COLUMN "upazila" TEXT;
ALTER TABLE "Address" ADD COLUMN "zoneId" TEXT;

-- Copy existing addressLine1 into the new addressLine column
UPDATE "Address" SET "addressLine" = "addressLine1" WHERE "addressLine" IS NULL AND "addressLine1" IS NOT NULL;

-- NOTE:
-- 1) `zoneId` is added nullable here. You should populate it with appropriate canonical zone identifiers
--    after running this migration (or adjust to set a default if you prefer).
-- 2) If you want `addressLine` to be NOT NULL, either set a default or alter the column after populating.
