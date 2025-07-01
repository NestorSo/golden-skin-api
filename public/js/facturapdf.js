{/* 
function generarFacturaPDF() {
  // Seleccionar el elemento que contiene la factura
  const element = document.getElementById('facturaVisual');
  const facturaVisual = document.getElementById('facturaVisual');
  const btnDescargar = facturaVisual.querySelector('button');
  
  // Configuración para html2pdf
  const opt = {
    margin: 10,
    filename: 'factura_goldenskin.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Generar PDF
  html2pdf().from(element).set(opt).save();
} */}
{// // Función para formatear la fecha como DD/MM/AAAA
// function obtenerFechaActual() {
//   const ahora = new Date();
//   const dia = ahora.getDate().toString().padStart(2, '0');
//   const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
//   const año = ahora.getFullYear();
//   return `${dia}/${mes}/${año}`;
// }

// // Función para generar la factura PDF
// function generarFacturaPDF() {
//   const facturaVisual = document.getElementById('modalFactura');
//   const btnDescargar = facturaVisual.querySelector('button');
  
//   btnDescargar.style.display = 'none';
  
//   const opt = {
//     margin: 10,
//     filename: 'factura_goldenskin.pdf',
//     image: { type: 'jpeg', quality: 0.98 },
//     html2canvas: { scale: 2 },
//     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
//   };

//   html2pdf().set(opt).from(facturaVisual).save().then(() => 
//     {
//     btnDescargar.style.display = 'inline-block';
//   });
// }

// // Función para cargar datos en la factura
// function cargarDatosFactura(productos, empleado, cliente, descuento = 0) {
//   // Establecer fecha actual
//   document.getElementById('factura-fecha').textContent = obtenerFechaActual();
  
//   // Generar un ID de factura único basado en la fecha/hora
//   const facturaId = 'F-' + new Date().getTime().toString().slice(-6);
//   document.getElementById('factura-id').textContent = facturaId;
  
//   // Datos de empleado y cliente
//   document.getElementById('factura-empleado').textContent = empleado;
//   document.getElementById('factura-cliente').textContent = cliente;
  
//   // Detalles de productos
//   const detallesContainer = document.getElementById('factura-detalles');
//   detallesContainer.innerHTML = '';
  
//   let subtotal = 0;
  
//   productos.forEach(producto => {
//     const subtotalProducto = producto.precio * producto.cantidad;
//     subtotal += subtotalProducto;
    
//     const fila = document.createElement('tr');
//     fila.innerHTML = `
//       <td style="padding: 8px; border: 1px solid #ccc;">${producto.NombreProducto}</td>
//       <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${producto.cantidad}</td>
//       <td style="padding: 8px; border: 1px solid #ccc; text-align: right;">C$ ${producto.Precio.toFixed(2)}</td>
//       <td style="padding: 8px; border: 1px solid #ccc; text-align: right;">C$ ${subtotalProducto.toFixed(2)}</td>
//     `;
//     detallesContainer.appendChild(fila);
//   });
  
//   // Calcular totales
//   const total = subtotal - descuento;
  
//   document.getElementById('factura-subtotal').textContent = subtotal.toFixed(2);
//   document.getElementById('factura-descuento').textContent = descuento.toFixed(2);
//   document.getElementById('factura-total').textContent = total.toFixed(2);
// 
}

