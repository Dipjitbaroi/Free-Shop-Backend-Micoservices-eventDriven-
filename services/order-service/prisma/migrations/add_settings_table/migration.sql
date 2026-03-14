-- Create a settings table for platform-wide config
CREATE TABLE IF NOT EXISTS "Setting" (
    "key" TEXT PRIMARY KEY,
    "value" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP DEFAULT now()
);

-- Insert default delivery settings if not present
INSERT INTO "Setting" ("key", "value") VALUES
  ('defaultShippingFee', '60'),
  ('freeShippingMinAmount', '500')
ON CONFLICT ("key") DO NOTHING;
