    document.addEventListener('DOMContentLoaded', () => {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const welcomeText = document.getElementById('welcomeText');
      if (usuario && usuario.Nombre) {
welcomeText.textContent = `👋 Bienvenido, ${usuario.Nombre} (${usuario.NombreRol})`;
      }

      // Reloj en tiempo real
      const clock = document.getElementById('clock');
      setInterval(() => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        clock.textContent = `🕒 ${timeStr}`;
      }, 1000);
    });