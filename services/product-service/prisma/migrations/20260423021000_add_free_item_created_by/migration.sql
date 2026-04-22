ALTER TABLE "free_items" ADD COLUMN "createdBy" TEXT;

UPDATE "free_items" fi
SET "createdBy" = source."vendorId"
FROM (
    SELECT DISTINCT ON (pfi."freeItemId")
        pfi."freeItemId",
        p."vendorId"
    FROM "product_free_items" pfi
    INNER JOIN "products" p ON p."id" = pfi."productId"
    ORDER BY pfi."freeItemId", pfi."assignedAt" ASC
) AS source
WHERE fi."id" = source."freeItemId";

ALTER TABLE "free_items" ALTER COLUMN "createdBy" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "free_items_createdBy_idx" ON "free_items" ("createdBy");
