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

    for (const producto of productos) {
      const { id, cantidad } = producto;
      await pool.request()
        .input('IdCliente', sql.Int, clienteId)
        .input('IdProducto', sql.Int, id)
        .input('Cantidad', sql.Int, cantidad)
        .input('Descripcion', sql.VarChar(100), descripcion)
        .execute('GestionarPedidoGoldenSkin');
    }

    return res.status(201).json({ mensaje: '✅ Pedido registrado correctamente' });
  } catch (err) {
    console.error('❌ Error al registrar pedido:', err);
    return res.status(500).json({ mensaje: '❌ Error en el servidor' });
  }
};

