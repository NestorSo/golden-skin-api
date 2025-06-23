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

app.use('/api/productos', productRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api', userRoutes);
console.log('🔗 Rutas cargadas correctamente.');

// 🔹 Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'HTML', 'home.html'));
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
