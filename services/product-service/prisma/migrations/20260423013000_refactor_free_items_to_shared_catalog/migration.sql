CREATE TABLE "product_free_items" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "freeItemId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_free_items_pkey" PRIMARY KEY ("id")
);

INSERT INTO "product_free_items" ("id", "productId", "freeItemId", "assignedAt")
SELECT ("productId" || ':' || "id"), "productId", "id", "createdAt"
FROM "free_items";

ALTER TABLE "free_items" DROP CONSTRAINT IF EXISTS "free_items_productId_fkey";
ALTER TABLE "free_items" DROP COLUMN "productId";

CREATE UNIQUE INDEX "product_free_items_productId_freeItemId_key"
    ON "product_free_items" ("productId", "freeItemId");
CREATE INDEX "product_free_items_productId_idx"
    ON "product_free_items" ("productId");
CREATE INDEX "product_free_items_freeItemId_idx"
    ON "product_free_items" ("freeItemId");

ALTER TABLE "product_free_items"
    ADD CONSTRAINT "product_free_items_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "product_free_items"
    ADD CONSTRAINT "product_free_items_freeItemId_fkey"
    FOREIGN KEY ("freeItemId") REFERENCES "free_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
