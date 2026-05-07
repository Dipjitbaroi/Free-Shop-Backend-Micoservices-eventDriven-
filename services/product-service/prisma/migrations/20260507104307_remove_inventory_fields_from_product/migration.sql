/*
  Warnings:

  - You are about to drop the column `lowStockThreshold` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `reservedStock` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "lowStockThreshold",
DROP COLUMN "reservedStock",
DROP COLUMN "stock";
