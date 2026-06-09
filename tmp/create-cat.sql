INSERT INTO categories (id, name, slug, description, level, "sortOrder", "isActive", "productCount", "userId", "createdAt", "updatedAt")
VALUES (
  'test-cat-001',
  'Test Category',
  'test-category',
  'Auto-created for inventory test',
  0,
  0,
  true,
  0,
  '4d27efbf-5b4b-4f95-bd0c-a1eca8ece111',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING
RETURNING id, name, slug;
