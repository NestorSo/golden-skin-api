document.addEventListener('DOMContentLoaded', () => {
  const userIconLink = document.getElementById('userIconLink');
  const userInfo = document.getElementById('userInfo');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (usuario) {
    userInfo.innerHTML = `<span>👤 Bienvenido, <strong>${usuario.nombre}</strong></span>`;
    userIconLink.setAttribute('title', 'Cerrar sesión');
    userIconLink.style.cursor = 'pointer';

    userIconLink.addEventListener('click', (e) => {
      e.preventDefault();
      mostrarAlertaConfirmación("¿Deseas cerrar sesión?", () => {
        localStorage.removeItem('usuario');
        localStorage.removeItem('carrito');
        mostrarAlerta("👋 Sesión cerrada.");
        setTimeout(() => {
          window.location.href = '/HTML/catalogo.html'; // Redirige luego
        }, 1000);
      });
    });
  } else {
    userInfo.innerHTML = `<span>🔒 No has iniciado sesión</span>`;
    userIconLink.setAttribute('href', '/HTML/login.html');
    userIconLink.setAttribute('title', 'Iniciar sesión');
  }
});
