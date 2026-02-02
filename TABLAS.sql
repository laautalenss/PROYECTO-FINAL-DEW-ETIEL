CREATE DATABASE IF NOT EXISTS tienda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tienda;

-- TABLA PRODUCTOS
CREATE TABLE productos (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  disponibilidad INT NOT NULL DEFAULT 0,
  imagen VARCHAR(255), -- URL de la imagen del producto
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABLA USUARIOS
CREATE TABLE usuarios (
  id_usuario VARCHAR(50) PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  telefono VARCHAR(50),
  cuenta_bancaria VARCHAR(100),
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- INSERTAR PRODUCTOS
INSERT INTO productos (nombre, descripcion, precio, disponibilidad, imagen) VALUES
('Masajeador de Cuello', 'Masajeador electrico para aliviar tensiones en el cuello', 94.99, 15, 'imgs/imgs_productos/masaje_cuello.png'),
('Masajeador de Espalda', 'Masajeador de espalda con masaje profundo', 120.99, 20, 'imgs/imgs_productos/masaje_espalda.png'),
('Masajeador de Pies', 'Masajeador completo electrico para tus pies cansados', 110.99, 12, 'imgs/imgs_productos/masaje_pies.png'),
('Pastillas para Dormir', 'Pastillas naturales para un mejor sueño', 16.50, 30, 'imgs/imgs_productos/pastillas_dormir.png'),
('Pistola de Masaje', 'Terapia muscular profesional en casa', 100, 8, 'imgs/imgs_productos/pistola.png'),
('Plantillas Ortopédicas', 'Plantillas con soporte y comodidad para tus pies', 49.99, 25, 'imgs/imgs_productos/plantillas_pie.png'),
('Vitaminas Bienestar', 'Vitaminas para tu bienestar diario', 16.99, 40, 'imgs/imgs_productos/vitaminas_bienestar.png'),
('Vitaminas Diarias', 'Vitaminas diarias para una mejor salud', 18.99, 35, 'imgs/imgs_productos/vitaminas_diarias.png'),
('Pistola de Masaje Profesional', 'Pistola de masaje muscular de alta potencia para recuperación deportiva', 149.99, 10, 'imgs/pistola_masaje.jpg'),
('Sensor Corrector de Postura', 'Sensor inteligente para corregir tu postura y aliviar dolores de espalda', 79.99, 18, 'imgs/sensor_espalda.png'),
('Centrum Women Multivitamínico', 'Multivitamínico completo diseñado especialmente para mujeres', 24.99, 50, 'imgs/centrum_women.png');
