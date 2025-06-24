
// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// // 🔹 Registro (cliente desde el frontend)
// router.post('/register', userController.registrarCliente);

// // 🔹 Registro desde panel administrativo (cliente o empleado)
// router.post('/admin/register', userController.registrarUsuarioAdmin);

// // 🔹 Login general (retorna datos y rol)
// router.post('/login', userController.loginUsuario);

// // 🔹 Buscar usuarios por texto
// router.get('/buscar', userController.buscarUsuarios);

// // 🔹 Listar todos los usuarios
// router.get('/listar', userController.listarUsuarios);

// // 🔹 Listar usuarios activos
// router.get('/listar/activos', userController.listarActivos);

// // 🔹 Listar usuarios inactivos
// router.get('/listar/inactivos', userController.listarInactivos);

// // 🔹 Buscar por nombre o apellido
// router.get('/buscar/nombre', userController.buscarPorNombre);

// // 🔹 Cambiar estado (activar/dar de baja)
// router.put('/estado/:id', userController.cambiarEstado);

// // 🔹 Actualizar usuario
// router.put('/actualizar/:id', userController.actualizarUsuario);

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// router.post('/register', userController.registerUser);
// router.post('/login', userController.loginUser);
// router.post('/login', async (req, res) => {
//   const { correo, contrasena } = req.body;

//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request()
//       .input('Correo', sql.VarChar, correo)
//       .input('Contrasena', sql.VarChar, contrasena)
//       .query(`
//         SELECT IdCliente, NombreCliente, Correo 
//         FROM Clientes 
//         WHERE Correo = @Correo AND Contrasena = @Contrasena
//       `);

//     if (result.recordset.length === 0) {
//       return res.status(401).json({ mensaje: 'Credenciales inválidas' });
//     }

//     const usuario = result.recordset[0];

//     res.status(200).json({
//       mensaje: 'Inicio de sesión exitoso',
//       usuario: {
//         id: usuario.IdCliente,
//         nombre: usuario.NombreCliente,
//         correo: usuario.Correo
//       }
//     });
//   } catch (err) {
//     console.error('Error en login:', err);
//     res.status(500).json({ mensaje: 'Error del servidor' });
//   }
// });

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// /**
//  * @swagger
//  * tags:
//  *   name: Usuarios
//  *   description: Endpoints para gestión de usuarios
//  */

// /**
//  * @swagger
//  * /api/register:
//  *   post:
//  *     summary: Registrar un nuevo cliente desde el frontend
//  *     tags: [Usuarios]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required: [nombre, apellido, correo, contrasena, direccion, telefono]
//  *             properties:
//  *               nombre:
//  *                 type: string
//  *               apellido:
//  *                 type: string
//  *               correo:
//  *                 type: string
//  *               contrasena:
//  *                 type: string
//  *               direccion:
//  *                 type: string
//  *               telefono:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Registro exitoso
//  *       409:
//  *         description: Correo ya registrado
//  *       500:
//  *         description: Error en el servidor
//  */
// router.post('/register', userController.registrarCliente);

// /**
//  * @swagger
//  * /api/admin/register:
//  *   post:
//  *     summary: Registrar usuario desde panel admin (cliente o empleado)
//  *     tags: [Usuarios]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required: [nombre, apellido, email, pass, rolNombre]
//  *             properties:
//  *               nombre:
//  *                 type: string
//  *               apellido:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               pass:
//  *                 type: string
//  *               rolNombre:
//  *                 type: string
//  *               direccion:
//  *                 type: string
//  *               telefono:
//  *                 type: string
//  *               cargo:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Usuario registrado
//  *       400:
//  *         description: Datos faltantes o inválidos
//  *       500:
//  *         description: Error del servidor
//  */
// router.post('/admin/register', userController.registerDesdeAdmin);

// /**
//  * @swagger
//  * /api/login:
//  *   post:
//  *     summary: Login general de usuario
//  *     tags: [Usuarios]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required: [correo, contrasena]
//  *             properties:
//  *               correo:
//  *                 type: string
//  *               contrasena:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Login exitoso
//  *       401:
//  *         description: Credenciales inválidas
//  *       403:
//  *         description: Cuenta bloqueada temporalmente
//  *       500:
//  *         description: Error del servidor
//  */
// router.post('/login', userController.loginUsuario);

