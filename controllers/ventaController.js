const { sql, config } = require('../config/db');

// 🔹 Registrar venta
exports.registrarVenta = async (req, res) => {
  const { clienteId, empleadoId, productos } = req.body;

  if (!clienteId || !empleadoId || !productos || productos.length === 0) {
    return res.status(400).json({ mensaje: '❌ Faltan datos para procesar la venta' });
  }

  try {
    const pool = await sql.connect(config);

    await pool.request()
      .input('IdCliente', sql.Int, clienteId)
      .input('IdEmpleado', sql.Int, empleadoId)
      .input('Descripcion', sql.NVarChar, 'Venta generada desde sistema web')
      .execute('GestionarVentaMultiple');

    const ventaIdResult = await pool.request().query('SELECT MAX(IdVenta) AS IdVenta FROM Ventas');
    const idVenta = ventaIdResult.recordset[0].IdVenta;

    for (const { id, cantidad } of productos) {
      await pool.request()
        .input('IdVenta', sql.Int, idVenta)
        .input('IdProducto', sql.Int, id)
        .input('Cantidad', sql.Int, cantidad)
        .execute('NuevoDetalleVenta');
    }

    res.status(201).json({ mensaje: '✅ Pedido registrado correctamente', id: idVenta });
  } catch (err) {
    console.error('❌ Error en registrar venta múltiple:', err);
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
  const soloDelivery = req.query.soloDelivery === 'true'; // true o false

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('SoloDelivery', sql.Bit, soloDelivery)
      .execute('sp_ListarTodasLasVentas');

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


// ventasController.js
exports.obtenerFacturaPorVenta = async (req, res) => {
  const { idVenta } = req.params;

  if (isNaN(idVenta)) {
    return res.status(400).json({ mensaje: '❌ ID de venta inválido' });
  }

  try {
    const pool = await sql.connect(config);

    // Ejecutar el procedimiento que devuelve dos conjuntos de resultados
    const result = await pool.request()
      .input('IdVenta', sql.Int, idVenta)
      .execute('sp_ObtenerFacturaVenta');

    const cabecera = result.recordsets[0][0]; // Primer conjunto: información general
    const detalle = result.recordsets[1];     // Segundo conjunto: productos vendidos

    if (!cabecera) {
      return res.status(404).json({ mensaje: '❌ Venta no encontrada' });
    }

    // Construir el objeto completo de factura
    const factura = {
      IdVenta: cabecera.IdVenta,
      Fecha: cabecera.FechaVenta,
      Cliente: cabecera.Cliente,
      Empleado: cabecera.Empleado,
      Subtotal: parseFloat(cabecera.Subtotal),
      Descuento: parseFloat(cabecera.Descuento),
      Total: parseFloat(cabecera.Total),
      EsDelivery: cabecera.EsDelivery,
      Detalle: detalle.map(p => ({
        NombreProducto: p.NombreProducto,
        PrecioUnitario: parseFloat(p.PrecioUnitario),
        Cantidad: p.Cantidad
      }))
    };

    res.json(factura);
  } catch (err) {
    console.error('❌ Error obteniendo factura:', err);
    res.status(500).json({ mensaje: '❌ Error interno del servidor' });
  }
};

exports.listarVentas = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { soloDelivery } = req.query;

    let result;
    if (soloDelivery === 'true') {
      result = await pool.request().execute('sp_ListarVentasDelivery');
    } else {
      result = await pool.request().execute('sp_ListarVentasNoDelivery');
    }

    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al listar ventas:', error);
    res.status(500).json({ mensaje: '❌ Error al obtener ventas' });
  }
};



exports.insertarVentaCompleta = async (req, res) => {
  const { idCliente, idEmpleado, descuento = 0, delivery = true, productos } = req.body;

  if (!idCliente || !idEmpleado || !productos || productos.length === 0) {
    return res.status(400).json({ mensaje: 'Datos incompletos para la venta' });
  }

  const total = productos.reduce((acc, p) => acc + p.subtotal, 0) - descuento;

  try {
    const pool = await sql.connect(config);
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    const ventaRequest = new sql.Request(transaction);
    const ventaResult = await ventaRequest
      .input('IdEmpleado', sql.Int, idEmpleado)
      .input('IdCliente', sql.Int, idCliente)
      .input('Descuento', sql.Decimal(10, 2), descuento)
      .input('Total', sql.Decimal(10, 2), total)
      .input('Delivery', sql.Bit, delivery ? 1 : 0)
      .query(`
        INSERT INTO Ventas (IdEmpleado, IdCliente, FechaVenta, Descuento, Total, Delivery)
        VALUES (@IdEmpleado, @IdCliente, GETDATE(), @Descuento, @Total, @Delivery);
        SELECT SCOPE_IDENTITY() AS IdVenta;
      `);

    const idVenta = ventaResult.recordset[0].IdVenta;

    for (const prod of productos) {
      await new sql.Request(transaction)
        .input('IdVenta', sql.Int, idVenta)
        .input('IdProducto', sql.Int, prod.idProducto)
        .input('CantidadVendida', sql.Int, prod.cantidad)
        .input('Subtotal', sql.Decimal(10, 2), prod.subtotal)
        .query(`
          INSERT INTO DetalleVenta (IdVenta, IdProducto, CantidadVendida, Subtotal)
          VALUES (@IdVenta, @IdProducto, @CantidadVendida, @Subtotal)
        `);

      // Actualizar inventario
      await new sql.Request(transaction)
        .input('IdProducto', sql.Int, prod.idProducto)
        .input('Cantidad', sql.Int, prod.cantidad)
        .query(`
          UPDATE Productos SET Cantidad = Cantidad - @Cantidad
          WHERE IdProducto = @IdProducto
        `);
    }

    await transaction.commit();

    res.json({ mensaje: '✅ Venta registrada correctamente', idVenta });
  } catch (error) {
    console.error('❌ Error al registrar venta completa:', error);
    res.status(500).json({ mensaje: 'Error al registrar la venta' });
  }
};
