/*
  Warnings:

  - A unique constraint covering the columns `[freeItemId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "productId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_freeItemId_key" ON "Inventory"("freeItemId");
