// const { sql, config } = require('../config/db');

// // Esta función otorga permisos por rol
// async function asignarPermisosPorRol(correo, rolNombre) {
//   const usuarioSQL = correo.replace(/[^a-zA-Z0-9]/g, '_'); // Limpia @ y .

//   const pool = await sql.connect(config);

//   // 1. Crear login y user si no existen
//   await pool.request().batch(`
//     IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = '${usuarioSQL}')
//       CREATE LOGIN [${usuarioSQL}] WITH PASSWORD = 'Golden123!';

//     USE ${config.database};

//     IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = '${usuarioSQL}')
//       CREATE USER [${usuarioSQL}] FOR LOGIN [${usuarioSQL}];
//   `);

//   // 2. Otorgar roles según el tipo
//   if (rolNombre === 'admin') {
//     await pool.request().query(`EXEC sp_addrolemember 'db_owner', '${usuarioSQL}'`);
//   }

//   else if (rolNombre === 'vendedor') {
//     await pool.request().batch(`
//       EXEC sp_addrolemember 'db_datareader', '${usuarioSQL}';
//       EXEC sp_addrolemember 'db_datawriter', '${usuarioSQL}';
//     `);
//   }

//   else if (rolNombre === 'bodeguero') {
//     await pool.request().batch(`
//       GRANT SELECT, INSERT, UPDATE ON Productos TO [${usuarioSQL}];
//     `);
//   }

//   else if (rolNombre === 'cliente') {
//     await pool.request().batch(`
//       GRANT SELECT ON Productos TO [${usuarioSQL}];
//     `);
//   }
// }

// module.exports = { asignarPermisosPorRol };
