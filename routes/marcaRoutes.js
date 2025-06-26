const express = require('express');
const router = express.Router();
const marcaController = require('../controllers/marcaController');

/**
 * @swagger
 * tags:
 *   name: Marcas
 *   description: Endpoints para la gestión de marcas
 */

/**
 * @swagger
 * /api/marcas:
 *   post:
 *     summary: Crear una nueva marca
 *     tags: [Marcas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *               - fabricante
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fabricante:
 *                 type: string
 *     responses:
 *       201:
 *         description: Marca registrada correctamente
 *       500:
 *         description: Error del servidor
 */
router.post('/', marcaController.crearMarca);

/**
 * @swagger
 * /api/marcas/{id}:
 *   put:
 *     summary: Actualizar información de una marca
 *     tags: [Marcas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la marca a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fabricante:
 *                 type: string
 *     responses:
 *       200:
 *         description: Marca actualizada correctamente
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', marcaController.actualizarMarca);

/**
 * @swagger
 * /api/marcas/estado/{id}:
 *   put:
 *     summary: Cambiar estado de una marca (activa/inactiva)
 *     tags: [Marcas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la marca
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
 *         description: Estado actualizado correctamente
 *       500:
 *         description: Error del servidor
 */
router.put('/estado/:id', marcaController.cambiarEstadoMarca);

/**
 * @swagger
 * /api/marcas/buscar:
 *   get:
 *     summary: Buscar marcas por nombre o fabricante
 *     tags: [Marcas]
 *     parameters:
 *       - in: query
 *         name: texto
 *         schema:
 *           type: string
 *         description: Texto de búsqueda
 *     responses:
 *       200:
 *         description: Lista de marcas encontradas
 *       500:
 *         description: Error del servidor
 */
router.get('/buscar', marcaController.buscarMarca);
/**
 * @swagger
 * /api/marcas/todos:
 *   get:
 *     summary: Listar todas las marcas activas
 *     tags: [Marcas]
 *     responses:
 *       200:
 *         description: Lista de marcas
 *       500:
 *         description: Error del servidor
 */
router.get('/todos', marcaController.listarMarcas);


module.exports = router;
