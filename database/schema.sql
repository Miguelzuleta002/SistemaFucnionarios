-- schema.sql
-- Script de Creación de la Base de Datos y sus Tablas

CREATE DATABASE IF NOT EXISTS sistema_funcionarios;
USE sistema_funcionarios;

-- 1. Tabla de Roles (Administrador, Docente)
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Usuarios (Contiene contraseña encriptada y llave foránea a roles)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- 3. Tabla de Funcionarios (Principal para el CRUD)
CREATE TABLE IF NOT EXISTS funcionarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    documento VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(200),
    estado BOOLEAN DEFAULT TRUE,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Tablas paramétricas para Inventario
CREATE TABLE IF NOT EXISTS marcas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    estado BOOLEAN DEFAULT TRUE,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS estados_equipos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    estado BOOLEAN DEFAULT TRUE,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tipos_equipos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    estado BOOLEAN DEFAULT TRUE,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Inventarios
CREATE TABLE IF NOT EXISTS inventarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serial VARCHAR(100) NOT NULL UNIQUE,
    modelo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    foto VARCHAR(255),
    color VARCHAR(50),
    fecha_compra DATE,
    precio DECIMAL(10,2),
    usuario_id INT NOT NULL, -- Usuario a cargo del equipo
    marca_id INT NOT NULL,
    estado_equipo_id INT NOT NULL,
    tipo_equipo_id INT NOT NULL,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (marca_id) REFERENCES marcas(id) ON DELETE RESTRICT,
    FOREIGN KEY (estado_equipo_id) REFERENCES estados_equipos(id) ON DELETE RESTRICT,
    FOREIGN KEY (tipo_equipo_id) REFERENCES tipos_equipos(id) ON DELETE RESTRICT
);
