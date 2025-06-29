document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario) {
    alert('⚠️ Debes iniciar sesión primero');
    window.location.href = '../HTML/login.html';
    return;
  }

  const rol = usuario.NombreRol.toLowerCase();

  if (rol === 'vendedor') {
    ocultarMenus(['menu-productos', 'menu-compras', 'menu-marcas', 'menu-proveedores', 'menu-roles']);
  } else if (rol === 'bodeguero') {
    ocultarMenus(['menu-ventas', 'menu-compras', 'menu-usuarios', 'menu-marcas', 'menu-proveedores', 'menu-roles']);
  } else if (rol === 'cliente') {
    // Por seguridad, los clientes no deben entrar a homeAdmin
    alert('⛔ Acceso no permitido para clientes');
    window.location.href = '../HTML/home.html';
    return;
  }

  function ocultarMenus(ids) {
    ids.forEach(id => {
      const elemento = document.getElementById(id);
      if (elemento) elemento.style.display = 'none';
    });
  }
});
