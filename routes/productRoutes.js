const express = require('express');
const router = express.Router();
const { sql, config } = require('../config/db');

// Obtener todos los productos
router.get('/productos', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query('SELECT * FROM Productos WHERE EstadoProducto = 1');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al obtener productos:', err);
    res.status(500).send('Error interno del servidor');
  }
});

// Obtener un producto por ID
router.get('/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('IdProducto', sql.Int, id)
      .query('SELECT * FROM Productos WHERE IdProducto = @IdProducto');
    if (result.recordset.length === 0) {
      return res.status(404).send('Producto no encontrado');
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('❌ Error al obtener producto:', err);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
