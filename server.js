const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log('✅ Iniciando servidor Golden Skin...');

// 🔹 Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
console.log('📦 Middleware y archivos estáticos configurados.');


// 🔹 Rutas
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const compraRoutes = require('./routes/compraRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const rolRoutes = require('./routes/rolRoutes');
const marcaRoutes = require('./routes/marcaRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');


app.use('/api/productos', productRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/compras', compraRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/proveedores', proveedorRoutes);


console.log('🔗 Rutas cargadas correctamente.');

// Swagger setup
const { swaggerUi, specs } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
console.log('📖 Swagger UI configurado en /api-docs');


// 🔹 Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'HTML', 'homeAdmin.html'));
});

// 🔹 Página de éxito
app.get('/success', (req, res) => {
  res.send(`
    <div style="text-align:center; margin-top:100px; font-family:sans-serif;">
      <h2>✅ Operación exitosa</h2>
      <p>Tu acción fue procesada correctamente.</p>
      <a href="/" style="color:#c57a88; font-weight:bold;">Volver al inicio</a>
    </div>
  `);
});

// 🔹 Página de error
app.get('/error', (req, res) => {
  res.send(`
    <div style="text-align:center; margin-top:100px; font-family:sans-serif;">
      <h2>❌ Algo salió mal</h2>
      <p>No se pudo completar la operación.</p>
      <a href="/" style="color:#c57a88; font-weight:bold;">Volver al inicio</a>
    </div>
  `);
});



// 🔹 Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log('🌐 Accede a la documentación de la API en http://localhost:3000/api-docs');
});

// 🔹 Cierre limpio
const closeServer = () => {
  console.log('\n🛑 Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente.');
    process.exit(0);
  });
};

process.on('SIGINT', closeServer);
process.on('SIGTERM', closeServer);

// 🔹 Manejo de errores globales
process.on('uncaughtException', err => {
  console.error('❌ Excepción no capturada:', err);
});

process.on('unhandledRejection', reason => {
  console.error('❌ Rechazo de promesa no manejado:', reason);
});
