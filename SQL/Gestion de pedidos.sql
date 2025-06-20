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

CREATE PROCEDURE GestionarPedidoGoldenSkin
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

    -- Insertar el pedido
    INSERT INTO Pedidos (IdCliente, FechaPedido, FechaEntrega, Descripcion, EstadoPedido)
    VALUES (@IdCliente, GETDATE(), @FechaEntrega, @Descripcion, 1);

    SET @IdPedido = SCOPE_IDENTITY();

    -- Insertar el detalle
    EXEC NuevoDetallePedido @IdPedido, @IdProducto, @Cantidad;

    COMMIT;
    PRINT '✅ Pedido registrado correctamente.';
  END TRY
  BEGIN CATCH
    ROLLBACK;
    DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
    PRINT '❌ Error al registrar el pedido: ' + @Err;
  END CATCH
END

CREATE TRIGGER tr_RegistrarVentaDesdePedidoDelivery
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
    DECLARE @IdEmpleado INT = 1; -- Cambiar si se desea dinámico

    -- Insertar en Ventas con delivery = 1
    INSERT INTO Ventas (IdEmpleado, IdCliente, FechaVenta, Descuento, Total, Delivery)
    VALUES (@IdEmpleado, @IdCliente, @FechaPedido, 0, 0, 1);

    SET @IdVenta = SCOPE_IDENTITY();

    -- Insertar detalle
    INSERT INTO DetalleVenta (IdVenta, IdProducto, Subtotal, CantidadVendida)
    SELECT
      @IdVenta,
      DP.IdProducto,
      P.Precio * DP.Cantidad,
      DP.Cantidad
    FROM DetallePedido DP
    JOIN Productos P ON DP.IdProducto = P.IdProducto
    WHERE DP.IdPedido = @IdPedido;

    -- Calcular descuento
    DECLARE @Descuento DECIMAL(10,2) = dbo.CalcularDescuentoPorCantidad(@IdVenta);

    -- Calcular subtotal
    DECLARE @Subtotal DECIMAL(10,2);
    SELECT @Subtotal = SUM(Subtotal) FROM DetalleVenta WHERE IdVenta = @IdVenta;

    -- Calcular total (con IVA y 10% delivery extra)
    DECLARE @Total DECIMAL(10,2) = (@Subtotal - @Descuento) * 1.15 * 1.10;

    -- Actualizar venta
    UPDATE Ventas
    SET Descuento = @Descuento,
        Total = @Total
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