// /**
//  * @swagger
//  * /api/buscar:
//  *   get:
//  *     summary: Buscar usuarios por texto
//  *     tags: [Usuarios]
//  *     parameters:
//  *       - name: texto
//  *         in: query
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Resultados encontrados
//  */
// router.get('/buscar', userController.buscarUsuarios);

// /**
//  * @swagger
//  * /api/listar:
//  *   get:
//  *     summary: Listar todos los usuarios
//  *     tags: [Usuarios]
//  *     responses:
//  *       200:
//  *         description: Lista completa
//  */
// router.get('/listar', userController.listarUsuarios);

// /**
//  * @swagger
//  * /api/listar/activos:
//  *   get:
//  *     summary: Listar usuarios activos
//  *     tags: [Usuarios]
//  *     responses:
//  *       200:
//  *         description: Lista de usuarios activos
//  */
// router.get('/listar/activos', userController.listarActivos);

// /**
//  * @swagger
//  * /api/listar/inactivos:
//  *   get:
//  *     summary: Listar usuarios inactivos
//  *     tags: [Usuarios]
//  *     responses:
//  *       200:
//  *         description: Lista de usuarios inactivos
//  */
// router.get('/listar/inactivos', userController.listarInactivos);

// /**
//  * @swagger
//  * /api/buscar/nombre:
//  *   get:
//  *     summary: Buscar usuario por nombre o apellido
//  *     tags: [Usuarios]
//  *     parameters:
//  *       - name: nombre
//  *         in: query
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Resultados encontrados
//  */
// router.get('/buscar/nombre', userController.buscarPorNombre);

// /**
//  * @swagger
//  * /api/estado/{id}:
//  *   put:
//  *     summary: Cambiar estado (activo/inactivo) del usuario
//  *     tags: [Usuarios]
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               estado:
//  *                 type: boolean
//  *     responses:
//  *       200:
//  *         description: Estado actualizado
//  *       404:
//  *         description: Usuario no encontrado
//  */
// router.put('/estado/:id', userController.cambiarEstado);

// /**
//  * @swagger
//  * /api/actualizar/{id}:
//  *   put:
//  *     summary: Actualizar datos del usuario
//  *     tags: [Usuarios]
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               nombre:
//  *                 type: string
//  *               apellido:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               direccion:
//  *                 type: string
//  *               telefono:
//  *                 type: string
//  *               cargo:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Usuario actualizado
//  *       404:
//  *         description: Usuario no encontrado
//  */
// router.put('/actualizar/:id', userController.actualizarUsuario);

// module.exports = router;


// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * tags:
 * name: Usuarios
 * description: Endpoints para gestión de usuarios
 */

/**
 * @swagger
 * /api/register:
 * post:
 * summary: Registrar un nuevo cliente desde el frontend
 * tags: [Usuarios]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [nombre, apellido, correo, contrasena, direccion, telefono]
 * properties:
 * nombre:
 * type: string
 * example: Maria
 * apellido:
 * type: string
 * example: Lopez
 * correo:
 * type: string
 * format: email
 * example: maria.lopez@example.com
 * contrasena:
 * type: string
 * example: mySecurePass123
 * direccion:
 * type: string
 * example: Calle Falsa 123
 * telefono:
 * type: string
 * example: 555-0101
 * responses:
 * 200:
 * description: Registro exitoso
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: ✅ Registro exitoso
 * 409:
 * description: Correo ya registrado
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: El correo ya está registrado
 * 500:
 * description: Error en el servidor
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: Error en el servidor
 */
router.post('/register', userController.registerCliente);

/**
 * @swagger
 * /api/admin/register:
 * post:
 * summary: Registrar usuario desde panel admin (cliente o empleado)
 * tags: [Usuarios]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [nombre, apellido, correo, contrasena, rol]
 * properties:
 * nombre:
 * type: string
 * example: Juan
 * apellido:
 * type: string
 * example: Perez
 * correo:
 * type: string
 * format: email
 * example: juan.perez.admin@example.com
 * contrasena:
 * type: string
 * example: adminPass123
 * rol:
 * type: string
 * description: Nombre del rol (Cliente, Empleado, Administrador).
 * example: Empleado
 * direccion:
 * type: string
 * nullable: true
 * example: Avenida Central 456
 * telefono:
 * type: string
 * nullable: true
 * example: 555-0202
 * cargo:
 * type: string
 * nullable: true
 * example: Gerente
 * responses:
 * 201:
 * description: Usuario registrado
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: ✅ Usuario registrado por admin
 * 400:
 * description: Datos faltantes o inválidos
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: Campos obligatorios faltantes
 * 500:
 * description: Error del servidor
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: Error en registro admin: [mensaje de error]
 */
