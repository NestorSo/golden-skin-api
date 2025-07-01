function mostrarReporte(titulo, contenidoHTML) {
  document.getElementById('reporteTitulo').textContent = titulo;
  document.getElementById('reporteHTML').innerHTML = contenidoHTML;
  document.getElementById('modalReporte').style.display = 'block';
}

function cerrarReporte() {
  document.getElementById('modalReporte').style.display = 'none';
}

function descargarReportePDF() {
  const original = document.getElementById('reporteContenido');
  const copia = original.cloneNode(true);
  copia.style.display = 'block';

  const temp = document.createElement('div');
  temp.style.position = 'absolute';
  temp.style.left = '-9999px';
  temp.appendChild(copia);
  document.body.appendChild(temp);

  const options = {
    margin: 0.5,
    filename: `Reporte-${new Date().toISOString().slice(0, 10)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(options).from(copia).save().then(() => {
    document.body.removeChild(temp);
  });
}

function imprimirReporte() {
  const contenido = document.getElementById('reporteContenido').innerHTML;
  const ventana = window.open('', '', 'width=800,height=600');
  ventana.document.write(`<html><head><title>Reporte</title></head><body>${contenido}</body></html>`);
  ventana.document.close();
  ventana.focus();
  ventana.print();
  ventana.close();
}
