INSERT INTO user_roles (id, "userId", "roleId", "assignmentNumber", "assignedBy", "assignedAt") 
VALUES (gen_random_uuid()::text, 'a7653681-26f3-404f-91ef-4e4514629ef2', 'e5f15e64-4d04-4560-98e0-4f7829a76582', 1, 'system-seed', NOW());
