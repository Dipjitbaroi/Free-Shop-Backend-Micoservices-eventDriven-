/*
  Warnings:

  - You are about to drop the column `carrier` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `trackingNumber` on the `Order` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DeliveryProvider" AS ENUM ('INHOUSE', 'STEADFAST', 'PATHAO', 'REDX', 'SUNDARBAN', 'OTHER');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "carrier",
DROP COLUMN "trackingNumber",
ADD COLUMN     "sellerId" TEXT,
ADD COLUMN     "sellerNote" TEXT;

-- CreateTable
CREATE TABLE "DeliveryInfo" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" "DeliveryProvider" NOT NULL,
    "deliveryManId" TEXT,
    "externalTrackingId" TEXT,
    "externalProvider" TEXT,
    "externalApiRef" TEXT,
    "shippingAddress" JSONB,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "trackingNumber" TEXT,
    "carrier" TEXT,
    "estimatedDeliveryDate" TIMESTAMP(3),
    "actualDeliveryDate" TIMESTAMP(3),
    "weight" DOUBLE PRECISION,
    "dimensions" JSONB,
    "fragile" BOOLEAN NOT NULL DEFAULT false,
    "deliveryCharge" DOUBLE PRECISION,
    "discountApplied" DOUBLE PRECISION DEFAULT 0,
    "pickedUpAt" TIMESTAMP(3),
    "inTransitAt" TIMESTAMP(3),
    "outForDeliveryAt" TIMESTAMP(3),
    "failedAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastFailureReason" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryInfo_orderId_key" ON "DeliveryInfo"("orderId");

-- CreateIndex
CREATE INDEX "DeliveryInfo_orderId_idx" ON "DeliveryInfo"("orderId");

-- CreateIndex
CREATE INDEX "DeliveryInfo_deliveryManId_idx" ON "DeliveryInfo"("deliveryManId");

-- CreateIndex
CREATE INDEX "DeliveryInfo_provider_idx" ON "DeliveryInfo"("provider");

-- CreateIndex
CREATE INDEX "DeliveryInfo_status_idx" ON "DeliveryInfo"("status");

-- CreateIndex
CREATE INDEX "DeliveryInfo_externalTrackingId_idx" ON "DeliveryInfo"("externalTrackingId");

-- CreateIndex
CREATE INDEX "Order_sellerId_idx" ON "Order"("sellerId");

-- AddForeignKey
ALTER TABLE "DeliveryInfo" ADD CONSTRAINT "DeliveryInfo_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
