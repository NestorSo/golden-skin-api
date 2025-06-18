Create database GoldenSkin
use GoldenSkin
use master


-- 1. Roles y Privilegios
CREATE TABLE Roles (
    IdRol INT PRIMARY KEY IDENTITY(1,1),
    NombreRol VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Privilegios (
    IdPrivilegio INT PRIMARY KEY IDENTITY(1,1),
    Descripcion VARCHAR(255) NOT NULL,
    IdRol INT FOREIGN KEY REFERENCES Roles(IdRol)
);

-- 2. Usuarios
CREATE TABLE Usuarios (
    IdUsuario INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Email VARCHAR(200) NOT NULL UNIQUE,
    Pass VARCHAR(255) NOT NULL,
    EstadoLogin BIT DEFAULT 1,
    EstadoUsuario BIT DEFAULT 1, -- 1 = Activo, 0 = Inactivo
    FechaRegistro DATE DEFAULT GETDATE(),
    IdRol INT FOREIGN KEY REFERENCES Roles(IdRol)
);

-- 3. Empleados
CREATE TABLE Empleados (
    IdEmpleado INT PRIMARY KEY IDENTITY(1,1),
    IdUsuario INT UNIQUE FOREIGN KEY REFERENCES Usuarios(IdUsuario),
    Cargo VARCHAR(100) NOT NULL
);

-- 4. Clientes
CREATE TABLE Clientes (
    IdCliente INT PRIMARY KEY IDENTITY(1,1),
    IdUsuario INT UNIQUE FOREIGN KEY REFERENCES Usuarios(IdUsuario),
    Direccion VARCHAR(200) NOT NULL,
    Telefono VARCHAR(15) NOT NULL
);

-- 5. Marcas
CREATE TABLE Marcas (
    IdMarca INT PRIMARY KEY IDENTITY(1,1),
    NombreMarca VARCHAR(100) NOT NULL UNIQUE,
    Descripcion VARCHAR(400),
    Fabricante VARCHAR(100),
    EstadoMarca BIT DEFAULT 1 -- 1 = Activa, 0 = Inactiva
);

-- 6. Productos
CREATE TABLE Productos (
    IdProducto INT PRIMARY KEY IDENTITY(1,1),
    NombreProducto VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(400),
    Precio DECIMAL(10,2) NOT NULL,
    Cantidad INT NOT NULL,
    FechaFabricacion DATE,
    FechaVencimiento DATE,
    IdMarca INT FOREIGN KEY REFERENCES Marcas(IdMarca),
	Categoria VARCHAR (50),
    EstadoProducto BIT DEFAULT 1, -- 1 = Disponible, 0 = Inactivo o Agotado
	Imagen VARBINARY(MAX)
);



-- 7. Proveedores
CREATE TABLE Proveedores (
    IdProveedor INT PRIMARY KEY IDENTITY(1,1),
    NombreProveedor VARCHAR(100) NOT NULL,
    Direccion VARCHAR(200),
    Telefono VARCHAR(15),
    Correo VARCHAR(100),
    EstadoProveedor BIT DEFAULT 1 -- 1 = Activo, 0 = Inactivo
);

-- 8. Compras y Detalle
CREATE TABLE Compras (
    IdCompra INT PRIMARY KEY IDENTITY(1,1),
    IdEmpleado INT FOREIGN KEY REFERENCES Empleados(IdEmpleado),
    IdProveedor INT FOREIGN KEY REFERENCES Proveedores(IdProveedor),
    FechaCompra DATE DEFAULT GETDATE(),
    Total DECIMAL(10,2)
);

CREATE TABLE DetalleCompra (
    IdDetalleCompra INT PRIMARY KEY IDENTITY(1,1),
    IdCompra INT FOREIGN KEY REFERENCES Compras(IdCompra),
    IdProducto INT FOREIGN KEY REFERENCES Productos(IdProducto),
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL
);

-- 9. Ventas y Detalle
CREATE TABLE Ventas (
    IdVenta INT PRIMARY KEY IDENTITY(1,1),
    IdEmpleado INT FOREIGN KEY REFERENCES Empleados(IdEmpleado),
    IdCliente INT FOREIGN KEY REFERENCES Clientes(IdCliente),
    FechaVenta DATE DEFAULT GETDATE(),
    Subtotal DECIMAL(10,2),
    Descuento DECIMAL(10,2),
    Total DECIMAL(10,2),
    TotalVenta VARCHAR(50)
);

CREATE TABLE DetalleVenta (
    IdDetalleVenta INT PRIMARY KEY IDENTITY(1,1),
    IdVenta INT FOREIGN KEY REFERENCES Ventas(IdVenta),
    IdProducto INT FOREIGN KEY REFERENCES Productos(IdProducto),
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(10,2)
);

-- 10. Pedidos y Detalle
CREATE TABLE Pedidos (
    IdPedido INT PRIMARY KEY IDENTITY(1,1),
    IdCliente INT FOREIGN KEY REFERENCES Clientes(IdCliente),
    FechaPedido DATE DEFAULT GETDATE(),
    Descripcion VARCHAR(100),
    EstadoPedido BIT DEFAULT 1 -- 1 = Activo, 0 = Cancelado/Inactivo
);

CREATE TABLE DetallePedido (
    IdDetallePedido INT PRIMARY KEY IDENTITY(1,1),
    IdPedido INT FOREIGN KEY REFERENCES Pedidos(IdPedido),
    IdProducto INT FOREIGN KEY REFERENCES Productos(IdProducto),
    Cantidad INT NOT NULL
);



ALTER TABLE Productos
ADD Imagen VARBINARY(MAX);


ALTER TABLE Productos ADD ImagenUrl VARCHAR(255);

-- Inserciones de prueba
INSERT INTO roles (NombreRol) VALUES ('Administrador');
INSERT INTO roles (NombreRol) VALUES ('Cliente');
INSERT INTO roles (NombreRol) VALUES ('Vendedor');
INSERT INTO roles (NombreRol) VALUES ('Bodeguero');


INSERT INTO Usuarios (Nombre, Apellido, Email, Pass, IdRol)
VALUES ('keneth', 'Palacios', 'kepalcast07@gmail.com', CONVERT(VARCHAR(32), HASHBYTES('MD5', '1234'), 2), 2);

INSERT INTO usuarios (nombre, Apellidos, Correo, Pass, IdRol)
VALUES ('keneth', 'Palacios', 'kepalcast07@gmail.com', '1234', 2);



-- Consulta para login
SELECT * FROM usuarios WHERE correo = 'kepalcast07@gmail.com' AND contrasena = CONVERT(VARCHAR(32), HASHBYTES('MD5', 'mi_contraseña'), 2);
SELECT * FROM GoldenSkin.dbo.usuarios;

select * from roles
select * from privilegios
SELECT * FROM usuarios
SELECT * FROM Clientes
SELECT * FROM Productos where Categoria='Maquillaje'
SELECT * FROM Pedidos
SELECT * FROM Productos


use goldenskin
use GoldenSkin
use Northwind
select * from Employees
select * from Marcas

insert into Marcas (NombreMarca, Descripcion, Fabricante,EstadoMarca) values('Neutrogena',
'Es una solución ligera, con una amplia protección para prevenir daños ocasionados por los rayos del sol. Tecnología Dry-Touch para un acabado ligero y sin brillo.',
'Avon',1)


INSERT INTO Productos 
(NombreProducto, Descripcion, Precio, Cantidad, IdMarca, EstadoProducto, Imagen)
VALUES 
('Ultra Sheer', 'Protector solar Neutrogena', 22.00, 50, 1, 1, 'C:\Users\Nesto\Downloads\golden-skin-api\public\images\Protector Neutrogena 50.jpg');


INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, IdMarca, EstadoProducto, Imagen)
SELECT 'Ultra Sheer', 'Protector solar Neutrogena', 22.00, 50, 1, 1,
       BulkColumn
