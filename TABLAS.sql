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
('Masajeador de Cuello', 'Masajeador eléctrico para aliviar tensiones en el cuello', 34.99, 15, 'imgs/imgs_productos/masaje_cuello.png'),
('Masajeador de Espalda', 'Alivia el dolor de espalda con masaje profundo', 42.99, 20, 'imgs/imgs_productos/masaje_espalda.png'),
('Masajeador de Pies', 'Relajación completa para tus pies cansados', 29.99, 12, 'imgs/imgs_productos/masaje_pies.png'),
('Pastillas para Dormir', 'Complemento natural para un sueño reparador', 16.99, 30, 'imgs/imgs_productos/pastillas_dormir.png'),
('Pistola de Masaje', 'Terapia muscular profesional en casa', 89.99, 8, 'imgs/imgs_productos/pistola.png'),
('Plantillas Ortopédicas', 'Soporte y comodidad para tus pies', 22.99, 25, 'imgs/imgs_productos/plantillas_pie.png'),
('Vitaminas Bienestar', 'Complemento vitamínico para tu bienestar diario', 24.99, 40, 'imgs/imgs_productos/vitaminas_bienestar.png'),
('Vitaminas Diarias', 'Multivitamínico completo para toda la familia', 18.99, 35, 'imgs/imgs_productos/vitaminas_diarias.png');
