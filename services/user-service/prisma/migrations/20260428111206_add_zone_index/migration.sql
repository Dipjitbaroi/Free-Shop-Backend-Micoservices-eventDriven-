/*
  Warnings:

  - You are about to drop the column `addressLine1` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine2` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `division` on the `Address` table. All the data in the column will be lost.
  - Made the column `district` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `addressLine` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `zoneId` on table `Address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "addressLine1",
DROP COLUMN "addressLine2",
DROP COLUMN "city",
DROP COLUMN "division",
ADD COLUMN     "area" TEXT,
ALTER COLUMN "district" SET NOT NULL,
ALTER COLUMN "addressLine" SET NOT NULL,
ALTER COLUMN "zoneId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Address_zoneId_idx" ON "Address"("zoneId");