router.post('/admin/register', userController.registerDesdeAdmin);

/**
 * @swagger
 * /api/login:
 * post:
 * summary: Login general de usuario
 * tags: [Usuarios]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [correo, contrasena]
 * properties:
 * correo:
 * type: string
 * example: usuario@example.com
 * contrasena:
 * type: string
 * example: mysecretpassword
 * responses:
 * 200:
 * description: Login exitoso
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * mensaje:
 * type: string
 * example: ✅ Login exitoso
 * usuario:
 * type: object
 * properties:
 * IdUsuario:
 * type: integer
 * example: 1
 * Nombre:
 * type: string
 * example: Test
 * Apellido:
 * type: string
 * example: User
 * Email:
 * type: string
 * example: test@example.com
 * EstadoLogin:
 * type: boolean
 * example: true
 * EstadoUsuario:
 * type: boolean
 * example: true
 * FechaRegistro:
 * type: string
 * format: date
 * example: 2024-01-01
 * IdRol:
 * type: integer
 * example: 2
 * 401:
 * description: Credenciales inválidas
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * mensaje:
 * type: string
 * example: ❌ Credenciales inválidas
 * 403:
 * description: Cuenta bloqueada temporalmente
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: ⏳ Cuenta bloqueada. Intente en X segundos.
 * 500:
 * description: Error del servidor
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: Error en el servidor
 */
router.post('/login', userController.loginUser);

/**
 * @swagger
 * /api/buscar:
 * get:
 * summary: Buscar usuarios por texto
 * tags: [Usuarios]
 * parameters:
 * - in: query
 * name: texto
 * schema:
 * type: string
 * required: true
 * description: Texto de búsqueda para filtrar usuarios (nombre, apellido, email).
 * example: juan
 * - in: query
 * name: estado
 * schema:
 * type: string
 * enum: ['0', '1']
 * required: false
 * description: Filtra por estado del usuario (0=Inactivo, 1=Activo). Opcional.
 * example: 1
 * responses:
 * 200:
 * description: Resultados encontrados
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * IdUsuario:
 * type: integer
 * example: 1
 * Nombre:
 * type: string
 * example: Test
 * Apellido:
 * type: string
 * example: User
 * Email:
 * type: string
 * example: test@example.com
 * EstadoUsuario:
 * type: boolean
 * example: true
 * IdRol:
 * type: integer
 * example: 2
 * 500:
 * description: Error del servidor
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: Error al buscar usuarios: [mensaje de error]
 */
router.get('/buscar', userController.buscarUsuarios);

/**
 * @swagger
 * /api/listar:
 * get:
 * summary: Listar todos los usuarios
 * tags: [Usuarios]
 * parameters:
 * - in: query
 * name: estado
 * schema:
 * type: string
 * enum: ['0', '1']
 * required: false
 * description: Filtra por estado del usuario (0=Inactivo, 1=Activo). Opcional.
 * example: 1
 * responses:
 * 200:
 * description: Lista completa de usuarios
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * IdUsuario:
 * type: integer
 * example: 1
 * Nombre:
 * type: string
 * example: Test
 * Apellido:
 * type: string
 * example: User
 * Email:
 * type: string
 * example: test@example.com
 * EstadoUsuario:
 * type: boolean
 * example: true
 * IdRol:
 * type: integer
 * example: 2
 * 500:
 * description: Error del servidor
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: Error al listar usuarios: [mensaje de error]
 */
router.get('/listar', userController.listarUsuarios);