/***********************PARA EL MODAL***************************/
/* // Función para formatear la fecha como DD/MM/AAAA
function obtenerFechaActual() {
  const ahora = new Date();
  const dia = ahora.getDate().toString().padStart(2, '0');
  const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
  const año = ahora.getFullYear();
  return `${dia}/${mes}/${año}`;
}

// Función para generar la factura PDF
function generarFacturaPDF() {
  const facturaVisual = document.getElementById('facturaVenta');
  const btnDescargar = document.getElementById('btnDescargarFactura');
  
  btnDescargar.style.display = 'none';
  
  const opt = {
    margin: 10,
    filename: 'factura_goldenskin.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      windowWidth: document.getElementById('facturaVenta').scrollWidth
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(facturaVisual).save().then(() => {
    btnDescargar.style.display = 'inline-block';
  });
}

// Función para cargar datos en la factura
function cargarDatosFactura(productos, empleado, cliente, descuento = 0) {
  // Establecer fecha actual
  document.getElementById('facturaFecha').textContent = obtenerFechaActual();
  
  // Generar un ID de factura único basado en la fecha/hora
  const facturaId = 'F-' + new Date().getTime().toString().slice(-6);
  document.getElementById('facturaNumero').textContent = facturaId;
  
  // Datos de empleado y cliente
  document.getElementById('empleadoNombre').textContent = empleado;
  document.getElementById('clienteNombre').textContent = cliente;
  
  // Detalles de productos
  const detallesContainer = document.getElementById('detalleVenta');
  detallesContainer.innerHTML = '';
  
  let subtotal = 0;
  
  productos.forEach(producto => {
    const subtotalProducto = producto.Precio * producto.cantidad;
    subtotal += subtotalProducto;
    
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td style="padding: 8px; border: 1px solid #ccc;">${producto.NombreProducto}</td>
      <td style="padding: 8px; border: 1px solid #ccc; text-align: right;">C$ ${producto.Precio.toFixed(2)}</td>
      <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${producto.cantidad}</td>
      <td style="padding: 8px; border: 1px solid #ccc; text-align: right;">C$ ${subtotalProducto.toFixed(2)}</td>
    `;
    detallesContainer.appendChild(fila);
  });
  
  // Calcular totales
  const total = subtotal - descuento;
  
  document.getElementById('subtotal').textContent = `C$ ${subtotal.toFixed(2)}`;
  document.getElementById('descuento').textContent = `C$ ${descuento.toFixed(2)}`;
  document.getElementById('total').textContent = `C$ ${total.toFixed(2)}`;
  
  // Conectar eventos de los botones
  document.getElementById('btnDescargarFactura').addEventListener('click', generarFacturaPDF);
  document.getElementById('btnImprimirFactura').addEventListener('click', function() {
    window.print();
  });
}

// 1. Mostrar el modal
document.getElementById('modalFactura').style.display = 'block';

// 2. Cargar los datos
cargarDatosFactura(
  arrayDeProductos,
  nombreEmpleado,
  nombreCliente,
  montoDescuento
);

//Para cerrar el modal
document.getElementById('btnCerrarModal').addEventListener('click', function() {
  document.getElementById('modalFactura').style.display = 'none';
});
 */





/***********************PARA EL MODAL***************************/
// Función para formatear la fecha como DD/MM/AAAA
function obtenerFechaActual() {
  const ahora = new Date();
  const dia = ahora.getDate().toString().padStart(2, '0');
  const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
  const año = ahora.getFullYear();
  return `${dia}/${mes}/${año}`;
}

