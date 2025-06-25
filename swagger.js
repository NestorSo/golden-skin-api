// // swagger.js
// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Golden Skin API',
//       version: '1.0.0',
//       description: 'API para la gestión de usuarios, productos, pedidos, compras, ventas, marcas, proveedores y roles.',
//     },
//     servers: [
//       {
//         url: 'http://localhost:3000',
//         description: 'Servidor local',
//       },
//     ],
//   },
//   apis: ['./routes/*.js'], // Documentación extraída desde los comentarios en los routers
// };

// const specs = swaggerJsdoc(options);

// module.exports = {
//   swaggerUi,
//   specs,
// };
// swagger.js



const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Golden Skin API',
      version: '1.0.0',
      description: 'API para la gestión de usuarios, productos, pedidos, compras, ventas, marcas, proveedores y roles.',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Asegúrate de que esta URL base coincida con la que usas en tus rutas (ej. app.use('/api', userRoutes))
        description: 'Servidor local de la API',
      },
    ],
  },
  // Aquí le indicamos a swagger-jsdoc dónde encontrar tus anotaciones de Swagger
  // ¡Hemos hecho la lista de archivos explícita para evitar problemas!
  apis: [
    './routes/userRoutes.js',
    './routes/productRoutes.js',
    './routes/pedidoRoutes.js',
    './routes/compraRoutes.js',
    './routes/ventaRoutes.js',
    './routes/rolRoutes.js',
    './routes/marcaRoutes.js',
    './routes/proveedorRoutes.js',
    // Asegúrate de que TODAS tus rutas .js estén listadas aquí.
    // Si tienes rutas en subcarpetas (ej. routes/admin/authRoutes.js),
    // deberás agregarlas aquí también (ej. './routes/admin/authRoutes.js').
  ],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};