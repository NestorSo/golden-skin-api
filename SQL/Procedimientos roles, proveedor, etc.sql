
use goldenskin

sp_CrearRolConPrivilegios 'Cajero','Gestionar Ventas y Compras'
select * from roles
CREATE PROCEDURE sp_CrearRolConPrivilegios
    @NombreRol VARCHAR(50),
    @Privilegios NVARCHAR(MAX) -- Ej: 'Registrar usuarios;Ver reportes;Eliminar productos'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdRol INT;

    IF EXISTS (SELECT 1 FROM Roles WHERE LOWER(NombreRol) = LOWER(@NombreRol))
    BEGIN
        RAISERROR('❌ Ya existe un rol con ese nombre.', 16, 1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

        INSERT INTO Roles (NombreRol, EstadoRol) VALUES (@NombreRol, 1);
        SET @IdRol = SCOPE_IDENTITY();

        -- Separar privilegios por punto y coma y agregarlos
        DECLARE @Descripcion VARCHAR(255), @Pos INT;
        WHILE LEN(@Privilegios) > 0
        BEGIN
            SET @Pos = CHARINDEX(';', @Privilegios);
            IF @Pos > 0
            BEGIN
                SET @Descripcion = LTRIM(RTRIM(LEFT(@Privilegios, @Pos - 1)));
                SET @Privilegios = SUBSTRING(@Privilegios, @Pos + 1, LEN(@Privilegios));
            END
            ELSE
            BEGIN
                SET @Descripcion = LTRIM(RTRIM(@Privilegios));
                SET @Privilegios = '';
            END

            IF @Descripcion <> ''
            BEGIN
                INSERT INTO Privilegios (Descripcion, IdRol) VALUES (@Descripcion, @IdRol);
            END
        END

        COMMIT;
        PRINT '✅ Rol y privilegios registrados correctamente.';
    END TRY
    BEGIN CATCH
        ROLLBACK;

        DECLARE @MensajeError NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@MensajeError, 16, 1);
    END CATCH
END


CREATE PROCEDURE sp_ActualizarRol
    @IdRol INT,
    @NuevoNombre VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Roles WHERE IdRol = @IdRol)
    BEGIN
        RAISERROR('❌ El rol no existe.', 16, 1);
        RETURN;
    END

    UPDATE Roles SET NombreRol = @NuevoNombre WHERE IdRol = @IdRol;

    PRINT '✅ Rol actualizado.';
END


sp_CambiarEstadoRol 1,1
CREATE PROCEDURE sp_CambiarEstadoRol
    @IdRol INT,
    @Estado BIT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Roles
    SET EstadoRol = @Estado
    WHERE IdRol = @IdRol;

    PRINT '✅ Estado del rol actualizado.';
END

CREATE PROCEDURE sp_ListarRoles
    @Estado BIT -- 1 = activos, 0 = inactivos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT * FROM Roles WHERE EstadoRol = @Estado;
END


CREATE PROCEDURE sp_VerPrivilegiosPorRol
    @IdRol INT
AS
BEGIN
    SELECT Descripcion FROM Privilegios WHERE IdRol = @IdRol;
END


CREATE PROCEDURE sp_EliminarPrivilegiosDeRol
    @IdRol INT
AS
BEGIN
    DELETE FROM Privilegios WHERE IdRol = @IdRol;
    PRINT '✅ Privilegios eliminados para el rol.';
END

select * from marcas
--- marca
sp_CrearMarca 'Tresemé','Cuidado para el cabello','Shakira'
CREATE PROCEDURE sp_CrearMarca
    @Nombre VARCHAR(100),
    @Descripcion VARCHAR(400),
    @Fabricante VARCHAR(100)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Marcas WHERE NombreMarca = @Nombre)
    BEGIN
        RAISERROR('❌ Ya existe una marca con ese nombre.', 16, 1);
        RETURN;
    END

    INSERT INTO Marcas (NombreMarca, Descripcion, Fabricante, EstadoMarca)
    VALUES (@Nombre, @Descripcion, @Fabricante, 1);

    PRINT '✅ Marca registrada.';
END


CREATE PROCEDURE sp_ActualizarMarca
    @IdMarca INT,
    @Nombre VARCHAR(100),
    @Descripcion VARCHAR(400),
    @Fabricante VARCHAR(100)
AS
BEGIN
    UPDATE Marcas
    SET NombreMarca = @Nombre,
        Descripcion = @Descripcion,
        Fabricante = @Fabricante
    WHERE IdMarca = @IdMarca;

    PRINT '✅ Marca actualizada.';
END

sp_CambiarEstadoMarca 11,0
CREATE PROCEDURE sp_CambiarEstadoMarca
    @IdMarca INT,
    @Estado BIT
AS
BEGIN
    UPDATE Marcas
    SET EstadoMarca = @Estado
    WHERE IdMarca = @IdMarca;
END


CREATE PROCEDURE sp_BuscarMarca
    @Texto VARCHAR(100)
AS
BEGIN
    SELECT *
    FROM Marcas
    WHERE NombreMarca LIKE '%' + @Texto + '%'
       OR Fabricante LIKE '%' + @Texto + '%';
END

sp_CrearProveedor 'Bimbo','Managua,carretera Norte','87675651','bimbo@gmail.com'
-- proveedores
CREATE PROCEDURE sp_CrearProveedor
    @Nombre VARCHAR(100),
    @Direccion VARCHAR(200),
    @Telefono VARCHAR(15),
    @Correo VARCHAR(100)
AS
BEGIN
    INSERT INTO Proveedores (NombreProveedor, Direccion, Telefono, Correo, EstadoProveedor)
    VALUES (@Nombre, @Direccion, @Telefono, @Correo, 1);

    PRINT '✅ Proveedor registrado.';
END


CREATE PROCEDURE sp_ActualizarProveedor
    @IdProveedor INT,
    @Nombre VARCHAR(100),
    @Direccion VARCHAR(200),
    @Telefono VARCHAR(15),
    @Correo VARCHAR(100)
AS
BEGIN
    UPDATE Proveedores
    SET NombreProveedor = @Nombre,
        Direccion = @Direccion,
        Telefono = @Telefono,
        Correo = @Correo
    WHERE IdProveedor = @IdProveedor;

    PRINT '✅ Proveedor actualizado.';
END

CREATE PROCEDURE sp_CambiarEstadoProveedor
    @IdProveedor INT,
    @Estado BIT
AS
BEGIN
    UPDATE Proveedores
    SET EstadoProveedor = @Estado
    WHERE IdProveedor = @IdProveedor;
END

sp_BuscarProveedor 'bimbo'
CREATE PROCEDURE sp_BuscarProveedor
    @Texto VARCHAR(100)
AS
BEGIN
    SELECT *
    FROM Proveedores
    WHERE NombreProveedor LIKE '%' + @Texto + '%'
       OR Correo LIKE '%' + @Texto + '%';
END


