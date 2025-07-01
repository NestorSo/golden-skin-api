const sql = require('mssql');

exports.reporteVentas = async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('FechaInicio', sql.Date, fechaInicio || null)
      .input('FechaFin', sql.Date, fechaFin || null)
      .execute('sp_ReporteVentas');

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al generar reporte de ventas:', err);
    res.status(500).json({ mensaje: 'Error al generar el reporte' });
  }
};

// Agrega otras funciones de reporte similares según se necesite.
