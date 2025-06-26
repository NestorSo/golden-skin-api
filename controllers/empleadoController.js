const { sql, config } = require('../config/db');




// Obtener IdEmpleado a partir del IdUsuario
exports.obtenerEmpleadoPorUsuario = async (req, res) => {
  const idUsuario = parseInt(req.params.id);

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('IdUsuario', sql.Int, idUsuario)
      .execute('sp_ObtenerIdEmpleadoPorUsuario');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado para este usuario.' });
    }

    res.status(200).json(result.recordset[0]); // { IdEmpleado: X }
  } catch (err) {
    console.error('❌ Error al obtener IdEmpleado:', err);
    res.status(500).json({ error: err.message });
  }
};
