-- AlterEnum
-- Adds ASSIGN and REFUND values to the PermissionAction enum.
-- These are required for DELIVERY_ASSIGN (6005) and PAYMENT_REFUND (8004)
-- permissions which were previously skipped by the standard pattern parser
-- because the enum values did not exist.

ALTER TYPE "PermissionAction" ADD VALUE 'ASSIGN';

ALTER TYPE "PermissionAction" ADD VALUE 'REFUND';
