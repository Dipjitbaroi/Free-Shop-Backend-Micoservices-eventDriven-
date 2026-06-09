DELETE FROM categories WHERE slug = 'test-category';
INSERT INTO categories (id, name, slug, description, level, "sortOrder", "isActive", "productCount", "userId", "createdAt", "updatedAt")
VALUES (
  '85f38b7d-c722-4dfb-91db-13fd912e4f01',
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
