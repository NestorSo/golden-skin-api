// routes/reportesRoutes.js
const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');

router.get('/ventas', reporteController.reporteVentas); // Ruta: /api/reportes/ventas

module.exports = router;
