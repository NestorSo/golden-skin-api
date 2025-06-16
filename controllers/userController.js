
// const { sql, config } = require('../config/db');


// const loginAttempts = {};
// exports.registerUser = async (req, res) => {
//   const { nombre, apellido, correo, contrasena, direccion, telefono } = req.body;

//   if (!nombre || !apellido || !correo || !contrasena || !direccion || !telefono) {
//     console.log('⚠️ Registro fallido: campos vacíos');
//     return res.status(400).send('Todos los campos son requeridos');
//   }

//   try {
//     const pool = await sql.connect(config);

//     // Verificar si el correo ya existe
//     const check = await pool.request()
//       .input('Correo', sql.VarChar, correo)
//       .query('SELECT * FROM Usuarios WHERE Email = @Correo');

//     if (check.recordset.length > 0) {
//       console.log('⚠️ El correo ya está registrado');
//       return res.status(409).send('El correo ya está registrado');
//     }

//     // Insertar en Usuarios
//     const insertUser = await pool.request()
//       .input('Nombre', sql.VarChar, nombre)
//       .input('Apellido', sql.VarChar, apellido)
//       .input('Email', sql.VarChar, correo)
//       .input('Pass', sql.VarChar, contrasena)
//       .input('IdRol', sql.Int, 2) // Rol Cliente
//       .query(`
//         INSERT INTO Usuarios (Nombre, Apellido, Email, Pass, IdRol)
//         OUTPUT INSERTED.IdUsuario
//         VALUES (
//           @Nombre,
//           @Apellido,
//           @Email,
//           CONVERT(VARCHAR(32), HASHBYTES('MD5', @Pass), 2),
//           @IdRol
//         )
//       `);

//     const idUsuario = insertUser.recordset[0].IdUsuario;

//     // Insertar en Clientes
//     await pool.request()
//       .input('IdUsuario', sql.Int, idUsuario)
//       .input('Direccion', sql.VarChar, direccion)
//       .input('Telefono', sql.VarChar, telefono)
//       .query(`
//         INSERT INTO Clientes (IdUsuario, Direccion, Telefono)
//         VALUES (@IdUsuario, @Direccion, @Telefono)
//       `);

//     console.log(`✅ Cliente registrado correctamente: ${correo}`);
//     res.redirect('/success');
//   } catch (err) {
//     console.error('❌ Error en registro:', err);
//     res.redirect('/error');
//   }
// };


// const MAX_ATTEMPTS = 3;
// const LOCK_TIME_MS = 1 * 60 * 1000; // 1 minuto de espera

// exports.loginUser = async (req, res) => {
//   const { correo, contrasena } = req.body;

//   if (!correo || !contrasena) {
//     return res.status(400).send('Faltan campos');
//   }

//   const userAttempt = loginAttempts[correo] || { count: 0, lockedUntil: null };

//   // Bloqueo activo
//   if (userAttempt.lockedUntil && Date.now() < userAttempt.lockedUntil) {
//     const remaining = Math.ceil((userAttempt.lockedUntil - Date.now()) / 1000);
//     return res.status(403).send(`Cuenta bloqueada. Intente de nuevo en ${remaining} segundos.`);
//   }

//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request()
//       .input('Correo', sql.VarChar, correo)
//       .input('Pass', sql.VarChar, contrasena)
//       .query(`
//         SELECT u.*, r.NombreRol 
//         FROM Usuarios u
//         JOIN Roles r ON u.IdRol = r.IdRol
//         WHERE u.Email = @Correo 
//         AND u.Pass = CONVERT(VARCHAR(32), HASHBYTES('MD5', @Pass), 2)
//       `);

//     // ❌ Login incorrecto
//     if (result.recordset.length === 0) {
//       userAttempt.count += 1;

//       if (userAttempt.count >= MAX_ATTEMPTS) {
//         userAttempt.lockedUntil = Date.now() + LOCK_TIME_MS;
//         loginAttempts[correo] = userAttempt;
//         return res.status(403).send('Demasiados intentos. Tu cuenta está bloqueada por 1 minuto.');
//       }

//       loginAttempts[correo] = userAttempt;
//       return res.status(401).send(`Correo o contraseña inválidos. Intento ${userAttempt.count} de ${MAX_ATTEMPTS}`);
//     }

//     // ✅ Login correcto
//     console.log(`✅ Login exitoso: ${result.recordset[0].Nombre} (${result.recordset[0].NombreRol})`);

//     loginAttempts[correo] = { count: 0, lockedUntil: null }; // Reinicia intentos

