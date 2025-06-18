-------------compras y ventas
CREATE PROCEDURE GestionCompraGoldenSkin
  @IdProveedor INT,
  @IdEmpleado INT,
  @IdProducto INT,
  @Cantidad INT,
  @PrecioUnitario DECIMAL(10,2)
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @IdCompra INT;

  BEGIN TRY
    BEGIN TRAN;

    -- 1. Insertar en Compras
    INSERT INTO Compras (IdEmpleado, IdProveedor, FechaCompra, Total)
    VALUES (@IdEmpleado, @IdProveedor, GETDATE(), 0);

    SET @IdCompra = SCOPE_IDENTITY();

    -- 2. Insertar detalle de compra
    EXEC NuevoDetalleCompra @IdCompra, @IdProducto, @Cantidad, @PrecioUnitario;

    -- 3. Actualizar precio (en caso que el nuevo precio sea mayor)
    EXEC ActualizarPrecioProductos;

    COMMIT;
    PRINT '✅ Compra registrada correctamente.';
  END TRY
  BEGIN CATCH
    ROLLBACK;
    PRINT '❌ Error durante la gestión de la compra: ' + ERROR_MESSAGE();
  END CATCH
END;


CREATE PROCEDURE NuevoDetalleCompra
  @IdCompra INT,
  @IdProducto INT,
  @Cantidad INT,
  @PrecioUnitario DECIMAL(10,2)
AS
BEGIN
  INSERT INTO DetalleCompra (IdCompra, IdProducto, Cantidad, PrecioUnitario)
  VALUES (@IdCompra, @IdProducto, @Cantidad, @PrecioUnitario);
END;


CREATE TRIGGER tr_ActualizarInventarioPostCompra
ON DetalleCompra
AFTER INSERT
AS
BEGIN
  SET NOCOUNT ON;

  -- Aumentar inventario
  UPDATE P
  SET P.Cantidad = P.Cantidad + I.Cantidad
  FROM Productos P
  JOIN inserted I ON P.IdProducto = I.IdProducto;

  -- Actualizar total de la compra
  UPDATE C
  SET C.Total = (
    SELECT SUM(DC.Cantidad * DC.PrecioUnitario)
    FROM DetalleCompra DC
    WHERE DC.IdCompra = C.IdCompra
  )
  FROM Compras C
  JOIN inserted I ON C.IdCompra = I.IdCompra;
END;
------

CREATE PROCEDURE ActualizarPrecioProductos
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE P
  SET Precio = CASE
                 WHEN DC.PrecioUnitario > P.Precio THEN DC.PrecioUnitario * 1.08
                 ELSE P.Precio
               END
  FROM Productos P
  JOIN DetalleCompra DC ON P.IdProducto = DC.IdProducto;
END;



--listado de compras
CREATE PROCEDURE sp_ListarTodasLasCompras
AS
BEGIN
    SET NOCOUNT ON;

    SELECT C.IdCompra, 
           C.FechaCompra, 
           P.NombreProveedor, 
           E.IdEmpleado,
           U.Nombre + ' ' + U.Apellido AS Empleado,
           C.Total
    FROM Compras C
    INNER JOIN Proveedores P ON C.IdProveedor = P.IdProveedor
    INNER JOIN Empleados E ON C.IdEmpleado = E.IdEmpleado
    INNER JOIN Usuarios U ON E.IdUsuario = U.IdUsuario
    ORDER BY C.FechaCompra DESC;
END;


--por proveedor
CREATE PROCEDURE sp_ListarComprasPorProveedor
    @IdProveedor INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT C.IdCompra, 
           C.FechaCompra, 
           C.Total
    FROM Compras C
    WHERE C.IdProveedor = @IdProveedor
    ORDER BY C.FechaCompra DESC;
END;
-- entre fechas
CREATE PROCEDURE sp_ListarComprasEntreFechas
    @FechaInicio DATE,
    @FechaFin DATE
AS
BEGIN
    SET NOCOUNT ON;

    SELECT C.IdCompra, 
           C.FechaCompra, 
           P.NombreProveedor, 
           C.Total
    FROM Compras C
    INNER JOIN Proveedores P ON C.IdProveedor = P.IdProveedor
    WHERE C.FechaCompra BETWEEN @FechaInicio AND @FechaFin
    ORDER BY C.FechaCompra DESC;
END;
-- compra especifica

CREATE PROCEDURE sp_VerDetalleCompra
    @IdCompra INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT DC.IdDetalleCompra,
           P.NombreProducto,
           DC.Cantidad,
           DC.PrecioUnitario,
           (DC.Cantidad * DC.PrecioUnitario) AS Subtotal
    FROM DetalleCompra DC
    INNER JOIN Productos P ON DC.IdProducto = P.IdProducto
    WHERE DC.IdCompra = @IdCompra;
END;
