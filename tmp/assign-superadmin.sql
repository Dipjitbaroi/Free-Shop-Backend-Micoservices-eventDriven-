INSERT INTO user_roles (id, "userId", "roleId", "assignedBy", "assignedAt")
VALUES (
  'assign-sa-001',
  '4d27efbf-5b4b-4f95-bd0c-a1eca8ece111',
  '471aa493-d869-42eb-a1e6-329e731e34c3',
  'system-seed',
  NOW()
)
ON CONFLICT ("userId", "roleId") DO NOTHING
RETURNING id, "userId", "roleId";
