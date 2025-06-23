document.addEventListener('DOMContentLoaded', () => {
  const userIcon = document.getElementById('userIconLink');
  const userInfo = document.getElementById('userInfo');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!userIcon) return;

  // Si el usuario ha iniciado sesión
  if (usuario) {
    userIcon.title = 'Cerrar sesión';
    userIcon.href = '#'; // Bloqueamos el link por defecto

    if (userInfo) {
      userInfo.innerHTML = `<span style="color:white">👤 ${usuario.nombre || usuario.correo}</span>`;
    }

    userIcon.addEventListener('click', e => {
      e.preventDefault();
      
      if (typeof mostrarAlertaConfirmación === 'function') {
        mostrarAlertaConfirmación('¿Deseas cerrar sesión?', () => {
          localStorage.removeItem('usuario');
          localStorage.removeItem('carrito');
          mostrarAlerta('👋 Sesión cerrada');
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        });
      } else {
        // Backup si alertas.js no se cargó
        const confirmar = confirm('¿Deseas cerrar sesión?');
        if (confirmar) {
          localStorage.removeItem('usuario');
          localStorage.removeItem('carrito');
          window.location.href = '/';
        }
      }
    });

  } else {
    // Si no ha iniciado sesión
    userIcon.title = 'Iniciar sesión';
    userIcon.href = '/HTML/login.html';
  }
});