//     res.redirect('/home.html');
//   } catch (err) {
//     console.error('❌ Error en login:', err);
//     res.status(500).send('Error en el servidor');
//   }
// };



const { sql, config } = require('../config/db');

const loginAttempts = {};

exports.registerUser = async (req, res) => {
  const { nombre, apellido, correo, contrasena, direccion, telefono } = req.body;

  if (!nombre || !apellido || !correo || !contrasena || !direccion || !telefono) {
    console.log('⚠️ Registro fallido: campos vacíos');
    return res.status(400).send('Todos los campos son requeridos');
  }

  try {
    const pool = await sql.connect(config);

    const check = await pool.request()
      .input('Correo', sql.VarChar, correo)
      .query('SELECT * FROM Usuarios WHERE Email = @Correo');

    if (check.recordset.length > 0) {
      console.log('⚠️ El correo ya está registrado');
      return res.status(409).send('El correo ya está registrado');
    }

    const insertUser = await pool.request()
      .input('Nombre', sql.VarChar, nombre)
      .input('Apellido', sql.VarChar, apellido)
      .input('Email', sql.VarChar, correo)
      .input('Pass', sql.VarChar, contrasena)
      .input('IdRol', sql.Int, 2) // Rol Cliente
      .query(`
        INSERT INTO Usuarios (Nombre, Apellido, Email, Pass, IdRol)
        OUTPUT INSERTED.IdUsuario
        VALUES (
          @Nombre,
          @Apellido,
          @Email,
          CONVERT(VARCHAR(32), HASHBYTES('MD5', @Pass), 2),
          @IdRol
        )
      `);

    const idUsuario = insertUser.recordset[0].IdUsuario;

    await pool.request()
      .input('IdUsuario', sql.Int, idUsuario)
      .input('Direccion', sql.VarChar, direccion)
      .input('Telefono', sql.VarChar, telefono)
      .query(`
        INSERT INTO Clientes (IdUsuario, Direccion, Telefono)
        VALUES (@IdUsuario, @Direccion, @Telefono)
      `);

    console.log(`✅ Cliente registrado correctamente: ${correo}`);
    return res.status(200).send('✅ Registro exitoso. Ya puedes iniciar sesión.');
  } catch (err) {
    console.error('❌ Error en registro:', err);
    return res.status(500).send('❌ Error en el servidor');
  }
};

const MAX_ATTEMPTS = 3;
const LOCK_TIME_MS = 1 * 60 * 1000; // 1 minuto


exports.loginUser = async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Faltan campos' });
  }

  const userAttempt = loginAttempts[correo] || { count: 0, lockedUntil: null };

  if (userAttempt.lockedUntil && Date.now() < userAttempt.lockedUntil) {
    const remaining = Math.ceil((userAttempt.lockedUntil - Date.now()) / 1000);
    return res.status(403).json({ mensaje: `⏳ Cuenta bloqueada. Intente en ${remaining} segundos.` });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Correo', sql.VarChar, correo)
      .input('Pass', sql.VarChar, contrasena)
      .query(`
        SELECT u.IdUsuario, u.Nombre, u.Apellido, u.Email, r.NombreRol
        FROM Usuarios u
        JOIN Roles r ON u.IdRol = r.IdRol
        WHERE u.Email = @Correo 
        AND u.Pass = CONVERT(VARCHAR(32), HASHBYTES('MD5', @Pass), 2)
      `);

    if (result.recordset.length === 0) {
      userAttempt.count += 1;
      if (userAttempt.count >= MAX_ATTEMPTS) {
        userAttempt.lockedUntil = Date.now() + LOCK_TIME_MS;
        loginAttempts[correo] = userAttempt;
        return res.status(403).json({ mensaje: '🔒 Demasiados intentos. Cuenta bloqueada por 1 minuto.' });
      }

      loginAttempts[correo] = userAttempt;
      return res.status(401).json({ mensaje: `❌ Credenciales inválidas. Intento ${userAttempt.count} de ${MAX_ATTEMPTS}` });
    }

    loginAttempts[correo] = { count: 0, lockedUntil: null };

    const usuario = result.recordset[0];

    console.log(`✅ Login exitoso: ${usuario.Nombre} (${usuario.NombreRol})`);
    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario.IdUsuario,
        nombre: usuario.Nombre,
        apellido: usuario.Apellido,
        correo: usuario.Email,
        rol: usuario.NombreRol
      }
    });
  } catch (err) {
    console.error('❌ Error en login:', err);
    return res.status(500).json({ mensaje: '❌ Error en el servidor' });
  }
};


