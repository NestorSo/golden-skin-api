let proveedores = [];
let proveedorSeleccionado = null;

document.addEventListener('DOMContentLoaded', () => {
  cargarProveedores();

  document.getElementById('insertarProveedor').addEventListener('click', insertarProveedor);
  document.getElementById('actualizarProveedor').addEventListener('click', actualizarProveedor);
  document.getElementById('eliminarProveedor').addEventListener('click', desactivarProveedor);
    document.getElementById('reactivarProveedor').addEventListener('click', reactivarProveedor);
  document.getElementById('limpiarProveedor').addEventListener('click', limpiarFormulario);
  document.querySelector('.search-button').addEventListener('click', buscarProveedor);
});
document.getElementById('verInactivos').addEventListener('change', () => {
  const mostrarInactivos = document.getElementById('verInactivos').checked;
  cargarDatos(mostrarInactivos);
});
async function cargarDatos(mostrarInactivos = false) {
  try {
    const estado = mostrarInactivos ? 0 : 1;
    const res = await fetch(`/api/roles/listar/${estado}`); // o /api/proveedores/listar/${estado}
    const data = await res.json();
    renderTabla(data);
  } catch (err) {
    console.error('❌ Error al cargar datos:', err);
  }
}

async function cargarProveedores() {
  try {
    const res = await fetch('/api/proveedores/todos?estado=1');
    proveedores = await res.json();
    renderTabla(proveedores);
  } catch (err) {
    console.error('❌ Error al cargar proveedores:', err);
  }
}

function renderTabla(lista) {
  const tbody = document.querySelector('table.client-table tbody');
  tbody.innerHTML = '';

  lista.forEach(p => {
    const fila = document.createElement('tr');
fila.innerHTML = `
  <td>${p.IdProveedor}</td>
  <td>${p.NombreProveedor}</td>
  <td>${p.Telefono}</td>
  <td>${p.Direccion}</td>
`;

    fila.addEventListener('click', () => {
      proveedorSeleccionado = p;
      document.getElementById('nombre').value = p.Nombre;
      document.getElementById('telefono').value = p.Telefono;
      document.getElementById('direccion').value = p.Direccion;
      document.getElementById('correo').value = p.Correo;
    });
    tbody.appendChild(fila);
  });
}

async function insertarProveedor() {
  const nombre = document.getElementById('nombre').value;
  const telefono = document.getElementById('telefono').value;
  const direccion = document.getElementById('direccion').value;
  const correo = document.getElementById('correo').value;

  if (!nombre || !telefono || !direccion || !correo) {
    alert('⚠️ Completa todos los campos');
    return;
  }

  try {
    const res = await fetch('/api/proveedores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, telefono, direccion, correo })
    });

    const data = await res.json();
    alert(data.mensaje || '✅ Proveedor agregado');
    cargarProveedores();
    limpiarFormulario();
  } catch (err) {
    console.error('❌ Error al insertar proveedor:', err);
    alert('❌ No se pudo insertar');
  }
}

async function actualizarProveedor() {
  if (!proveedorSeleccionado) {
    alert('⚠️ Selecciona un proveedor');
    return;
  }

  const id = proveedorSeleccionado.IdProveedor;
  const nombre = document.getElementById('nombre').value;
  const telefono = document.getElementById('telefono').value;
  const direccion = document.getElementById('direccion').value;
  const correo = document.getElementById('correo').value;

  try {
    const res = await fetch(`/api/proveedores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, telefono, direccion, correo })
    });

    const data = await res.json();
    alert(data.mensaje || '✅ Proveedor actualizado');
    cargarProveedores();
    limpiarFormulario();
  } catch (err) {
    console.error('❌ Error al actualizar proveedor:', err);
    alert('❌ No se pudo actualizar');
  }
}

async function desactivarProveedor() {
  if (!proveedorSeleccionado) {
    alert('⚠️ Selecciona un proveedor');
    return;
  }

  const confirmacion = confirm('¿Seguro que deseas desactivar este proveedor?');
  if (!confirmacion) return;

  try {
    const res = await fetch(`/api/proveedores/estado/${proveedorSeleccionado.IdProveedor}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: false })
    });

    const data = await res.json();
    alert(data.mensaje || '✅ Proveedor desactivado');
    cargarProveedores();
    limpiarFormulario();
  } catch (err) {
    console.error('❌ Error al desactivar proveedor:', err);
    alert('❌ No se pudo desactivar');
  }
}

function limpiarFormulario() {
  document.getElementById('nombre').value = '';
  document.getElementById('telefono').value = '';
  document.getElementById('direccion').value = '';
  document.getElementById('correo').value = '';
  proveedorSeleccionado = null;
}

async function buscarProveedor() {
  const texto = document.querySelector('.search-input').value.trim();
  if (!texto) {
    cargarProveedores();
    return;
  }

  try {
    const res = await fetch(`/api/proveedores/buscar?texto=${encodeURIComponent(texto)}`);
    const resultados = await res.json();
    renderTabla(resultados);
  } catch (err) {
    console.error('❌ Error en la búsqueda:', err);
  }
}
