// public/js/gestionarMarcas.js
document.addEventListener('DOMContentLoaded', () => {
  const API_URL = '/api/marcas';

  const inputBuscar = document.querySelector('.search-input');
  const tablaBody = document.querySelector('.client-table tbody');

  const inputId = document.getElementById('UsuarioId');
  const inputNombre = document.getElementById('marca');
  const inputDescripcion = document.getElementById('descripcion');
  const inputFabricante = document.getElementById('fabricante');

  const btnInsertar = document.getElementById('insertarMarca');
  const btnActualizar = document.getElementById('actualizarMarca');
  const btnEliminar = document.getElementById('eliminarMarca');
const btnReactivar = document.getElementById('reactivarMarca');
  const btnLimpiar = document.getElementById('limpiarMarca');

  let marcas = [];

  btnInsertar.addEventListener('click', crearMarca);
  btnActualizar.addEventListener('click', actualizarMarca);
  btnEliminar.addEventListener('click', desactivarMarca);
  btnReactivar.addEventListener('click', reactivarMarca);

  btnLimpiar.addEventListener('click', limpiarFormulario);
  inputBuscar.addEventListener('input', buscarMarca);

  cargarMarcas();

  async function cargarMarcas() {
    try {
      const res = await fetch(`${API_URL}/todos`);
      marcas = await res.json();
      renderTabla(marcas);
    } catch (err) {
      console.error('❌ Error al cargar marcas:', err);
    }
  }
async function reactivarMarca() {
  const id = parseInt(inputId.value);
  if (!id) {
    mostrarAlerta('⚠️ Seleccione una marca para reactivarla');
    return;
  }
  
  mostrarAlertaConfirmación('¿Está seguro de reactivar esta marca?', async () => {
 try {
    const res = await fetch(`${API_URL}/estado/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: true })
    });

    const result = await res.json();
    alert(result.mensaje || '✅ Marca reactivada');
    limpiarFormulario();
    cargarMarcas();
  } catch (err) {
    console.error('❌ Error al reactivar marca:', err);
    alert('❌ Error al reactivar marca');
  }
});
}

  function renderTabla(lista) {
    tablaBody.innerHTML = '';
    lista.forEach(m => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${m.IdMarca}</td>
        <td>${m.NombreMarca}</td>
        <td>${m.Descripcion}</td>
        <td>${m.Fabricante}</td>
      `;
 fila.addEventListener('click', () => {
  inputId.value = m.IdMarca;
  inputNombre.value = m.NombreMarca;   // ✅ Corregido
  inputDescripcion.value = m.Descripcion;
  inputFabricante.value = m.Fabricante;
});

      tablaBody.appendChild(fila);
    });
  }

  async function crearMarca() {
    const data = leerFormulario();
    if (!data) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
mostrarAlerta(result.mensaje || '✅ Marca registrada');
      limpiarFormulario();
      cargarMarcas();
    } catch (err) {
      console.error('❌ Error al registrar marca:', err);
mostrarAlerta('❌ Error al registrar marca');
    }
  }

  async function actualizarMarca() {
    const id = parseInt(inputId.value);
    const data = leerFormulario();
    if (!id || !data) {
mostrarAlerta('⚠️ Debe seleccionar una marca');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      mostrarAlerta(result.mensaje || '✅ Marca actualizada');
      limpiarFormulario();
      cargarMarcas();
    } catch (err) {
      console.error('❌ Error al actualizar marca:', err);
      mostrarAlerta('❌ Error al actualizar marca');
    }
  }

  async function desactivarMarca() {
    const id = parseInt(inputId.value);
    if (!id) {
      mostrarAlerta('⚠️ Seleccione una marca para desactivarla');
      return;
    }

     mostrarAlertaConfirmación('¿Está seguro de desactivar esta marca?', async () => {
  try {
      const res = await fetch(`${API_URL}/estado/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: false })
      });
      const result = await res.json();
      mostrarAlerta(result.mensaje || '✅ Marca desactivada');
      limpiarFormulario();
      cargarMarcas();
    } catch (err) {
      console.error('❌ Error al desactivar marca:', err);
      mostrarAlerta('❌ Error al desactivar marca');
    }
});
  }

  function buscarMarca() {
    const texto = inputBuscar.value.toLowerCase();
    const filtradas = marcas.filter(m =>
      m.Nombre.toLowerCase().includes(texto) ||
      m.Fabricante.toLowerCase().includes(texto) ||
      String(m.IdMarca).includes(texto)
    );
    renderTabla(filtradas);
  }

  function leerFormulario() {
    const nombre = inputNombre.value.trim();
    const descripcion = inputDescripcion.value.trim();
    const fabricante = inputFabricante.value.trim();

    if (!nombre || !descripcion || !fabricante) {
      mostrarAlerta('⚠️ Por favor complete todos los campos');
      return null;
    }

    return { nombre, descripcion, fabricante };
  }

  function limpiarFormulario() {
    inputId.value = '';
    inputNombre.value = '';
    inputDescripcion.value = '';
    inputFabricante.value = '';
  }
});
