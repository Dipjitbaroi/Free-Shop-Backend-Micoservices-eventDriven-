-- Update Setting table to support delivery zones as a JSON object
ALTER TABLE "Setting" ALTER COLUMN "value" TYPE JSONB USING value::jsonb;

-- Remove old delivery keys if present
DELETE FROM "Setting" WHERE key IN ('defaultShippingFee', 'freeShippingMinAmount');

-- Insert a new deliveryCharges key as a JSON object example
INSERT INTO "Setting" ("key", "value") VALUES
  ('deliveryCharges', '{"in_feni":60,"in_dhaka":50,"outside_dhaka":120}')
ON CONFLICT ("key") DO NOTHING;
