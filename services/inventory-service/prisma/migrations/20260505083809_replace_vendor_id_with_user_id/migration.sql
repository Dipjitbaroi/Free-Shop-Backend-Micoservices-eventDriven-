/*
  Warnings:

  - You are about to drop the column `vendorId` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `InventoryAlert` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `InventoryAlert` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Inventory_vendorId_idx";

-- DropIndex
DROP INDEX "InventoryAlert_vendorId_idx";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "vendorId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "InventoryAlert" DROP COLUMN "vendorId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Inventory_userId_idx" ON "Inventory"("userId");

-- CreateIndex
CREATE INDEX "InventoryAlert_userId_idx" ON "InventoryAlert"("userId");
