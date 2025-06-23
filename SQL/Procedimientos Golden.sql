use GoldenSkin


--registro de usuario  con rol de cliente por defecto para el registro
CREATE PROCEDURE sp_RegistrarUsuarioCliente
    @Nombre      VARCHAR(100),
    @Apellido    VARCHAR(100),
    @Email       VARCHAR(150),
    @Pass        VARCHAR(255),
    @Direccion   VARCHAR(MAX),
    @Telefono    VARCHAR(15)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdRolCliente INT = 2;
    DECLARE @IdUsuario INT;

    -- Validaciones básicas
    IF (@Nombre = '' OR @Apellido = '' OR @Email = '' OR @Pass = '' OR @Direccion = '' OR @Telefono = '')
    BEGIN
        RAISERROR('❌ Ningún campo puede estar vacío.', 16, 1);
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM Usuarios WHERE Email = @Email)
    BEGIN
        RAISERROR('❌ El correo ya está registrado.', 16, 1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Insertar en tabla Usuarios
        INSERT INTO Usuarios (Nombre, Apellido, Email, Pass, IdRol)
        VALUES (@Nombre, @Apellido, @Email, @Pass, @IdRolCliente);

        SET @IdUsuario = SCOPE_IDENTITY();

        -- Insertar en tabla Clientes
        INSERT INTO Clientes (IdUsuario, Direccion, Telefono)
        VALUES (@IdUsuario, @Direccion, @Telefono);

        COMMIT;

        PRINT '✅ Usuario cliente registrado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END

--registro de los usuarios desde el punto del admin
CREATE PROCEDURE sp_RegistrarUsuarioAdmin
    @Nombre     VARCHAR(100),
    @Apellido   VARCHAR(100),
    @Email      VARCHAR(150),
    @Pass       VARCHAR(255),
    @RolNombre  VARCHAR(50),
    @Direccion  VARCHAR(MAX),
    @Telefono   VARCHAR(15),
    @Cargo      VARCHAR(100) -- Solo se usará si el rol no es 'cliente'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdUsuario INT;
    DECLARE @IdRol INT;

    -- Validar campos vacíos
    IF (@Nombre = '' OR @Apellido = '' OR @Email = '' OR @Pass = '' OR @RolNombre = '')
    BEGIN
        RAISERROR('❌ Todos los campos obligatorios deben ser completados.', 16, 1);
        RETURN;
    END

    -- Validar existencia del rol
    SELECT @IdRol = IdRol FROM Roles WHERE LOWER(NombreRol) = LOWER(@RolNombre);

    IF @IdRol IS NULL
    BEGIN
        RAISERROR('❌ El rol proporcionado no existe.', 16, 1);
        RETURN;
    END

    -- Validar email no registrado
    IF EXISTS (SELECT 1 FROM Usuarios WHERE Email = @Email)
    BEGIN
        RAISERROR('❌ El correo ya está registrado.', 16, 1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Insertar en Usuarios
        INSERT INTO Usuarios (Nombre, Apellido, Email, Pass, IdRol)
        VALUES (@Nombre, @Apellido, @Email, @Pass, @IdRol);

        SET @IdUsuario = SCOPE_IDENTITY();

        -- Lógica según el rol
        IF LOWER(@RolNombre) = 'cliente'
        BEGIN
            IF (@Direccion = '' OR @Telefono = '')
            BEGIN
                RAISERROR('❌ Dirección y teléfono son obligatorios para clientes.', 16, 1);
                ROLLBACK;
                RETURN;
            END

            INSERT INTO Clientes (IdUsuario, Direccion, Telefono)
            VALUES (@IdUsuario, @Direccion, @Telefono);
        END
        ELSE
        BEGIN
            IF (@Cargo = '')
            BEGIN
                RAISERROR('❌ El cargo es obligatorio para empleados.', 16, 1);
                ROLLBACK;
                RETURN;
            END

            INSERT INTO Empleados (IdUsuario, Cargo)
            VALUES (@IdUsuario, @Cargo);
        END

        COMMIT;
        PRINT '✅ Usuario registrado correctamente según el rol.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

        DECLARE @Error NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Error, 16, 1);
    END CATCH
END

sp_BuscarUsuarios 0


--busqueda de los usuarios
CREATE PROCEDURE sp_BuscarUsuarios
    @TextoBusqueda VARCHAR(100),
    @Estado BIT = NULL -- Opcional, puede filtrar por estado (1=activo, 0=inactivo)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        u.IdUsuario,
        u.Nombre,
        u.Apellido,
        u.Email,
        r.NombreRol,
        u.EstadoUsuario,
        CASE 
            WHEN c.IdCliente IS NOT NULL THEN 'Cliente'
            WHEN e.IdEmpleado IS NOT NULL THEN 'Empleado'
            ELSE 'No definido'
        END AS TipoUsuario,
        ISNULL(c.Direccion, '') AS Direccion,
        ISNULL(c.Telefono, '') AS Telefono,
        ISNULL(e.Cargo, '') AS Cargo
    FROM Usuarios u
    LEFT JOIN Roles r ON u.IdRol = r.IdRol
    LEFT JOIN Clientes c ON u.IdUsuario = c.IdUsuario
    LEFT JOIN Empleados e ON u.IdUsuario = e.IdUsuario
    WHERE
        (u.Nombre LIKE '%' + @TextoBusqueda + '%' OR
         u.Apellido LIKE '%' + @TextoBusqueda + '%' OR
         u.Email LIKE '%' + @TextoBusqueda + '%' OR
         r.NombreRol LIKE '%' + @TextoBusqueda + '%')
        AND (@Estado IS NULL OR u.EstadoUsuario = @Estado)
    ORDER BY u.IdUsuario;
END

use GoldenSkin
---dar de baja usuarios

CREATE PROCEDURE sp_DarDeBajaUsuario
    @IdUsuario INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE IdUsuario = @IdUsuario)
    BEGIN
        RAISERROR('❌ El usuario no existe.', 16, 1);
        RETURN;
    END

    UPDATE Usuarios
    SET EstadoUsuario = 0
    WHERE IdUsuario = @IdUsuario;

    PRINT '✅ Usuario dado de baja correctamente.';
