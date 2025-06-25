// document.addEventListener('DOMContentLoaded', () => {
//   const API_URL = '/api/usuarios';
//   const SELECT_ROLES = '/api/roles/listar/1';

//   const form = document.getElementById('formUsuario');
//   const tablaBody = document.getElementById('tablaUsuariosBody');
//   const inputBuscar = document.querySelector('.search-input');
//   const btnInsertar = document.getElementById('insertarUsuario');
//   const btnActualizar = document.getElementById('actualizarUsuario');
//   const btnEliminar = document.getElementById('eliminarUsuario');
//   const btnLimpiar = document.getElementById('limpiarUsuario');
//   const selectRol = document.getElementById('RolId');
//   const checkInactivos = document.getElementById('verInactivos');

//   let usuarios = [], usuarioSeleccionado = null, roles = [];

//   btnInsertar.onclick = crearUsuario;
//   btnActualizar.onclick = actualizarUsuario;
//   btnEliminar.onclick = eliminarUsuario;
//   btnLimpiar.onclick = limpiarFormulario;
//   inputBuscar.oninput = filtrarUsuarios;
//   checkInactivos.onchange = cargarUsuarios;

//   cargarRoles();
//   cargarUsuarios();

//   async function cargarRoles() {
//     try {
//       const res = await fetch(SELECT_ROLES);
//       roles = await res.json();
//       selectRol.innerHTML = '<option value="">Seleccione un rol</option>';
//       roles.forEach(r => {
//         selectRol.innerHTML += `<option value="${r.IdRol}">${r.NombreRol}</option>`;
//       });
//     } catch (e) {
//       console.error('❌ Error al cargar roles:', e);
//       selectRol.innerHTML = '<option value="">Error al cargar</option>';
//     }
//   }

// async function cargarUsuarios() {
//   const url = checkInactivos?.checked
//     ? `${API_URL}/listar/inactivos`
//     : `${API_URL}/listar/activos`;

//   try {
//     const res = await fetch(url);
//     usuarios = await res.json();
//     renderTabla(usuarios);
//   } catch (e) {
//     console.error('❌ Error al cargar usuarios:', e);
//     tablaBody.innerHTML = '<tr><td colspan="5">❌ No se pudieron cargar usuarios</td></tr>';
//   }
// }


//   function renderTabla(lista) {
//     tablaBody.innerHTML = '';
//     lista.forEach(u => {
//       const rol = roles.find(r => r.IdRol === u.RolId);
//       const fila = document.createElement('tr');
//       fila.innerHTML = `
//         <td>${u.UsuarioId ?? 'N/D'}</td>
//         <td>${u.Nombre}</td>
//         <td>${u.Email}</td>
//         <td>${rol ? rol.NombreRol : 'Sin rol'}</td>
//         <td>${u.Estado ? 'Activo' : 'Inactivo'}</td>
//       `;
//       fila.addEventListener('click', () => {
//         usuarioSeleccionado = u;
//         form.Nombre.value = u.Nombre;
//         form.Email.value = u.Email;
//         form.RolId.value = u.RolId;
//         form.UsuarioId.value = u.UsuarioId;
//       });
//       tablaBody.appendChild(fila);
//     });
//   }

//   function filtrarUsuarios() {
//     const texto = inputBuscar.value.toLowerCase();
//     const filtrados = usuarios.filter(u => {
//       const rolNombre = (roles.find(r => r.IdRol === u.RolId)?.NombreRol || '').toLowerCase();
//       return (
//         u.Nombre.toLowerCase().includes(texto) ||
//         u.Email.toLowerCase().includes(texto) ||
//         String(u.UsuarioId).includes(texto) ||
//         rolNombre.includes(texto)
//       );
//     });
//     renderTabla(filtrados);
//   }

