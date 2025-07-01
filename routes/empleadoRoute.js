const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');

/**
 * @swagger
 * /api/empleados/por-usuario/{id}:
 *   get:
 *     summary: Obtener el IdEmpleado a partir del IdUsuario
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: IdEmpleado encontrado
 *       404:
 *         description: No se encontró empleado para ese usuario
 */
router.get('/por-usuario/:id', empleadoController.obtenerEmpleadoPorUsuario);

// routes/empleadoRoute.js
router.get('/todos', empleadoController.obtenerTodosLosEmpleados);

module.exports = router;
