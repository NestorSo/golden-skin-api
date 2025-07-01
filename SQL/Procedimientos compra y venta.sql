
use GoldenSkin
-------------compras y ventas
CREATE PROCEDURE GestionarCompraMultiple
    @IdProveedor INT,
    @IdEmpleado INT,
    @Productos JSON -- [{ "id": 1, "cantidad": 5, "precioUnitario": 100.0 }, ...]
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdCompra INT;
    DECLARE @Fecha DATETIME = GETDATE();
    DECLARE @Total DECIMAL(10,2) = 0.00;

    -- Crear la compra principal
    INSERT INTO Compras (IdProveedor, IdEmpleado, Fecha)
    VALUES (@IdProveedor, @IdEmpleado, @Fecha);

    SET @IdCompra = SCOPE_IDENTITY();

    -- Crear tabla temporal para productos
    CREATE TABLE #Detalle (
        IdProducto INT,
        Cantidad INT,
        PrecioUnitario DECIMAL(10,2)
    );

    -- Insertar los productos desde el JSON
    INSERT INTO #Detalle (IdProducto, Cantidad, PrecioUnitario)
    SELECT
        JSON_VALUE(value, '$.id') AS IdProducto,
        JSON_VALUE(value, '$.cantidad') AS Cantidad,
        JSON_VALUE(value, '$.precioUnitario') AS PrecioUnitario
    FROM OPENJSON(@Productos);

    -- Insertar detalles de la compra y actualizar inventario
    INSERT INTO DetalleCompra (IdCompra, IdProducto, Cantidad, PrecioUnitario, Subtotal)
    SELECT 
        @IdCompra,
        IdProducto,
        Cantidad,
        PrecioUnitario,
        Cantidad * PrecioUnitario
    FROM #Detalle;

    -- Actualizar el total
    SELECT @Total = SUM(Cantidad * PrecioUnitario) FROM #Detalle;

    -- Actualizar la compra con el total
    UPDATE Compras SET Total = @Total WHERE IdCompra = @IdCompra;

    -- Aumentar inventario
    UPDATE p
    SET p.Cantidad = p.Cantidad + d.Cantidad
    FROM Productos p
    INNER JOIN #Detalle d ON p.IdProducto = d.IdProducto;

    DROP TABLE #Detalle;

    PRINT '✅ Compra registrada exitosamente';
END;

alter PROCEDURE GestionCompraGoldenSkin
  @IdProveedor INT,
  @IdEmpleado INT
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @IdCompra INT;

  BEGIN TRY
    BEGIN TRAN;

    -- Crear compra
    INSERT INTO Compras (IdEmpleado, IdProveedor, FechaCompra, Total)
    VALUES (@IdEmpleado, @IdProveedor, GETDATE(), 0);

    SET @IdCompra = SCOPE_IDENTITY();

    -- Insertar detalle desde backend (usando el mismo @IdCompra)

    -- Actualizar precios
    EXEC ActualizarPrecioProductos;

    COMMIT;
    PRINT '✅ Compra registrada con múltiples productos';
  END TRY
  BEGIN CATCH
    ROLLBACK;
    PRINT '❌ Error en la compra múltiple: ' + ERROR_MESSAGE();
  END CATCH
END

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
alter FUNCTION CalcularDescuentoPorCantidad
(
    @IdVenta INT
)
RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @Descuento DECIMAL(10,2) = 0.00;

    -- Calcular la cantidad total de unidades vendidas en la venta
    DECLARE @TotalCantidad INT;
    SELECT @TotalCantidad = SUM(CantidadVendida)
    FROM DetalleVenta
    WHERE IdVenta = @IdVenta;

    -- Si se vendieron más de 10 unidades en total, aplicar 5% de descuento
    IF @TotalCantidad > 10
    BEGIN
        DECLARE @Subtotal DECIMAL(10,2);
        SELECT @Subtotal = SUM(Subtotal)
        FROM DetalleVenta
        WHERE IdVenta = @IdVenta;

        SET @Descuento = @Subtotal * 0.05;
    END

    RETURN @Descuento;
END



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


use goldenskin
--gestion de la venta
GestionarVentaGoldenSkin
create PROCEDURE GestionarVentaMultiple
  @IdCliente INT,
  @IdEmpleado INT,
  @Descripcion NVARCHAR(100)
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @IdVenta INT;

  BEGIN TRY
    BEGIN TRAN;

    -- Crear venta inicial
    INSERT INTO Ventas (IdEmpleado, IdCliente, FechaVenta, Descuento, Total, Delivery)
    VALUES (@IdEmpleado, @IdCliente, GETDATE(), 0, 0, 0);

    SET @IdVenta = SCOPE_IDENTITY();

    -- Insertar cada producto (reutilizar con EXEC externo desde backend)
    -- Backend hará bucles de ejecución de `NuevoDetalleVenta` por cada producto usando @IdVenta

    -- Calcular descuento y actualizar
    DECLARE @Descuento DECIMAL(10,2) = dbo.CalcularDescuentoPorCantidad(@IdVenta);
    UPDATE Ventas
    SET Descuento = @Descuento
    WHERE IdVenta = @IdVenta;

    COMMIT;
    PRINT '✅ Venta registrada con múltiples productos';
  END TRY
  BEGIN CATCH
    ROLLBACK;
    PRINT '❌ Error en la venta múltiple: ' + ERROR_MESSAGE();
  END CATCH