//   async function crearUsuario() {
//     const data = {
//       nombre: form.Nombre.value,
//       apellido: 'Desconocido',
//       correo: form.Email.value,
//       contrasena: 'Temporal123',
//       rolNombre: roles.find(r => r.IdRol === parseInt(form.RolId.value))?.NombreRol,
//       direccion: '',
//       telefono: '',
//       cargo: ''
//     };

//     try {
//       const res = await fetch(`${API_URL}/admin/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//       });
//       if (!res.ok) throw new Error(await res.text());
//       alert('✅ Usuario registrado');
//       limpiarFormulario();
//       cargarUsuarios();
//     } catch (e) {
//       console.error('❌ Error al registrar:', e);
//       alert('❌ ' + e.message);
//     }
//   }

//   async function actualizarUsuario() {
//     if (!usuarioSeleccionado) return alert('⚠️ Selecciona un usuario');

//     const data = {
//       nombre: form.Nombre.value,
//       apellido: 'Actualizado',
//       email: form.Email.value,
//       direccion: '',
//       telefono: '',
//       cargo: ''
//     };

//     try {
//       const res = await fetch(`${API_URL}/actualizar/${usuarioSeleccionado.UsuarioId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//       });
//       if (!res.ok) throw new Error(await res.text());
//       alert('✅ Usuario actualizado');
//       limpiarFormulario();
//       cargarUsuarios();
//     } catch (e) {
//       console.error('❌ Error al actualizar:', e);
//       alert('❌ ' + e.message);
//     }
//   }

//   async function eliminarUsuario() {
//     if (!usuarioSeleccionado) return alert('⚠️ Selecciona un usuario');
//     if (!confirm('¿Deseas desactivar este usuario?')) return;

//     try {
//       const res = await fetch(`${API_URL}/estado/${usuarioSeleccionado.UsuarioId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ estado: false })
//       });
//       if (!res.ok) throw new Error(await res.text());
//       alert('✅ Usuario desactivado');
//       limpiarFormulario();
//       cargarUsuarios();
//     } catch (e) {
//       console.error('❌ Error al desactivar usuario:', e);
//       alert('❌ ' + e.message);
//     }
//   }

//   function limpiarFormulario() {
//     form.reset();
//     usuarioSeleccionado = null;
//   }
// });


// gestionarUsuario.js

