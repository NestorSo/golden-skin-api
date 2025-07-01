// routes/reportesRoutes.js
const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');


router.get('/ventas', reporteController.reporteVentas);
router.get('/compras', reporteController.reporteCompras);
router.get('/productos', reporteController.reporteProductos);
router.get('/usuarios', reporteController.reporteUsuarios);
router.get('/proveedores', reporteController.reporteProveedores);
router.get('/marcas', reporteController.reporteMarcas);


module.exports = router;
