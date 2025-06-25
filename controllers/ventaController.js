const { sql, config } = require('../config/db');

// 🔹 Registrar venta
exports.registrarVenta = async (req, res) => {
  const { clienteId, empleadoId, productos } = req.body;

  if (!clienteId || !empleadoId || !productos || productos.length === 0) {
    return res.status(400).json({ mensaje: '❌ Faltan datos para procesar la venta' });
  }

  try {
    const pool = await sql.connect(config);

    // 1. Crear la venta
    await pool.request()
      .input('IdCliente', sql.Int, clienteId)
      .input('IdEmpleado', sql.Int, empleadoId)
      .input('Descripcion', sql.NVarChar, 'Venta generada desde sistema web')
      .execute('GestionarVentaMultiple');

    // 2. Obtener el ID recién insertado
    const ventaIdResult = await pool.request().query('SELECT MAX(IdVenta) AS IdVenta FROM Ventas');
    const idVenta = ventaIdResult.recordset[0].IdVenta;

    // 3. Insertar detalle para cada producto
    for (const { id, cantidad } of productos) {
      await pool.request()
        .input('IdVenta', sql.Int, idVenta)
        .input('IdProducto', sql.Int, id)
        .input('Cantidad', sql.Int, cantidad)
        .execute('NuevoDetalleVenta');
    }

    res.status(201).json({ mensaje: '✅ Venta registrada correctamente', id: idVenta });
  } catch (err) {
    console.error('❌ Error al registrar venta:', err);
    res.status(500).json({ mensaje: '❌ Error interno del servidor' });
  }
};

exports.Venta = async (req, res) => {
  const { idCliente, idEmpleado, idProducto, cantidad } = req.body;

  if (!idCliente || !idEmpleado || !idProducto || !cantidad) {
    return res.status(400).json({ mensaje: '❌ Todos los campos son obligatorios' });
  }

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('IdCliente', sql.Int, idCliente)
      .input('IdEmpleado', sql.Int, idEmpleado)
      .input('IdProducto', sql.Int, idProducto)
      .input('Cantidad', sql.Int, cantidad)
      .execute('GestionarVentaGoldenSkin');

    res.status(201).json({ mensaje: '✅ Venta registrada correctamente' });
  } catch (error) {
    console.error('❌ Error al registrar venta:', error);
    res.status(500).json({ mensaje: '❌ Error interno al registrar la venta' });
  }
};

// 🔹 Listar todas las ventas
exports.listarVentas = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('sp_ListarTodasLasVentas');
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al listar ventas:', error);
    res.status(500).json({ mensaje: '❌ Error al obtener ventas' });
  }
};

// 🔹 Listar ventas por cliente
exports.listarVentasPorCliente = async (req, res) => {
  const idCliente = parseInt(req.params.idCliente);
  if (isNaN(idCliente)) {
    return res.status(400).json({ mensaje: '❌ ID de cliente inválido' });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('IdCliente', sql.Int, idCliente)
      .execute('sp_ListarVentasPorCliente');

    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al listar ventas por cliente:', error);
    res.status(500).json({ mensaje: '❌ Error interno del servidor' });
  }
};

// 🔹 Listar ventas entre fechas
exports.listarVentasEntreFechas = async (req, res) => {
  const { desde, hasta } = req.query;

  if (!desde || !hasta) {
    return res.status(400).json({ mensaje: '❌ Debes enviar ambas fechas' });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('FechaInicio', sql.Date, desde)
      .input('FechaFin', sql.Date, hasta)
      .execute('sp_ListarVentasEntreFechas');

    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al listar ventas por fechas:', error);
    res.status(500).json({ mensaje: '❌ Error al filtrar ventas' });
  }
};

// 🔹 Ver detalle de una venta
exports.verDetalleVenta = async (req, res) => {
  const idVenta = parseInt(req.params.idVenta);
  if (isNaN(idVenta)) {
    return res.status(400).json({ mensaje: '❌ ID de venta inválido' });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('IdVenta', sql.Int, idVenta)
      .execute('sp_VerDetalleVenta');

    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener detalle de venta:', error);
    res.status(500).json({ mensaje: '❌ Error al cargar detalle de venta' });
  }
};

// 🔹 Ver resumen de ventas por producto
exports.ventasPorProducto = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('sp_VentasPorProducto');
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al listar ventas por producto:', error);
    res.status(500).json({ mensaje: '❌ Error interno del servidor' });
  }
};
