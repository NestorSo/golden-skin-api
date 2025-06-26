const { sql, config } = require('../config/db');

// Crear nueva marca
exports.crearMarca = async (req, res) => {
  const { nombre, descripcion, fabricante } = req.body;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('Nombre', sql.VarChar, nombre)
      .input('Descripcion', sql.VarChar, descripcion)
      .input('Fabricante', sql.VarChar, fabricante)
      .execute('sp_CrearMarca');

    res.status(201).json({ mensaje: '✅ Marca registrada correctamente.' });
  } catch (err) {
    console.error('❌ Error al registrar marca:', err);
    res.status(500).json({ error: err.message });
  }
};

// Actualizar marca
exports.actualizarMarca = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, descripcion, fabricante } = req.body;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('IdMarca', sql.Int, id)
      .input('Nombre', sql.VarChar, nombre)
      .input('Descripcion', sql.VarChar, descripcion)
      .input('Fabricante', sql.VarChar, fabricante)
      .execute('sp_ActualizarMarca');

    res.status(200).json({ mensaje: '✅ Marca actualizada correctamente.' });
  } catch (err) {
    console.error('❌ Error al actualizar marca:', err);
    res.status(500).json({ error: err.message });
  }
};

// Cambiar estado de la marca (activar/inactivar)
exports.cambiarEstadoMarca = async (req, res) => {
  const id = parseInt(req.params.id);
  const { estado } = req.body; // debe ser 1 o 0

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('IdMarca', sql.Int, id)
      .input('Estado', sql.Bit, estado)
      .execute('sp_CambiarEstadoMarca');

    res.status(200).json({ mensaje: '✅ Estado de la marca actualizado.' });
  } catch (err) {
    console.error('❌ Error al cambiar estado de la marca:', err);
    res.status(500).json({ error: err.message });
  }
};

// Buscar marca por texto
exports.buscarMarca = async (req, res) => {
  const { texto } = req.query;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Texto', sql.VarChar, texto)
      .execute('sp_BuscarMarca');

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('❌ Error al buscar marcas:', err);
    res.status(500).json({ error: err.message });
  }
};

// Listar marcas activas
exports.listarMarcas = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('sp_ListarMarcas');
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('❌ Error al listar marcas:', err);
    res.status(500).json({ error: err.message });
  }
};
