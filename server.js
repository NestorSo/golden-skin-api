require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sql = require('mssql');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Archivos HTML, CSS, imágenes, etc.

// Configuración conexión
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, // <- Este debe ser NESTORLAPTOP
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Intentos fallidos por correo
let loginAttempts = {};

// Ruta raíz: redirigir a login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Registro de usuario con rol cliente (ID 2)
app.post('/register', async (req, res) => {
  const { nombre, apellido, correo, contrasena } = req.body;
  if (!nombre || !apellido || !correo || !contrasena) {
    return res.status(400).send('Todos los campos son requeridos');
  }

  try {
    await sql.connect(config);
    const check = await sql.query`SELECT * FROM usuarios WHERE correo = ${correo}`;
    if (check.recordset.length > 0) {
      return res.status(409).send('El correo ya está registrado');
    }

    await sql.query`
      INSERT INTO usuarios (nombre, apellido, correo, contrasena, id_rol)
      VALUES (${nombre}, ${apellido}, ${correo}, 
      CONVERT(VARCHAR(32), HASHBYTES('MD5', ${contrasena}), 2), 2)`;

    res.redirect('/login.html');
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).send('Error en el servidor');
  }
});

// Login
app.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena) {
    return res.status(400).send('Faltan campos');
  }

  loginAttempts[correo] = loginAttempts[correo] || 0;

  if (loginAttempts[correo] >= 3) {
    return res.status(403).send('Demasiados intentos fallidos');
  }

  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT u.*, r.nombre_rol FROM usuarios u
      JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.correo = ${correo}
      AND u.contrasena = CONVERT(VARCHAR(32), HASHBYTES('MD5', ${contrasena}), 2)`;

    if (result.recordset.length === 0) {
      loginAttempts[correo]++;
      return res.status(401).send('Correo o contraseña inválidos');
    }

    loginAttempts[correo] = 0;
    res.redirect('/home.html');
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).send('Error en el servidor');
  }
});

// Cerrar servidor al salir
process.on('SIGINT', () => {
  console.log('Cerrando servidor...');
  process.exit();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
