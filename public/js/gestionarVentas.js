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

  function cargarEmpleado() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
      inputEmpleado.value = `${usuario.Nombre} ${usuario.Apellido}`;
      inputEmpleado.dataset.id = usuario.IdUsuario;
    }
  }

  async function registrarVenta() {
    const clienteId = selectCliente.value;
    const productoId = selectProducto.value;
    const cantidad = parseInt(inputCantidad.value);
    const empleadoId = document.getElementById('empleado').dataset.id;

    if (!clienteId || !productoId || isNaN(cantidad)) {
      alert('⚠️ Por favor complete todos los campos');
      return;
    }

    try {
      const res = await fetch(`${API_VENTAS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idCliente: parseInt(clienteId),
          idEmpleado: parseInt(empleadoId),
          idProducto: parseInt(productoId),
          cantidad: parseInt(cantidad)
        })
      });

      const result = await res.json();
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
