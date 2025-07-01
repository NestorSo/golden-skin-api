const { sql, config } = require('../config/db');

// ===== VENTAS =====
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
    console.error('❌ Error al generar el reporte de ventas:', error);
    res.status(500).json({ mensaje: 'Error al generar el reporte de ventas' });
  }
};

// ===== COMPRAS =====
exports.reporteCompras = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('sp_ReporteCompras');
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al generar el reporte de compras:', error);
    res.status(500).json({ mensaje: 'Error al generar el reporte de compras' });
  }
};

// ===== PRODUCTOS =====
exports.reporteProductos = async (req, res) => {
  const { tipoReporte, IdMarca, Categoria } = req.query;
  try {
    const pool = await sql.connect(config);

    let result;
    switch (tipoReporte) {
      case 'general':
        result = await pool.request().execute('sp_ReporteProductosGeneral');
        break;
      case 'sinStock':
        result = await pool.request().execute('sp_ReporteProductosSinStock');
        break;
      case 'masVendidos':
        result = await pool.request().execute('sp_ReporteProductosMasVendidos');
        break;
      case 'porMarca':
        result = await pool.request()
          .input('IdMarca', sql.Int, IdMarca)
          .execute('sp_ReporteProductosPorMarca');
        break;
      case 'porCategoria':
        result = await pool.request()
          .input('Categoria', sql.VarChar, Categoria)
          .execute('sp_ReporteProductosPorCategoria');
        break;
      default:
        return res.status(400).json({ mensaje: "Tipo de reporte inválido" });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error reporte productos:", err);
    res.status(500).json({ mensaje: "Error interno al generar el reporte" });
  }
};


// ===== USUARIOS =====
exports.reporteUsuarios = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('sp_ReporteUsuarios');
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al generar el reporte de usuarios:', error);
    res.status(500).json({ mensaje: 'Error al generar el reporte de usuarios' });
  }
};

// ===== PROVEEDORES =====
exports.reporteProveedores = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('sp_ReporteProveedores');
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al generar el reporte de proveedores:', error);
    res.status(500).json({ mensaje: 'Error al generar el reporte de proveedores' });
  }
};

// ===== MARCAS =====
exports.reporteMarcas = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('sp_ReporteMarcas');
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al generar el reporte de marcas:', error);
    res.status(500).json({ mensaje: 'Error al generar el reporte de marcas' });
  }
};

exports.reporteProductos = async (req, res) => {
  const { tipoReporte, IdMarca, Categoria } = req.query;
  try {
    const pool = await sql.connect(config);

    let result;
    switch (tipoReporte) {
      case 'general':
        result = await pool.request().execute('sp_ReporteProductosGeneral');
        break;
      case 'sinStock':
        result = await pool.request().execute('sp_ReporteProductosSinStock');
        break;
      case 'masVendidos':
        result = await pool.request().execute('sp_ReporteProductosMasVendidos');
        break;
      case 'porMarca':
        result = await pool.request().input('IdMarca', sql.Int, IdMarca).execute('sp_ReporteProductosPorMarca');
        break;
      case 'porCategoria':
        result = await pool.request().input('Categoria', sql.VarChar, Categoria).execute('sp_ReporteProductosPorCategoria');
        break;
      default:
        return res.status(400).json({ mensaje: "Tipo de reporte inválido" });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error reporte productos:", err);
    res.status(500).json({ mensaje: "Error interno al generar el reporte" });
  }
};
