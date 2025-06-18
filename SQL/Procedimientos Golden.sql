


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


-- actualiza solo la tabla usuario, usar este : 
CREATE OR ALTER PROCEDURE sp_ActualizarSoloUsuario
  @IdUsuario INT,
  @NuevoNombre VARCHAR(100),
  @NuevoApellido VARCHAR(100),
  @NuevoEmail VARCHAR(150),
  @NuevoEstadoLogin BIT,
  @NuevoEstadoUsuario BIT
AS
BEGIN
  SET NOCOUNT ON;

  IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE IdUsuario = @IdUsuario)
  BEGIN
    RAISERROR('❌ Usuario no encontrado.', 16, 1);
    RETURN;
  END

  UPDATE Usuarios
  SET
    Nombre = @NuevoNombre,
    Apellido = @NuevoApellido,
    Email = @NuevoEmail,
    EstadoLogin = @NuevoEstadoLogin,
    EstadoUsuario = @NuevoEstadoUsuario
  WHERE IdUsuario = @IdUsuario;

  PRINT '✅ Usuario actualizado exitosamente.';
END

--trigger para actalizar las otras dos tablas segun el rol actualizado
CREATE OR ALTER TRIGGER tr_SincronizarUsuarioConPerfil
ON Usuarios
AFTER UPDATE
AS
BEGIN
  SET NOCOUNT ON;

  -- Actualiza nombre y apellido en Empleados (si existe)
  UPDATE E
  SET
    E.Cargo = E.Cargo, -- No se actualiza desde Usuarios, pero mantiene integridad
    -- aquí podrías añadir más lógica si cargo se derivara del rol
    -- opcionalmente, podrías guardar nombre/apellido ahí también si es necesario
    -- por ahora, se asume que nombre/apellido solo están en Usuarios
    -- si decides repetir datos, puedes agregarlos aquí
    -- Ejemplo: E.Nombre = U.Nombre
    E.Cargo = E.Cargo
  FROM Empleados E
  INNER JOIN INSERTED U ON E.IdUsuario = U.IdUsuario;

  -- Actualiza teléfono o dirección en Clientes si decides duplicarlos también (opcional)
  -- Por defecto, no se cambia nada aquí ya que dirección y teléfono están separados
  -- pero podrías sincronizar valores si estuvieran repetidos
END


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
