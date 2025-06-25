// gestionarProductos.js

let productos = [];
let productoSeleccionado = null;

document.addEventListener('DOMContentLoaded', () => {
  const API_URL = '/api/productos';
  const tablaBody = document.getElementById('tablaProductosBody');
  const inputBuscar = document.querySelector('.search-input');
  const checkInactivos = document.getElementById('verInactivos');
const ordenarPorSelect = document.getElementById('ordenarPor');

  // Eventos
  document.getElementById('insertarProducto').addEventListener('click', agregarProducto); // ID corregido
  document.getElementById('actualizar').addEventListener('click', actualizarProducto);
  document.getElementById('baja').addEventListener('click', darDeBaja);
  document.getElementById('limpiar').addEventListener('click', limpiarFormulario);
  inputBuscar.addEventListener('input', filtrarProductos);
  checkInactivos.addEventListener('change', ordenarPor);
  ordenarPorSelect.addEventListener('change', ordenarProductos);

  cargarProductos();

async function cargarProductos() {
  const estado = checkInactivos.checked ? 0 : 1;
  const criterio = ordenarPorSelect.value || 'id';

  try {
    const res = await fetch(`${API_URL}/todos?estado=${estado}&ordenarPor=${criterio}`);
    productos = await res.json();
    renderTabla(productos);
  } catch (err) {
    console.error(err);
    tablaBody.innerHTML = '<tr><td colspan="5">❌ No se pudieron cargar productos</td></tr>';
  }
}


 function filtrarProductos() {
  const texto = inputBuscar.value.toLowerCase();
  const filtrados = productos.filter(p =>
    p.NombreProducto.toLowerCase().includes(texto) ||
    (p.Marca || '').toLowerCase().includes(texto) ||
    (p.Categoria || '').toLowerCase().includes(texto) || // 🔧 Añadido
    String(p.IdProducto).includes(texto)
  );
  renderTabla(filtrados);
}


  async function agregarProducto() {
    const form = document.getElementById('formProducto');
    const formData = new FormData(form);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error(await res.text());
      alert('✅ Producto agregado');
      limpiarFormulario();
      cargarProductos();
    } catch (err) {
      console.error(err);
      alert('❌ Error al agregar producto');
    }
  }

  async function actualizarProducto() {
    if (!productoSeleccionado) return alert('❌ Selecciona un producto');
    const form = document.getElementById('formProducto');
    const formData = new FormData(form);
    formData.append('IdProducto', productoSeleccionado.IdProducto);

    try {
      const res = await fetch(API_URL, {
        method: 'PUT',
        body: formData
      });
      if (!res.ok) throw new Error(await res.text());
      alert('✅ Producto actualizado');
      limpiarFormulario();
      cargarProductos();
    } catch (err) {
      console.error(err);
      alert('❌ Error al actualizar');
    }
  }

  async function darDeBaja() {
    if (!productoSeleccionado) return alert('❌ Selecciona un producto');
    if (!confirm('¿Estás seguro de dar de baja este producto?')) return;
    try {
      const res = await fetch(`${API_URL}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ IdProducto: productoSeleccionado.IdProducto, NuevoEstado: false })
      });
      if (!res.ok) throw new Error(await res.text());
      alert('✅ Producto dado de baja');
      limpiarFormulario();
      cargarProductos();
    } catch (err) {
      console.error(err);
      alert('❌ Error al dar de baja');
    }
  }

function renderTabla(lista) {
  tablaBody.innerHTML = '';
  lista.forEach(p => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${p.IdProducto}</td>
      <td>${p.NombreProducto}</td>
      <td>${p.Marca || 'Sin marca'}</td>
      <td>${p.Categoria || 'Sin categoría'}</td>
      <td>${p.Descripcion || 'Sin descripción'}</td>
      <td>${p.Precio != null ? `C$ ${parseFloat(p.Precio).toFixed(2)}` : 'N/D'}</td>
      <td>${(p.FechaFabricacion || '').split('T')[0]}</td>
      <td>${(p.FechaVencimiento || '').split('T')[0]}</td>
      <td>${p.Cantidad ?? 0}</td>
      <td>${p.Vendidos ?? 0}</td>
    `;
    fila.addEventListener('click', () => {
      productoSeleccionado = p;
      document.getElementById('nombre').value = p.NombreProducto;
      document.getElementById('marca').value = p.Marca;
      document.getElementById('descripcion').value = p.Descripcion;
      document.getElementById('precio').value = p.Precio;
      document.getElementById('cantidad').value = p.Cantidad;
      document.getElementById('fecha-caducidad').value = (p.FechaVencimiento || '').split('T')[0];
      document.getElementById('fecha-fabricacion').value = (p.FechaFabricacion || '').split('T')[0];
    });
    tablaBody.appendChild(fila);
  });
}


  function limpiarFormulario() {
    document.getElementById('formProducto').reset();
    productoSeleccionado = null;
  }
});
function ordenarProductos() {
  const criterio = ordenarPorSelect.value;
  const texto = inputBuscar.value.toLowerCase();
  const filtrados = productos.filter(p =>
    p.NombreProducto.toLowerCase().includes(criterio) ||
    (p.Marca || '').toLowerCase().includes(criterio) ||
    (p.Categoria || '').toLowerCase().includes(criterio) || // 🔧 Añadido
    String(p.IdProducto).includes(criterio)
  );
  renderTabla(filtrados);
  }

 


// //funcionalidad que puso la kelly dentro del html
// document.addEventListener('DOMContentLoaded', function() {
//             // Aquí puedes agregar la funcionalidad JavaScript
//             document.getElementById('agregar').addEventListener('click', function() {
//                 alert('Función de Agregar cliente');
//                 // Lógica para agregar cliente
//             });
            
//             document.getElementById('actualizar').addEventListener('click', function() {
//                 alert('Función de Actualizar cliente');
//                 // Lógica para actualizar cliente
//             });
            
//             document.getElementById('baja').addEventListener('click', function() {
//                 alert('Función de Dar de baja cliente');
//                 // Lógica para dar de baja
//             });


//             //funcionalidad para reportes
//             const generateReport = document.getElementById('generateReport');
//             const generateInvoice = document.getElementById('generateInvoice');
//             const downloadMessage = document.getElementById('downloadMessage');
            
//             generateReport.addEventListener('click', function() {
//                 downloadMessage.textContent = "✔ Reporte generado correctamente.";
//                 downloadMessage.classList.add('show');
//                 setTimeout(() => {
//                     downloadMessage.classList.remove('show');
//                 }, 3000);
//             });
            
//             generateInvoice.addEventListener('click', function() {
//                 downloadMessage.textContent = "✔ Factura generada en formato PDF.";
//                 downloadMessage.classList.add('show');
//                 setTimeout(() => {
//                     downloadMessage.classList.remove('show');
//                 }, 3000);
//             });
//         });