SELECT r.name, COUNT(rp."permissionId") AS perm_count
FROM roles r
LEFT JOIN role_permissions rp ON rp."roleId" = r.id
GROUP BY r.id, r.name
ORDER BY r.name;
