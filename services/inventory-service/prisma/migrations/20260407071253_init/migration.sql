-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FULFILLED', 'RELEASED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('RESTOCK', 'SALE', 'RETURN', 'ADJUSTMENT', 'RESERVATION', 'RELEASE', 'INITIAL');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('LOW_STOCK', 'OUT_OF_STOCK', 'BACK_IN_STOCK', 'RESERVATION_EXPIRED');

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "totalStock" INTEGER NOT NULL DEFAULT 0,
    "reservedStock" INTEGER NOT NULL DEFAULT 0,
    "availableStock" INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 10,
    "isLowStock" BOOLEAN NOT NULL DEFAULT false,
    "isOutOfStock" BOOLEAN NOT NULL DEFAULT false,
    "lastRestockAt" TIMESTAMP(3),
    "lastSoldAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockReservation" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3),
    "releasedAt" TIMESTAMP(3),
    "fulfilledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "type" "MovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT,
    "reference" TEXT,
    "previousStock" INTEGER NOT NULL,
    "newStock" INTEGER NOT NULL,
    "performedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryAlert" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_productId_key" ON "Inventory"("productId");

-- CreateIndex
CREATE INDEX "Inventory_productId_idx" ON "Inventory"("productId");

-- CreateIndex
CREATE INDEX "Inventory_vendorId_idx" ON "Inventory"("vendorId");

-- CreateIndex
CREATE INDEX "Inventory_isLowStock_idx" ON "Inventory"("isLowStock");

-- CreateIndex
CREATE INDEX "Inventory_isOutOfStock_idx" ON "Inventory"("isOutOfStock");

-- CreateIndex
CREATE INDEX "StockReservation_orderId_idx" ON "StockReservation"("orderId");

-- CreateIndex
CREATE INDEX "StockReservation_status_idx" ON "StockReservation"("status");

-- CreateIndex
CREATE INDEX "StockReservation_expiresAt_idx" ON "StockReservation"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "StockReservation_inventoryId_orderId_key" ON "StockReservation"("inventoryId", "orderId");

-- CreateIndex
CREATE INDEX "StockMovement_inventoryId_idx" ON "StockMovement"("inventoryId");

-- CreateIndex
CREATE INDEX "StockMovement_type_idx" ON "StockMovement"("type");

-- CreateIndex
CREATE INDEX "StockMovement_createdAt_idx" ON "StockMovement"("createdAt");

-- CreateIndex
CREATE INDEX "InventoryAlert_vendorId_idx" ON "InventoryAlert"("vendorId");

-- CreateIndex
CREATE INDEX "InventoryAlert_isRead_idx" ON "InventoryAlert"("isRead");

-- CreateIndex
CREATE INDEX "InventoryAlert_createdAt_idx" ON "InventoryAlert"("createdAt");

-- AddForeignKey
ALTER TABLE "StockReservation" ADD CONSTRAINT "StockReservation_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
