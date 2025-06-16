const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Registro de usuarios
router.post('/register', userController.registerUser);

// Login de usuarios (cliente)
router.post('/login', userController.loginUser); // ✔️ SOLO esta ruta debe existir

module.exports = router;







// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// router.post('/register', userController.registerUser);
// router.post('/login', userController.loginUser);
// router.post('/login', async (req, res) => {
//   const { correo, contrasena } = req.body;

//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request()
//       .input('Correo', sql.VarChar, correo)
//       .input('Contrasena', sql.VarChar, contrasena)
//       .query(`
//         SELECT IdCliente, NombreCliente, Correo 
//         FROM Clientes 
//         WHERE Correo = @Correo AND Contrasena = @Contrasena
//       `);

//     if (result.recordset.length === 0) {
//       return res.status(401).json({ mensaje: 'Credenciales inválidas' });
//     }

//     const usuario = result.recordset[0];

//     res.status(200).json({
//       mensaje: 'Inicio de sesión exitoso',
//       usuario: {
//         id: usuario.IdCliente,
//         nombre: usuario.NombreCliente,
//         correo: usuario.Correo
//       }
//     });
//   } catch (err) {
//     console.error('Error en login:', err);
//     res.status(500).json({ mensaje: 'Error del servidor' });
//   }
// });

// module.exports = router;
