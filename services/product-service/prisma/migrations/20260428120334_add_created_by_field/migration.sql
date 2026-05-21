-- DropIndex
DROP INDEX "free_items_createdBy_idx";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "createdBy" TEXT;
