// Función para descargar el PDF de la venta seleccionada
function descargarPDFVenta() {
  // Verificar si el modal de factura está visible
  const modalFactura = document.getElementById('modalFactura');
  if (modalFactura.style.display === 'none' || modalFactura.style.display === '') {
    mostrarAlerta('Por favor seleccione una venta y visualice la factura primero', 'error');
    return;
  }

  // Obtener los datos del modal de factura
  const facturaData = {
    numero: document.getElementById('facturaNumero').textContent,
    fecha: document.getElementById('facturaFecha').textContent,
    cliente: document.getElementById('clienteNombre').textContent,
    empleado: document.getElementById('empleadoNombre').textContent,
    detalles: [],
    subtotal: document.getElementById('subtotal').textContent,
    descuento: document.getElementById('descuento').textContent,
    total: document.getElementById('total').textContent
  };

  // Obtener los detalles de los productos
  const filasDetalle = document.querySelectorAll('#detalleVenta tr');
  filasDetalle.forEach(fila => {
    const celdas = fila.querySelectorAll('td');
    if (celdas.length >= 4) {
      facturaData.detalles.push({
        producto: celdas[0].textContent,
        precio: celdas[1].textContent,
        cantidad: celdas[2].textContent,
        subtotal: celdas[3].textContent
      });
    }
  });

  // Crear el contenido HTML para el PDF
  const contenidoPDF = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { color: #CF818E; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .info-venta { margin-bottom: 20px; }
        .info-venta p { margin: 5px 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background-color: #CF818E; color: white; padding: 10px; text-align: left; }
        td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
        .totales { text-align: right; margin-top: 20px; }
        .totales p { margin: 8px 0; font-size: 16px; }
        .total-final { font-size: 18px; font-weight: bold; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">Golden Skin - Factura de Venta</div>
      </div>
      
      <div class="info-venta">
        <p><strong>No. Factura:</strong> ${facturaData.numero}</p>
        <p><strong>Fecha:</strong> ${facturaData.fecha}</p>
        <p><strong>Cliente:</strong> ${facturaData.cliente}</p>
        <p><strong>Empleado:</strong> ${facturaData.empleado}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio Unitario</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${facturaData.detalles.map(detalle => `
            <tr>
              <td>${detalle.producto}</td>
              <td>${detalle.precio}</td>
              <td>${detalle.cantidad}</td>
              <td>${detalle.subtotal}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="totales">
        <p><strong>Subtotal:</strong> ${facturaData.subtotal}</p>
        <p><strong>Descuento:</strong> ${facturaData.descuento}</p>
        <p class="total-final"><strong>Total a Pagar:</strong> ${facturaData.total}</p>
      </div>
      
      <div class="footer">
        <p>Gracias por su compra - Golden Skin</p>
        <p>${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `;

  // Configuración para html2pdf
  const opt = {
    margin: 10,
    filename: `Factura_${facturaData.numero}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Crear un elemento temporal para generar el PDF
  const element = document.createElement('div');
  element.innerHTML = contenidoPDF;
  document.body.appendChild(element);

  // Generar el PDF
  html2pdf().set(opt).from(element).save().then(() => {
    document.body.removeChild(element);
  });
}

// Asignar el evento al botón de descargar PDF del modal
document.addEventListener('DOMContentLoaded', function() {
  const btnDescargarPDF = document.getElementById('btnDescargarFactura');
  if (btnDescargarPDF) {
    btnDescargarPDF.addEventListener('click', descargarPDFVenta);
  }
});

// Función auxiliar para mostrar alertas (debes tenerla implementada)
function mostrarAlerta(mensaje, tipo) {
  // Implementación dependiente de tu sistema de alertas
  console.log(`[${tipo}] ${mensaje}`);
  alert(mensaje); // Esto es temporal, usa tu sistema real de alertas
}