document.addEventListener('DOMContentLoaded', () => {
  const API_URL = '/api/usuarios';
  const SELECT_ROLES = '/api/roles/listar/1';

  const form = document.getElementById('formUsuario');
  const tablaBody = document.getElementById('tablaUsuariosBody');
  const inputBuscar = document.querySelector('.search-input');
  const btnInsertar = document.getElementById('insertarUsuario');
  const btnActualizar = document.getElementById('actualizarUsuario');
  const btnEliminar = document.getElementById('eliminarUsuario');
  const btnLimpiar = document.getElementById('limpiarUsuario');
  const selectRol = document.getElementById('RolId');
  const checkInactivos = document.getElementById('verInactivos');

  let usuarios = [], usuarioSeleccionado = null, roles = [];

  btnInsertar.onclick = crearUsuario;
  btnActualizar.onclick = actualizarUsuario;
  btnEliminar.onclick = eliminarUsuario;
  btnLimpiar.onclick = limpiarFormulario;
  inputBuscar.oninput = filtrarUsuarios;
  checkInactivos.onchange = cargarUsuarios;

  cargarRoles();
  cargarUsuarios();

  async function cargarRoles() {
    try {
      const res = await fetch(SELECT_ROLES);
      roles = await res.json();
      selectRol.innerHTML = '<option value="">Seleccione un rol</option>';
      roles.forEach(r => {
        selectRol.innerHTML += `<option value="${r.IdRol}">${r.NombreRol}</option>`;
      });
    } catch (e) {
      console.error('❌ Error al cargar roles:', e);
      selectRol.innerHTML = '<option value="">Error al cargar</option>';
    }
  }

  async function cargarUsuarios() {
    const url = checkInactivos?.checked
      ? `${API_URL}/listar/inactivos`
      : `${API_URL}/listar/activos`;

    try {
      const res = await fetch(url);
      usuarios = await res.json();
      renderTabla(usuarios);
    } catch (e) {
      console.error('❌ Error al cargar usuarios:', e);
      tablaBody.innerHTML = '<tr><td colspan="5">❌ No se pudieron cargar usuarios</td></tr>';
    }
  }

  function renderTabla(lista) {
    tablaBody.innerHTML = '';
    lista.forEach(u => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${u.IdUsuario}</td>
        <td>${u.Nombre}</td>
        <td>${u.Email}</td>
        <td>${u.NombreRol || 'Sin rol'}</td>
        <td>${u.EstadoUsuario ? 'Activo' : 'Inactivo'}</td>
      `;
      fila.addEventListener('click', () => {
        usuarioSeleccionado = u;
        document.getElementById('Nombre').value = u.Nombre;
        document.getElementById('Email').value = u.Email;
        document.getElementById('RolId').value = roles.find(r => r.NombreRol === u.NombreRol)?.IdRol || '';
        document.getElementById('UsuarioId').value = u.IdUsuario;
      });
      tablaBody.appendChild(fila);
    });
  }

  function filtrarUsuarios() {
    const texto = inputBuscar.value.toLowerCase();
    const filtrados = usuarios.filter(u => {
      return (
        u.Nombre.toLowerCase().includes(texto) ||
        u.Email.toLowerCase().includes(texto) ||
        String(u.IdUsuario).includes(texto) ||
        (u.NombreRol || '').toLowerCase().includes(texto)
      );
    });
    renderTabla(filtrados);
  }

  async function crearUsuario() {
    const nombre = document.getElementById('Nombre').value.trim();
    const email = document.getElementById('Email').value.trim();
    const rolId = parseInt(document.getElementById('RolId').value);
    const rolNombre = roles.find(r => r.IdRol === rolId)?.NombreRol;

    if (!nombre || !email || !rolNombre) {
      alert('⚠️ Todos los campos son obligatorios');
      return;
    }

    const data = {
      nombre,
      apellido: 'Desconocido',
      correo: email,
      contrasena: 'Temporal123',
      rolNombre,
      direccion: '',
      telefono: '',
      cargo: ''
    };

    try {
      const res = await fetch(`${API_URL}/admin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await res.text());
      alert('✅ Usuario registrado');
      limpiarFormulario();
      cargarUsuarios();
    } catch (e) {
      console.error('❌ Error al registrar:', e);
      alert('❌ ' + e.message);
    }
  }

  async function actualizarUsuario() {
    if (!usuarioSeleccionado) return alert('⚠️ Selecciona un usuario');

    const nombre = document.getElementById('Nombre').value.trim();
    const email = document.getElementById('Email').value.trim();

    const data = {
      nombre,
      apellido: 'Actualizado',
      email,
      direccion: '',
      telefono: '',
      cargo: ''
    };

    try {
      const res = await fetch(`${API_URL}/actualizar/${usuarioSeleccionado.IdUsuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await res.text());
      alert('✅ Usuario actualizado');
      limpiarFormulario();
      cargarUsuarios();
    } catch (e) {
      console.error('❌ Error al actualizar:', e);
      alert('❌ ' + e.message);
    }
  }

  async function eliminarUsuario() {
    if (!usuarioSeleccionado) return alert('⚠️ Selecciona un usuario');
    if (!confirm('¿Deseas desactivar este usuario?')) return;

    try {
      const res = await fetch(`${API_URL}/estado/${usuarioSeleccionado.IdUsuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoEstado: false })
      });
      if (!res.ok) throw new Error(await res.text());
      alert('✅ Usuario desactivado');
      limpiarFormulario();
      cargarUsuarios();
    } catch (e) {
      console.error('❌ Error al desactivar usuario:', e);
      alert('❌ ' + e.message);
    }
  }

  function limpiarFormulario() {
    form.reset();
    usuarioSeleccionado = null;
  }
});
