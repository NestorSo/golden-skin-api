document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const correo = document.getElementById('correo').value;
  const contrasena = document.getElementById('contrasena').value;
  const messageBox = document.getElementById('login-message');

  try {
    const res = await fetch('/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena })
    });

    const data = await res.json();

    if (res.status === 200) {
      // Guardar el usuario en localStorage
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      const rol = data.usuario.NombreRol?.toLowerCase();
      console.log('📦 Datos recibidos del backend:', data.usuario);

      if (rol === 'cliente') {
        window.location.href = '../HTML/home.html';
      } else {
        window.location.href = '../HTML/homeGestion.html';
      }
    } else {
      messageBox.textContent = data.mensaje || '❌ Credenciales incorrectas';
    }

  } catch (err) {
    console.error('Catch block error:', err);
    messageBox.textContent = '❌ Error de red o servidor.';
  }

  
});


// document.getElementById('loginForm').addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const correo = document.getElementById('correo').value;
//   const contrasena = document.getElementById('contrasena').value;
//   const messageBox = document.getElementById('login-message');

//   try {
//     const res = await fetch('/api/usuarios/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ correo, contrasena })
//     });

//     const data = await res.json();

//     if (res.status === 200) {
//       localStorage.setItem('usuario', JSON.stringify(data.usuario));

//       const rol = data.usuario.NombreRol?.toLowerCase();
//       console.log('📦 Datos recibidos del backend:', data.usuario);

//       if (rol === 'cliente') {
//         window.location.href = '../HTML/home.html';
//       } else if (['Administrador', 'Vendedor', 'Bodeguero'].includes(rol)) {
//         window.location.href = '../HTML/homeAdmin.html';
//       } else {
//         messageBox.textContent = '❌ Rol no autorizado.';
//       }
//     } else {
//       messageBox.textContent = data.mensaje || '❌ Credenciales incorrectas';
//     }

//   } catch (err) {
//     console.error('Catch block error:', err);
//     messageBox.textContent = '❌ Error de red o servidor.';
//   }
// });
