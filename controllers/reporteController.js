const { sql, config } = require('../config/db');



exports.reporteVentas = async (req, res) => {
const { fechaInicio, fechaFin, IdEmpleado, IdCliente, tipoReporte } = req.query;

try {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input('FechaInicio', sql.Date, fechaInicio || null)
    .input('FechaFin', sql.Date, fechaFin || null)
    .input('IdEmpleado', sql.Int, IdEmpleado || null)
    .input('IdCliente', sql.Int, IdCliente || null)
    .input('TipoReporte', sql.VarChar(50), tipoReporte || 'general')
    .execute('sp_ReporteVentas');

  res.json(result.recordset);
} catch (error) {
  console.error('❌ Error al generar el reporte:', error);
  res.status(500).json({ mensaje: 'Error al generar el reporte' });
}

};
