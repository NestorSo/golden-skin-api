// gestionarVentas.js

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
  const chkSoloDelivery = document.getElementById('verSoloDelivery');

  const btnVerFactura = document.getElementById('btnVerFactura');
  const modalFactura = document.getElementById('modalFactura');
  const btnDescargarFactura = document.getElementById('btnDescargarFactura');
  const btnImprimirFactura = document.getElementById('btnImprimirFactura');
  const btnCerrarModal = document.getElementById('btnCerrarModal');

  let detalleTemporal = [];
  let ventas = [];

  cargarVentas();
  cargarProductos();
  cargarClientes();
  cargarEmpleado();

document.getElementById('nuevaVenta').addEventListener('click', async () => {
  const idCliente = document.getElementById('cliente').value;
  const idEmpleado = document.getElementById('empleado').dataset.id;
  const delivery = document.getElementById('verSoloDelivery').checked;

  if (!idCliente || !idEmpleado || detalleTemporal.length === 0) {
    return mostrarAlerta("❌ Completa cliente, empleado y productos");
  }

  const productos = detalleTemporal.map(p => ({
    id: parseInt(p.idProducto),  // El backend espera `id` no `idProducto`
    cantidad: p.cantidad
  }));

  try {
    const res = await fetch('/api/ventas/venta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clienteId: parseInt(idCliente),
        empleadoId: parseInt(idEmpleado),
        productos,
        delivery
      })
    });

    const data = await res.json();
    if (!res.ok) return mostrarAlerta(data.mensaje || "❌ Error");

    mostrarAlerta(data.mensaje || "✅ Venta registrada");
    detalleTemporal = [];
    renderizarDetalleTemporal();
    cargarVentas();

  } catch (error) {
    console.error("❌ Error al registrar venta:", error);
    mostrarAlerta("❌ Error del servidor");
  }
});


  document.getElementById('btnAgregarProducto').addEventListener('click', () => {
    const idProducto = selectProducto.value;
    const nombreProducto = selectProducto.selectedOptions[0].textContent;
    const cantidad = parseInt(inputCantidad.value);

    if (!idProducto || cantidad <= 0) {
      return mostrarAlerta("⚠️ Selecciona un producto válido y una cantidad mayor a cero");
    }

    const existente = detalleTemporal.find(p => p.idProducto === idProducto);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      detalleTemporal.push({ idProducto, nombre: nombreProducto, cantidad });
    }

    renderizarDetalleTemporal();
    inputCantidad.value = '';
  });

  btnLimpiar.addEventListener('click', limpiarFormulario);
  chkSoloDelivery.addEventListener('change', cargarVentas);

  btnVerFactura?.addEventListener('click', () => {
    if (!window.ventaSeleccionada) return mostrarAlerta('⚠️ Selecciona una venta.');
    cargarFacturaVenta(window.ventaSeleccionada);
  });

  btnCerrarModal?.addEventListener('click', () => {
    modalFactura.style.display = 'none';
  });

  btnImprimirFactura?.addEventListener('click', () => {
    const factura = document.getElementById('facturaVenta');
    const ventana = window.open('', '', 'width=800,height=600');
    ventana.document.write(`
      <html>
      <head><title>Factura</title></head>
      <body>${factura.innerHTML}</body>
      </html>
    `);
    ventana.document.close();
    ventana.focus();
    ventana.print();
    ventana.close();
  });

  window.onclick = (event) => {
    if (event.target === modalFactura) modalFactura.style.display = 'none';
  };

  function renderizarDetalleTemporal() {
    const tbody = document.getElementById('detalleVentaTemporalBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    detalleTemporal.forEach((item, index) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
        <td><button onclick="quitarProducto(${index})">❌ Quitar</button></td>
      `;
      tbody.appendChild(fila);
    });
  }

  window.quitarProducto = function (index) {
    detalleTemporal.splice(index, 1);
    renderizarDetalleTemporal();
  };

  function limpiarFormulario() {
    selectCliente.value = '';
    selectProducto.value = '';
    inputCantidad.value = '';
    window.ventaSeleccionada = null;
    document.querySelectorAll('#tablaVentasBody tr').forEach(tr => tr.classList.remove('selected'));
  }

  async function cargarVentas() {
    try {
      const soloDelivery = chkSoloDelivery.checked;
      const res = await fetch(`${API_VENTAS}?soloDelivery=${soloDelivery}`);
      const data = await res.json();

      if (!Array.isArray(data)) throw new Error('Respuesta inesperada');

      ventas = data;
      renderTabla(ventas);
    } catch (err) {
      console.error('❌ Error al cargar ventas:', err);
      tablaBody.innerHTML = '<tr><td colspan="7">❌ Error al obtener ventas</td></tr>';
    }
  }

  function renderTabla(lista) {
    tablaBody.innerHTML = '';
    lista.forEach(venta => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${venta.IdVenta}</td>
        <td>${venta.FechaVenta?.split('T')[0]}</td>
        <td>${venta.Empleado}</td>
        <td>${venta.Cliente}</td>
        <td>${venta.Descuento}</td>
        <td>${venta.Total}</td>
        <td>${venta.EsDelivery}</td>`;

      fila.addEventListener('click', () => {
        window.ventaSeleccionada = venta.IdVenta;
        document.querySelectorAll('#tablaVentasBody tr').forEach(tr => tr.classList.remove('selected'));
        fila.classList.add('selected');
      });

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
        if (!res.ok) throw new Error('Empleado no encontrado');

        const data = await res.json();
        inputEmpleado.value = `${usuario.Nombre} ${usuario.Apellido}`;
        inputEmpleado.dataset.id = data.IdEmpleado;
      } catch (err) {
        inputEmpleado.value = 'Empleado no vinculado';
      }
    } else {
      inputEmpleado.value = 'Empleado no cargado';
    }
  }

  async function cargarFacturaVenta(id) {
    try {
      const res = await fetch(`/api/ventas/factura/${id}`);
      const venta = await res.json();

      document.getElementById("facturaNumero").textContent = venta.IdVenta;
      document.getElementById("facturaFecha").textContent = venta.Fecha?.split("T")[0] || "N/D";
      document.getElementById("clienteNombre").textContent = venta.Cliente || "Cliente General";
      document.getElementById("empleadoNombre").textContent = venta.Empleado || "No disponible";

      const cuerpo = document.getElementById("detalleVenta");
      cuerpo.innerHTML = "";
      venta.Detalle.forEach(p => {
        cuerpo.innerHTML += `
          <tr>
            <td style="padding: 8px;">${p.NombreProducto}</td>
            <td style="padding: 8px;">C$ ${p.PrecioUnitario.toFixed(2)}</td>
            <td style="padding: 8px;">${p.Cantidad}</td>
            <td style="padding: 8px;">C$ ${(p.PrecioUnitario * p.Cantidad).toFixed(2)}</td>
          </tr>`;
      });

      document.getElementById("subtotal").textContent = `C$ ${venta.Subtotal.toFixed(2)}`;
      document.getElementById("descuento").textContent = `C$ ${venta.Descuento.toFixed(2)}`;
      document.getElementById("total").textContent = `C$ ${venta.Total.toFixed(2)}`;

      modalFactura.style.display = 'block';
    } catch (err) {
      console.error("❌ Error cargando factura:", err);
      mostrarAlerta("❌ No se pudo cargar la factura.");
    }
  }
});