FROM OPENROWSET(BULK 'C:\Images\Protector Neutrogena 50.jpg', SINGLE_BLOB) AS Imagen;


-- Inserción de marcas
INSERT INTO Marcas (NombreMarca, Descripcion, Fabricante, EstadoMarca)
VALUES 
('Rare Beauty', 'Marca de maquillaje creada por Selena Gomez', 'Rare Beauty Inc.', 1),
('The Ordinary', 'Marca de cosméticos con enfoque en activos específicos', 'DECIEM', 1),
('Mario Badescu', 'Productos de cuidado facial', 'Mario Badescu Skin Care', 1),
('Cerave', 'Marca dermatológica de cuidado para piel seca y sensible', 'L`Oréal', 1),
('Bioderma', 'Marca francesa especializada en biología dermatológica', 'Laboratoire Bioderma', 1),
('Cetaphil', 'Marca de cuidado dermatológico suave', 'Galderma', 1),
('Tree Hut', 'Productos de exfoliación y baño con fragancias tropicales', 'Naterra', 1),
('Magic', 'Productos de depilación accesibles', 'SoftSheen-Carson', 1),
('Neutrogena', 'Marca de cuidado facial y solar', 'Johnson & Johnson', 1),
('Eucerin', 'Cuidado dermatológico avanzado', 'Beiersdorf AG', 1);


