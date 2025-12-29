-- Quick Setup: Make Users Admin
-- Run this script to make specific users admin

-- Option 1: Make user admin by email
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';

-- Option 2: Make user admin by username
-- UPDATE users SET role = 'ADMIN' WHERE username = 'admin';

-- Option 3: Make user admin by ID
-- UPDATE users SET role = 'ADMIN' WHERE id = 1;

-- Verify admin users
SELECT id, name, email, username, role FROM users WHERE role = 'ADMIN';

-- List all users and their roles
SELECT id, name, email, username, role FROM users ORDER BY role DESC, name;
