-- ============================================================================
-- Partial unique indexes for Inventory
-- ============================================================================
-- Why: The previous composite `@@unique([productId, variantId, freeItemId])`
-- constraint forced Prisma 7's client-side validation to require ALL three
-- fields on every insert. Because the fields are all `String?`, this made
-- it impossible to create a row that only sets `freeItemId` for a standalone
-- free item (Prisma raised `Argument productId is missing`).
--
-- This migration:
--   1. Drops the composite unique constraint.
--   2. Adds two PARTIAL unique indexes that mirror the original business
--      rules without forcing all three columns to be non-null on insert.
--
-- Rules enforced:
--   * A product (with or without variantId) may have ONE inventory row.
--     Uniqueness keyed on (productId, variantId) but ONLY when freeItemId
--     is NULL — so attaching a free item to a product doesn't collide.
--   * A free item may have ONE inventory row, regardless of which product
--     it might be attached to. Uniqueness keyed on freeItemId but ONLY when
--     productId is NULL — so the same free item can be associated with
--     multiple products without violating the index.
-- ============================================================================

-- Drop the old composite unique constraint. In Prisma 5/6, @@unique on a
-- table generates a unique CONSTRAINT, but Prisma 7 (with the
-- `prisma-client` generator used here) generates a unique INDEX instead.
-- Try the constraint form first, then fall back to the index form so this
-- migration is portable across both code paths.
ALTER TABLE "Inventory" DROP CONSTRAINT IF EXISTS "Inventory_productId_variantId_freeItemId_key";
DROP INDEX IF EXISTS "Inventory_productId_variantId_freeItemId_key";

-- Create a partial unique index for products/variants:
--   enforce (productId, variantId) uniqueness only among rows that are
--   NOT free items (freeItemId IS NULL)
CREATE UNIQUE INDEX IF NOT EXISTS "Inventory_product_variant_unique"
  ON "Inventory" ("productId", "variantId")
  WHERE "freeItemId" IS NULL;

-- Create a partial unique index for standalone free items:
--   enforce freeItemId uniqueness only among rows that have no productId
--   (i.e. free items that aren't attached to a specific product)
CREATE UNIQUE INDEX IF NOT EXISTS "Inventory_freeitem_unique"
  ON "Inventory" ("freeItemId")
  WHERE "productId" IS NULL;
