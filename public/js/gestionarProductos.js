let productos = [];
let productoSeleccionado = null;
let marcas = [];
let categorias = [];

document.addEventListener('DOMContentLoaded', () => {
  const API_URL = '/api/productos';
  const API_MARCAS = '/api/marcas/todos';
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

  async function cargarProductos() {
    const estado = checkInactivos.checked ? 0 : 1;
    const criterio = ordenarPorSelect.value || 'id';

    try {
      const res = await fetch(`${API_URL}/todos?estado=${estado}&ordenarPor=${criterio}`);
      productos = await res.json();
      renderTabla(productos);
      cargarCategoriasDesdeProductos(productos);
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
    categorias = categoriasUnicas.map(c => ({ NombreCategoria: c }));
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

    if (!idMarca || isNaN(idMarca)) return mostrarAlerta('⚠️ Debe seleccionar una marca válida');
    if (!categoria) return mostrarAlerta('⚠️ Debe seleccionar una categoría válida');

    formData.set('IdMarca', parseInt(idMarca));
    formData.set('Categoria', categoria);

    try {
      const res = await fetch(API_URL, { method: 'POST', body: formData });
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

    if (!idMarca || isNaN(idMarca)) return mostrarAlerta('⚠️ Debe seleccionar una marca válida');
    if (!categoria) return mostrarAlerta('⚠️ Debe seleccionar una categoría válida');

    formData.set('IdMarca', parseInt(idMarca));
    formData.set('Categoria', categoria);

    try {
      const res = await fetch(API_URL, { method: 'PUT', body: formData });
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

  // ================== REPORTES DE PRODUCTO ==================

  document.getElementById('generateReport').addEventListener('click', () => {
    document.getElementById('modalReporte').style.display = 'block';
    document.getElementById('contenidoReporte').innerHTML = '';
  });

  const tipoReporte = document.getElementById('tipoReporteProductos');
  const filtrosExtras = document.getElementById('filtrosExtrasProductos');
  const btnEjecutar = document.getElementById('btnEjecutarReporteProductos');

  tipoReporte.addEventListener('change', async () => {
    filtrosExtras.innerHTML = '';
    if (tipoReporte.value === 'porMarca') {
      filtrosExtras.innerHTML = `
        <label>Marca:
          <select id="filtroMarca">
            ${marcas.map(m => `<option value="${m.IdMarca}">${m.NombreMarca}</option>`).join('')}
          </select>
        </label>`;
    }
    if (tipoReporte.value === 'porCategoria') {
      filtrosExtras.innerHTML = `
        <label>Categoría:
          <select id="filtroCategoria">
            ${categorias.map(c => `<option value="${c.NombreCategoria}">${c.NombreCategoria}</option>`).join('')}
          </select>
        </label>`;
    }
  });

  btnEjecutar.addEventListener('click', async () => {
    const tipo = tipoReporte.value;
    const params = new URLSearchParams({ tipoReporte: tipo });

    if (tipo === 'porMarca') {
      const marca = document.getElementById('filtroMarca')?.value;
      if (!marca) return mostrarAlerta('⚠️ Selecciona una marca');
      params.append('IdMarca', marca);
    }

    if (tipo === 'porCategoria') {
      const categoria = document.getElementById('filtroCategoria')?.value;
      if (!categoria) return mostrarAlerta('⚠️ Selecciona una categoría');
      params.append('Categoria', categoria);
    }

    try {
      const res = await fetch(`/api/reportes/productos?${params.toString()}`);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        return mostrarAlerta('⚠️ No se encontraron datos');
      }

      const columnas = Object.keys(data[0]).map(key => ({ header: key, key }));
      mostrarReporte({ titulo: `Reporte de productos: ${tipo}`, columnas, data });
    } catch (err) {
      console.error("❌ Error al obtener el reporte:", err);
      mostrarAlerta("❌ No se pudo obtener el reporte");
    }
  });

});

// ========== FUNCIONES REUTILIZABLES DE REPORTE ==========
btnEjecutar.addEventListener('click', async () => {
  const tipo = tipoReporte.value;
  const params = new URLSearchParams({ tipoReporte: tipo });

  if (tipo === 'porMarca') {
    const marca = document.getElementById('filtroMarca')?.value;
    if (!marca) return alert('⚠️ Selecciona una marca');
    params.append('IdMarca', marca);
  }

  if (tipo === 'porCategoria') {
    const categoria = document.getElementById('filtroCategoria')?.value;
    if (!categoria) return alert('⚠️ Selecciona una categoría');
    params.append('Categoria', categoria);
  }

  try {
    const res = await fetch(`/api/reportes/productos?${params.toString()}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return alert('⚠️ No se encontraron datos');
    }

    // ⚠️ Ajuste solo para reporte general
    let columnas;
    if (tipo === 'general') {
      columnas = [
        { header: 'ID', key: 'IdProducto' },
        { header: 'Nombre', key: 'NombreProducto' },
        { header: 'Marca', key: 'Marca' },
        { header: 'Categoría', key: 'Categoria' },
        { header: 'Cantidad', key: 'Cantidad' }
      ];
    } else {
      columnas = Object.keys(data[0]).map(key => ({ header: key, key }));
    }

    mostrarReporte({ titulo: `Reporte de productos: ${tipo}`, columnas, data });
  } catch (err) {
    console.error("❌ Error al obtener el reporte:", err);
    alert("❌ No se pudo obtener el reporte");
  }
});

function mostrarReporte({ titulo, columnas, data }) {
  const contenedor = document.getElementById("contenidoReporte");
  contenedor.innerHTML = `
    <h2 style="color:#C57A88; text-align:center;">${titulo}</h2>
    <table class="client-table" style="width: 100%; margin-top: 20px;">
      <thead>
        <tr>${columnas.map(col => `<th>${col.header}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr>${columnas.map(col => `<td>${row[col.key]}</td>`).join('')}</tr>
        `).join('')}
      </tbody>
    </table>
  `;
  abrirModalReporte();
}

function abrirModalReporte() {
  document.getElementById("modalReporte").style.display = "block";
}

function cerrarReporte() {
  document.getElementById("modalReporte").style.display = "none";
}

function descargarReportePDF() {
  const elemento = document.getElementById("contenidoReporte");
  const opciones = {
    margin: 0.5,
    filename: `reporte_${Date.now()}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
  };
  html2pdf().from(elemento).set(opciones).save();
}

function imprimirReporte() {
  const contenido = document.getElementById("contenidoReporte").innerHTML;
  const ventana = window.open('', '', 'width=800,height=600');
  ventana.document.write(`<html><head><title>Reporte</title></head><body>${contenido}</body></html>`);
  ventana.document.close();
  ventana.print();
}

function mostrarAlerta(mensaje) {
  alert(mensaje);
}

function mostrarAlertaConfirmación(mensaje, callback) {
  if (confirm(mensaje)) callback();
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