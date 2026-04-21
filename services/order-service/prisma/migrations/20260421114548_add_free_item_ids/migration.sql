/*
  Warnings:

  - You are about to drop the column `freeItemId` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
-- Add new array column to CartItem
ALTER TABLE "CartItem" ADD COLUMN IF NOT EXISTS "freeItemIds" TEXT[];

-- Add new array column to OrderItem
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "freeItemIds" TEXT[];

-- Copy legacy freeItemId values into the array column for OrderItem
UPDATE "OrderItem" SET "freeItemIds" = ARRAY["freeItemId"]::text[] WHERE "freeItemId" IS NOT NULL;

-- Optionally drop the old column (commented out for safety). Uncomment to remove after verification.
-- ALTER TABLE "OrderItem" DROP COLUMN "freeItemId";
