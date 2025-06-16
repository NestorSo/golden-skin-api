document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const correo = document.getElementById('correo').value;
  const contrasena = document.getElementById('contrasena').value;
  const messageBox = document.getElementById('login-message');

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena })
    });

    const data = await res.json();

    if (res.status === 200) {
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      window.location.href = '../HTML/home.html';
    } else {
      messageBox.textContent = data.mensaje;
    }
  } catch (err) {
    console.error('Catch block error:', err);
    messageBox.textContent = '❌ Error de red o servidor.';
  }
});




  // try {
  //   const res = await fetch('/api/login', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ correo, contrasena })
  //   });

  //   const text = await res.text();

  //   if (res.status === 200) {
  //     // Guarda sesión localmente (puedes guardar ID, nombre, correo, etc.)
  //     const user = JSON.parse(text);
  //     localStorage.setItem('usuario', JSON.stringify(user));

  //     // Redirigir al home del cliente
  //     window.location.href = '../HTML/home.html';
  //   } else {
  //     messageBox.textContent = text;
  //   }
  // } catch (err) {
  //   messageBox.textContent = '❌ Error de red o servidor.';
  // }
//});
