-- Add freeItemId to OrderItem
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "freeItemId" TEXT;
