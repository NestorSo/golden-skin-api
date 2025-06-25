


const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para gestión de usuarios
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registrar un nuevo cliente desde el frontend
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, apellido, correo, contrasena, direccion, telefono]
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registro exitoso
 *       409:
 *         description: Correo ya registrado
 *       500:
 *         description: Error en el servidor
 */
router.post('/register', userController.registerCliente);

/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Registrar usuario desde panel admin (cliente o empleado)
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, apellido, email, pass, rolNombre]
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               email:
 *                 type: string
 *               pass:
 *                 type: string
 *               rolNombre:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *               cargo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado
 *       400:
 *         description: Datos faltantes o inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/admin/register', userController.registerDesdeAdmin);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login general de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [correo, contrasena]
 *             properties:
 *               correo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 *       403:
 *         description: Cuenta bloqueada temporalmente
 *       500:
 *         description: Error del servidor
 */
router.post('/login', userController.loginUsuario);

/**
 * @swagger
 * /api/buscar:
 *   get:
 *     summary: Buscar usuarios por texto
 *     tags: [Usuarios]
 *     parameters:
 *       - name: texto
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultados encontrados
 */
router.get('/buscar', userController.buscarUsuarios);

/**
 * @swagger
 * /api/listar:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista completa
 */
router.get('/todos', userController.listarUsuarios);

/**
 * @swagger
 * /api/listar/activos:
 *   get:
 *     summary: Listar usuarios activos
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios activos
 */
router.get('/listar/activos', userController.listarActivos);

/**
 * @swagger
 * /api/listar/inactivos:
 *   get:
 *     summary: Listar usuarios inactivos
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios inactivos
 */
router.get('/listar/inactivos', userController.listarInactivos);

/**
 * @swagger
 * /api/buscar/nombre:
 *   get:
 *     summary: Buscar usuario por nombre o apellido
 *     tags: [Usuarios]
 *     parameters:
 *       - name: nombre
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultados encontrados
 */
router.get('/buscar/nombre', userController.buscarPorNombre);

/**
 * @swagger
 * /api/estado/{id}:
 *   put:
 *     summary: Cambiar estado (activo/inactivo) del usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - name: id
 *         in: path
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
 *         description: Estado actualizado
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/estado/:id', userController.cambiarEstado);

/**
 * @swagger
 * /api/actualizar/{id}:
 *   put:
 *     summary: Actualizar datos del usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - name: id
 *         in: path
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
 *               apellido:
 *                 type: string
 *               email:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *               cargo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/actualizar/:id', userController.actualizarUsuario);

module.exports = router;

