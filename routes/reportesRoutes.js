const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportesController');

router.get('/ventas', controller.reporteVentas);
// Se pueden agregar más reportes según el módulo
router.get('/productos', controller.reporteProductos);
router.get('/compras', controller.reporteCompras);

module.exports = router;
