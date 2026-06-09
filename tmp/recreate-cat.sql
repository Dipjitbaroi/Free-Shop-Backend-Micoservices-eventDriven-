DELETE FROM categories WHERE id = 'test-cat-001';
INSERT INTO categories (id, name, slug, description, level, "sortOrder", "isActive", "productCount", "userId", "createdAt", "updatedAt")
VALUES (
  'a0000000-0000-0000-0000-000000000001',
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
RETURNING id, name, slug;
