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

    const text = await res.text();

    if (res.status === 200) {
      window.location.href = '/home.html';
    } else {
      messageBox.textContent = text;
    }
  } catch (err) {
    messageBox.textContent = '❌ Error de red o servidor.';
  }
});
