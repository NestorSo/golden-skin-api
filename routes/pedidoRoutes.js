// const express = require('express');
// const router = express.Router();
// const { sql, config } = require('../config/db');

// // POST /api/pedidos
// router.post('/', async (req, res) => {
//   const { productos, clienteId, descripcion } = req.body;

//   if (!productos || productos.length === 0 || !clienteId) {
//     return res.status(400).json({ message: 'Faltan datos del pedido o cliente' });
//   }

//   try {
//     const pool = await sql.connect(config);

//     // 1. Insertar el pedido (encabezado)
//     const pedidoResult = await pool.request()
//       .input('IdCliente', sql.Int, clienteId)
//       .input('Fecha', sql.DateTime, new Date())
//       .input('Descripcion', sql.VarChar(400), descripcion || 'Pedido desde catálogo web')
//       .input('Estado', sql.Int, 1) // 1 = pendiente
//       .query(`
//         INSERT INTO Pedidos (IdCliente, Fecha, Descripcion, Estado)
//         OUTPUT INSERTED.IdPedido
//         VALUES (@IdCliente, @Fecha, @Descripcion, @Estado)
//       `);

//     const idPedido = pedidoResult.recordset[0].IdPedido;

//     // 2. Insertar cada detalle del pedido
//     for (const p of productos) {
//       await pool.request()
//         .input('IdPedido', sql.Int, idPedido)
//         .input('IdProducto', sql.Int, p.id)
//         .input('Cantidad', sql.Int, p.cantidad)
//         .input('PrecioUnitario', sql.Decimal(10, 2), p.precio)
//         .query(`
//           INSERT INTO DetallePedidos (IdPedido, IdProducto, Cantidad, PrecioUnitario)
//           VALUES (@IdPedido, @IdProducto, @Cantidad, @PrecioUnitario)
//         `);
//     }

//     res.status(201).json({ message: 'Pedido guardado correctamente', id: idPedido });
//   } catch (err) {
//     console.error('❌ Error al guardar pedido:', err);
//     res.status(500).json({ message: 'Error interno del servidor' });
//   }
// });

// module.exports = router;



// // routes/pedidoRoutes.js
// const express = require('express');
// const router = express.Router();
// const pedidoController = require('../controllers/pedidoController');

// // POST /api/pedidos
// router.post('/', pedidoController.crearPedido);

// module.exports = router;


const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Endpoints para gestionar pedidos
 */

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Crear un nuevo pedido (cliente)
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clienteId
 *               - productos
 *               - descripcion
 *             properties:
 *               clienteId:
 *                 type: integer
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *       400:
 *         description: Datos incompletos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', pedidoController.crearPedido);

module.exports = router;
