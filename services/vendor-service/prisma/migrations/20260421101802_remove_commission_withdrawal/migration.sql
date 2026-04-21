/*
  Warnings:

  - You are about to drop the column `commissionRate` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `minimumWithdrawal` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the `Commission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Withdrawal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Commission" DROP CONSTRAINT "Commission_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "Commission" DROP CONSTRAINT "Commission_withdrawalId_fkey";

-- DropForeignKey
ALTER TABLE "Withdrawal" DROP CONSTRAINT "Withdrawal_vendorId_fkey";

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "commissionRate",
DROP COLUMN "minimumWithdrawal";

-- DropTable
DROP TABLE "Commission";

-- DropTable
DROP TABLE "Withdrawal";

-- DropEnum
DROP TYPE "CommissionStatus";

-- DropEnum
DROP TYPE "WithdrawalMethod";

-- DropEnum
DROP TYPE "WithdrawalStatus";
