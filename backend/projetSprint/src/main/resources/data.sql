-- Insert sample admin user (password: admin123)
INSERT INTO app_user (username, email, password) VALUES ('admin', 'admin@ecommerce.com', '$2a$10$Pb7Z7e0zCpIYmM1M.4Qty.11sH1bGRUhLOJwoiXlOHjf9XrEE6SDS');

-- Insert sample client user (password: client123)  
INSERT INTO app_user (username, email, password) VALUES ('client', 'client@ecommerce.com', '$2a$10$Rzx1BQB15DTwbTVQmkQFwuxlQ308mp2rSwn8K9SrKQlp89jglmz4i');

-- Insert super admin user (password: super123)
INSERT INTO app_user (username, email, password) VALUES ('superadmin', 'superadmin@ecommerce.com', '$2a$10$BO/qlksHTxKfv5NZQMPRV.j.X7KxXjjMp0xNOTzkveoTIwZ4CsthW');

-- Insert roles
INSERT INTO role (name) VALUES ('ROLE_ADMIN');
INSERT INTO role (name) VALUES ('ROLE_CLIENT');

-- Assign roles to users
INSERT INTO app_user_roles (user_id, role_id) VALUES (1, 1);
INSERT INTO app_user_roles (user_id, role_id) VALUES (2, 2);
INSERT INTO app_user_roles (user_id, role_id) VALUES (3, 1);