END




---listar usuarios
CREATE PROCEDURE sp_ListarUsuarios
    @Estado BIT = NULL -- 1 = activos, 0 = inactivos, NULL = todos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        u.IdUsuario,
        u.Nombre,
        u.Apellido,
        u.Email,
        r.NombreRol,
        u.EstadoUsuario,
        ISNULL(c.Direccion, '') AS Direccion,
        ISNULL(c.Telefono, '') AS Telefono,
        ISNULL(e.Cargo, '') AS Cargo
    FROM Usuarios u
    LEFT JOIN Roles r ON u.IdRol = r.IdRol
    LEFT JOIN Clientes c ON u.IdUsuario = c.IdUsuario
    LEFT JOIN Empleados e ON u.IdUsuario = e.IdUsuario
    WHERE @Estado IS NULL OR u.EstadoUsuario = @Estado
    ORDER BY u.IdUsuario;
END



-- actualizar la informacion del usuario
CREATE PROCEDURE sp_ActualizarUsuario
    @IdUsuario INT,
    @Nombre VARCHAR(100),
    @Apellido VARCHAR(100),
    @Email VARCHAR(150),
    @Direccion VARCHAR(MAX) = NULL,  -- solo si es cliente
    @Telefono VARCHAR(15) = NULL,    -- solo si es cliente
    @Cargo VARCHAR(100) = NULL       -- solo si es empleado
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE IdUsuario = @IdUsuario)
    BEGIN
        RAISERROR('❌ Usuario no encontrado.', 16, 1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

        -- Actualizar datos generales
        UPDATE Usuarios
        SET Nombre = @Nombre,
            Apellido = @Apellido,
            Email = @Email
        WHERE IdUsuario = @IdUsuario;

        -- Actualizar en Clientes si aplica
        IF EXISTS (SELECT 1 FROM Clientes WHERE IdUsuario = @IdUsuario)
        BEGIN
            UPDATE Clientes
            SET Direccion = @Direccion,
                Telefono = @Telefono
            WHERE IdUsuario = @IdUsuario;
        END

        -- Actualizar en Empleados si aplica
        IF EXISTS (SELECT 1 FROM Empleados WHERE IdUsuario = @IdUsuario)
        BEGIN
            UPDATE Empleados
            SET Cargo = @Cargo
            WHERE IdUsuario = @IdUsuario;
        END

        COMMIT;
        PRINT '✅ Usuario actualizado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        RAISERROR(ERROR_MESSAGE(), 16, 1);
    END CATCH
END


---- actualiza solo la tabla usuario, usar este : 
--CREATE OR ALTER PROCEDURE sp_ActualizarSoloUsuario
--  @IdUsuario INT,
--  @NuevoNombre VARCHAR(100),
--  @NuevoApellido VARCHAR(100),
--  @NuevoEmail VARCHAR(150),
--  @NuevoEstadoLogin BIT,
--  @NuevoEstadoUsuario BIT
--AS
--BEGIN
--  SET NOCOUNT ON;

--  IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE IdUsuario = @IdUsuario)
--  BEGIN
--    RAISERROR('❌ Usuario no encontrado.', 16, 1);
--    RETURN;
--  END

