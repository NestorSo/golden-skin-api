const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Endpoints para gestión de roles y privilegios
 */

/**
 * @swagger
 * /api/roles/crear:
 *   post:
 *     summary: Crear un nuevo rol con privilegios
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombreRol
 *               - privilegios
 *             properties:
 *               nombreRol:
 *                 type: string
 *               privilegios:
 *                 type: string
 *                 description: Lista separada por punto y coma (;)
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 */
router.post('/crear', rolController.crearRolConPrivilegios);

/**
 * @swagger
 * /api/roles/actualizar/{id}:
 *   put:
 *     summary: Actualizar nombre de rol
 *     tags: [Roles]
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
 *             required:
 *               - nuevoNombre
 *             properties:
 *               nuevoNombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rol actualizado
 */
router.put('/actualizar/:id', rolController.actualizarRol);

/**
 * @swagger
 * /api/roles/estado/{id}:
 *   put:
 *     summary: Cambiar estado del rol
 *     tags: [Roles]
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
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 */
router.put('/estado/:id', rolController.cambiarEstadoRol);

/**
 * @swagger
 * /api/roles/listar/{estado}:
 *   get:
 *     summary: Listar roles por estado
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Lista de roles
 */
router.get('/listar/:estado', rolController.listarRoles);

/**
 * @swagger
 * /api/roles/privilegios/{idRol}:
 *   get:
 *     summary: Ver privilegios de un rol
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: idRol
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de privilegios
 */
router.get('/privilegios/:idRol', rolController.verPrivilegiosPorRol);

/**
 * @swagger
 * /api/roles/privilegios/{idRol}:
 *   delete:
 *     summary: Eliminar todos los privilegios de un rol
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: idRol
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Privilegios eliminados
 */
router.delete('/privilegios/:idRol', rolController.eliminarPrivilegiosDeRol);

module.exports = router;
