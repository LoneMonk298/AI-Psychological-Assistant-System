USE ai_psychological_assistant;

UPDATE sys_user
SET role = 'SUPER_ADMIN'
WHERE username = 'admin'
  AND deleted = 0;

SELECT id, username, role, status, deleted
FROM sys_user
WHERE username = 'admin';