--  UPDATE Usuarios
--  SET
--    Nombre = @NuevoNombre,
--    Apellido = @NuevoApellido,
--    Email = @NuevoEmail,
--    EstadoLogin = @NuevoEstadoLogin,
--    EstadoUsuario = @NuevoEstadoUsuario
--  WHERE IdUsuario = @IdUsuario;

--  PRINT '✅ Usuario actualizado exitosamente.';
--END

----trigger para actalizar las otras dos tablas segun el rol actualizado
--CREATE OR ALTER TRIGGER tr_SincronizarUsuarioConPerfil
--ON Usuarios
--AFTER UPDATE
--AS
--BEGIN
--  SET NOCOUNT ON;

--  -- Actualiza nombre y apellido en Empleados (si existe)
--  UPDATE E
--  SET
--    E.Cargo = E.Cargo, -- No se actualiza desde Usuarios, pero mantiene integridad
--    -- aquí podrías añadir más lógica si cargo se derivara del rol
--    -- opcionalmente, podrías guardar nombre/apellido ahí también si es necesario
--    -- por ahora, se asume que nombre/apellido solo están en Usuarios
--    -- si decides repetir datos, puedes agregarlos aquí
--    -- Ejemplo: E.Nombre = U.Nombre
--    E.Cargo = E.Cargo
--  FROM Empleados E
--  INNER JOIN INSERTED U ON E.IdUsuario = U.IdUsuario;

--  -- Actualiza teléfono o dirección en Clientes si decides duplicarlos también (opcional)
--  -- Por defecto, no se cambia nada aquí ya que dirección y teléfono están separados
--  -- pero podrías sincronizar valores si estuvieran repetidos
--END


--cambiar estado usuario 
CREATE OR ALTER PROCEDURE sp_CambiarEstadoUsuario
  @IdUsuario INT,
  @NuevoEstado BIT  -- 1 = Activo, 0 = Inactivo
AS
BEGIN
  SET NOCOUNT ON;

  IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE IdUsuario = @IdUsuario)
  BEGIN
    RAISERROR('❌ El usuario no existe.', 16, 1);
    RETURN;
  END

  UPDATE Usuarios
  SET EstadoUsuario = @NuevoEstado
  WHERE IdUsuario = @IdUsuario;

  PRINT 
    CASE 
      WHEN @NuevoEstado = 1 THEN '✅ Usuario activado correctamente.'
      ELSE '✅ Usuario dado de baja correctamente.'
    END;
END


--------------------------------------listas de usuarios
CREATE PROCEDURE sp_ListarTodosUsuarios
AS
BEGIN
  SET NOCOUNT ON;

  SELECT U.IdUsuario, U.Nombre, U.Apellido, U.Email, R.NombreRol,
         CASE WHEN U.EstadoUsuario = 1 THEN 'Activo' ELSE 'Inactivo' END AS Estado
  FROM Usuarios U
  INNER JOIN Roles R ON U.IdRol = R.IdRol;
