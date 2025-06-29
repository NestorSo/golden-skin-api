// document.addEventListener('DOMContentLoaded', () => {
//   const API_VENTAS = '/api/ventas';
//   const API_PRODUCTOS = '/api/productos/todos?estado=1';
//   const API_CLIENTES = '/api/usuarios/clientes';


//   const tablaBody = document.getElementById('tablaVentasBody');
//   const btnRegistrar = document.getElementById('nuevaVenta');
//   const btnLimpiar = document.getElementById('limpiarVenta');
//   const selectProducto = document.getElementById('producto');
//   const selectCliente = document.getElementById('cliente');
//   const inputCantidad = document.getElementById('cantidad-vendida');
//   const inputEmpleado = document.getElementById('empleado');

//  let ventas = [];

//   btnRegistrar.onclick = registrarVenta;
//   btnLimpiar.onclick = limpiarFormulario;

//   cargarVentas();
//   cargarProductos();
//   cargarClientes();
//   cargarEmpleado();

//   async function cargarVentas() {
//     try {
//       const res = await fetch(API_VENTAS);
//       ventas = await res.json();
//       renderTabla(ventas);
//     } catch (err) {
//       console.error('❌ Error al cargar ventas:', err);
//       tablaBody.innerHTML = '<tr><td colspan="5">❌ Error al obtener ventas</td></tr>';
//     }
//   }

//   function renderTabla(lista) {
//     tablaBody.innerHTML = '';
//     lista.forEach(v => {
//       const fila = document.createElement('tr');
//       fila.innerHTML = `
//         <td>${v.IdVenta}</td>
//         <td>${v.FechaVenta?.split('T')[0]}</td>
//         <td>${v.Empleado}</td>
//         <td>${v.Cliente}</td>
//         <td>${v.Descuento}</td>
//         <td>${v.Total}</td>
//         <td>${v.EsDelivery ? 'Sí' : 'No'}</td>
//       `;
//       tablaBody.appendChild(fila);
//     });
//   }

//   async function cargarProductos() {
//     try {
//       const res = await fetch(API_PRODUCTOS);
//       const productos = await res.json();
//       selectProducto.innerHTML = '<option value="">Seleccione un producto</option>';
//       productos.forEach(p => {
//         const opt = document.createElement('option');
//         opt.value = p.IdProducto;
//         opt.textContent = p.NombreProducto;
//         selectProducto.appendChild(opt);
//       });
//     } catch (err) {
//       console.error('❌ Error al cargar productos:', err);
//     }
//   }

//   async function cargarClientes() {
//     try {
//       const res = await fetch(API_CLIENTES);
//       const clientes = await res.json();
//       selectCliente.innerHTML = '<option value="">Seleccione un cliente</option>';
//       clientes.forEach(c => {
//         const opt = document.createElement('option');
//         opt.value = c.IdUsuario;
//         opt.textContent = `${c.Nombre} ${c.Apellido}`;
//         selectCliente.appendChild(opt);
//       });
//     } catch (err) {
//       console.error('❌ Error al cargar clientes:', err);
//     }
//   }

//   async function cargarEmpleado() {
//   const usuario = JSON.parse(localStorage.getItem('usuario'));

//   if (usuario && usuario.IdUsuario) {
//     try {
//       const res = await fetch(`/api/empleados/por-usuario/${usuario.IdUsuario}`);
//       if (!res.ok) throw new Error('No se encontró empleado');

//       const data = await res.json(); // { IdEmpleado: 4 }

//       inputEmpleado.value = `${usuario.Nombre} ${usuario.Apellido}`;
//       inputEmpleado.dataset.id = data.IdEmpleado;

//     } catch (err) {
//       console.warn('⚠️ No se pudo obtener el ID del empleado', err);
//       inputEmpleado.value = 'Empleado no vinculado';
//     }
//   } else {
//     inputEmpleado.value = 'Empleado no cargado';
//   }
// }


//    async function registrarVenta() {
//     const clienteId = selectCliente.value;
//     const productoId = selectProducto.value;
//     const cantidad = parseInt(inputCantidad.value);
//     const empleadoId = inputEmpleado.dataset.id;

//     if (!clienteId || !productoId || !empleadoId || isNaN(cantidad) || cantidad <= 0) {
//       alert('⚠️ Por favor complete todos los campos correctamente');
//       return;
//     }

//     const datosVenta = {
//       idCliente: parseInt(clienteId),
//       idEmpleado: parseInt(empleadoId),
//       idProducto: parseInt(productoId),
//       cantidad: parseInt(cantidad)
//     };

//     console.log('🟨 Enviando datos de venta:', datosVenta);

//     try {
//       const res = await fetch(`${API_VENTAS}/tienda`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(datosVenta)
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         alert(result.mensaje || '❌ Error al registrar venta');
//         return;
//       }

//       alert(result.mensaje || '✅ Venta registrada');
//       limpiarFormulario();
//       cargarVentas();
//     } catch (err) {
//       console.error('❌ Error al registrar venta:', err);
//       alert('❌ No se pudo registrar la venta');
//     }
//   }