END


ALTER PROCEDURE GestionarVentaGoldenSkin
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

    INSERT INTO Ventas (IdEmpleado, IdCliente, FechaVenta, Descuento, Total, Delivery)
    VALUES (@IdEmpleado, @IdCliente, GETDATE(), 0, 0, 0);

    SET @IdVenta = SCOPE_IDENTITY();

    -- Insertar el detalle directamente
    EXEC NuevoDetalleVenta @IdVenta, @IdProducto, @Cantidad;

    -- Calcular y actualizar descuento
    DECLARE @Descuento DECIMAL(10,2) = dbo.CalcularDescuentoPorCantidad(@IdVenta);

    UPDATE Ventas
    SET Descuento = @Descuento
    WHERE IdVenta = @IdVenta;

    COMMIT;
  END TRY
  BEGIN CATCH
    ROLLBACK;
    THROW;
  END CATCH
END;



use GoldenSkin
-----listados 
--CREATE PROCEDURE sp_ListarTodasLasVentas
--AS
--BEGIN
--    SET NOCOUNT ON;

--    SELECT 
--        V.IdVenta,
--        V.FechaVenta,
--        U.Nombre + ' ' + U.Apellido AS Empleado,
--        C.IdCliente,
--        CU.Nombre + ' ' + CU.Apellido AS Cliente,
--        V.Descuento,
--        V.Total,
--        CASE WHEN V.Delivery = 1 THEN 'Sí' ELSE 'No' END AS EsDelivery
--    FROM Ventas V
--    INNER JOIN Empleados E ON V.IdEmpleado = E.IdEmpleado
--    INNER JOIN Usuarios U ON E.IdUsuario = U.IdUsuario
--    INNER JOIN Clientes C ON V.IdCliente = C.IdCliente
--    INNER JOIN Usuarios CU ON C.IdUsuario = CU.IdUsuario
--    ORDER BY V.FechaVenta DESC;
--END;
sp_ListarTodasLasVentas 
CREATE OR ALTER PROCEDURE sp_ListarTodasLasVentas
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        V.IdVenta,
        V.FechaVenta,
        U.Nombre + ' ' + U.Apellido AS Empleado,
        CU.Nombre + ' ' + CU.Apellido AS Cliente,
        V.Descuento,
        V.Total,
        V.Delivery AS EsDelivery
    FROM Ventas V
    INNER JOIN Empleados E ON V.IdEmpleado = E.IdEmpleado
    INNER JOIN Usuarios U ON E.IdUsuario = U.IdUsuario
    INNER JOIN Clientes C ON V.IdCliente = C.IdCliente
    INNER JOIN Usuarios CU ON C.IdUsuario = CU.IdUsuario
    ORDER BY V.FechaVenta DESC;
END;



CREATE PROCEDURE sp_ListarVentasDelivery
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        V.IdVenta,
        V.FechaVenta,
        U.Nombre + ' ' + U.Apellido AS Empleado,
        CU.Nombre + ' ' + CU.Apellido AS Cliente,
        V.Descuento,
        V.Total,
        'Sí' AS EsDelivery
    FROM Ventas V
    INNER JOIN Empleados E ON V.IdEmpleado = E.IdEmpleado
    INNER JOIN Usuarios U ON E.IdUsuario = U.IdUsuario
    INNER JOIN Clientes C ON V.IdCliente = C.IdCliente
    INNER JOIN Usuarios CU ON C.IdUsuario = CU.IdUsuario
    WHERE V.Delivery = 1
    ORDER BY V.FechaVenta DESC;
END;
CREATE PROCEDURE sp_ListarVentasNoDelivery
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        V.IdVenta,
        V.FechaVenta,
        U.Nombre + ' ' + U.Apellido AS Empleado,
        CU.Nombre + ' ' + CU.Apellido AS Cliente,
        V.Descuento,
        V.Total,
        'No' AS EsDelivery
    FROM Ventas V
    INNER JOIN Empleados E ON V.IdEmpleado = E.IdEmpleado
    INNER JOIN Usuarios U ON E.IdUsuario = U.IdUsuario
    INNER JOIN Clientes C ON V.IdCliente = C.IdCliente
    INNER JOIN Usuarios CU ON C.IdUsuario = CU.IdUsuario
    WHERE V.Delivery = 0
    ORDER BY V.FechaVenta DESC;
END;



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


use GoldenSkin
CREATE PROCEDURE sp_ObtenerFacturaVenta
  @IdVenta INT
