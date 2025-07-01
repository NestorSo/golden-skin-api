// routes/categoriaRoutes.js
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { config } = require('../config/db');

router.get('/activas', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('sp_ListarCategoriasActivas');
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener categorías activas:", err);
    res.status(500).json({ mensaje: "Error al obtener categorías activas" });
  }
});

module.exports = router;