-- Inserción de productos
INSERT INTO Productos (NombreProducto, Descripcion, Precio, Cantidad, FechaFabricacion, IdMarca, EstadoProducto, Categoria, Imagen)
VALUES
('Soft Pinch Blush Encourage', 'Soft Pinch Blush Encourage', 35, 1, '06/10/2025', 1, 1, 'Maquillaje', NULL),
('Soft Pinch Blush Believe', 'Soft Pinch Blush Believe', 35, 1, '06/10/2025', 1, 1, 'Maquillaje', NULL),
('Soft Pinch Blush Worth', 'Soft Pinch Blush Worth', 35, 1, '06/10/2025', 1, 1, 'Maquillaje', NULL),
('Soft Pinch Lip oil Joy', 'Soft Pinch Lip oil Joy', 32, 2, '06/10/2025', 1, 1, 'Maquillaje', NULL),
('Soft Pinch Lip oil Hope', 'Soft Pinch Lip oil Hope', 32, 1, '06/10/2025', 1, 1, 'Maquillaje', NULL),
('Soft Pinch Lip oil serenity', 'Soft Pinch Lip oil serenity', 32, 1, '06/10/2025', 1, 1, 'Maquillaje', NULL),
('Multi Peptide lash and brown', 'Multi Peptide lash and brown', 25, 5, '06/10/2025', 2, 1, 'Maquillaje', NULL),
('Salicylic Acid 2% Solution', 'Salicylic Acid 2% Solution', 16, 6, '06/10/2025', 2, 1, 'Skincare', NULL),
('Niacinamide 30ml', 'Niacinamide 30ml', 17, 1, '06/10/2025', 2, 1, 'Skincare', NULL),
('Niacinamide 60ml', 'Niacinamide 60ml', 26, 2, '06/10/2025', 2, 1, 'Skincare', NULL),
('Caffeine Solution 5%', 'Caffeine Solution 5%', 19, 5, '06/10/2025', 2, 1, 'Skincare', NULL),
('Alpha Arbutin 2%', 'Alpha Arbutin 2%', 19, 5, '06/10/2025', 2, 1, 'Skincare', NULL),
('Peeling Solution', 'Peeling Solution', 19, 6, '06/10/2025', 2, 1, 'Skincare', NULL),
('Hyaluronic Acid 2%', 'Hyaluronic Acid 2%', 19, 8, '06/10/2025', 2, 1, 'Skincare', NULL),
('Vitamina C Suspension', 'Vitamina C Suspension', 15, 3, '06/10/2025', 2, 1, 'Skincare', NULL),
('Natural Moisturizing Factors 100ml', 'Natural Moisturizing Factors 100ml', 26, 5, '06/10/2025', 2, 1, 'Skincare', NULL),
('Natural Moisturizing Factors 30ml', 'Natural Moisturizing Factors 30ml', 16, 4, '06/10/2025', 2, 1, 'Skincare', NULL),
('Azelaic Acid Suspension', 'Azelaic Acid Suspension', 20, 5, '06/10/2025', 2, 1, 'Skincare', NULL),
('Facial Spray Agua de rosas', 'Facial Spray Agua de rosas', 10, 2, '06/10/2025', 3, 1, 'Skincare', NULL),
('Glycolic Acid 7%', 'Glycolic Acid 7%', 25, 13, '06/10/2025', 2, 1, 'Skincare', NULL),
('Foaming Facial Cleanser 16onz', 'Foaming Facial Cleanser 16onz', 30, 13, '06/10/2025', 4, 1, 'Skincare', NULL),
('Foaming Facial Cleanser 3 onz', 'Foaming Facial Cleanser 3 onz', 8, 10, '06/10/2025', 4, 1, 'Skincare', NULL),
('Hydrating Facial Cleanser 16 onz', 'Hydrating Facial Cleanser 16 onz', 30, 10, '06/10/2025', 4, 1, 'Skincare', NULL),
('Hydrating Facial Cleanser 3 onz', 'Hydrating Facial Cleanser 3 onz', 8, 7, '06/10/2025', 4, 1, 'Skincare', NULL),
('Sebium Gel Moussant', 'Sebium Gel Moussant', 29, 8, '06/10/2025', 5, 1, 'Skincare', NULL),
('Sensibio Gel Moussant', 'Sensibio Gel Moussant', 29, 5, '06/10/2025', 5, 1, 'Skincare', NULL),
('Daily Facial cleanser 16 onz', 'Daily Facial cleanser 16 onz', 27, 2, '06/10/2025', 6, 1, 'Skincare', NULL),
('Daily Facial cleanser 8 onz', 'Daily Facial cleanser 8 onz', 20, 3, '06/10/2025', 6, 1, 'Skincare', NULL),
('Gentle Skin Cleanser 16onz', 'Gentle Skin Cleanser 16onz', 27, 4, '06/10/2025', 6, 1, 'Skincare', NULL),
('Gentle Skin Cleanser 8onz', 'Gentle Skin Cleanser 8onz', 20, 3, '06/10/2025', 6, 1, 'Skincare', NULL),
('Acne Control cleanser', 'Acne Control cleanser', 28, 9, '06/10/2025', 4, 1, 'Skincare', NULL),
('Renewing Cleanser', 'Renewing Cleanser', 25, 3, '06/10/2025', 4, 1, 'Skincare', NULL),
('SA Lotion Rough&Bumpy Skin', 'SA Lotion Rough&Bumpy Skin', 28, 5, '06/10/2025', 4, 1, 'Skincare', NULL),
('SA Cream Rough&Bumpy Skin', 'SA Cream Rough&Bumpy Skin', 30, 1, '06/10/2025', 4, 1, 'Skincare', NULL),
('Sebium H2O Agua micelar', 'Sebium H2O Agua micelar', 32, 4, '06/10/2025', 5, 1, 'Skincare', NULL),
('Sensibio Agua micelar', 'Sensibio Agua micelar', 32, 4, '06/10/2025', 5, 1, 'Skincare', NULL),
('Gel de baño Vitamina C', 'Gel de baño Vitamina C', 20, 4, '06/10/2025', 7, 1, 'Baño', NULL),
('Gel de bano Watermelon', 'Gel de bano Watermelon', 20, 2, '06/10/2025', 7, 1, 'Baño', NULL),
('Exfoliante coco colada', 'Exfoliante coco colada', 20, 2, '06/10/2025', 7, 1, 'Baño', NULL),
('Exfoliante watermelon', 'Exfoliante watermelon', 20, 1, '06/10/2025', 7, 1, 'Baño', NULL),
('Exfoliante fresa', 'Exfoliante fresa', 20, 1, '06/10/2025', 7, 1, 'Baño', NULL),
('Exfoliante cotton candy', 'Exfoliante cotton candy', 20, 1, '06/10/2025', 7, 1, 'Baño', NULL),
('Polvo depilador', 'Polvo depilador', 15, 4, '06/10/2025', 8, 1, 'Otro', NULL),
('Body clear body wash', 'Body clear body wash', 20, 6, '06/10/2025', 9, 1, 'Baño', NULL),
('Acne Foaming cream cleanser', 'Acne Foaming cream cleanser', 25, 4, '06/10/2025', 4, 1, 'Baño', NULL),
('Acne control gel', 'Acne control gel', 25, 7, '06/10/2025', 4, 1, 'Baño', NULL),
('Resurfacing retinol serum', 'Resurfacing retinol serum', 25, 8, '06/10/2025', 4, 1, 'Serum', NULL),
('Eye repair cream', 'Eye repair cream', 23, 3, '06/10/2025', 4, 1, 'Skincare', NULL),
('Facial moisturizing Lotion AM', 'Facial moisturizing Lotion AM', 26, 7, '06/10/2025', 4, 1, 'Skincare', NULL),
('Facial moisturizing Lotion PM', 'Facial moisturizing Lotion PM', 26, 3, '06/10/2025', 4, 1, 'Skincare', NULL),
('Skin renewing Vitamina C', 'Skin renewing Vitamina C', 15, 9, '06/10/2025', 4, 1, 'Serum', NULL),
('Hydro Boost', 'Hydro Boost', 30, 14, '06/10/2025', 9, 1, 'Skincare', NULL),
('Daily Moisturizing Lotion', 'Daily Moisturizing Lotion', 25, 2, '06/10/2025', 4, 1, 'Skincare', NULL),
('Hydro Boost protector solar', 'Hydro Boost protector solar', 25, 5, '06/10/2025', 9, 1, 'Protector Solar', NULL),
('Protector solar Ultra sheer', 'Protector solar Ultra sheer', 22, 7, '06/10/2025', 9, 1, 'Protector Solar', NULL),
('Oil control mineral', 'Oil control mineral', 25, 4, '06/10/2025', 10, 1, 'Protector Solar', NULL),
('Oil control anti brillo sin tinte protector solar', 'Oil control anti brillo sin tinte protector solar', 30, 11, '06/10/2025', 10, 1, 'Protector Solar', NULL),
('Oil control anti brillo con tinte protector solar', 'Oil control anti brillo con tinte protector solar', 30, 5, '06/10/2025', 10, 1, 'Protector Solar', NULL),
('Pigment control protector solar', 'Pigment control protector solar', 30, 7, '06/10/2025', 10, 1, 'Protector Solar', NULL),
('Pigment control protector solar con tinte', 'Pigment control protector solar con tinte', 30, 1, '06/10/2025', 10, 1, 'Protector Solar', NULL),
('Photoaging control protector solar', 'Photoaging control protector solar', 30, 2, '06/10/2025', 10, 1, 'Protector Solar', NULL),
('Photoderm Mineral protector solar', 'Photoderm Mineral protector solar', 25, 5, '06/10/2025', 5, 1, 'Protector Solar', NULL),
('Photoderm Creme protector solar', 'Photoderm Creme protector solar', 25, 5, '06/10/2025', 5, 1, 'Protector Solar', NULL);
