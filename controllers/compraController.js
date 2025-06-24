const { sql, config } = require('../config/db');

// 🔹 Registrar una compra
exports.registrarCompra = async (req, res) => {
  const { idProveedor, idEmpleado, idProducto, cantidad, precioUnitario } = req.body;

  if (!idProveedor || !idEmpleado || !idProducto || !cantidad || !precioUnitario) {
    return res.status(400).json({ mensaje: '❌ Todos los campos son obligatorios' });
  }

  try {
    const pool = await sql.connect(config);

    await pool.request()
      .input('IdProveedor', sql.Int, idProveedor)
      .input('IdEmpleado', sql.Int, idEmpleado)
      .input('IdProducto', sql.Int, idProducto)
      .input('Cantidad', sql.Int, cantidad)
      .input('PrecioUnitario', sql.Decimal(10, 2), precioUnitario)
      .execute('GestionCompraGoldenSkin');

    return res.status(201).json({ mensaje: '✅ Compra registrada correctamente' });
  } catch (error) {
    console.error('❌ Error al registrar compra:', error);
    return res.status(500).json({ mensaje: '❌ Error interno del servidor' });
  }
};

// 🔹 Listar todas las compras
exports.listarCompras = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('sp_ListarTodasLasCompras');
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al listar compras:', error);
    res.status(500).json({ mensaje: '❌ Error al obtener las compras' });
  }
};

// 🔹 Listar compras por proveedor
exports.listarComprasPorProveedor = async (req, res) => {
  const idProveedor = parseInt(req.params.idProveedor);
  if (isNaN(idProveedor)) {
    return res.status(400).json({ mensaje: '❌ ID de proveedor inválido' });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('IdProveedor', sql.Int, idProveedor)
      .execute('sp_ListarComprasPorProveedor');

    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al listar compras por proveedor:', error);
    res.status(500).json({ mensaje: '❌ Error interno del servidor' });
  }
};

// 🔹 Listar compras entre fechas
exports.listarComprasEntreFechas = async (req, res) => {
  const { desde, hasta } = req.query;

  if (!desde || !hasta) {
    return res.status(400).json({ mensaje: '❌ Debes enviar ambas fechas: desde y hasta' });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('FechaInicio', sql.Date, desde)
      .input('FechaFin', sql.Date, hasta)
      .execute('sp_ListarComprasEntreFechas');

    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al listar compras entre fechas:', error);
    res.status(500).json({ mensaje: '❌ Error interno del servidor' });
  }
};

// 🔹 Ver detalle de una compra específica
exports.verDetalleCompra = async (req, res) => {
  const idCompra = parseInt(req.params.idCompra);
  if (isNaN(idCompra)) {
    return res.status(400).json({ mensaje: '❌ ID de compra inválido' });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('IdCompra', sql.Int, idCompra)
      .execute('sp_VerDetalleCompra');

    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener detalle de compra:', error);
    res.status(500).json({ mensaje: '❌ Error interno del servidor' });
  }
};
