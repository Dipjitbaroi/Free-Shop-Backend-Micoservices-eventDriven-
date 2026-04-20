-- CreateEnum
CREATE TYPE "SellerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "SellerDepartment" AS ENUM ('ORDER_PROCESSING', 'DELIVERY_ASSIGNMENT', 'CUSTOMER_SUPPORT', 'QUALITY_CONTROL');

-- CreateTable
CREATE TABLE "SellerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "avatar" TEXT,
    "employeeId" TEXT NOT NULL,
    "department" "SellerDepartment" NOT NULL,
    "assignedZone" TEXT,
    "status" "SellerStatus" NOT NULL DEFAULT 'ACTIVE',
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "terminationDate" TIMESTAMP(3),
    "ordersProcessed" INTEGER NOT NULL DEFAULT 0,
    "assignedDeliveries" INTEGER NOT NULL DEFAULT 0,
    "successRate" DOUBLE PRECISION DEFAULT 0,
    "rating" DOUBLE PRECISION DEFAULT 5,
    "commissionRate" DECIMAL(5,2) NOT NULL DEFAULT 5,
    "bankDetails" JSONB,
    "workSchedule" JSONB,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SellerProfile_userId_key" ON "SellerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SellerProfile_email_key" ON "SellerProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SellerProfile_employeeId_key" ON "SellerProfile"("employeeId");

-- CreateIndex
CREATE INDEX "SellerProfile_userId_idx" ON "SellerProfile"("userId");

-- CreateIndex
CREATE INDEX "SellerProfile_employeeId_idx" ON "SellerProfile"("employeeId");

-- CreateIndex
CREATE INDEX "SellerProfile_department_idx" ON "SellerProfile"("department");

-- CreateIndex
CREATE INDEX "SellerProfile_assignedZone_idx" ON "SellerProfile"("assignedZone");

-- CreateIndex
CREATE INDEX "SellerProfile_status_idx" ON "SellerProfile"("status");

-- CreateIndex
CREATE INDEX "SellerProfile_isAvailable_idx" ON "SellerProfile"("isAvailable");
