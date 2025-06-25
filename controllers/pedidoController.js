// controllers/pedidoController.js
const { sql, config } = require('../config/db');
exports.crearPedido = async (req, res) => {
  const { clienteId, productos, nombre, direccion, telefono, metodoPago } = req.body;

  if (!clienteId || !productos || productos.length === 0) {
    return res.status(400).json({ mensaje: 'Faltan datos del pedido' });
  }

  if (!nombre || !direccion || !telefono || !metodoPago) {
    return res.status(400).json({ mensaje: 'Faltan datos de envío' });
  }

  const descripcion = `Envío a: ${nombre}, ${direccion}. Tel: ${telefono}. Pago: ${metodoPago}`;

  try {
    const pool = await sql.connect(config);

    // 1. Insertar el pedido y obtener el ID
    const result = await pool.request()
      .input('IdCliente', sql.Int, clienteId)
      .input('Descripcion', sql.VarChar(100), descripcion)
      .output('IdPedido', sql.Int)
      .execute('GestionarPedidoGoldenSkin');

    const idPedido = result.output.IdPedido;

    if (!idPedido || idPedido === 0) {
      return res.status(500).json({ mensaje: '❌ No se pudo registrar el pedido.' });
    }

    // 2. Insertar cada producto en el detalle
    for (const { id, cantidad } of productos) {
      await pool.request()
        .input('IdPedido', sql.Int, idPedido)
        .input('IdProducto', sql.Int, id)
        .input('Cantidad', sql.Int, cantidad)
        .execute('NuevoDetallePedido');
    }

    res.status(201).json({ mensaje: '✅ Pedido registrado correctamente', id: idPedido });
  } catch (err) {
    console.error('❌ Error al registrar pedido:', err);
    res.status(500).json({ mensaje: '❌ Error en el servidor' });
  }
};


