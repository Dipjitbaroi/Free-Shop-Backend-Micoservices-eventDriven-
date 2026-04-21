/*
  Warnings:

  - You are about to drop the column `commission` on the `VendorReport` table. All the data in the column will be lost.
  - You are about to drop the column `netRevenue` on the `VendorReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VendorReport" DROP COLUMN "commission",
DROP COLUMN "netRevenue";
