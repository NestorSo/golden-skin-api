// controllers/rolController.js
const { sql, config } = require('../config/db');

exports.crearRolConPrivilegios = async (req, res) => {
  const { nombreRol, privilegios } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('NombreRol', sql.VarChar, nombreRol)
      .input('Privilegios', sql.NVarChar, privilegios)
      .execute('sp_CrearRolConPrivilegios');

    res.status(201).json({ mensaje: '✅ Rol y privilegios creados correctamente' });
  } catch (error) {
    console.error('❌ Error al crear rol:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarRol = async (req, res) => {
  const { id } = req.params;
  const { nuevoNombre } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('IdRol', sql.Int, id)
      .input('NuevoNombre', sql.VarChar, nuevoNombre)
      .execute('sp_ActualizarRol');

    res.json({ mensaje: '✅ Rol actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar rol:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.cambiarEstadoRol = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('IdRol', sql.Int, id)
      .input('Estado', sql.Bit, estado)
      .execute('sp_CambiarEstadoRol');

    res.json({ mensaje: '✅ Estado de rol actualizado' });
  } catch (error) {
    console.error('❌ Error al cambiar estado del rol:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.listarRoles = async (req, res) => {
  const { estado } = req.query;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Estado', sql.Bit, estado)
      .execute('sp_ListarRoles');

    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al listar roles:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.verPrivilegiosPorRol = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('IdRol', sql.Int, id)
      .execute('sp_VerPrivilegiosPorRol');

    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener privilegios:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarPrivilegiosDeRol = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('IdRol', sql.Int, id)
      .execute('sp_EliminarPrivilegiosDeRol');

    res.json({ mensaje: '✅ Privilegios eliminados' });
  } catch (error) {
    console.error('❌ Error al eliminar privilegios:', error);
    res.status(500).json({ error: error.message });
  }
};
