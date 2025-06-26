const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');

/**
 * @swagger
 * tags:
 *   name: Proveedores
 *   description: Endpoints para gestión de proveedores
 */

/**
 * @swagger
 * /api/proveedores:
 *   post:
 *     summary: Crear nuevo proveedor
 *     tags: [Proveedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - direccion
 *               - telefono
 *               - correo
 *             properties:
 *               nombre:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *               correo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proveedor registrado correctamente
 */
router.post('/', proveedorController.crearProveedor);

/**
 * @swagger
 * /api/proveedores/{id}:
 *   put:
 *     summary: Actualizar proveedor
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *               correo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proveedor actualizado correctamente
 */
router.put('/:id', proveedorController.actualizarProveedor);

/**
 * @swagger
 * /api/proveedores/estado/{id}:
 *   put:
 *     summary: Cambiar estado del proveedor
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estado del proveedor actualizado
 */
router.put('/estado/:id', proveedorController.cambiarEstadoProveedor);

/**
 * @swagger
 * /api/proveedores/buscar:
 *   get:
 *     summary: Buscar proveedor por nombre o correo
 *     tags: [Proveedores]
 *     parameters:
 *       - in: query
 *         name: texto
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de proveedores encontrados
 */
router.get('/buscar', proveedorController.buscarProveedor);

/**
 * @swagger
 * /api/proveedores/todos:
 *   get:
 *     summary: Listar proveedores activos 
 *     tags: [Proveedores]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [0, 1]
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/todos', proveedorController.listarProveedores);

module.exports = router;
