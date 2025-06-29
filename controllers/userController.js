
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

//     const check = await pool.request()
//       .input('Correo', sql.VarChar, correo)
//       .query('SELECT * FROM Usuarios WHERE Email = @Correo');

//     if (check.recordset.length > 0) {
//       console.log('⚠️ El correo ya está registrado');
//       return res.status(409).send('El correo ya está registrado');
//     }

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

//     await pool.request()
//       .input('IdUsuario', sql.Int, idUsuario)
//       .input('Direccion', sql.VarChar, direccion)
//       .input('Telefono', sql.VarChar, telefono)
//       .query(`
//         INSERT INTO Clientes (IdUsuario, Direccion, Telefono)
//         VALUES (@IdUsuario, @Direccion, @Telefono)
//       `);

//     console.log(`✅ Cliente registrado correctamente: ${correo}`);
//     return res.status(200).send('✅ Registro exitoso. Ya puedes iniciar sesión.');
//   } catch (err) {
//     console.error('❌ Error en registro:', err);
//     return res.status(500).send('❌ Error en el servidor');
//   }
// };

// const MAX_ATTEMPTS = 3;
// const LOCK_TIME_MS = 1 * 60 * 1000; // 1 minuto


// exports.loginUser = async (req, res) => {
//   const { correo, contrasena } = req.body;

//   if (!correo || !contrasena) {
//     return res.status(400).json({ mensaje: 'Faltan campos' });
//   }

//   const userAttempt = loginAttempts[correo] || { count: 0, lockedUntil: null };

//   if (userAttempt.lockedUntil && Date.now() < userAttempt.lockedUntil) {
//     const remaining = Math.ceil((userAttempt.lockedUntil - Date.now()) / 1000);
//     return res.status(403).json({ mensaje: `⏳ Cuenta bloqueada. Intente en ${remaining} segundos.` });
//   }

//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request()
//       .input('Correo', sql.VarChar, correo)
//       .input('Pass', sql.VarChar, contrasena)
//       .query(`
//         SELECT u.IdUsuario, u.Nombre, u.Apellido, u.Email, r.NombreRol
//         FROM Usuarios u
//         JOIN Roles r ON u.IdRol = r.IdRol
//         WHERE u.Email = @Correo 
//         AND u.Pass = CONVERT(VARCHAR(32), HASHBYTES('MD5', @Pass), 2)
//       `);

//     if (result.recordset.length === 0) {
//       userAttempt.count += 1;
//       if (userAttempt.count >= MAX_ATTEMPTS) {
//         userAttempt.lockedUntil = Date.now() + LOCK_TIME_MS;
//         loginAttempts[correo] = userAttempt;
//         return res.status(403).json({ mensaje: '🔒 Demasiados intentos. Cuenta bloqueada por 1 minuto.' });
//       }

//       loginAttempts[correo] = userAttempt;
//       return res.status(401).json({ mensaje: `❌ Credenciales inválidas. Intento ${userAttempt.count} de ${MAX_ATTEMPTS}` });
//     }

//     loginAttempts[correo] = { count: 0, lockedUntil: null };

//     const usuario = result.recordset[0];

//     console.log(`✅ Login exitoso: ${usuario.Nombre} (${usuario.NombreRol})`);
//     return res.status(200).json({
//       mensaje: 'Inicio de sesión exitoso',
//       usuario: {
//         id: usuario.IdUsuario,
//         nombre: usuario.Nombre,
//         apellido: usuario.Apellido,
//         correo: usuario.Email,
//         rol: usuario.NombreRol
//       }
//     });
//   } catch (err) {
//     console.error('❌ Error en login:', err);
//     return res.status(500).json({ mensaje: '❌ Error en el servidor' });
//   }
// };


// ✅ userController.js
const { sql, config } = require('../config/db');

exports.registerCliente = async (req, res) => {
  const { nombre, apellido, correo, contrasena, direccion, telefono } = req.body;

  if (!nombre || !apellido || !correo || !contrasena || !direccion || !telefono) {
    return res.status(400).send('Todos los campos son requeridos');
  }

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('Nombre', sql.VarChar, nombre)
      .input('Apellido', sql.VarChar, apellido)
      .input('Email', sql.VarChar, correo)
      .input('Pass', sql.VarChar, contrasena)
      .input('Direccion', sql.VarChar, direccion)
      .input('Telefono', sql.VarChar, telefono)
      .execute('sp_RegistrarUsuarioCliente');

    res.status(200).send('✅ Registro exitoso');
  } catch (err) {
    console.error('❌ Error en registro cliente:', err);
    res.status(500).send(err.message);
  }
};

exports.registerDesdeAdmin = async (req, res) => {
  const { nombre, apellido, correo, contrasena, rol, direccion, telefono, cargo } = req.body;

  if (!nombre || !apellido || !correo || !contrasena || !rol) {
    return res.status(400).send('Campos obligatorios faltantes');
  }

  const usuarioLogin = `${nombre}_${apellido}`.replace(/\s/g, '');

  try {
    const pool = await sql.connect(config);

    // 1. Registrar usuario
    await pool.request()
      .input('Nombre', sql.VarChar, nombre)
      .input('Apellido', sql.VarChar, apellido)
      .input('Email', sql.VarChar, correo)
      .input('Pass', sql.VarChar, contrasena)
      .input('RolNombre', sql.VarChar, rol)
      .input('Direccion', sql.VarChar, direccion || '')
      .input('Telefono', sql.VarChar, telefono || '')
      .input('Cargo', sql.VarChar, cargo || '')
      .execute('sp_RegistrarUsuarioAdmin');

    // 2. Asignar rol a nivel de base de datos (FUERA de la transacción anterior)
    await pool.request()
      .input('UsuarioDB', sql.VarChar, usuarioLogin)
      .input('RolNombre', sql.VarChar, rol)
      .execute('sp_AsignarRolBaseDatos');

    res.status(201).send('✅ Usuario registrado por admin');
  } catch (err) {
    console.error('❌ Error en registro admin:', err);
    res.status(500).send(err.message);
  }
};


