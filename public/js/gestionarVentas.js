document.addEventListener('DOMContentLoaded', () => {
  const API_VENTAS = '/api/ventas';
  const API_PRODUCTOS = '/api/productos/todos?estado=1';
  const API_CLIENTES = '/api/usuarios/clientes';


  const tablaBody = document.getElementById('tablaVentasBody');
  const btnRegistrar = document.getElementById('nuevaVenta');
  const btnLimpiar = document.getElementById('limpiarVenta');
  const selectProducto = document.getElementById('producto');
  const selectCliente = document.getElementById('cliente');
  const inputCantidad = document.getElementById('cantidad-vendida');
  const inputEmpleado = document.getElementById('empleado');

 let ventas = [];

  btnRegistrar.onclick = registrarVenta;
  btnLimpiar.onclick = limpiarFormulario;

  cargarVentas();
  cargarProductos();
  cargarClientes();
  cargarEmpleado();

  async function cargarVentas() {
    try {
      const res = await fetch(API_VENTAS);
      ventas = await res.json();
      renderTabla(ventas);
    } catch (err) {
      console.error('❌ Error al cargar ventas:', err);
      tablaBody.innerHTML = '<tr><td colspan="5">❌ Error al obtener ventas</td></tr>';
    }
  }

  function renderTabla(lista) {
    tablaBody.innerHTML = '';
    lista.forEach(v => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${v.IdVenta}</td>
        <td>${v.FechaVenta?.split('T')[0]}</td>
        <td>${v.Empleado}</td>
        <td>${v.Cliente}</td>
        <td>${v.Descuento}</td>
        <td>${v.Total}</td>
        <td>${v.EsDelivery ? 'Sí' : 'No'}</td>
      `;
      tablaBody.appendChild(fila);
    });
  }

  async function cargarProductos() {
    try {
      const res = await fetch(API_PRODUCTOS);
      const productos = await res.json();
      selectProducto.innerHTML = '<option value="">Seleccione un producto</option>';
      productos.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.IdProducto;
        opt.textContent = p.NombreProducto;
        selectProducto.appendChild(opt);
      });
    } catch (err) {
      console.error('❌ Error al cargar productos:', err);
    }
  }

  async function cargarClientes() {
    try {
      const res = await fetch(API_CLIENTES);
      const clientes = await res.json();
      selectCliente.innerHTML = '<option value="">Seleccione un cliente</option>';
      clientes.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.IdUsuario;
        opt.textContent = `${c.Nombre} ${c.Apellido}`;
        selectCliente.appendChild(opt);
      });
    } catch (err) {
      console.error('❌ Error al cargar clientes:', err);
    }
  }

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


   async function registrarVenta() {
    const clienteId = selectCliente.value;
    const productoId = selectProducto.value;
    const cantidad = parseInt(inputCantidad.value);
    const empleadoId = inputEmpleado.dataset.id;

    if (!clienteId || !productoId || !empleadoId || isNaN(cantidad) || cantidad <= 0) {
      alert('⚠️ Por favor complete todos los campos correctamente');
      return;
    }

    const datosVenta = {
      idCliente: parseInt(clienteId),
      idEmpleado: parseInt(empleadoId),
      idProducto: parseInt(productoId),
      cantidad: parseInt(cantidad)
    };

    console.log('🟨 Enviando datos de venta:', datosVenta);

    try {
      const res = await fetch(`${API_VENTAS}/tienda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosVenta)
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.mensaje || '❌ Error al registrar venta');
        return;
      }

      alert(result.mensaje || '✅ Venta registrada');
      limpiarFormulario();
      cargarVentas();
    } catch (err) {
      console.error('❌ Error al registrar venta:', err);
      alert('❌ No se pudo registrar la venta');
    }
  }

  function limpiarFormulario() {
    selectCliente.value = '';
    selectProducto.value = '';
    inputCantidad.value = '';
  }

  // Botones de reportes simulados
  document.getElementById('generateReport').addEventListener('click', () => {
    mostrarMensajeDescarga('✔ Reporte generado correctamente.');
  });

  document.getElementById('generateInvoice').addEventListener('click', () => {
    mostrarMensajeDescarga('✔ Factura generada en formato PDF.');
  });

  function mostrarMensajeDescarga(texto) {
    const msg = document.getElementById('downloadMessage');
    msg.textContent = texto;
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 3000);
  }
});
