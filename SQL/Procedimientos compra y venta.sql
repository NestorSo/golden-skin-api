
use GoldenSkin
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

    -- 1. Insertar en Compras (total se actualizará con trigger)
    INSERT INTO Compras (IdEmpleado, IdProveedor, FechaCompra, Total)
    VALUES (@IdEmpleado, @IdProveedor, GETDATE(), 0);

    SET @IdCompra = SCOPE_IDENTITY();

    -- 2. Insertar detalle de compra
    EXEC NuevoDetalleCompra @IdCompra, @IdProducto, @Cantidad, @PrecioUnitario;

    -- 3. Actualizar precio de productos (si aplica)
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
  SET NOCOUNT ON;

  DECLARE @Subtotal DECIMAL(10,2) = @Cantidad * @PrecioUnitario;

  INSERT INTO DetalleCompra (IdCompra, IdProducto, CantidadComprada, PrecioCompra, SubtotalCompra)
  VALUES (@IdCompra, @IdProducto, @Cantidad, @PrecioUnitario, @Subtotal);
END;


CREATE TRIGGER tr_ActualizarInventarioPostCompra
ON DetalleCompra
AFTER INSERT
AS
BEGIN
  SET NOCOUNT ON;

  -- Aumentar inventario
  UPDATE P
  SET P.Cantidad = P.Cantidad + I.CantidadComprada
  FROM Productos P
  JOIN inserted I ON P.IdProducto = I.IdProducto;

  -- Actualizar total de la compra (con 15% aplicado al subtotal)
  UPDATE C
  SET C.Total = (
    SELECT SUM(SubtotalCompra) * 1.15
    FROM DetalleCompra
    WHERE IdCompra = C.IdCompra
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
                 WHEN DC.PrecioCompra > P.Precio THEN DC.PrecioCompra * 1.08
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
         DC.CantidadComprada AS Cantidad,
         DC.PrecioCompra AS PrecioUnitario,
         DC.SubtotalCompra AS Subtotal
  FROM DetalleCompra DC
  INNER JOIN Productos P ON DC.IdProducto = P.IdProducto
  WHERE DC.IdCompra = @IdCompra;
END;



-------------------gestion de ventas

-- hacer el subtotal de la venta

CREATE FUNCTION fn_SubtotalVenta (
    @IdProducto INT,
    @CantidadVendida INT
)
RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @PrecioUnitario DECIMAL(10,2);

    SELECT @PrecioUnitario = Precio
    FROM Productos
    WHERE IdProducto = @IdProducto;

    RETURN @PrecioUnitario * @CantidadVendida;
END;
-- calcular el descuento
CREATE FUNCTION CalcularDescuentoPorCantidad
(
    @IdVenta INT
)
RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @Descuento DECIMAL(10,2) = 0.00;

    IF (
        SELECT COUNT(DISTINCT IdProducto)
        FROM DetalleVenta
        WHERE IdVenta = @IdVenta
    ) > 3
    BEGIN
        -- Obtener subtotal de la venta
        DECLARE @Subtotal DECIMAL(10,2);
        SELECT @Subtotal = SUM(Subtotal)
        FROM DetalleVenta
        WHERE IdVenta = @IdVenta;

        SET @Descuento = @Subtotal * 0.05; -- 5% de descuento
    END

    RETURN @Descuento;
END;


--nuevo detalle de venta
CREATE PROCEDURE NuevoDetalleVenta
  @IdVenta INT,
  @IdProducto INT,
  @Cantidad INT
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @Existencia INT;

  SELECT @Existencia = Cantidad
  FROM Productos
  WHERE IdProducto = @IdProducto;

  IF @Cantidad <= 0 OR @Cantidad > @Existencia
  BEGIN
    RAISERROR('❌ La cantidad es inválida o supera el inventario disponible.', 16, 1);
    RETURN;
  END

  DECLARE @Subtotal DECIMAL(10,2) = dbo.fn_SubtotalVenta(@IdProducto, @Cantidad);

  INSERT INTO DetalleVenta (IdVenta, IdProducto, Subtotal, CantidadVendida)
  VALUES (@IdVenta, @IdProducto, @Subtotal, @Cantidad);
END;


CREATE TRIGGER tr_ActualizarInventarioPostVenta
ON DetalleVenta
AFTER INSERT
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE P
  SET P.Cantidad = P.Cantidad - I.CantidadVendida
  FROM Productos P
  JOIN inserted I ON P.IdProducto = I.IdProducto;
END;


CREATE TRIGGER tr_ActualizarTotalVenta
ON DetalleVenta
AFTER INSERT
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE V
  SET V.Total = (
    SELECT SUM(Subtotal)
    FROM DetalleVenta
    WHERE IdVenta = V.IdVenta
  ) * 1.15
  FROM Ventas V
  JOIN inserted I ON V.IdVenta = I.IdVenta;
END;

--gestion de la venta
CREATE PROCEDURE GestionarVentaGoldenSkin
  @IdCliente INT,
  @IdEmpleado INT,
  @IdProducto INT,
  @Cantidad INT
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @IdVenta INT;

  BEGIN TRY
    BEGIN TRAN;

    -- Insertar la venta (Descuento y Total inicial en 0, Delivery por defecto en 0)
    INSERT INTO Ventas (IdEmpleado, IdCliente, FechaVenta, Descuento, Total, Delivery)
    VALUES (@IdEmpleado, @IdCliente, GETDATE(), 0, 0, 0);

    SET @IdVenta = SCOPE_IDENTITY();

    -- Insertar detalle de venta
    EXEC NuevoDetalleVenta @IdVenta, @IdProducto, @Cantidad;

    -- Obtener el descuento si aplica (más de 3 productos distintos)
    DECLARE @Descuento DECIMAL(10,2) = dbo.CalcularDescuentoPorCantidad(@IdVenta);

    -- Actualizar el campo descuento
    UPDATE Ventas
    SET Descuento = @Descuento
    WHERE IdVenta = @IdVenta;

    -- Nota: el total se calculará automáticamente por el trigger tr_ActualizarTotalVenta
    -- Y si es delivery, el trigger tr_AjustarTotalPorDelivery lo ajustará con el recargo

    COMMIT;
    PRINT '✅ Venta registrada correctamente con cálculo automático de total.';
  END TRY
  BEGIN CATCH
    ROLLBACK;
    DECLARE @Error NVARCHAR(4000) = ERROR_MESSAGE();
    PRINT '❌ Error al registrar la venta: ' + @Error;
  END CATCH
END;



---listados 
CREATE PROCEDURE sp_ListarTodasLasVentas
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        V.IdVenta,
        V.FechaVenta,
        U.Nombre + ' ' + U.Apellido AS Empleado,
        C.IdCliente,
        CU.Nombre + ' ' + CU.Apellido AS Cliente,
        V.Descuento,
        V.Total,
        CASE WHEN V.Delivery = 1 THEN 'Sí' ELSE 'No' END AS EsDelivery
    FROM Ventas V
    INNER JOIN Empleados E ON V.IdEmpleado = E.IdEmpleado
    INNER JOIN Usuarios U ON E.IdUsuario = U.IdUsuario
    INNER JOIN Clientes C ON V.IdCliente = C.IdCliente
    INNER JOIN Usuarios CU ON C.IdUsuario = CU.IdUsuario
    ORDER BY V.FechaVenta DESC;
END;
don

--por cliente
CREATE PROCEDURE sp_ListarVentasPorCliente
    @IdCliente INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        V.IdVenta,
        V.FechaVenta,
        V.Descuento,
        V.Total
    FROM Ventas V
    WHERE V.IdCliente = @IdCliente
    ORDER BY V.FechaVenta DESC;
END;

--entre fechas
CREATE PROCEDURE sp_ListarVentasEntreFechas
    @FechaInicio DATE,
    @FechaFin DATE
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        V.IdVenta,
        V.FechaVenta,
        CU.Nombre + ' ' + CU.Apellido AS Cliente,
        V.Total
    FROM Ventas V
    INNER JOIN Clientes C ON V.IdCliente = C.IdCliente
    INNER JOIN Usuarios CU ON C.IdUsuario = CU.IdUsuario
    WHERE V.FechaVenta BETWEEN @FechaInicio AND @FechaFin
    ORDER BY V.FechaVenta DESC;
END;
--venta especifica
CREATE PROCEDURE sp_VerDetalleVenta
    @IdVenta INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        DV.IdDetalleVenta,
        P.NombreProducto,
        DV.CantidadVendida,
        DV.Subtotal
    FROM DetalleVenta DV
    INNER JOIN Productos P ON DV.IdProducto = P.IdProducto
    WHERE DV.IdVenta = @IdVenta;
END;

--ventas por producto
CREATE PROCEDURE sp_VentasPorProducto
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        P.NombreProducto,
        SUM(DV.CantidadVendida) AS TotalVendido,
        SUM(DV.Subtotal) AS IngresoTotal
    FROM DetalleVenta DV
    INNER JOIN Productos P ON DV.IdProducto = P.IdProducto
    GROUP BY P.NombreProducto
    ORDER BY IngresoTotal DESC;
END;


