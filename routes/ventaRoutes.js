const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

/**
 * @swagger
 * tags:
 *   name: Ventas
 *   description: Endpoints para gestionar ventas
 */

/**
 * @swagger
 * /api/ventas/multiple:
 *   post:
 *     summary: Registrar venta múltiple
 *     tags: [Ventas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clienteId, empleadoId, productos]
 *             properties:
 *               clienteId:
 *                 type: integer
 *               empleadoId:
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
 *     responses:
 *       201:
 *         description: Venta múltiple registrada correctamente
 */

router.post('/', ventaController.registrarVenta);

/**
 * @swagger
 * /api/ventas:
 *   post:
 *     summary: Registrar venta individual
 *     tags: [Ventas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idCliente, idEmpleado, idProducto, cantidad]
 *             properties:
 *               idCliente:
 *                 type: integer
 *               idEmpleado:
 *                 type: integer
 *               idProducto:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Venta registrada correctamente
 */

router.post('/tienda', ventaController.Venta);

/**
 * @swagger
 * /api/ventas:
 *   get:
 *     summary: Listar todas las ventas
 *     tags: [Ventas]
 *     responses:
 *       200:
 *         description: Lista de todas las ventas
 *       500:
 *         description: Error del servidor
 */
router.get('/', ventaController.listarVentas);

/**
 * @swagger
 * /api/ventas/cliente/{idCliente}:
 *   get:
 *     summary: Obtener ventas por ID de cliente
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: idCliente
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de ventas del cliente
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/cliente/:idCliente', ventaController.listarVentasPorCliente);

/**
 * @swagger
 * /api/ventas/entre-fechas:
 *   get:
 *     summary: Obtener ventas entre fechas
 *     tags: [Ventas]
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de ventas en el rango de fechas
 *       400:
 *         description: Fechas inválidas
 *       500:
 *         description: Error del servidor
 */
router.get('/entre-fechas', ventaController.listarVentasEntreFechas);

/**
 * @swagger
 * /api/ventas/detalle/{idVenta}:
 *   get:
 *     summary: Ver detalle de una venta específica
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: idVenta
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles de la venta
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/detalle/:idVenta', ventaController.verDetalleVenta);

/**
 * @swagger
 * /api/ventas/por-producto:
 *   get:
 *     summary: Ver resumen de ventas agrupado por producto
 *     tags: [Ventas]
 *     responses:
 *       200:
 *         description: Resumen de productos más vendidos
 *       500:
 *         description: Error del servidor
 */
router.get('/por-producto', ventaController.ventasPorProducto);

/**
 * @swagger
 * /api/ventas/factura/{idVenta}:
 *   get:
 *     summary: Obtener los datos completos para la factura de una venta
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: idVenta
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Datos completos de la factura
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/factura/:idVenta', ventaController.obtenerFacturaPorVenta);



router.post('/tienda', ventaController.insertarVentaCompleta);


module.exports = router;
