const tipoReporte = document.getElementById("tipoReporte");
const filtrosExtras = document.getElementById("filtrosExtras");
const btnEjecutarReporte = document.getElementById("btnEjecutarReporte");

// Cambiar filtros según el tipo de reporte
tipoReporte.addEventListener("change", async () => {
  filtrosExtras.innerHTML = ''; // limpiar filtros

  const tipo = tipoReporte.value;

  if (tipo === "porFecha") {
    filtrosExtras.innerHTML = `
      <label>Desde: <input type="date" id="fechaInicio"></label>
      <label>Hasta: <input type="date" id="fechaFin"></label>
    `;
  }

if (tipo === "porEmpleado") {
    const empleados = await fetch("/api/empleados/todos").then(r => r.json());
    filtrosExtras.innerHTML = `
      <label>Empleado:
        <select id="filtroEmpleado">
          ${empleados.map(e => `
            <option value="${e.IdEmpleado}">${e.Nombre} ${e.Apellido}</option>
          `).join("")}
        </select>
      </label>
    `;
  }

  if (tipo === "porCliente") {
    const clientes = await fetch("/api/usuarios/clientes").then(r => r.json());
    filtrosExtras.innerHTML = `
      <label>Cliente:
        <select id="filtroCliente">
          ${clientes.map(c => `<option value="${c.IdUsuario}">${c.Nombre} ${c.Apellido}</option>`).join("")}
        </select>
      </label>
    `;
  }
});

// Ejecutar el reporte al hacer clic
btnEjecutarReporte.addEventListener("click", async () => {
  const tipo = tipoReporte.value;
const params = new URLSearchParams({ tipoReporte: tipo });

  if (tipo === "porFecha") {
    const desde = document.getElementById("fechaInicio")?.value;
    const hasta = document.getElementById("fechaFin")?.value;
    if (!desde || !hasta) return mostrarAlerta("⚠️ Seleccione fechas válidas");
    params.append("FechaInicio", desde);
    params.append("FechaFin", hasta);
  }

  if (tipo === "porEmpleado") {
    const id = document.getElementById("filtroEmpleado")?.value;
    if (!id) return mostrarAlerta("⚠️ Seleccione un empleado");
    params.append("IdEmpleado", id);
  }

  if (tipo === "porCliente") {
    const id = document.getElementById("filtroCliente")?.value;
    if (!id) return mostrarAlerta("⚠️ Seleccione un cliente");
    params.append("IdCliente", id);
  }

  try {
    const res = await fetch(`/api/reportes/ventas?${params.toString()}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return mostrarAlerta("⚠️ No se encontraron datos para este reporte");
    }

    const columnas = Object.keys(data[0]).map(key => ({
      header: key,
      key
    }));

    mostrarReporte({
      titulo: `Reporte: ${tipo}`,
      columnas,
      data
    });

  } catch (err) {
    console.error("❌ Error al generar el reporte:", err);
    mostrarAlerta("❌ No se pudo generar el reporte.");
  }
});

// Mostrar datos en el modal de reporte
function mostrarReporte({ titulo, columnas, data }) {
  const contenedor = document.getElementById("contenidoReporte");
  contenedor.innerHTML = `
    <h2 style="color:#C57A88; text-align:center;">${titulo}</h2>
    <table class="client-table" style="width: 100%; margin-top: 20px;">
      <thead>
        <tr>
          ${columnas.map(col => `<th>${col.header}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr>
            ${columnas.map(col => `<td>${row[col.key]}</td>`).join('')}
          </tr>`).join('')}
      </tbody>
    </table>
  `;

  document.getElementById("modalReporte").style.display = "block";
}

// Cerrar el modal
function cerrarReporte() {
  document.getElementById("modalReporte").style.display = "none";
}

// Descargar PDF
function descargarReportePDF() {
  const elemento = document.getElementById("contenidoReporte");
  const opciones = {
    margin: 0.5,
    filename: `reporte_ventas_${Date.now()}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
  };

  html2pdf().from(elemento).set(opciones).save();
}

// Imprimir
function imprimirReporte() {
  const contenido = document.getElementById("contenidoReporte").innerHTML;
  const ventana = window.open('', '', 'width=800,height=600');
  ventana.document.write(`<html><head><title>Reporte</title></head><body>${contenido}</body></html>`);
  ventana.document.close();
  ventana.print();
}

// Mostrar alertas simples
function mostrarAlerta(mensaje) {
  alert(mensaje); // Puedes reemplazarlo con SweetAlert u otro sistema
}

function abrirModalReporte() {
  document.getElementById("modalReporte").style.display = "block";
}
