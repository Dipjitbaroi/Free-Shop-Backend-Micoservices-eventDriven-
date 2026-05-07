/*
  Warnings:

  - A unique constraint covering the columns `[productId,variantId,freeItemId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[inventoryId,orderId,variantId]` on the table `StockReservation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MovementType" ADD VALUE 'COMPENSATION';
ALTER TYPE "MovementType" ADD VALUE 'REFUND';

-- AlterEnum
ALTER TYPE "ReservationStatus" ADD VALUE 'REFUNDED';

-- DropIndex
DROP INDEX "Inventory_productId_key";

-- DropIndex
DROP INDEX "StockReservation_inventoryId_orderId_key";

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "freeItemId" TEXT,
ADD COLUMN     "variantId" TEXT;

-- AlterTable
ALTER TABLE "StockReservation" ADD COLUMN     "variantId" TEXT;

-- CreateTable
CREATE TABLE "EventProcessingLog" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "orderId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PROCESSING',
    "payload" TEXT,
    "error" TEXT,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventProcessingLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventProcessingLog_orderId_idx" ON "EventProcessingLog"("orderId");

-- CreateIndex
CREATE INDEX "EventProcessingLog_status_idx" ON "EventProcessingLog"("status");

-- CreateIndex
CREATE INDEX "EventProcessingLog_processedAt_idx" ON "EventProcessingLog"("processedAt");

-- CreateIndex
CREATE UNIQUE INDEX "EventProcessingLog_eventType_eventId_key" ON "EventProcessingLog"("eventType", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_productId_variantId_freeItemId_key" ON "Inventory"("productId", "variantId", "freeItemId");

-- CreateIndex
CREATE UNIQUE INDEX "StockReservation_inventoryId_orderId_variantId_key" ON "StockReservation"("inventoryId", "orderId", "variantId");