END



CREATE PROCEDURE sp_ListarUsuariosInactivos
AS
BEGIN
  SET NOCOUNT ON;

  SELECT U.IdUsuario, U.Nombre, U.Apellido, U.Email, R.NombreRol
  FROM Usuarios U
  INNER JOIN Roles R ON U.IdRol = R.IdRol
  WHERE U.EstadoUsuario = 0;
END



CREATE OR ALTER PROCEDURE sp_ListarUsuariosActivos
AS
BEGIN
  SET NOCOUNT ON;

  SELECT U.IdUsuario, U.Nombre, U.Apellido, U.Email, R.NombreRol
  FROM Usuarios U
  INNER JOIN Roles R ON U.IdRol = R.IdRol
  WHERE U.EstadoUsuario = 1;
END


CREATE OR ALTER PROCEDURE sp_BuscarUsuarioPorNombre
  @Nombre NVARCHAR(100)
AS
BEGIN
  SET NOCOUNT ON;

  SELECT U.IdUsuario, U.Nombre, U.Apellido, U.Email, R.NombreRol, U.EstadoUsuario
  FROM Usuarios U
  INNER JOIN Roles R ON U.IdRol = R.IdRol
  WHERE U.Nombre LIKE '%' + @Nombre + '%'
     OR U.Apellido LIKE '%' + @Nombre + '%';
END


----------------------------------------------------------Procedimientos para productos, compras y ventas



--insertar un nuevo producto 
CREATE PROCEDURE sp_InsertarProducto
    @NombreProducto VARCHAR(100),
    @Descripcion VARCHAR(400),
    @Precio DECIMAL(10,2),
    @Cantidad INT,
    @FechaFabricacion DATE = NULL,
    @IdMarca INT,
    @Categoria VARCHAR(50),
    @Imagen VARBINARY(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- Validación de campos requeridos
    IF (@NombreProducto IS NULL OR @NombreProducto = ''
        OR @Precio IS NULL OR @Cantidad IS NULL
        OR @IdMarca IS NULL OR @Categoria IS NULL OR @Categoria = '')
    BEGIN
        RAISERROR('❌ Todos los campos obligatorios deben estar completos.', 16, 1);
        RETURN;
    END

    -- Verificar existencia de la marca
    IF NOT EXISTS (SELECT 1 FROM Marcas WHERE IdMarca = @IdMarca AND EstadoMarca = 1)
    BEGIN
        RAISERROR('❌ La marca no existe o está inactiva.', 16, 1);
        RETURN;
    END

    -- Si no se especifica la fecha de fabricación, usar la actual
    IF @FechaFabricacion IS NULL
    BEGIN
        SET @FechaFabricacion = GETDATE();
    END

    DECLARE @FechaVencimiento DATE = DATEADD(YEAR, 2, @FechaFabricacion);

    BEGIN TRY
        INSERT INTO Productos (
            NombreProducto,
            Descripcion,
            Precio,
            Cantidad,
            FechaFabricacion,
            FechaVencimiento,
            IdMarca,
            Categoria,
            EstadoProducto,
            Imagen
        )
        VALUES (
            @NombreProducto,
            @Descripcion,
            @Precio,
            @Cantidad,
            @FechaFabricacion,
            @FechaVencimiento,
            @IdMarca,
            @Categoria,
            1, -- Estado activo por defecto
            @Imagen
        );

        PRINT '✅ Producto insertado correctamente.';
    END TRY
    BEGIN CATCH
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END;


--agregar productos al inventario 
CREATE PROCEDURE sp_AgregarInventarioProducto
    @IdProducto INT,
    @CantidadAgregada INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar campos
    IF @IdProducto IS NULL OR @CantidadAgregada IS NULL OR @CantidadAgregada <= 0
    BEGIN
        RAISERROR('❌ Debes proporcionar un producto válido y una cantidad mayor a cero.', 16, 1);
        RETURN;
    END

    -- Verificar existencia del producto
    IF NOT EXISTS (SELECT 1 FROM Productos WHERE IdProducto = @IdProducto AND EstadoProducto = 1)
    BEGIN
        RAISERROR('❌ El producto no existe o está inactivo.', 16, 1);
        RETURN;
    END

    -- Calcular nueva fecha de vencimiento (2 años desde hoy)
    DECLARE @NuevaFechaVenc DATE = DATEADD(YEAR, 2, GETDATE());

    BEGIN TRY
        UPDATE Productos
        SET 
            Cantidad = Cantidad + @CantidadAgregada,
            FechaVencimiento = @NuevaFechaVenc
        WHERE IdProducto = @IdProducto;

        PRINT '✅ Inventario actualizado correctamente.';
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMsg, 16, 1);
    END CATCH
