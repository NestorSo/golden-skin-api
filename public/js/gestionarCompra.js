// gestionarCompras.js

const API_URL = '/api/compras';
  const SELECT_ROLES = '/api/proveedores/todos?estado=1';

let productos = [], compras = [], productosCompra = [], productoSeleccionado = null;

window.addEventListener('DOMContentLoaded', () => {
  cargarProveedores();
  cargarEmpleado();
  cargarProductos();
  cargarCompras();

  document.getElementById('formCompra').addEventListener('submit', registrarCompra);
  document.getElementById('limpiarCompra').addEventListener('click', limpiarFormulario);
});

async function cargarProveedores() {
  const select = document.getElementById('proveedor');
  try {
    const res = await fetch('/api/proveedores/todos?estado=1');
    const proveedores = await res.json();

    // Reiniciar el select
    select.innerHTML = '<option value="">Seleccione un proveedor</option>';

    // Verificar si vienen datos
    if (!Array.isArray(proveedores) || proveedores.length === 0) {
      console.warn('⚠️ No se encontraron proveedores activos');
      return;
    }

    // Insertar opciones
    proveedores.forEach(p => {
      const option = document.createElement('option');
      option.value = p.IdProveedor;
      option.textContent = p.NombreProveedor;
      select.appendChild(option);
    });
  } catch (err) {
    console.error('❌ Error cargando proveedores:', err);
    select.innerHTML = '<option value="">Error al cargar proveedores</option>';
  }
}



const inputEmpleado = document.getElementById('empleado');


  async function cargarEmpleado() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (usuario && usuario.IdUsuario) {
    try {
      const res = await fetch(`/api/empleados/por-usuario/${usuario.IdUsuario}`);
      if (!res.ok) throw new Error('No se encontró empleado');

      const data = await res.json(); // { IdEmpleado: 4 }

      inputEmpleado.value = `${usuario.Nombre} ${usuario.Apellido}`;
      inputEmpleado.dataset.id = data.IdEmpleado;

    } catch (err) {
      console.warn('⚠️ No se pudo obtener el ID del empleado', err);
      inputEmpleado.value = 'Empleado no vinculado';
    }
  } else {
    inputEmpleado.value = 'Empleado no cargado';
  }
}




async function cargarProductos() {
  try {
    const res = await fetch('/api/productos/todos?estado=1');
    productos = await res.json();
    const tabla = document.getElementById('tablaProductosBody');
    tabla.innerHTML = '';
    productos.forEach(p => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${p.IdProducto}</td>
        <td>${p.NombreProducto}</td>
        <td>${p.Marca || 'Sin marca'}</td>
        <td>${p.Categoria || 'Sin categoría'}</td>
        <td>${p.Descripcion || '-'}</td>
        <td>${p.Precio != null ? `C$ ${parseFloat(p.Precio).toFixed(2)}` : 'N/D'}</td>
        <td>${(p.FechaFabricacion || '').split('T')[0]}</td>
        <td>${(p.FechaVencimiento || '').split('T')[0]}</td>
        <td>${p.Cantidad ?? 0}</td>
        <td>${p.Vendidos ?? 0}</td>
      `;
      fila.addEventListener('click', () => {
        productoSeleccionado = p;
        document.getElementById('IdProducto').value = p.IdProducto;
        document.getElementById('nombreProducto').value = p.NombreProducto;
        document.getElementById('marcaProducto').value = p.Marca;
        document.getElementById('categoriaProducto').value = p.Categoria;
        document.getElementById('descripcionProducto').value = p.Descripcion;
      });
      tabla.appendChild(fila);
    });
  } catch (err) {
    console.error('❌ Error cargando productos:', err);
  }
}

async function cargarCompras() {
  try {
    const res = await fetch(`${API_URL}`);
    compras = await res.json();
    const tabla = document.getElementById('tablaComprasBody');
    tabla.innerHTML = '';
    compras.forEach(c => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${c.IdCompra}</td>
        <td>${c.NombreProveedor}</td>
        <td>${c.Empleado}</td>
        <td>${c.Fecha?.split('T')[0]}</td>
        <td>${c.Total || '-'}</td>
      `;
      tabla.appendChild(fila);
    });
  } catch (err) {
    console.error('❌ Error cargando compras:', err);
  }
}

async function registrarCompra(e) {
  e.preventDefault();

  const proveedorId = parseInt(document.getElementById('proveedor').value);
const empleadoId = parseInt(inputEmpleado.dataset.id); // no del value
  const productoId = parseInt(document.getElementById('IdProducto').value);
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const precio = parseFloat(document.getElementById('precioUnitario').value);

  if (!productoId || isNaN(cantidad) || isNaN(precio)) {
    alert('⚠️ Producto no seleccionado o datos incorrectos');
    return;
  }

  productosCompra.push({ id: productoId, cantidad, precioUnitario: precio });

  if (!confirm('¿Deseas registrar esta compra ahora?')) return;

  try {
    const res = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proveedorId, empleadoId, productos: productosCompra })
    });
    if (!res.ok) {
  const text = await res.text();
  throw new Error(`Error del servidor: ${text}`);
}
    const result = await res.json();
    alert(result.mensaje);
    productosCompra = [];
    limpiarFormulario();
    cargarCompras();
    cargarProductos();
  } catch (err) {
    console.error('❌ Error al registrar compra:', err);
    alert('❌ Error al registrar compra');
  }
}

function limpiarFormulario() {
  document.getElementById('formCompra').reset();
  document.getElementById('IdProducto').value = '';
  document.getElementById('nombreProducto').value = '';
  document.getElementById('marcaProducto').value = '';
  document.getElementById('categoriaProducto').value = '';
  document.getElementById('descripcionProducto').value = '';
  document.getElementById('cantidad').value = '';
  document.getElementById('precioUnitario').value = '';
  productoSeleccionado = null;
}