//   function limpiarFormulario() {
//     selectCliente.value = '';
//     selectProducto.value = '';
//     inputCantidad.value = '';
//   }

//   // Botones de reportes simulados
//   document.getElementById('generateReport').addEventListener('click', () => {
//     mostrarMensajeDescarga('✔ Reporte generado correctamente.');
//   });

//   document.getElementById('generateInvoice').addEventListener('click', () => {
//     mostrarMensajeDescarga('✔ Factura generada en formato PDF.');
//   });

//   function mostrarMensajeDescarga(texto) {
//     const msg = document.getElementById('downloadMessage');
//     msg.textContent = texto;
//     msg.classList.add('show');
//     setTimeout(() => msg.classList.remove('show'), 3000);
//   }
// });

// document.addEventListener('DOMContentLoaded', () => {
//   const API_VENTAS = '/api/ventas';
//   const API_PRODUCTOS = '/api/productos/todos?estado=1';
//   const API_CLIENTES = '/api/usuarios/clientes';

//   const tablaBody = document.getElementById('tablaVentasBody');
//   const btnRegistrar = document.getElementById('nuevaVenta');
//   const btnLimpiar = document.getElementById('limpiarVenta');
//   const selectProducto = document.getElementById('producto');
//   const selectCliente = document.getElementById('cliente');
//   const inputCantidad = document.getElementById('cantidad-vendida');
//   const inputEmpleado = document.getElementById('empleado');
//   const chkSoloDelivery = document.getElementById('verSoloDelivery');

//   let ventas = [];

//   btnRegistrar.onclick = registrarVenta;
//   btnLimpiar.onclick = limpiarFormulario;


//   cargarVentas();
//   cargarProductos();
//   cargarClientes();
//   cargarEmpleado();

//  chkSoloDelivery.addEventListener('change', cargarVentas);

// async function cargarVentas() {
//   try {
//     const soloDelivery = chkSoloDelivery.checked;
//     const res = await fetch(`/api/ventas?soloDelivery=${soloDelivery}`);
//     const data = await res.json();

//     if (!Array.isArray(data)) {
//       console.error('❌ Respuesta inesperada:', data);
//       tablaBody.innerHTML = '<tr><td colspan="7">❌ Error inesperado</td></tr>';
//       return;
//     }

//     ventas = data;
//     renderTabla(ventas);
//   } catch (err) {
//     console.error('❌ Error al cargar ventas:', err);
//     tablaBody.innerHTML = '<tr><td colspan="7">❌ Error al obtener ventas</td></tr>';
//   }
// }


//   function renderTabla(lista) {
//     tablaBody.innerHTML = '';
//     lista.forEach(venta => {
//       const fila = document.createElement('tr');
//       fila.innerHTML = `
//         <td>${venta.IdVenta}</td>
//         <td>${venta.FechaVenta?.split('T')[0]}</td>
//         <td>${venta.Empleado}</td>
//         <td>${venta.Cliente}</td>
//         <td>${venta.Descuento}</td>
//         <td>${venta.Total}</td>
//         <td>${venta.EsDelivery}</td>
//       `;

//       fila.addEventListener('click', () => {
//         window.ventaSeleccionada = venta.IdVenta;
//         document.querySelectorAll('#tablaVentasBody tr').forEach(tr => tr.classList.remove('selected'));
//         fila.classList.add('selected');
//       });

//       tablaBody.appendChild(fila);
//     });
//   }

//   async function cargarProductos() {
//     try {
//       const res = await fetch(API_PRODUCTOS);
//       const productos = await res.json();
//       selectProducto.innerHTML = '<option value="">Seleccione un producto</option>';
//       productos.forEach(p => {
//         const opt = document.createElement('option');
//         opt.value = p.IdProducto;
//         opt.textContent = p.NombreProducto;
//         selectProducto.appendChild(opt);
//       });
//     } catch (err) {
//       console.error('❌ Error al cargar productos:', err);
//     }
//   }

//   async function cargarClientes() {
//     try {
//       const res = await fetch(API_CLIENTES);
//       const clientes = await res.json();
//       selectCliente.innerHTML = '<option value="">Seleccione un cliente</option>';
//       clientes.forEach(c => {
//         const opt = document.createElement('option');
//         opt.value = c.IdUsuario;
//         opt.textContent = `${c.Nombre} ${c.Apellido}`;
//         selectCliente.appendChild(opt);
//       });
//     } catch (err) {
//       console.error('❌ Error al cargar clientes:', err);
//     }
//   }

//   async function cargarEmpleado() {
//     const usuario = JSON.parse(localStorage.getItem('usuario'));

//     if (usuario && usuario.IdUsuario) {
//       try {
//         const res = await fetch(`/api/empleados/por-usuario/${usuario.IdUsuario}`);
//         if (!res.ok) throw new Error('No se encontró empleado');

//         const data = await res.json();
//         inputEmpleado.value = `${usuario.Nombre} ${usuario.Apellido}`;
//         inputEmpleado.dataset.id = data.IdEmpleado;
//       } catch (err) {
//         console.warn('⚠️ No se pudo obtener el ID del empleado', err);
//         inputEmpleado.value = 'Empleado no vinculado';
//       }
//     } else {
//       inputEmpleado.value = 'Empleado no cargado';
//     }
//   }

