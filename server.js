require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to DB:', err);
    return;
  }
  console.log('Connected to MySQL');
});

let loginAttempts = {};

// Login
app.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Campos requeridos' });
  }

  loginAttempts[correo] = loginAttempts[correo] || 0;

  if (loginAttempts[correo] >= 3) {
    return res.status(403).json({ error: 'Máximo de intentos alcanzado' });
  }

  const query = `SELECT u.*, r.nombre_rol FROM usuarios u
                 JOIN roles r ON u.id_rol = r.id_rol
                 WHERE u.correo = ? AND u.contrasena = MD5(?)`;

  connection.query(query, [correo, contrasena], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });

    if (results.length === 0) {
      loginAttempts[correo]++;
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    loginAttempts[correo] = 0;
    const user = results[0];
    res.json({ mensaje: 'Inicio de sesión exitoso', rol: user.nombre_rol });
  });
});

// Registro
app.post('/register', (req, res) => {
  const { nombre, apellido, correo, contrasena, id_rol } = req.body;

  if (!nombre || !apellido || !correo || !contrasena || !id_rol) {
    return res.status(400).json({ error: 'Campos requeridos' });
  }

  connection.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error verificando el correo' });
    if (results.length > 0) return res.status(409).json({ error: 'Correo ya registrado' });

    const insert = 'INSERT INTO usuarios (nombre, apellido, correo, contrasena, id_rol) VALUES (?, ?, ?, MD5(?), ?)';
    connection.query(insert, [nombre, apellido, correo, contrasena, id_rol], err => {
      if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
      res.json({ mensaje: 'Usuario registrado con éxito' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});