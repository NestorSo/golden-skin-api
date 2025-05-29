-- A continuación se implementarán los procedimientos solicitados para:
-- 1. Inserción, actualización y baja lógica de las tablas
-- 2. Listado general
-- 3. Procedimientos especiales: ventas y compras con triggers para inventario
-- 4. Procedimiento de alerta por bajo stock y vencimiento de producto

-- 1. Procedimiento: Insertar nuevo usuario (cliente por defecto)
CREATE PROCEDURE InsertarUsuario
  @Nombre VARCHAR(100),
  @Apellido VARCHAR(100),
  @Email VARCHAR(150),
  @Pass VARCHAR(255),
  @Rol INT = 1 -- 1: Cliente por defecto
AS
BEGIN
  INSERT INTO Usuarios (Nombre, Apellido, Email, Pass, IdRol)
  VALUES (@Nombre, @Apellido, @Email, @Pass, @Rol);
END;

-- 2. Procedimiento: Actualizar datos del usuario
CREATE PROCEDURE ActualizarUsuario
  @IdUsuario INT,
  @Nombre VARCHAR(100),
  @Apellido VARCHAR(100),
  @Email VARCHAR(150)
AS
BEGIN
  UPDATE Usuarios
  SET Nombre = @Nombre,
      Apellido = @Apellido,
      Email = @Email
  WHERE IdUsuario = @IdUsuario;
END;

-- 3. Procedimiento: Dar de baja a un usuario
CREATE PROCEDURE BajaUsuario
  @IdUsuario INT
AS
BEGIN
  UPDATE Usuarios
  SET EstadoUsuario = 0
  WHERE IdUsuario = @IdUsuario;
END;

-- 4. Procedimiento: Listar usuarios activos
CREATE PROCEDURE ListarUsuariosActivos
AS
BEGIN
  SELECT * FROM Usuarios WHERE EstadoUsuario = 1;
END;

-- 5. Procedimiento: Registrar una nueva venta
CREATE PROCEDURE RegistrarVenta
  @IdEmpleado INT,
  @IdCliente INT,
  @Subtotal DECIMAL(10,2),
  @Descuento DECIMAL(10,2),
  @Total DECIMAL(10,2),
  @Productos XML
AS
BEGIN
  DECLARE @IdVenta INT;

  BEGIN TRANSACTION;

  INSERT INTO Ventas (IdEmpleado, IdCliente, Subtotal, Descuento, Total)
  VALUES (@IdEmpleado, @IdCliente, @Subtotal, @Descuento, @Total);

  SET @IdVenta = SCOPE_IDENTITY();

  -- Insertar productos desde XML
  INSERT INTO DetalleVenta (IdVenta, IdProducto, Cantidad, PrecioUnitario)
  SELECT
    @IdVenta,
    Tbl.Col.value('(IdProducto)[1]', 'INT'),
    Tbl.Col.value('(Cantidad)[1]', 'INT'),
    Tbl.Col.value('(Precio)[1]', 'DECIMAL(10,2)')
  FROM @Productos.nodes('/Productos/Item') AS Tbl(Col);

  COMMIT;
END;

-- 6. Trigger: Actualizar inventario luego de una venta
CREATE TRIGGER tr_AjustarInventarioVenta
ON DetalleVenta
AFTER INSERT
AS
BEGIN
  UPDATE P
  SET P.Cantidad = P.Cantidad - I.Cantidad
  FROM Productos P
  JOIN INSERTED I ON P.IdProducto = I.IdProducto;
END;

-- 7. Procedimiento: Registrar nueva compra
CREATE PROCEDURE RegistrarCompra
  @IdEmpleado INT,
  @IdProveedor INT,
  @Total DECIMAL(10,2),
  @Productos XML
AS
BEGIN
  DECLARE @IdCompra INT;

  BEGIN TRANSACTION;

  INSERT INTO Compras (IdEmpleado, IdProveedor, Total)
  VALUES (@IdEmpleado, @IdProveedor, @Total);

  SET @IdCompra = SCOPE_IDENTITY();

  -- Insertar productos desde XML
  INSERT INTO DetalleCompra (IdCompra, IdProducto, Cantidad, PrecioUnitario)
  SELECT
    @IdCompra,
    Tbl.Col.value('(IdProducto)[1]', 'INT'),
    Tbl.Col.value('(Cantidad)[1]', 'INT'),
    Tbl.Col.value('(Precio)[1]', 'DECIMAL(10,2)')
  FROM @Productos.nodes('/Productos/Item') AS Tbl(Col);

  COMMIT;
END;

-- 8. Trigger: Actualizar inventario luego de compra
CREATE TRIGGER tr_AjustarInventarioCompra
ON DetalleCompra
AFTER INSERT
AS
BEGIN
  UPDATE P
  SET P.Cantidad = P.Cantidad + I.Cantidad
  FROM Productos P
  JOIN INSERTED I ON P.IdProducto = I.IdProducto;
END;

-- 9. Procedimiento de alerta por stock bajo o productos vencidos
CREATE PROCEDURE AlertasProductos
AS
BEGIN
  SELECT NombreProducto, Cantidad
  FROM Productos
  WHERE Cantidad <= 10;

  SELECT NombreProducto, FechaVencimiento
  FROM Productos
  WHERE DATEDIFF(DAY, GETDATE(), FechaVencimiento) <= 30;
END;

-- 10. Procedimiento: Listar productos con filtros opcionales por nombre o marca
CREATE PROCEDURE ListarProductos
  @NombreProducto VARCHAR(100) = NULL,
  @NombreMarca VARCHAR(100) = NULL
AS
BEGIN
  SELECT P.IdProducto, P.NombreProducto, P.Descripcion, P.Precio, P.Cantidad,
         P.FechaVencimiento, M.NombreMarca
  FROM Productos P
  INNER JOIN Marcas M ON P.IdMarca = M.IdMarca
  WHERE
    (@NombreProducto IS NULL OR P.NombreProducto LIKE '%' + @NombreProducto + '%') AND
    (@NombreMarca IS NULL OR M.NombreMarca LIKE '%' + @NombreMarca + '%');
END;

-- Nota: Para XML de productos en compras o ventas, estructura esperada:
-- <Productos>
--   <Item>
--     <IdProducto>1</IdProducto>
--     <Cantidad>2</Cantidad>
--     <Precio>120.00</Precio>
--   </Item>
-- </Productos>
