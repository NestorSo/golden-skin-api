

// const express = require('express');
// const router = express.Router();
// const { sql, config } = require('../config/db');

// // ✅ Obtener todos los productos
// router.get('/todos', async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request().query(`
//       SELECT p.IdProducto, p.NombreProducto, p.Precio, p.Descripcion, p.Categoria, m.NombreMarca AS Marca
//       FROM Productos p
//       LEFT JOIN Marcas m ON p.IdMarca = m.IdMarca
//       WHERE p.EstadoProducto = 1
//     `);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('❌ Error al obtener productos:', err);
//     res.status(500).send('Error en el servidor');
//   }
// });

// // ✅ Obtener un producto por ID
// router.get('/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request()
//       .input('IdProducto', sql.Int, id)
//       .query(`
//         SELECT p.IdProducto, p.NombreProducto, p.Precio, p.Descripcion, p.Categoria, m.NombreMarca AS Marca
//         FROM Productos p
//         LEFT JOIN Marcas m ON p.IdMarca = m.IdMarca
//         WHERE p.IdProducto = @IdProducto
//       `);

//     if (result.recordset.length === 0) {
//       return res.status(404).send('Producto no encontrado');
//     }
//     res.json(result.recordset[0]);
//   } catch (err) {
//     console.error('❌ Error al obtener producto:', err);
//     res.status(500).send('Error interno del servidor');
//   }
// });

// // ✅ Obtener imagen en base64
// router.get('/imagen/:id', async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request()
//       .input('id', sql.Int, req.params.id)
//       .query('SELECT Imagen FROM Productos WHERE IdProducto = @id');

//     if (result.recordset.length === 0 || !result.recordset[0].Imagen) {
//       return res.status(404).send('Imagen no encontrada');
//     }

//     const buffer = result.recordset[0].Imagen;
//     const base64 = buffer.toString('base64');
//     res.send(`data:image/jpeg;base64,${base64}`);
//   } catch (err) {
//     console.error('❌ Error al obtener imagen:', err);
//     res.status(500).send('Error del servidor');
//   }
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { sql, config } = require('../config/db');

// // Imagen primero
// router.get('/imagen/:id', async (req, res) => {
//   const id = parseInt(req.params.id);
//   if (isNaN(id)) return res.status(400).send('ID inválido');

//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request()
//       .input('id', sql.Int, id)
//       .query('SELECT Imagen FROM Productos WHERE IdProducto = @id');

//     if (!result.recordset[0]?.Imagen) {
//       return res.status(404).send('Imagen no encontrada');
//     }

//     const buffer = result.recordset[0].Imagen;
//     const base64 = buffer.toString('base64');
//     res.send(`data:image/jpeg;base64,${base64}`);
//   } catch (err) {
//     console.error('❌ Error al obtener imagen:', err);
//     res.status(500).send('Error del servidor');
//   }
// });
// // Todos los productos
// router.get('/todos', async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request().query(`
//       SELECT p.IdProducto, p.NombreProducto, p.Precio, p.Descripcion, p.Categoria, m.NombreMarca AS Marca
//       FROM Productos p
//       LEFT JOIN Marcas m ON p.IdMarca = m.IdMarca
//       WHERE p.EstadoProducto = 1
//     `);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('❌ Error al obtener productos:', err);
//     res.status(500).send('Error en el servidor');
//   }
// });

// // Producto por ID
// router.get('/:id', async (req, res) => {
//   const id = parseInt(req.params.id);
//   if (isNaN(id)) return res.status(400).send('ID inválido');

//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request()
//       .input('IdProducto', sql.Int, id)
//       .query(`
//         SELECT p.IdProducto, p.NombreProducto, p.Precio, p.Descripcion, p.Categoria, m.NombreMarca AS Marca
//         FROM Productos p
//         LEFT JOIN Marcas m ON p.IdMarca = m.IdMarca
//         WHERE p.IdProducto = @IdProducto
//       `);

//     if (!result.recordset.length) return res.status(404).send('Producto no encontrado');
//     res.json(result.recordset[0]);
//   } catch (err) {
//     console.error('❌ Error al obtener producto:', err);
//     res.status(500).send('Error interno del servidor');
//   }
// });


// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const upload = multer(); // para imágenes

// const productController = require('../controllers/productController');

// // 🔸 POST /api/productos/insertar
// router.post('/insertar', upload.single('Imagen'), productController.insertarProducto);

// // 🔸 PUT /api/productos/inventario
// router.put('/inventario', productController.agregarInventarioProducto);


// // 🔸 PUT /api/productos/actualizar
// router.put('/actualizar', upload.single('Imagen'), productController.actualizarProducto);

// // 🔸 PUT /api/productos/estado
// router.put('/estado', productController.cambiarEstadoProducto);

// // 🔸 GET /api/productos/buscar?texto=serum
// router.get('/buscar', productController.buscarProductos);

// // 🔸 GET /api/productos/listar?estado=1
// router.get('/listar', productController.listarProductos);

// // 🔸 GET /api/productos/categoria?categoria=hidratantes
// router.get('/categoria', productController.filtrarPorCategoria);

// module.exports = router;


const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Endpoints para gestión de productos
 */

/**
 * @swagger
 * /api/productos/todos:
 *   get:
 *     summary: Obtener todos los productos activos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *       500:
 *         description: Error en el servidor
 */
router.get('/todos', productController.obtenerTodosLosProductos);

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del producto
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.get('/:id', productController.obtenerProductoPorId);

/**
 * @swagger
 * /api/productos/imagen/{id}:
 *   get:
 *     summary: Obtener imagen del producto en base64
 *     tags: [Productos]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del producto
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Imagen base64
 *       404:
 *         description: Imagen no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/imagen/:id', productController.obtenerImagenProducto);

module.exports = router;
