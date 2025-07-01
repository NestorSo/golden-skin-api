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
// // factura.js - Generación de factura PDF desde tabla de productos

// // Función principal que se ejecuta al cargar la página
// // Función para cargar los datos de la venta en el modal
// function cargarDatosVentaEnModal(venta) {
//   document.getElementById('facturaNumero').textContent = venta.idVenta;
//   document.getElementById('facturaFecha').textContent = venta.fechaVenta;
//   document.getElementById('clienteNombre').textContent = venta.nombreCliente;
//   document.getElementById('empleadoNombre').textContent = venta.nombreEmpleado;
  
//   // Cargar detalles de la venta
//   const detalleVenta = document.getElementById('detalleVenta');
//   detalleVenta.innerHTML = '';
  
//   // Aquí deberías hacer una llamada AJAX para obtener los detalles de la venta
//   // o pasarlos como parte del objeto venta
//   if (venta.detalles) {
//     let subtotal = 0;
//     venta.detalles.forEach(detalle => {
//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td>${detalle.nombreProducto}</td>
//         <td>${detalle.precioUnitario}</td>
//         <td>${detalle.cantidad}</td>
//         <td>${detalle.subtotal}</td>
//       `;
//       detalleVenta.appendChild(row);
//       subtotal += parseFloat(detalle.subtotal);
//     });
    
//     document.getElementById('subtotal').textContent = subtotal.toFixed(2);
//     document.getElementById('descuento').textContent = venta.descuento || '0.00';
//     document.getElementById('total').textContent = (subtotal - (venta.descuento || 0)).toFixed(2);
//   }
// }

// // Evento para mostrar el modal cuando se selecciona una venta
// document.addEventListener('DOMContentLoaded', function() {
//   const btnVerFactura = document.getElementById('btnVerFactura');
  
//   btnVerFactura.addEventListener('click', function() {
//     const ventaSeleccionada = obtenerVentaSeleccionada(); // Implementa esta función según tu código
    
//     if (ventaSeleccionada) {
//       cargarDatosVentaEnModal(ventaSeleccionada);
//       document.getElementById('modalFactura').style.display = 'block';
//     } else {
//       mostrarAlerta('Por favor seleccione una venta primero', 'error');
//     }
//   });
  
//   // Cerrar modal
//   document.getElementById('btnCerrarModal').addEventListener('click', function() {
//     document.getElementById('modalFactura').style.display = 'none';
//   });
// });

// // Función de ejemplo para obtener la venta seleccionada (debes adaptarla a tu código)
// function obtenerVentaSeleccionada() {
//   // Aquí debes implementar la lógica para obtener la venta seleccionada en la tabla
//   // Por ejemplo:
//   const filaSeleccionada = document.querySelector('#tablaVentasBody tr.selected');
//   if (!filaSeleccionada) return null;
  
//   return {
//     idVenta: filaSeleccionada.cells[0].textContent,
//     fechaVenta: filaSeleccionada.cells[1].textContent,
//     nombreEmpleado: filaSeleccionada.cells[2].textContent,
//     nombreCliente: filaSeleccionada.cells[3].textContent,
//     descuento: parseFloat(filaSeleccionada.cells[4].textContent),
//     // Aquí deberías incluir los detalles de la venta, posiblemente con una llamada AJAX
//     detalles: obtenerDetallesVenta(filaSeleccionada.cells[0].textContent)
//   };
// }

// // Función de ejemplo para obtener detalles (debes implementar la llamada real a tu API)
// function obtenerDetallesVenta(idVenta) {
//   // Esto es un ejemplo - implementa la llamada real a tu backend
//   return [
//     {
//       nombreProducto: "Producto 1",
//       precioUnitario: "50.00",
//       cantidad: 2,
//       subtotal: "100.00"
//     },
//     {
//       nombreProducto: "Producto 2",
//       precioUnitario: "30.00",
//       cantidad: 1,
//       subtotal: "30.00"
//     }
//   ];
// }























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