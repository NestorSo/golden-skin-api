const { sql, config } = require('../config/db');

// Crear nuevo proveedor
exports.crearProveedor = async (req, res) => {
  const { nombre, direccion, telefono, correo } = req.body;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('Nombre', sql.VarChar, nombre)
      .input('Direccion', sql.VarChar, direccion)
      .input('Telefono', sql.VarChar, telefono)
      .input('Correo', sql.VarChar, correo)
      .execute('sp_CrearProveedor');

    res.status(201).json({ mensaje: '✅ Proveedor registrado correctamente.' });
  } catch (err) {
    console.error('❌ Error al crear proveedor:', err);
    res.status(500).json({ error: err.message });
  }
};

// Actualizar proveedor
exports.actualizarProveedor = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, direccion, telefono, correo } = req.body;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('IdProveedor', sql.Int, id)
      .input('Nombre', sql.VarChar, nombre)
      .input('Direccion', sql.VarChar, direccion)
      .input('Telefono', sql.VarChar, telefono)
      .input('Correo', sql.VarChar, correo)
      .execute('sp_ActualizarProveedor');

    res.status(200).json({ mensaje: '✅ Proveedor actualizado correctamente.' });
  } catch (err) {
    console.error('❌ Error al actualizar proveedor:', err);
    res.status(500).json({ error: err.message });
  }
};

// Cambiar estado del proveedor
exports.cambiarEstadoProveedor = async (req, res) => {
  const id = parseInt(req.params.id);
  const { estado } = req.body; // 1 = activo, 0 = inactivo

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('IdProveedor', sql.Int, id)
      .input('Estado', sql.Bit, estado)
      .execute('sp_CambiarEstadoProveedor');

    res.status(200).json({ mensaje: '✅ Estado del proveedor actualizado.' });
  } catch (err) {
    console.error('❌ Error al cambiar estado:', err);
    res.status(500).json({ error: err.message });
  }
};

// Buscar proveedor por texto
exports.buscarProveedor = async (req, res) => {
  const { texto } = req.query;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Texto', sql.VarChar, texto)
      .execute('sp_BuscarProveedor');

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('❌ Error al buscar proveedores:', err);
    res.status(500).json({ error: err.message });
  }
};



// 🔹 Listar productos por estado
exports.listarProveedores = async (req, res) => {
  const estado = req.query.estado; // 1, 0 o vacío

  try {
    const pool = await sql.connect(config);
    let result;
    if (estado === '0') {
      result = await pool.request().execute('sp_ListarProveedoresInactivos');
    } else {
      result = await pool.request().execute('sp_ListarProveedores');
    }

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al listar proveedores:', err);
    res.status(500).send(err.message);
  }
};