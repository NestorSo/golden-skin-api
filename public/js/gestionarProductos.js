//gestionarProductos.js
let productos = [];
let productoSeleccionado = null;
let marcas = [];
let categorias = [];

document.addEventListener('DOMContentLoaded', () => {
  const API_URL = '/api/productos';
  const API_MARCAS = '/api/marcas/todos';
  const API_CATEGORIAS = '/api/categorias/activas';
  const tablaBody = document.getElementById('tablaProductosBody');
  const inputBuscar = document.querySelector('.search-input');
  const checkInactivos = document.getElementById('verInactivos');
  const ordenarPorSelect = document.getElementById('ordenarPor');
  const selectMarca = document.getElementById('marca');
  const selectCategoria = document.getElementById('categoria');

  document.getElementById('insertarProducto').addEventListener('click', agregarProducto);
  document.getElementById('agregarInventario').addEventListener('click', agregarProducto);
  document.getElementById('actualizar').addEventListener('click', actualizarProducto);
  document.getElementById('baja').addEventListener('click', darDeBaja);
  document.getElementById('reactivarProducto').addEventListener('click', reactivarProducto);
  document.getElementById('limpiar').addEventListener('click', limpiarFormulario);
  inputBuscar.addEventListener('input', filtrarProductos);
  checkInactivos.addEventListener('change', cargarProductos);
  ordenarPorSelect.addEventListener('change', ordenarProductos);

  cargarProductos();
  cargarMarcas();
  cargarCategorias();

  async function cargarMarcas() {
    try {
      const res = await fetch(API_MARCAS);
      marcas = await res.json();
      selectMarca.innerHTML = '<option value="">Seleccione una marca</option>';
      marcas.forEach(m => {
        selectMarca.innerHTML += `<option value="${m.IdMarca}">${m.NombreMarca}</option>`;
      });
    } catch (err) {
      console.error('❌ Error al cargar marcas:', err);
      selectMarca.innerHTML = '<option value="">Error al cargar marcas</option>';
    }
  }

  async function cargarCategorias() {
    try {
      const res = await fetch(API_CATEGORIAS);
      categorias = await res.json();
      selectCategoria.innerHTML = '<option value="">Seleccione una categoría</option>';
      categorias.forEach(c => {
        selectCategoria.innerHTML += `<option value="${c.NombreCategoria}">${c.NombreCategoria}</option>`;
      });
    } catch (err) {
      console.error('❌ Error al cargar categorías:', err);
      selectCategoria.innerHTML = '<option value="">Error al cargar categorías</option>';
    }
  }

async function cargarProductos() {
  const estado = checkInactivos.checked ? 0 : 1;
  const criterio = ordenarPorSelect.value || 'id';

  try {
    const res = await fetch(`${API_URL}/todos?estado=${estado}&ordenarPor=${criterio}`);
    productos = await res.json();
    renderTabla(productos);
    cargarCategoriasDesdeProductos(productos); // <--- AÑADIDO AQUÍ
  } catch (err) {
    console.error(err);
    tablaBody.innerHTML = '<tr><td colspan="5">❌ No se pudieron cargar productos</td></tr>';
  }
}
function cargarCategoriasDesdeProductos(productos) {
  const categoriasUnicas = [...new Set(productos.map(p => p.Categoria).filter(c => !!c))];
  selectCategoria.innerHTML = '<option value="">Seleccione una categoría</option>';
  categoriasUnicas.forEach(cat => {
    selectCategoria.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}


  function filtrarProductos() {
    const texto = inputBuscar.value.toLowerCase();
    const filtrados = productos.filter(p =>
      p.NombreProducto.toLowerCase().includes(texto) ||
      (p.Marca || '').toLowerCase().includes(texto) ||
      (p.Categoria || '').toLowerCase().includes(texto) ||
      String(p.IdProducto).includes(texto)
    );
    renderTabla(filtrados);
  }

  async function agregarProducto(e) {
    e.preventDefault();
    const form = document.getElementById('formProducto');
    const formData = new FormData(form);
    const idMarca = selectMarca.value;
    const categoria = selectCategoria.value;

if (!idMarca || isNaN(idMarca)) {
  return mostrarAlerta('⚠️ Debe seleccionar una marca válida');
}

if (!categoria) {
  return mostrarAlerta('⚠️ Debe seleccionar una categoría válida');
}

    formData.set('IdMarca', parseInt(idMarca));
    formData.set('Categoria', categoria);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error(await res.text());
mostrarAlerta('✅ Producto agregado');
      limpiarFormulario();
      cargarProductos();
    } catch (err) {
      console.error('❌ Error al insertar producto:', err);
mostrarAlerta('❌ Error al agregar producto');
    }
  }

  async function actualizarProducto() {
if (!productoSeleccionado) return mostrarAlerta('❌ Selecciona un producto');
    const form = document.getElementById('formProducto');
    const formData = new FormData(form);
    formData.append('IdProducto', productoSeleccionado.IdProducto);

    const idMarca = selectMarca.value;
    const categoria = selectCategoria.value;

if (!idMarca || isNaN(idMarca)) {
  return mostrarAlerta('⚠️ Debe seleccionar una marca válida');
}

if (!categoria) {
  return mostrarAlerta('⚠️ Debe seleccionar una categoría válida');
}

    formData.set('IdMarca', parseInt(idMarca));
    formData.set('Categoria', categoria);

    try {
      const res = await fetch(API_URL, {
        method: 'PUT',
        body: formData
      });
      if (!res.ok) throw new Error(await res.text());
mostrarAlerta('✅ Producto actualizado');
      limpiarFormulario();
      cargarProductos();
    } catch (err) {
      console.error(err);
mostrarAlerta('❌ Error al actualizar producto');
    }
  }

  async function darDeBaja() {
if (!productoSeleccionado) return mostrarAlerta('❌ Selecciona un producto');
   mostrarAlertaConfirmación('¿Estás seguro de dar de baja este producto?', async () => {
  try {
    const res = await fetch(`${API_URL}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ IdProducto: productoSeleccionado.IdProducto, NuevoEstado: false })
    });
    if (!res.ok) throw new Error(await res.text());
    mostrarAlerta('✅ Producto dado de baja');
    limpiarFormulario();
    cargarProductos();
  } catch (err) {
    console.error(err);
    mostrarAlerta('❌ Error al dar de baja');
  }
});
  }

  async function reactivarProducto() {
if (!productoSeleccionado) return mostrarAlerta('❌ Selecciona un producto');

try {
  const res = await fetch(`${API_URL}/estado`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ IdProducto: productoSeleccionado.IdProducto, NuevoEstado: true })
  });
  if (!res.ok) throw new Error(await res.text());
  mostrarAlerta('✅ Producto reactivado');
  limpiarFormulario();
  cargarProductos();
} catch (err) {
  console.error(err);
  mostrarAlerta('❌ Error al reactivar');
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
        selectMarca.value = marcas.find(m => m.NombreMarca === p.Marca)?.IdMarca || '';
        selectCategoria.value = p.Categoria || '';
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

  function ordenarProductos() {
    const criterio = ordenarPorSelect.value;
    const texto = inputBuscar.value.toLowerCase();
    const filtrados = productos.filter(p =>
      p.NombreProducto.toLowerCase().includes(criterio) ||
      (p.Marca || '').toLowerCase().includes(criterio) ||
      (p.Categoria || '').toLowerCase().includes(criterio) ||
      String(p.IdProducto).includes(criterio)
    );
    renderTabla(filtrados);
  }
});


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