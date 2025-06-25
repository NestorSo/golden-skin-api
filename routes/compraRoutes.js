const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');

/**
 * @swagger
 * tags:
 *   name: Compras
 *   description: Endpoints para gestionar compras
 */

/**
 * @swagger
 * /api/compras:
 *   post:
 *     summary: Registrar una nueva compra
 *     tags: [Compras]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - proveedorId
 *               - empleadoId
 *               - productoId
 *               - cantidad
 *               - precioUnitario
 *             properties:
 *               proveedorId:
 *                 type: integer
 *               empleadoId:
 *                 type: integer
 *               productoId:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               precioUnitario:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Compra registrada correctamente
 *       400:
 *         description: Datos incompletos
 *       500:
 *         description: Error del servidor
 */
router.post('/', compraController.registrarCompra);

/**
 * @swagger
 * /api/compras:
 *   get:
 *     summary: Obtener todas las compras
 *     tags: [Compras]
 *     responses:
 *       200:
 *         description: Lista de todas las compras
 *       500:
 *         description: Error del servidor
 */
router.get('/', compraController.listarCompras);

/**
 * @swagger
 * /api/compras/proveedor/{idProveedor}:
 *   get:
 *     summary: Obtener compras por ID de proveedor
 *     tags: [Compras]
 *     parameters:
 *       - in: path
 *         name: idProveedor
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de compras del proveedor
 *       404:
 *         description: Proveedor no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/proveedor/:idProveedor', compraController.listarComprasPorProveedor);

/**
 * @swagger
 * /api/compras/entre-fechas:
 *   get:
 *     summary: Obtener compras entre fechas
 *     tags: [Compras]
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
 *         description: Lista de compras en el rango de fechas
 *       400:
 *         description: Fechas inválidas
 *       500:
 *         description: Error del servidor
 */
router.get('/entre-fechas', compraController.listarComprasEntreFechas);

/**
 * @swagger
 * /api/compras/detalle/{idCompra}:
 *   get:
 *     summary: Ver detalle de una compra específica
 *     tags: [Compras]
 *     parameters:
 *       - in: path
 *         name: idCompra
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles de la compra
 *       404:
 *         description: Compra no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/detalle/:idCompra', compraController.verDetalleCompra);

module.exports = router;