AS
BEGIN
  SET NOCOUNT ON;

  -- Cabecera de la factura: información general de la venta
  SELECT 
    v.IdVenta,
    v.FechaVenta,
    v.Descuento,
    v.Total,
    ISNULL(SUM(dv.Subtotal), 0) AS Subtotal,
    v.Delivery AS EsDelivery,
    CONCAT(uCli.Nombre, ' ', uCli.Apellido) AS Cliente,
    CONCAT(uEmp.Nombre, ' ', uEmp.Apellido) AS Empleado
  FROM Ventas v
  INNER JOIN Clientes c ON v.IdCliente = c.IdCliente
  INNER JOIN Usuarios uCli ON c.IdUsuario = uCli.IdUsuario
  INNER JOIN Empleados e ON v.IdEmpleado = e.IdEmpleado
  INNER JOIN Usuarios uEmp ON e.IdUsuario = uEmp.IdUsuario
  LEFT JOIN DetalleVenta dv ON v.IdVenta = dv.IdVenta
  WHERE v.IdVenta = @IdVenta
  GROUP BY 
    v.IdVenta, v.FechaVenta, v.Descuento, v.Total, v.Delivery,
    uCli.Nombre, uCli.Apellido, uEmp.Nombre, uEmp.Apellido;

  -- Detalle de productos vendidos
  SELECT 
    p.NombreProducto,
    dv.Subtotal / NULLIF(dv.CantidadVendida, 0) AS PrecioUnitario,
    dv.CantidadVendida AS Cantidad
  FROM DetalleVenta dv
  INNER JOIN Productos p ON dv.IdProducto = p.IdProducto
  WHERE dv.IdVenta = @IdVenta;
END;


use goldenskin

sp_ReporteVentas '','', 1,''
alter PROCEDURE sp_ReporteVentas
    @FechaInicio DATE = NULL,
    @FechaFin DATE = NULL,
    @IdEmpleado INT = NULL,
    @IdCliente INT = NULL,
    @TipoReporte VARCHAR(50) = 'general'
AS
BEGIN
    SET NOCOUNT ON;

    IF @TipoReporte = 'general'
    BEGIN
        SELECT V.IdVenta, U.Nombre + ' ' + U.Apellido AS Empleado, C.Nombre + ' ' + C.Apellido AS Cliente,
               V.FechaVenta, V.Total, V.Descuento
        FROM Ventas V
        JOIN Empleados E ON V.IdEmpleado = E.IdEmpleado
        JOIN Usuarios U ON E.IdUsuario = U.IdUsuario
        JOIN Clientes CL ON V.IdCliente = CL.IdCliente
        JOIN Usuarios C ON CL.IdUsuario = C.IdUsuario
    END

    ELSE IF @TipoReporte = 'porFecha' AND @FechaInicio IS NOT NULL AND @FechaFin IS NOT NULL
    BEGIN
        SELECT V.IdVenta, V.FechaVenta, V.Total, V.Descuento
        FROM Ventas V
        WHERE V.FechaVenta BETWEEN @FechaInicio AND @FechaFin
    END

    ELSE IF @TipoReporte = 'porEmpleado' AND @IdEmpleado IS NOT NULL
    BEGIN
        SELECT V.IdVenta, V.FechaVenta, V.Total
        FROM Ventas V
        WHERE V.IdEmpleado = @IdEmpleado
    END

    ELSE IF @TipoReporte = 'porCliente' AND @IdCliente IS NOT NULL
    BEGIN
        SELECT V.IdVenta, V.FechaVenta, V.Total
        FROM Ventas V
        WHERE V.IdCliente = @IdCliente
    END

    ELSE IF @TipoReporte = 'productosVendidos'
    BEGIN
        SELECT P.NombreProducto, SUM(DV.CantidadVendida) AS TotalVendidas
        FROM DetalleVenta DV
        JOIN Productos P ON DV.IdProducto = P.IdProducto
        GROUP BY P.NombreProducto
        ORDER BY TotalVendidas DESC
    END

    ELSE IF @TipoReporte = 'topVentas'
    BEGIN
        SELECT TOP 10 V.IdVenta, V.Total, V.FechaVenta
        FROM Ventas V
        ORDER BY V.Total DESC
    END

    ELSE
    BEGIN
        SELECT '❌ Tipo de reporte no válido o parámetros incompletos' AS Error;
    END
END;

EXEC sp_ReporteVentas 
    @TipoReporte = 'porFecha',
    @FechaInicio = CONVERT(DATE, GETDATE()),
    @FechaFin = CONVERT(DATE, GETDATE());



	EXEC sp_ReporteVentas 
    @TipoReporte = 'porFecha',
    @FechaInicio = '2025-06-01',
    @FechaFin = '2025-06-30';

	EXEC sp_ReporteVentas 
    @TipoReporte = 'porEmpleado',
    @IdEmpleado = 1;
	EXEC sp_ReporteVentas 
    @TipoReporte = 'porCliente',
    @IdCliente = 1;
	EXEC sp_ReporteVentas @TipoReporte = 'productosVendidos';
	EXEC sp_ReporteVentas @TipoReporte = 'topVentas';
