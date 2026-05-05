/*
  Warnings:

  - Added the required column `userId` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "categories_userId_idx" ON "categories"("userId");