// Función para generar la factura PDF
function generarFacturaPDF() {
  const facturaVisual = document.getElementById('facturaVenta');
  const btnDescargar = document.getElementById('btnDescargarFactura');
  
  // Deshabilitar botones temporalmente
  btnDescargar.disabled = true;
  document.getElementById('btnImprimirFactura').disabled = true;
  
  const opt = {
    margin: 10,
    filename: `factura_${document.getElementById('facturaNumero').textContent}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      windowWidth: document.getElementById('facturaVenta').scrollWidth
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(facturaVisual).save().finally(() => {
    // Rehabilitar botones después de generar el PDF
    btnDescargar.disabled = false;
    document.getElementById('btnImprimirFactura').disabled = false;
  });
}

// Función para cargar datos en la factura
function cargarDatosFactura(datosVenta) {
  // Establecer fecha actual
  document.getElementById('facturaFecha').textContent = obtenerFechaActual();
  
  // Datos de la factura
  document.getElementById('facturaNumero').textContent = datosVenta.numeroFactura || `F-${Date.now().toString().slice(-6)}`;
  document.getElementById('empleadoNombre').textContent = datosVenta.empleado;
  document.getElementById('clienteNombre').textContent = datosVenta.cliente;
  
  // Detalles de productos
  const detallesContainer = document.getElementById('detalleVenta');
  detallesContainer.innerHTML = '';
  
  let subtotal = 0;
  
  datosVenta.productos.forEach(producto => {
    const subtotalProducto = producto.Precio * producto.cantidad;
    subtotal += subtotalProducto;
    
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td style="padding: 8px; border: 1px solid #ccc;">${producto.NombreProducto}</td>
      <td style="padding: 8px; border: 1px solid #ccc; text-align: right;">C$ ${producto.Precio.toFixed(2)}</td>
      <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${producto.cantidad}</td>
      <td style="padding: 8px; border: 1px solid #ccc; text-align: right;">C$ ${subtotalProducto.toFixed(2)}</td>
    `;
    detallesContainer.appendChild(fila);
  });
  
  // Calcular totales
  const descuento = datosVenta.descuento || 0;
  const total = subtotal - descuento;
  
  document.getElementById('subtotal').textContent = `C$ ${subtotal.toFixed(2)}`;
  document.getElementById('descuento').textContent = `C$ ${descuento.toFixed(2)}`;
  document.getElementById('total').textContent = `C$ ${total.toFixed(2)}`;
}

// Función para mostrar el modal de factura
function mostrarFactura(datosVenta) {
  // Cargar los datos en la factura
  cargarDatosFactura(datosVenta);
  
  // Mostrar el modal
  document.getElementById('modalFactura').style.display = 'block';
  
  // Configurar eventos de los botones (evitando duplicados)
  const btnDescargar = document.getElementById('btnDescargarFactura');
  const btnImprimir = document.getElementById('btnImprimirFactura');
  
  // Clonar y reemplazar los botones para eliminar event listeners previos
  btnDescargar.replaceWith(btnDescargar.cloneNode(true));
  btnImprimir.replaceWith(btnImprimir.cloneNode(true));
  
  // Agregar nuevos event listeners
  document.getElementById('btnDescargarFactura').addEventListener('click', generarFacturaPDF);
  document.getElementById('btnImprimirFactura').addEventListener('click', function() {
    window.print();
  });
}

// Función para cerrar el modal de factura
function cerrarModalFactura() {
  document.getElementById('modalFactura').style.display = 'none';
}
















// Ejemplo de cómo cargar datos reales desde tu aplicación
// function cargarDatosReales(datosFactura) {
//   // Datos de la factura
//   document.getElementById('factura-id').textContent = datosFactura.numero;
//   document.getElementById('factura-fecha').textContent = datosFactura.fecha;
//   document.getElementById('factura-empleado').textContent = datosFactura.empleado;
//   document.getElementById('factura-cliente').textContent = datosFactura.cliente;
  
//   // Detalles de los productos
//   const detallesContainer = document.getElementById('factura-detalles');
//   detallesContainer.innerHTML = '';
  
//   let subtotal = 0;
  
//   datosFactura.productos.forEach(producto => {
//     const subtotalProducto = producto.precio * producto.cantidad;
//     subtotal += subtotalProducto;
    
//     const fila = document.createElement('tr');
//     fila.innerHTML = `
//       <td style="padding: 8px; border: 1px solid #ccc;">${producto.nombre}</td>
//       <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${producto.cantidad}</td>
//       <td style="padding: 8px; border: 1px solid #ccc; text-align: right;">C$ ${producto.precio.toFixed(2)}</td>
//       <td style="padding: 8px; border: 1px solid #ccc; text-align: right;">C$ ${subtotalProducto.toFixed(2)}</td>
//     `;
//     detallesContainer.appendChild(fila);
//   });
  
//   // Totales
//   const descuento = datosFactura.descuento || 0;
//   const total = subtotal - descuento;
  
//   document.getElementById('factura-subtotal').textContent = subtotal.toFixed(2);
//   document.getElementById('factura-descuento').textContent = descuento.toFixed(2);
//   document.getElementById('factura-total').textContent = total.toFixed(2);
// }