const express = require('express');
const router = express.Router();
const { sql, config } = require('../config/db');

// ✅ Obtener todos los productos
router.get('/todos', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT p.IdProducto, p.NombreProducto, p.Precio, p.Descripcion, p.Categoria, m.NombreMarca AS Marca
      FROM Productos p
      LEFT JOIN Marcas m ON p.IdMarca = m.IdMarca
      WHERE p.EstadoProducto = 1
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al obtener productos:', err);
    res.status(500).send('Error en el servidor');
  }
});

// ✅ Obtener un producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('IdProducto', sql.Int, id)
      .query(`
        SELECT p.IdProducto, p.NombreProducto, p.Precio, p.Descripcion, p.Categoria, m.NombreMarca AS Marca
        FROM Productos p
        LEFT JOIN Marcas m ON p.IdMarca = m.IdMarca
        WHERE p.IdProducto = @IdProducto
      `);

    if (result.recordset.length === 0) {
      return res.status(404).send('Producto no encontrado');
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('❌ Error al obtener producto:', err);
    res.status(500).send('Error interno del servidor');
  }
});

// ✅ Obtener imagen en base64
router.get('/imagen/:id', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT Imagen FROM Productos WHERE IdProducto = @id');

    if (result.recordset.length === 0 || !result.recordset[0].Imagen) {
      return res.status(404).send('Imagen no encontrada');
    }

    const buffer = result.recordset[0].Imagen;
    const base64 = buffer.toString('base64');
    res.send(`data:image/jpeg;base64,${base64}`);
  } catch (err) {
    console.error('❌ Error al obtener imagen:', err);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
