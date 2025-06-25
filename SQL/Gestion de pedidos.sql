
use goldenskin


select * from roles

EXEC GestionarPedidoGoldenSkin 
  @IdCliente = 1,
  @IdProducto = 1,
  @Cantidad = 10,
  @Descripcion = 'Prueba manual'

  select * from pedidos
select * from DetallePedido
select * from Ventas
select * from DetalleVenta
select * from productos



----gestion de pedidos

CREATE PROCEDURE NuevoDetallePedido
  @IdPedido INT,
  @IdProducto INT,
  @Cantidad INT
AS
BEGIN
  SET NOCOUNT ON;

  IF @Cantidad <= 0
  BEGIN
    RAISERROR('❌ La cantidad debe ser mayor que cero.', 16, 1);
    RETURN;
  END

  INSERT INTO DetallePedido (IdPedido, IdProducto, Cantidad)
  VALUES (@IdPedido, @IdProducto, @Cantidad);
END


ALTER PROCEDURE GestionarPedidoGoldenSkin
  @IdCliente INT,
  @Descripcion VARCHAR(100),
  @IdPedido INT OUTPUT
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @FechaEntrega DATE = DATEADD(DAY, 1, GETDATE());

  BEGIN TRY
    BEGIN TRAN;

    -- Insertar solo el pedido
    INSERT INTO Pedidos (IdCliente, FechaPedido, FechaEntrega, Descripcion, EstadoPedido)
    VALUES (@IdCliente, GETDATE(), @FechaEntrega, @Descripcion, 0);

    SET @IdPedido = SCOPE_IDENTITY();

    COMMIT;
    PRINT '✅ Pedido registrado correctamente.';
  END TRY
  BEGIN CATCH
    ROLLBACK;
    SET @IdPedido = 0;
    PRINT '❌ Error al registrar pedido: ' + ERROR_MESSAGE();
  END CATCH
END;


ALTER PROCEDURE GestionarPedidoGoldenSkin
  @IdCliente INT,
  @IdProducto INT,
  @Cantidad INT,
  @Descripcion VARCHAR(100)
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @IdPedido INT;
  DECLARE @FechaEntrega DATE = DATEADD(DAY, 1, GETDATE()); -- entrega a 24h

  BEGIN TRY
    BEGIN TRAN;

    -- 1. Insertar el pedido
    INSERT INTO Pedidos (IdCliente, FechaPedido, FechaEntrega, Descripcion, EstadoPedido)
    VALUES (@IdCliente, GETDATE(), @FechaEntrega, @Descripcion, 0);

    SET @IdPedido = SCOPE_IDENTITY();

    -- 2. Insertar detalle
    EXEC NuevoDetallePedido @IdPedido, @IdProducto, @Cantidad;

    -- 3. Crear la venta relacionada al pedido (sin empleado porque es desde el sitio web)
    EXEC GestionarVentaGoldenSkin @IdCliente = @IdCliente, @IdEmpleado = NULL, @IdProducto = @IdProducto, @Cantidad = @Cantidad;

    COMMIT;
    PRINT '✅ Pedido y venta generados correctamente.';
  END TRY
  BEGIN CATCH
    ROLLBACK;
    DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
    PRINT '❌ Error al registrar el pedido o la venta: ' + @Err;
  END CATCH
END


DROP TRIGGER IF EXISTS tr_RegistrarVentaDesdePedidoDelivery;

ALTER TRIGGER tr_RegistrarVentaDesdePedidoDelivery
ON Pedidos
AFTER INSERT
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @IdPedido INT, @IdCliente INT, @FechaPedido DATE, @EsDelivery BIT;

  SELECT TOP 1
    @IdPedido = i.IdPedido,
    @IdCliente = i.IdCliente,
    @FechaPedido = i.FechaPedido,
    @EsDelivery = CASE WHEN i.Descripcion LIKE '%[Delivery]%' THEN 1 ELSE 0 END
  FROM inserted i;

  IF @EsDelivery = 1
  BEGIN
    DECLARE @IdVenta INT;

    -- Insertar en Ventas (Delivery=1, sin empleado)
    INSERT INTO Ventas (IdEmpleado, IdCliente, FechaVenta, Descuento, Total, Delivery)
    VALUES (NULL, @IdCliente, @FechaPedido, 0, 0, 1);

    SET @IdVenta = SCOPE_IDENTITY();

    -- Variables para iteración
    DECLARE @IdProducto INT, @Cantidad INT;

    DECLARE detalle_cursor CURSOR FOR
    SELECT IdProducto, Cantidad
    FROM DetallePedido
    WHERE IdPedido = @IdPedido;

    OPEN detalle_cursor;
    FETCH NEXT FROM detalle_cursor INTO @IdProducto, @Cantidad;

    WHILE @@FETCH_STATUS = 0
    BEGIN
      EXEC NuevoDetalleVenta @IdVenta, @IdProducto, @Cantidad;
      FETCH NEXT FROM detalle_cursor INTO @IdProducto, @Cantidad;
    END

    CLOSE detalle_cursor;
    DEALLOCATE detalle_cursor;

    -- Obtener y actualizar descuento
    DECLARE @Descuento DECIMAL(10,2) = dbo.CalcularDescuentoPorCantidad(@IdVenta);

    UPDATE Ventas
    SET Descuento = @Descuento
    WHERE IdVenta = @IdVenta;

    PRINT '✅ Venta generada automáticamente por pedido delivery.';
  END
END;




CREATE TRIGGER tr_CalcularFechaEntrega
ON Pedidos
AFTER INSERT
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE P
  SET FechaEntrega = DATEADD(DAY, 1, i.FechaPedido)
  FROM Pedidos P
  INNER JOIN inserted i ON P.IdPedido = i.IdPedido;
END;


CREATE PROCEDURE sp_ActualizarPedidosEntregados
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE Pedidos
  SET EstadoPedido = 1
  WHERE EstadoPedido = 0 AND FechaEntrega <= CAST(GETDATE() AS DATE);

  PRINT '✅ Pedidos actualizados a entregados automáticamente.';
END;



--CREATE TRIGGER tr_AjustarTotalPorDelivery
--ON Pedidos
--AFTER INSERT
--AS
--BEGIN
--  SET NOCOUNT ON;

--  -- Obtener los pedidos con delivery
--  DECLARE @IdCliente INT, @FechaPedido DATE;

--  SELECT TOP 1 @IdCliente = IdCliente, @FechaPedido = FechaPedido
--  FROM inserted
--  WHERE EsDelivery = 1;

--  -- Encontrar la venta generada el mismo día por ese cliente
--  DECLARE @IdVenta INT;
--  SELECT TOP 1 @IdVenta = V.IdVenta
--  FROM Ventas V
--  WHERE V.IdCliente = @IdCliente AND CAST(V.FechaVenta AS DATE) = @FechaPedido;

--  -- Aplicar el recargo del 10% si se encontró la venta
--  IF @IdVenta IS NOT NULL
--  BEGIN
--    UPDATE Ventas
--    SET Total = Total * 1.10
--    WHERE IdVenta = @IdVenta;

--    -- Marcarla como delivery
--    UPDATE Ventas
--    SET Delivery = 1
--    WHERE IdVenta = @IdVenta;
--  END
--END;
