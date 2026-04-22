-- Recover cleanly from a previously failed partial run of this migration.
DROP TABLE IF EXISTS "CartItemFreeItem" CASCADE;
DROP TABLE IF EXISTS "OrderItemFreeItem" CASCADE;

CREATE TABLE "CartItemFreeItem" (
    "id" TEXT NOT NULL,
    "cartItemId" TEXT NOT NULL,
    "freeItemId" TEXT NOT NULL,
    "freeItemName" TEXT NOT NULL,
    "sku" TEXT,
    "image" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartItemFreeItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrderItemFreeItem" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "freeItemId" TEXT NOT NULL,
    "freeItemName" TEXT NOT NULL,
    "sku" TEXT,
    "image" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItemFreeItem_pkey" PRIMARY KEY ("id")
);

INSERT INTO "CartItemFreeItem" ("id", "cartItemId", "freeItemId", "freeItemName", "sku", "image", "assignedAt")
SELECT
  (ci."id" || ':' || free_item_id),
  ci."id",
  free_item_id,
  free_item_id,
  NULL,
  NULL,
  COALESCE(ci."updatedAt", CURRENT_TIMESTAMP)
FROM "CartItem" ci
CROSS JOIN LATERAL unnest("freeItemIds") AS free_item_id(free_item_id)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "OrderItemFreeItem" ("id", "orderItemId", "freeItemId", "freeItemName", "sku", "image", "assignedAt")
SELECT
  (oi."id" || ':' || free_item_id),
  oi."id",
  free_item_id,
  free_item_id,
  NULL,
  NULL,
  COALESCE(oi."updatedAt", CURRENT_TIMESTAMP)
FROM "OrderItem" oi
CROSS JOIN LATERAL unnest("freeItemIds") AS free_item_id(free_item_id)
ON CONFLICT ("id") DO NOTHING;

ALTER TABLE "CartItem" DROP COLUMN IF EXISTS "freeItemIds";
ALTER TABLE "OrderItem" DROP COLUMN IF EXISTS "freeItemIds";

CREATE UNIQUE INDEX "CartItemFreeItem_cartItemId_freeItemId_key" ON "CartItemFreeItem" ("cartItemId", "freeItemId");
CREATE INDEX "CartItemFreeItem_cartItemId_idx" ON "CartItemFreeItem" ("cartItemId");
CREATE INDEX "CartItemFreeItem_freeItemId_idx" ON "CartItemFreeItem" ("freeItemId");

CREATE UNIQUE INDEX "OrderItemFreeItem_orderItemId_freeItemId_key" ON "OrderItemFreeItem" ("orderItemId", "freeItemId");
CREATE INDEX "OrderItemFreeItem_orderItemId_idx" ON "OrderItemFreeItem" ("orderItemId");
CREATE INDEX "OrderItemFreeItem_freeItemId_idx" ON "OrderItemFreeItem" ("freeItemId");

ALTER TABLE "CartItemFreeItem"
  ADD CONSTRAINT "CartItemFreeItem_cartItemId_fkey"
  FOREIGN KEY ("cartItemId") REFERENCES "CartItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OrderItemFreeItem"
  ADD CONSTRAINT "OrderItemFreeItem_orderItemId_fkey"
  FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
