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
    Email VARCHAR(150) NOT NULL UNIQUE,
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
    Direccion VARCHAR(MAX) NOT NULL,
    Telefono VARCHAR(15) NOT NULL
);

-- 5. Marcas
CREATE TABLE Marcas (
    IdMarca INT PRIMARY KEY IDENTITY(1,1),
    NombreMarca VARCHAR(100) NOT NULL UNIQUE,
    Descripcion VARCHAR(MAX),
    Fabricante VARCHAR(100),
    EstadoMarca BIT DEFAULT 1 -- 1 = Activa, 0 = Inactiva
);

-- 6. Productos
CREATE TABLE Productos (
    IdProducto INT PRIMARY KEY IDENTITY(1,1),
    NombreProducto VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(MAX),
    Precio DECIMAL(10,2) NOT NULL,
    Cantidad INT NOT NULL,
    FechaVencimiento DATE,
    IdMarca INT FOREIGN KEY REFERENCES Marcas(IdMarca),
    EstadoProducto BIT DEFAULT 1 -- 1 = Disponible, 0 = Inactivo o Agotado
);

-- 7. Proveedores
CREATE TABLE Proveedores (
    IdProveedor INT PRIMARY KEY IDENTITY(1,1),
    NombreProveedor VARCHAR(100) NOT NULL,
    Direccion VARCHAR(MAX),
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
    Descripcion VARCHAR(MAX),
    EstadoPedido BIT DEFAULT 1 -- 1 = Activo, 0 = Cancelado/Inactivo
);

CREATE TABLE DetallePedido (
    IdDetallePedido INT PRIMARY KEY IDENTITY(1,1),
    IdPedido INT FOREIGN KEY REFERENCES Pedidos(IdPedido),
    IdProducto INT FOREIGN KEY REFERENCES Productos(IdProducto),
    Cantidad INT NOT NULL
);



-- Inserciones de prueba
INSERT INTO roles (nombre_rol) VALUES ('Cliente');

INSERT INTO usuarios (nombre, apellido, correo, contrasena, id_rol)
VALUES ('Carlos', 'Lopez', 'carlos@gmail.com', CONVERT(VARCHAR(32), HASHBYTES('MD5', 'mi_contraseña'), 2), 1);
insert into roles(nombre_rol) values ('Cliente')

-- Consulta para login
SELECT * FROM usuarios WHERE correo = 'kepalcast07@gmail.com' AND contrasena = CONVERT(VARCHAR(32), HASHBYTES('MD5', 'mi_contraseña'), 2);
SELECT * FROM GoldenSkin.dbo.usuarios;

select * from roles
select * from privilegios

use goldenskin