/**
 * @swagger
 * /api/listar/activos:
 * get:
 * summary: Listar usuarios activos (usa /api/listar?estado=1)
 * tags: [Usuarios]
 * responses:
 * 200:
 * description: Lista de usuarios activos. (Redirigido o manejado internamente por /api/listar?estado=1)
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * IdUsuario:
 * type: integer
 * example: 1
 * Nombre:
 * type: string
 * example: Test
 * Apellido:
 * type: string
 * example: User
 * Email:
 * type: string
 * example: test@example.com
 * EstadoUsuario:
 * type: boolean
 * example: true
 * IdRol:
 * type: integer
 * example: 2
 * 500:
 * description: Error del servidor
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: Error al listar usuarios: [mensaje de error]
 */
router.get('/listar/activos', userController.listarUsuarios);

/**
 * @swagger
 * /api/listar/inactivos:
 * get:
 * summary: Listar usuarios inactivos (usa /api/listar?estado=0)
 * tags: [Usuarios]
 * responses:
 * 200:
 * description: Lista de usuarios inactivos. (Redirigido o manejado internamente por /api/listar?estado=0)
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * IdUsuario:
 * type: integer
 * example: 1
 * Nombre:
 * type: string
 * example: Test
 * Apellido:
 * type: string
 * example: User
 * Email:
 * type: string
 * example: test@example.com
 * EstadoUsuario:
 * type: boolean
 * example: false
 * IdRol:
 * type: integer
 * example: 2
 * 500:
 * description: Error del servidor
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: Error al listar usuarios: [mensaje de error]
 */
router.get('/listar/inactivos', userController.listarUsuarios);

/**
 * @swagger
 * /api/buscar/nombre:
 * get:
 * summary: Buscar usuario por nombre o apellido (usa /api/buscar?texto=nombre)
 * tags: [Usuarios]
 * parameters:
 * - in: query
 * name: nombre
 * schema:
 * type: string
 * required: true
 * description: Nombre o apellido a buscar.
 * example: Maria
 * responses:
 * 200:
 * description: Resultados encontrados. (Redirigido o manejado internamente por /api/buscar?texto=nombre)
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * IdUsuario:
 * type: integer
 * example: 1
 * Nombre:
 * type: string
 * example: Test
 * Apellido:
 * type: string
 * example: User
 * Email:
 * type: string
 * example: test@example.com
 * EstadoUsuario:
 * type: boolean
 * example: true
 * IdRol:
 * type: integer
 * example: 2
 * 500:
 * description: Error del servidor
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: Error al buscar usuarios: [mensaje de error]
 */
router.get('/buscar/nombre', userController.buscarUsuarios);

/**
 * @swagger
 * /api/estado/{id}:
 * put:
 * summary: Cambiar estado (activo/inactivo) del usuario
 * tags: [Usuarios]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: ID del usuario a actualizar.
 * example: 1
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - nuevoEstado
 * properties:
 * nuevoEstado:
 * type: boolean
 * description: Nuevo estado del usuario (true para activo, false para inactivo).
 * example: false
 * responses:
 * 200:
 * description: Estado actualizado
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: ✅ Estado actualizado
 * 404:
 * description: Usuario no encontrado
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: Usuario no encontrado
 * 500:
 * description: Error del servidor
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: Error al cambiar estado: [mensaje de error]
 */
router.put('/estado/:id', userController.cambiarEstado);

/**
 * @swagger
 * /api/actualizar/{id}:
 * put:
 * summary: Actualizar datos del usuario
 * tags: [Usuarios]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: ID del usuario a actualizar.
 * example: 1
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nombre:
 * type: string
 * example: Juan Actualizado
 * apellido:
 * type: string
 * example: Pérez Actualizado
 * correo:
 * type: string
 * format: email
 * example: juan.actualizado@example.com
 * direccion:
 * type: string
 * nullable: true
 * example: Nueva Calle 456
 * telefono:
 * type: string
 * nullable: true
 * example: 555-2222
 * cargo:
 * type: string
 * nullable: true
 * example: Supervisor
 * responses:
 * 200:
 * description: Usuario actualizado
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: ✅ Usuario actualizado
 * 404:
 * description: Usuario no encontrado
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: Usuario no encontrado
 * 500:
 * description: Error del servidor
 * content:
 * text/plain:
 * schema:
 * type: string
 * example: Error al actualizar usuario: [mensaje de error]
 */
router.put('/actualizar/:id', userController.actualizarUsuario);

module.exports = router;