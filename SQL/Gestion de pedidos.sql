----gestion de pedidos
CREATE PROCEDURE GestionarPedidoGoldenSkin
  @IdCliente INT,
  @Descripcion VARCHAR(100),
  @IdProducto INT,
  @Cantidad INT
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @IdPedido INT;

  BEGIN TRY
    BEGIN TRAN;

    -- Insertar pedido principal
    INSERT INTO Pedidos (IdCliente, FechaPedido, Descripcion, EstadoPedido)
    VALUES (@IdCliente, GETDATE(), @Descripcion, 1);

    SET @IdPedido = SCOPE_IDENTITY();

    -- Insertar detalle del pedido
    INSERT INTO DetallePedido (IdPedido, IdProducto, Cantidad)
    VALUES (@IdPedido, @IdProducto, @Cantidad);

    COMMIT;
    PRINT '✅ Pedido registrado correctamente.';
  END TRY
  BEGIN CATCH
    ROLLBACK;
    PRINT '❌ Error al registrar el pedido: ' + ERROR_MESSAGE();
  END CATCH
END;