exports.loginUsuario = async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: '❌ Correo y contraseña son obligatorios' });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Email', sql.VarChar, correo)
      .input('Pass', sql.VarChar, contrasena)
      .execute('sp_LoginUsuario');

    const usuario = result.recordset[0];

    if (!usuario) {
      return res.status(401).json({ mensaje: '❌ Credenciales incorrectas' });
    }

    res.status(200).json({ mensaje: '✅ Login exitoso', usuario });
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ error: err.message });
  }
};

// Buscar usuario por nombre o apellido
exports.buscarPorNombre = async (req, res) => {
  const { nombre } = req.query;

  if (!nombre) {
    return res.status(400).json({ error: '⚠️ El parámetro "nombre" es obligatorio' });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Nombre', sql.NVarChar, nombre)
      .execute('sp_BuscarUsuarioPorNombre');

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al buscar usuario por nombre:', err);
    res.status(500).send(err.message);
  }
};

exports.buscarUsuarios = async (req, res) => {
  const { texto = '', estado = null } = req.query;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('TextoBusqueda', sql.VarChar, texto)
      .input('Estado', sql.Bit, estado === null ? null : Number(estado))
      .execute('sp_BuscarUsuarios');

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al buscar usuarios:', err);
    res.status(500).send(err.message);
  }
};

exports.listarUsuarios = async (req, res) => {
  const { estado = null } = req.query;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Estado', sql.Bit, estado === null ? null : Number(estado))
      .execute('sp_ListarUsuarios');

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al listar usuarios:', err);
    res.status(500).send(err.message);
  }
};
// Listar usuarios activos
exports.listarActivos = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('sp_ListarUsuariosActivos');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al listar usuarios activos:', err);
    res.status(500).json({ error: err.message });
  }
};

// Listar usuarios inactivos
exports.listarInactivos = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('sp_ListarUsuariosInactivos');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al listar usuarios inactivos:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const { nuevoEstado } = req.body;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('IdUsuario', sql.Int, id)
      .input('NuevoEstado', sql.Bit, nuevoEstado)
      .execute('sp_CambiarEstadoUsuario');

    res.status(200).send('✅ Estado actualizado');
  } catch (err) {
    console.error('❌ Error al cambiar estado:', err);
    res.status(500).send(err.message);
  }
};

exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, correo, direccion, telefono, cargo } = req.body;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('IdUsuario', sql.Int, id)
      .input('Nombre', sql.VarChar, nombre)
      .input('Apellido', sql.VarChar, apellido)
      .input('Email', sql.VarChar, correo)
      .input('Direccion', sql.VarChar, direccion || '')
      .input('Telefono', sql.VarChar, telefono || '')
      .input('Cargo', sql.VarChar, cargo || '')
      .execute('sp_ActualizarUsuario');

    res.status(200).send('✅ Usuario actualizado');
  } catch (err) {
    console.error('❌ Error al actualizar usuario:', err);
    res.status(500).send(err.message);
  }
};

// 🔹 Listar solo clientes (usuarios con rolId = 2)
exports.listarClientes = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('RolId', sql.Int, 2)
      .execute('sp_ListarUsuariosPorRol'); // ← Este SP debe existir

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al listar clientes:', err);
    res.status(500).json({ mensaje: '❌ Error al obtener clientes' });
  }
};


// ///sql

// const { asignarPermisosPorRol } = require('../utils/sqlRoleManager');

// exports.registerDesdeAdmin = async (req, res) => {
//   const { nombre, apellido, correo, contrasena, rol, direccion, telefono, cargo } = req.body;

//   if (!nombre || !apellido || !correo || !contrasena || !rol) {
//     return res.status(400).send('Campos obligatorios faltantes');
//   }

//   try {
//     const pool = await sql.connect(config);
//     await pool.request()
//       .input('Nombre', sql.VarChar, nombre)
//       .input('Apellido', sql.VarChar, apellido)
//       .input('Email', sql.VarChar, correo)
//       .input('Pass', sql.VarChar, contrasena)
//       .input('RolNombre', sql.VarChar, rol)
//       .input('Direccion', sql.VarChar, direccion || '')
//       .input('Telefono', sql.VarChar, telefono || '')
//       .input('Cargo', sql.VarChar, cargo || '')
//       .execute('sp_RegistrarUsuarioAdmin');

//     // 👇 Aquí se asigna el rol SQL automáticamente
//     await asignarPermisosPorRol(correo, rol.toLowerCase());

//     res.status(201).send('✅ Usuario registrado por admin y permisos asignados');
//   } catch (err) {
//     console.error('❌ Error en registro admin:', err);
//     res.status(500).send(err.message);
//   }
// };