END;


--actualizar productos
CREATE PROCEDURE sp_ActualizarProducto
    @IdProducto INT,
    @NombreProducto VARCHAR(100),
    @Descripcion VARCHAR(400),
    @Precio DECIMAL(10,2),
    @FechaFabricacion DATE,
    @IdMarca INT,
    @Categoria VARCHAR(50),
    @Imagen VARBINARY(MAX) = NULL  -- imagen opcional
AS
BEGIN
    SET NOCOUNT ON;

    -- Validaciones mínimas
    IF @IdProducto IS NULL OR @NombreProducto = '' OR @Precio IS NULL OR @Precio <= 0 OR @IdMarca IS NULL
    BEGIN
        RAISERROR('❌ Datos inválidos: revisa los campos obligatorios.', 16, 1);
        RETURN;
    END

    -- Verificar si el producto existe
    IF NOT EXISTS (SELECT 1 FROM Productos WHERE IdProducto = @IdProducto)
    BEGIN
        RAISERROR('❌ El producto no existe.', 16, 1);
        RETURN;
    END

    DECLARE @NuevaFechaVenc DATE = DATEADD(YEAR, 2, @FechaFabricacion);

    BEGIN TRY
        -- Si se proporciona imagen, se actualiza también
        IF @Imagen IS NOT NULL
        BEGIN
            UPDATE Productos
            SET 
                NombreProducto = @NombreProducto,
                Descripcion = @Descripcion,
                Precio = @Precio,
                FechaFabricacion = @FechaFabricacion,
                FechaVencimiento = @NuevaFechaVenc,
                IdMarca = @IdMarca,
                Categoria = @Categoria,
                Imagen = @Imagen
            WHERE IdProducto = @IdProducto;
        END
        ELSE
        BEGIN
            UPDATE Productos
            SET 
                NombreProducto = @NombreProducto,
                Descripcion = @Descripcion,
                Precio = @Precio,
                FechaFabricacion = @FechaFabricacion,
                FechaVencimiento = @NuevaFechaVenc,
                IdMarca = @IdMarca,
                Categoria = @Categoria
            WHERE IdProducto = @IdProducto;
        END

        PRINT '✅ Producto actualizado correctamente.';
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMsg, 16, 1);
    END CATCH
END;


-- cambiar de estado productos
CREATE PROCEDURE sp_CambiarEstadoProducto
    @IdProducto INT,
    @NuevoEstado BIT -- 1 = Activo, 0 = Inactivo o dado de baja
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar existencia del producto
    IF NOT EXISTS (SELECT 1 FROM Productos WHERE IdProducto = @IdProducto)
    BEGIN
        RAISERROR('❌ El producto no existe.', 16, 1);
        RETURN;
    END

    -- Validar que el estado sea 0 o 1
    IF @NuevoEstado NOT IN (0, 1)
    BEGIN
        RAISERROR('⚠️ Estado inválido. Solo se permite 0 (Inactivo) o 1 (Activo).', 16, 1);
        RETURN;
    END

    -- Actualizar estado
    UPDATE Productos
    SET EstadoProducto = @NuevoEstado
    WHERE IdProducto = @IdProducto;

    DECLARE @accion NVARCHAR(50) = CASE 
        WHEN @NuevoEstado = 1 THEN 'activado' 
        ELSE 'dado de baja' 
    END;

    PRINT '✅ Producto ' + @accion + ' correctamente.';
