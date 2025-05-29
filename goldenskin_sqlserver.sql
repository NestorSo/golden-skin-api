Create database GoldenSkin
use GoldenSkin
use master

-- 1. Roles y Privilegios
CREATE TABLE roles (
    id_rol INT PRIMARY KEY IDENTITY(1,1),
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE privilegios (
    id_privilegio INT PRIMARY KEY IDENTITY(1,1),
    descripcion VARCHAR(255) NOT NULL,
    id_rol INT FOREIGN KEY REFERENCES roles(id_rol)
);

-- 2. Usuarios
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    estado_login BIT DEFAULT 1,
    fecha_registro DATE DEFAULT GETDATE(),
    id_rol INT FOREIGN KEY REFERENCES roles(id_rol)
);

-- 3. Empleados
CREATE TABLE empleados (
    id_empleado INT PRIMARY KEY IDENTITY(1,1),
    id_usuario INT UNIQUE FOREIGN KEY REFERENCES usuarios(id_usuario),
    cargo VARCHAR(100) NOT NULL
);

-- 4. Clientes
CREATE TABLE clientes (
    id_cliente INT PRIMARY KEY IDENTITY(1,1),
    id_usuario INT UNIQUE FOREIGN KEY REFERENCES usuarios(id_usuario),
    direccion VARCHAR(MAX) NOT NULL,
    telefono VARCHAR(15) NOT NULL
);

-- 5. Marcas
CREATE TABLE marcas (
    id_marca INT PRIMARY KEY IDENTITY(1,1),
    nombre_marca VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(MAX),
    fabricante VARCHAR(100)
);

-- 6. Productos
CREATE TABLE productos (
    id_producto INT PRIMARY KEY IDENTITY(1,1),
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion VARCHAR(MAX),
    precio DECIMAL(10,2) NOT NULL,
    cantidad INT NOT NULL,
    fecha_vencimiento DATE,
    id_marca INT FOREIGN KEY REFERENCES marcas(id_marca)
);

-- 7. Proveedores
CREATE TABLE proveedores (
    id_proveedor INT PRIMARY KEY IDENTITY(1,1),
    nombre_proveedor VARCHAR(100) NOT NULL,
    direccion VARCHAR(MAX),
    telefono VARCHAR(15),
    correo VARCHAR(100)
);

-- 8. Compras y Detalle
CREATE TABLE compras (
    id_compra INT PRIMARY KEY IDENTITY(1,1),
    id_empleado INT FOREIGN KEY REFERENCES empleados(id_empleado),
    id_proveedor INT FOREIGN KEY REFERENCES proveedores(id_proveedor),
    fecha_compra DATE DEFAULT GETDATE(),
    total DECIMAL(10,2)
);

CREATE TABLE detalle_compra (
    id_detalle_compra INT PRIMARY KEY IDENTITY(1,1),
    id_compra INT FOREIGN KEY REFERENCES compras(id_compra),
    id_producto INT FOREIGN KEY REFERENCES productos(id_producto),
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL
);

-- 9. Ventas y Detalle
CREATE TABLE ventas (
    id_venta INT PRIMARY KEY IDENTITY(1,1),
    id_empleado INT FOREIGN KEY REFERENCES empleados(id_empleado),
    id_cliente INT FOREIGN KEY REFERENCES clientes(id_cliente),
    fecha_venta DATE DEFAULT GETDATE(),
    sub_total DECIMAL(10,2),
    descuento DECIMAL(10,2),
    total DECIMAL(10,2),
    tipo_venta VARCHAR(50)
);

CREATE TABLE detalle_venta (
    id_detalle_venta INT PRIMARY KEY IDENTITY(1,1),
    id_venta INT FOREIGN KEY REFERENCES ventas(id_venta),
    id_producto INT FOREIGN KEY REFERENCES productos(id_producto),
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2)
);

-- 10. Pedidos y Detalle
CREATE TABLE pedidos (
    id_pedido INT PRIMARY KEY IDENTITY(1,1),
    id_cliente INT FOREIGN KEY REFERENCES clientes(id_cliente),
    fecha_pedido DATE DEFAULT GETDATE(),
    descripcion VARCHAR(MAX)
);

CREATE TABLE detalle_pedido (
    id_detalle_pedido INT PRIMARY KEY IDENTITY(1,1),
    id_pedido INT FOREIGN KEY REFERENCES pedidos(id_pedido),
    id_producto INT FOREIGN KEY REFERENCES productos(id_producto),
    cantidad INT NOT NULL
);

-- Inserciones de prueba
INSERT INTO roles (nombre_rol) VALUES ('Administrador');

INSERT INTO usuarios (nombre, apellido, correo, contrasena, id_rol)
VALUES ('Carlos', 'Lopez', 'carlos@gmail.com', CONVERT(VARCHAR(32), HASHBYTES('MD5', 'mi_contraseña'), 2), 1);
insert into roles(nombre_rol) values ('Cliente')

-- Consulta para login
SELECT * FROM usuarios WHERE correo = 'carlos@gmail.com' AND contrasena = CONVERT(VARCHAR(32), HASHBYTES('MD5', 'mi_contraseña'), 2);
select * from usuarios