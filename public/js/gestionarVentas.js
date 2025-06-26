// gestionarVentas.js

document.addEventListener('DOMContentLoaded', () => {
  const API_URL = '/api/ventas';

  const tablaBody = document.getElementById('tablaVentasBody');
  const inputBuscar = document.querySelector('.search-input');
  const btnRegistrar = document.getElementById('nuevaVenta');
  const btnActualizar = document.getElementById('actualizarVenta');
  const btnEliminar = document.getElementById('desactivarVenta');
  const btnLimpiar = document.getElementById('limpiarVenta');

  let ventas = [];
  let ventaSeleccionada = null;

  btnRegistrar.onclick = registrarVenta;
  btnActualizar.onclick = actualizarVenta;
  btnEliminar.onclick = desactivarVenta;
  btnLimpiar.onclick = limpiarFormulario;
  inputBuscar.oninput = filtrarVentas;

  cargarVentas();

  async function cargarVentas() {
    try {
      const res = await fetch(API_URL);
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
      <td>${v.EsDelivery}</td>
    `;
    fila.addEventListener('click', () => {
      ventaSeleccionada = v;
      // Si necesitas cargar info al formulario, hazlo aquí
      document.getElementById('VentaId').value = v.IdVenta;
      document.getElementById('fecha-venta').value = v.FechaVenta?.split('T')[0];
    });
    tablaBody.appendChild(fila);
  });
}

  function filtrarVentas() {
    const texto = inputBuscar.value.toLowerCase();
    const filtradas = ventas.filter(v =>
      v.NombreProducto.toLowerCase().includes(texto) ||
      (v.Marca || '').toLowerCase().includes(texto) ||
      String(v.IdVenta).includes(texto)
    );
    renderTabla(filtradas);
  }

  async function registrarVenta() {
    const data = leerFormulario();
    if (!data) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: 1, // Esto debe ser dinámico
          empleadoId: 1, // Esto también
          productos: [
            { id: 1, cantidad: data.cantidad } // Solo demostrativo
          ]
        })
      });
      const result = await res.json();
      alert(result.mensaje);
      limpiarFormulario();
      cargarVentas();
    } catch (err) {
      console.error('❌ Error al registrar venta:', err);
      alert('❌ No se pudo registrar');
    }
  }

  async function actualizarVenta() {
    alert('🛠️ Actualización de ventas aún no implementada');
  }

  async function desactivarVenta() {
    alert('🛠️ Desactivación de ventas aún no implementada');
  }

  function leerFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const marca = document.getElementById('marca').value.trim();
    const cantidad = parseInt(document.getElementById('cantidad-vendida').value);
    const fecha = document.getElementById('fecha-venta').value;

    if (!nombre || !marca || isNaN(cantidad) || !fecha) {
      alert('⚠️ Por favor completa todos los campos');
      return null;
    }
    return { nombre, marca, cantidad, fecha };
  }

  function limpiarFormulario() {
    document.getElementById('nombre').value = '';
    document.getElementById('marca').value = '';
    document.getElementById('cantidad-vendida').value = '';
    document.getElementById('fecha-venta').value = '';
    document.getElementById('VentaId').value = '';
    ventaSeleccionada = null;
  }

  // Reportes
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
  function filtrarVentas() {
  const texto = inputBuscar.value.toLowerCase();
  const filtradas = ventas.filter(v =>
    String(v.IdVenta).includes(texto) ||
    v.Cliente.toLowerCase().includes(texto) ||
    v.Empleado.toLowerCase().includes(texto)
  );
  renderTabla(filtradas);
}

});
