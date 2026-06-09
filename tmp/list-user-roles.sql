SELECT u.id, u.email, r.name as role_name
FROM users u
LEFT JOIN user_roles ur ON ur."userId" = u.id
LEFT JOIN roles r ON r.id = ur."roleId"
WHERE u.email = 'dipjit.admin@freeshop.com';