END;


--- busqueda producto
CREATE PROCEDURE sp_BuscarProductos
    @TextoBusqueda VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    IF @TextoBusqueda IS NULL OR LTRIM(RTRIM(@TextoBusqueda)) = ''
    BEGIN
        RAISERROR('⚠️ Debes proporcionar un texto de búsqueda.', 16, 1);
        RETURN;
    END

    SELECT 
        P.IdProducto,
        P.NombreProducto,
        P.Descripcion,
        P.Precio,
        P.Cantidad,
        P.FechaFabricacion,
        P.FechaVencimiento,
        M.NombreMarca,
        P.Categoria,
        P.EstadoProducto
    FROM Productos P
    LEFT JOIN Marcas M ON P.IdMarca = M.IdMarca
    WHERE 
        P.NombreProducto LIKE '%' + @TextoBusqueda + '%'
        OR M.NombreMarca LIKE '%' + @TextoBusqueda + '%'
        OR P.Categoria LIKE '%' + @TextoBusqueda + '%'
    ORDER BY P.NombreProducto;
END;


--listar productos inactivos y activos
CREATE PROCEDURE sp_ListarProductosActivos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        P.IdProducto,
        P.NombreProducto,
        P.Descripcion,
        P.Precio,
        P.Cantidad,
        P.FechaFabricacion,
        P.FechaVencimiento,
        M.NombreMarca,
        P.Categoria
    FROM Productos P
    LEFT JOIN Marcas M ON P.IdMarca = M.IdMarca
    WHERE P.EstadoProducto = 1
    ORDER BY P.NombreProducto;
END;

CREATE PROCEDURE sp_ListarProductosInactivos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        P.IdProducto,
        P.NombreProducto,
        P.Descripcion,
        P.Precio,
        P.Cantidad,
        P.FechaFabricacion,
        P.FechaVencimiento,
        M.NombreMarca,
        P.Categoria
    FROM Productos P
    LEFT JOIN Marcas M ON P.IdMarca = M.IdMarca
    WHERE P.EstadoProducto = 0
    ORDER BY P.NombreProducto;
END;



-- filtros por categoria 
CREATE PROCEDURE sp_FiltrarProductosPorCategoria
    @Categoria VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Categoria IS NULL OR LTRIM(RTRIM(@Categoria)) = ''
    BEGIN
        RAISERROR('⚠️ Debes proporcionar una categoría válida.', 16, 1);
        RETURN;
    END

    SELECT 
        P.IdProducto,
        P.NombreProducto,
        P.Descripcion,
        P.Precio,
        P.Cantidad,
        P.FechaFabricacion,
        P.FechaVencimiento,
        M.NombreMarca,
        P.Categoria
    FROM Productos P
    LEFT JOIN Marcas M ON P.IdMarca = M.IdMarca
    WHERE LOWER(P.Categoria) = LOWER(@Categoria)
      AND P.EstadoProducto = 1
    ORDER BY P.NombreProducto;
END;

EXEC sp_FiltrarProductosPorCategoria @Categoria = 'serum';


--alerta de productos bajos
CREATE TRIGGER tr_AlertaInventarioBajo
ON Productos
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NombreProducto VARCHAR(100), @Cantidad INT;

    SELECT TOP 1 @NombreProducto = i.NombreProducto, @Cantidad = i.Cantidad
    FROM inserted i
    INNER JOIN deleted d ON i.IdProducto = d.IdProducto
    WHERE i.Cantidad <= 10;

    IF @Cantidad <= 10
    BEGIN
        PRINT '⚠️ ALERTA: El producto "' + @NombreProducto + '" tiene solo ' + CAST(@Cantidad AS VARCHAR) + ' unidades en inventario.';
    END
END;


CREATE PROCEDURE sp_UsuariosEnSesion
AS
BEGIN
  SELECT IdUsuario, Nombre, Apellido, Email
  FROM Usuarios
  WHERE EstadoLogin = 1;
END
