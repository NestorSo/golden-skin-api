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
