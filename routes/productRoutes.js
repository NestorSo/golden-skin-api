const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const upload = multer(); // Para manejar imágenes en memoria

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Endpoints para la gestión de productos
 */

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Agregar un nuevo producto (con imagen)
 *     tags: [Productos]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - NombreProducto
 *               - Precio
 *               - Cantidad
 *               - IdMarca
 *               - Categoria
 *             properties:
 *               NombreProducto:
 *                 type: string
 *               Descripcion:
 *                 type: string
 *               Precio:
 *                 type: number
 *                 format: float
 *               Cantidad:
 *                 type: integer
 *               FechaFabricacion:
 *                 type: string
 *                 format: date
 *               IdMarca:
 *                 type: integer
 *               Categoria:
 *                 type: string
 *               Imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Producto agregado
 *       500:
 *         description: Error del servidor
 */
router.post('/', upload.single('Imagen'), productController.insertarProducto);

/**
 * @swagger
 * /api/productos/inventario:
 *   put:
 *     summary: Agregar inventario a un producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdProducto:
 *                 type: integer
 *               CantidadAgregada:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Inventario actualizado
 */
router.put('/inventario', productController.agregarInventarioProducto);

/**
 * @swagger
 * /api/productos:
 *   put:
 *     summary: Actualizar un producto (opcionalmente con imagen)
 *     tags: [Productos]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - IdProducto
 *             properties:
 *               IdProducto:
 *                 type: integer
 *               NombreProducto:
 *                 type: string
 *               Descripcion:
 *                 type: string
 *               Precio:
 *                 type: number
 *               FechaFabricacion:
 *                 type: string
 *               IdMarca:
 *                 type: integer
 *               Categoria:
 *                 type: string
 *               Imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Producto actualizado
 */
router.put('/', upload.single('Imagen'), productController.actualizarProducto);

/**
 * @swagger
 * /api/productos/estado:
 *   put:
 *     summary: Cambiar estado de un producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdProducto:
 *                 type: integer
 *               NuevoEstado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estado cambiado
 */
router.put('/estado', productController.cambiarEstadoProducto);

/**
 * @swagger
 * /api/productos/buscar:
 *   get:
 *     summary: Buscar productos por nombre, marca o categoría
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: texto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultados de la búsqueda
 */
router.get('/buscar', productController.buscarProductos);

/**
 * @swagger
 * /api/productos/todos:
 *   get:
 *     summary: Listar productos activos o inactivos
 *     tags: [Productos]
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
router.get('/todos', productController.listarProductos);

// 🔹 Obtener imagen del producto
/**
 * @swagger
 * /api/productos/imagen/{id}:
 *   get:
 *     summary: Obtener imagen de un producto por su ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Imagen del producto en formato base64 o PNG
 *       404:
 *         description: Imagen no encontrada
 */
router.get('/imagen/:id', productController.obtenerImagenProducto);

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener detalles de un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Detalles del producto
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', productController.obtenerProductoPorId);


/**
 * @swagger
 * /api/productos/categoria:
 *   get:
 *     summary: Filtrar productos por categoría
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Productos filtrados por categoría
 */
router.get('/categoria', productController.filtrarPorCategoria);

module.exports = router;
