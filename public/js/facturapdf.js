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

// Función para formatear la fecha como DD/MM/AAAA
const btnDescargarFactura = document.getElementById('btnDescargarFactura');
document.getElementById('btnDescargarFactura').addEventListener('click', () => {
    generarFacturaPDF();
    btnDescargarFactura.style.display = 'none'; // Ocultar botón mientras se genera el PDF
    setTimeout(() => {
        btnDescargarFactura.style.display = 'inline-block'; // Mostrar botón después de generar el PDF
    }, 1000); // Esperar 1 segundo antes de mostrar el botón nuevamente
    
    
});
function obtenerFechaActual() {
  const ahora = new Date();
  const dia = ahora.getDate().toString().padStart(2, '0');
  const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
  const año = ahora.getFullYear();
  return `${dia}/${mes}/${año}`;
}

// Función para generar la factura PDF
function generarFacturaPDF() {
  const facturaVisual = document.getElementById('facturaVisual');
  const btnDescargar = facturaVisual.querySelector('button');
  
  btnDescargar.style.display = 'none';
  
  const opt = {
    margin: 10,
    filename: 'factura_goldenskin.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(facturaVisual).save().then(() => {
    btnDescargar.style.display = 'inline-block';
  });
}

// Función para cargar datos en la factura
function cargarDatosFactura(productos, empleado, cliente, descuento = 0) {
  // Establecer fecha actual
  document.getElementById('factura-fecha').textContent = obtenerFechaActual();
  
  // Generar un ID de factura único basado en la fecha/hora
  const facturaId = 'F-' + new Date().getTime().toString().slice(-6);
  document.getElementById('factura-id').textContent = facturaId;
  
  // Datos de empleado y cliente
  document.getElementById('factura-empleado').textContent = empleado;
  document.getElementById('factura-cliente').textContent = cliente;
  
  // Detalles de productos
  const detallesContainer = document.getElementById('factura-detalles');
  detallesContainer.innerHTML = '';
  
  let subtotal = 0;
  
  productos.forEach(producto => {
    const subtotalProducto = producto.precio * producto.cantidad;
    subtotal += subtotalProducto;
    
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td style="padding: 8px; border: 1px solid #ccc;">${producto.NombreProducto}</td>
      <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${producto.cantidad}</td>
      <td style="padding: 8px; border: 1px solid #ccc; text-align: right;">C$ ${producto.Precio.toFixed(2)}</td>
      <td style="padding: 8px; border: 1px solid #ccc; text-align: right;">C$ ${subtotalProducto.toFixed(2)}</td>
    `;
    detallesContainer.appendChild(fila);
  });
  
  // Calcular totales
  const total = subtotal - descuento;
  
  document.getElementById('factura-subtotal').textContent = subtotal.toFixed(2);
  document.getElementById('factura-descuento').textContent = descuento.toFixed(2);
  document.getElementById('factura-total').textContent = total.toFixed(2);
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