//   async function registrarVenta() {
//     const clienteId = selectCliente.value;
//     const productoId = selectProducto.value;
//     const cantidad = parseInt(inputCantidad.value);
//     const empleadoId = inputEmpleado.dataset.id;

//     if (!clienteId || !productoId || !empleadoId || isNaN(cantidad) || cantidad <= 0) {
//       alert('⚠️ Por favor complete todos los campos correctamente');
//       return;
//     }

//     const datosVenta = {
//       idCliente: parseInt(clienteId),
//       idEmpleado: parseInt(empleadoId),
//       idProducto: parseInt(productoId),
//       cantidad: cantidad
//     };

//     console.log('🟨 Enviando datos de venta:', datosVenta);

//     try {
//       const res = await fetch(`${API_VENTAS}/tienda`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(datosVenta)
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         alert(result.mensaje || '❌ Error al registrar venta');
//         return;
//       }

//       alert(result.mensaje || '✅ Venta registrada');
//       limpiarFormulario();
//       cargarVentas();
//     } catch (err) {
//       console.error('❌ Error al registrar venta:', err);
//       alert('❌ No se pudo registrar la venta');
//     }
//   }

//   function limpiarFormulario() {
//     selectCliente.value = '';
//     selectProducto.value = '';
//     inputCantidad.value = '';
//   }

//   document.getElementById('generateReport').addEventListener('click', () => {
//     mostrarMensajeDescarga('✔ Reporte generado correctamente.');
//   });

//   document.getElementById('generateInvoice').addEventListener('click', () => {
//     if (!window.ventaSeleccionada) {
//       alert('⚠️ Selecciona una venta de la tabla para generar la factura.');
//       return;
//     }
//     mostrarMensajeDescarga(`✔ Factura de venta #${window.ventaSeleccionada} generada.`);
//   });

//   function mostrarMensajeDescarga(texto) {
//     const msg = document.getElementById('downloadMessage');
//     msg.textContent = texto;
//     msg.classList.add('show');
//     setTimeout(() => msg.classList.remove('show'), 3000);
//   }
// });



// gestionarVentas.js
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



let ventas = [];

btnRegistrar.onclick = registrarVenta;
btnLimpiar.onclick = limpiarFormulario;
chkSoloDelivery.addEventListener('change', cargarVentas);

btnVerFactura?.addEventListener('click', () => {
if (!window.ventaSeleccionada) return mostrarAlerta('⚠️ Selecciona una venta.');
  cargarFacturaVenta(window.ventaSeleccionada);
});

btnCerrarModal?.addEventListener('click', () => {
  modalFactura.style.display = 'none';
});

document.getElementById('btnDescargarFactura').addEventListener('click', () => {
  const original = document.getElementById('facturaVenta');

  // Clonar factura sin estilos de modal
  const copia = original.cloneNode(true);
  copia.style.display = 'block';
  copia.style.position = 'static';
  copia.style.margin = '0 auto';
  copia.style.backgroundColor = '#fff';
  copia.style.color = '#000';
  copia.style.fontFamily = 'Arial';

  // Contenedor temporal oculto
  const contenedorTemporal = document.createElement('div');
  contenedorTemporal.style.position = 'absolute';
  contenedorTemporal.style.left = '-9999px';
  contenedorTemporal.appendChild(copia);
  document.body.appendChild(contenedorTemporal);

  const opciones = {
    margin: 0.5,
    filename: `Factura-${new Date().toISOString().slice(0, 10)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opciones).from(copia).save().then(() => {
    document.body.removeChild(contenedorTemporal);
  });
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

cargarVentas();
cargarProductos();
cargarClientes();
cargarEmpleado();

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

async function registrarVenta() {
  const clienteId = selectCliente.value;
  const productoId = selectProducto.value;
  const cantidad = parseInt(inputCantidad.value);
  const empleadoId = inputEmpleado.dataset.id;

if (!clienteId || !productoId || !empleadoId || isNaN(cantidad) || cantidad <= 0) {
  return mostrarAlerta('⚠️ Complete todos los campos correctamente');
}



  const datosVenta = {
    idCliente: parseInt(clienteId),
    idEmpleado: parseInt(empleadoId),
    idProducto: parseInt(productoId),
    cantidad
  };

  try {
    const res = await fetch(`${API_VENTAS}/tienda`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosVenta)
    });

    const result = await res.json();

if (!res.ok) return mostrarAlerta(result.mensaje || '❌ Error al registrar venta');

mostrarAlerta(result.mensaje || '✅ Venta registrada');

    limpiarFormulario();
    cargarVentas();
  } catch (err) {
    console.error('❌ Error al registrar venta:', err);
mostrarAlerta('❌ No se pudo registrar la venta');
  }
}

function limpiarFormulario() {
  selectCliente.value = '';
  selectProducto.value = '';
  inputCantidad.value = '';
  window.ventaSeleccionada = null;
  document.querySelectorAll('#tablaVentasBody tr').forEach(tr => tr.classList.remove('selected'));
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
