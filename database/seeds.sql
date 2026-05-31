-- seeds.sql
-- Script de Inserción de Datos Iniciales (Población)

USE sistema_funcionarios;

-- Insertar roles permitidos
INSERT INTO roles (nombre) VALUES ('Administrador');
INSERT INTO roles (nombre) VALUES ('Docente');

-- Insertar usuarios por defecto
-- NOTA: Las contraseñas están encriptadas usando bcrypt (Rondas: 10).
-- La contraseña en texto plano para ambos usuarios es: admin123

INSERT INTO usuarios (email, password, rol_id) 
VALUES (
    'admin@sistema.com', 
    '$2b$10$iI0T/.aW3pS4A2tY3sTfM.Hj38Q7lF5A/163fV3R6xO2hH0oR3q6q', -- 'admin123'
    (SELECT id FROM roles WHERE nombre = 'Administrador')
);

INSERT INTO usuarios (email, password, rol_id) 
VALUES (
    'docente@sistema.com', 
    '$2b$10$iI0T/.aW3pS4A2tY3sTfM.Hj38Q7lF5A/163fV3R6xO2hH0oR3q6q', -- 'admin123'
    (SELECT id FROM roles WHERE nombre = 'Docente')
);

-- Insertar datos base para listas desplegables
INSERT INTO marcas (nombre) VALUES ('Lenovo'), ('HP'), ('Dell'), ('Apple');

INSERT INTO estados_equipos (nombre) VALUES ('En uso'), ('En bodega'), ('Mantenimiento'), ('Dado de baja');

INSERT INTO tipos_equipos (nombre) VALUES ('Computador de Mesa'), ('Computador Portátil'), ('Tablet');

-- (Opcional) Insertar un Funcionario de prueba
INSERT INTO funcionarios (nombres, apellidos, documento, email, telefono, direccion)
VALUES ('Juan', 'Perez', '1020304050', 'juan.perez@empresa.com', '3001234567', 'Calle 123 # 45-67');
