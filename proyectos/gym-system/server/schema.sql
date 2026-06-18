-- =============================================
-- GymX Database Schema para MySQL / PHPMyAdmin
-- =============================================
-- Ejecuta este script en PHPMyAdmin para crear
-- la base de datos y todas las tablas necesarias.
-- =============================================

CREATE DATABASE IF NOT EXISTS gymx
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gymx;

-- -----------------------------------------------
-- Tabla: planes de membresía
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  duracion_dias INT NOT NULL,
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Tabla: usuarios del sistema (todos los roles)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  telefono VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'recepcionista', 'entrenador', 'miembro') DEFAULT 'miembro',
  edad INT,
  genero ENUM('M', 'F', 'O') DEFAULT 'M',
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Tabla: membresías (suscripciones de miembros)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS memberships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_id INT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado ENUM('Activo', 'Por vencer', 'Vencido') DEFAULT 'Activo',
  metodo_pago ENUM('Efectivo', 'Tarjeta', 'Transferencia') DEFAULT 'Efectivo',
  monto_pagado DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES plans(id)
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Tabla: registro de asistencias (check-ins)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS check_ins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Tabla: clases grupales
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  instructor_id INT,
  dia ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo') NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  capacidad INT NOT NULL DEFAULT 20,
  sala VARCHAR(50),
  color VARCHAR(10) DEFAULT '#818cf8',
  activo BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Tabla: inscripciones a clases
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS class_enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_id INT NOT NULL,
  user_id INT NOT NULL,
  fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (class_id, user_id)
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Tabla: productos del punto de venta
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  categoria VARCHAR(50),
  stock INT DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Tabla: transacciones de venta (POS)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  monto_total DECIMAL(10, 2) NOT NULL,
  metodo_pago ENUM('Efectivo', 'Tarjeta', 'Transferencia') DEFAULT 'Efectivo',
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS transaction_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id INT NOT NULL,
  product_id INT NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Tabla: métricas físicas del miembro
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS physical_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  fecha DATE NOT NULL,
  peso DECIMAL(5, 2),
  porcentaje_grasa DECIMAL(5, 2),
  imc DECIMAL(5, 2),
  notas TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Datos iniciales: planes por defecto
-- -----------------------------------------------
INSERT INTO plans (nombre, precio, duracion_dias, descripcion) VALUES
  ('Mensual', 500.00, 30, 'Acceso completo por 30 días'),
  ('Trimestral', 1200.00, 90, 'Acceso completo por 90 días - Ahorra $300'),
  ('VIP', 2000.00, 180, 'Acceso ilimitado + clases incluidas por 6 meses');

-- -----------------------------------------------
-- Datos iniciales: productos POS
-- -----------------------------------------------
INSERT INTO products (nombre, precio, categoria, stock) VALUES
  ('Agua 600ml', 15.00, 'Bebidas', 48),
  ('Bebida isotónica', 35.00, 'Bebidas', 24),
  ('Proteína (batido)', 60.00, 'Suplementos', 15),
  ('Barra energética', 30.00, 'Snacks', 30),
  ('Toalla pequeña', 25.00, 'Accesorios', 20),
  ('Candado casillero', 40.00, 'Accesorios', 12),
  ('Día de visita', 80.00, 'Acceso', 999),
  ('Guantes gimnasio', 150.00, 'Accesorios', 8);
