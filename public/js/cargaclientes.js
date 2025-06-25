

//carga cliente y rol 
document.addEventListener('DOMContentLoaded', () => {
  const userInfo = document.getElementById('userInfo');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (usuario) {
    userInfo.innerHTML = `<span>👤 Bienvenido, <strong>${usuario.Nombre}</strong></span>`;
  } else {
    userInfo.innerHTML = `<span>🔒 No has iniciado sesión</span>`;
  }
});


