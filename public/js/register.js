document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const direccion = document.getElementById('direccion').value;
  const telefono = document.getElementById('telefono').value;
  const correo = document.getElementById('correo').value;
  const contrasena = document.getElementById('contrasena').value;
  const messageBox = document.getElementById('register-message');

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        apellido,
        direccion,
        telefono,
        correo,
        contrasena
      })
    });

    const text = await res.text();

    if (res.status === 200) {
      messageBox.style.color = 'green';
      messageBox.textContent = '✅ Registro exitoso. Ya puedes iniciar sesión.';
    } else {
      messageBox.style.color = 'red';
      messageBox.textContent = text;
    }
  } catch (error) {
    console.error('❌ Error en el fetch:', error);
    messageBox.style.color = 'red';
    messageBox.textContent = '❌ Error de red o del servidor.';
  }
});
