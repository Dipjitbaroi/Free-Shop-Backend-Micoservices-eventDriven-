/*
  Warnings:

  - A unique constraint covering the columns `[sku]` on the table `free_items` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "free_items_sku_key" ON "free_items"("sku");

-- CreateIndex
CREATE INDEX "free_items_sku_idx" ON "free_items"("sku");
