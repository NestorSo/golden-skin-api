// Roles con filtro
// ===================

document.addEventListener("DOMContentLoaded", () => {
  const nombreRolInput = document.getElementById("nombreRol");
  const idRolInput = document.getElementById("idRol");
  const tablaBody = document.getElementById("tablaRolesBody");
  const verInactivosCheckbox = document.getElementById("verInactivos");

  const btnInsertar = document.getElementById("btnInsertarRol");
  const btnActualizar = document.getElementById("btnActualizarRol");
  const btnEliminar = document.getElementById("btnEliminarRol");
  const btnReactivar = document.getElementById("reactivarRol");
  const btnLimpiar = document.getElementById("btnLimpiarRol");
  const btnBuscar = document.getElementById("btnBuscarRol");

  const API_URL = "http://localhost:3000/api/roles";

  const limpiarFormulario = () => {
    nombreRolInput.value = "";
    idRolInput.value = "";
  };

  const cargarRoles = async (inactivos = false) => {
    try {
      const estado = inactivos ? 0 : 1;
      const res = await fetch(`${API_URL}/listar/${estado}`);
      const roles = await res.json();

      tablaBody.innerHTML = "";
      roles.forEach((rol) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${rol.IdRol}</td>
          <td>${rol.NombreRol}</td>
        `;
        fila.addEventListener("click", () => {
          idRolInput.value = rol.IdRol;
          nombreRolInput.value = rol.NombreRol;
        });
        tablaBody.appendChild(fila);
      });
    } catch (error) {
      console.error("❌ Error al cargar roles:", error);
    }
  };

  verInactivosCheckbox.addEventListener("change", () => {
    cargarRoles(verInactivosCheckbox.checked);
  });

  btnInsertar.addEventListener("click", async () => {
    const nombre = nombreRolInput.value.trim();
    if (!nombre) return alert("⚠️ Debes ingresar un nombre de rol.");

    const privilegios = prompt("🔐 Ingresa los privilegios separados por ';'").trim();
    if (!privilegios) return alert("⚠️ Debes ingresar al menos un privilegio.");

    try {
      const res = await fetch(`${API_URL}/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreRol: nombre, privilegios }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.mensaje);
        limpiarFormulario();
        cargarRoles();
      } else {
        alert(data.error || "❌ Error al crear rol.");
      }
    } catch (err) {
      console.error("❌ Error:", err);
    }
  });

  btnActualizar.addEventListener("click", async () => {
    const id = idRolInput.value;
    const nuevoNombre = nombreRolInput.value.trim();
    if (!id || !nuevoNombre) return alert("⚠️ Completa todos los campos.");

    try {
      const res = await fetch(`${API_URL}/actualizar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nuevoNombre }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.mensaje);
        limpiarFormulario();
        cargarRoles();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("❌ Error:", err);
    }
  });

  btnEliminar.addEventListener("click", async () => {
    const id = idRolInput.value;
    if (!id) return alert("⚠️ Selecciona un rol para eliminar.");

    if (!confirm("❗¿Estás seguro de eliminar este rol?")) return;

    try {
      const res = await fetch(`${API_URL}/estado/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: 0 }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.mensaje);
        limpiarFormulario();
        cargarRoles();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("❌ Error:", err);
    }
  });

  btnReactivar.addEventListener("click", async () => {
    const id = idRolInput.value;
    if (!id) return alert("⚠️ Selecciona un rol para reactivar.");

    try {
      const res = await fetch(`${API_URL}/estado/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: 1 }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.mensaje);
        limpiarFormulario();
        cargarRoles();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("❌ Error:", err);
    }
  });

  btnBuscar.addEventListener("click", async () => {
    const texto = document.getElementById("busquedaRol").value.trim();
    if (!texto) return cargarRoles(verInactivosCheckbox.checked);

    try {
      const res = await fetch(`${API_URL}/buscar?texto=${encodeURIComponent(texto)}`);
      const roles = await res.json();

      tablaBody.innerHTML = "";
      roles.forEach((rol) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${rol.IdRol}</td>
          <td>${rol.NombreRol}</td>
        `;
        fila.addEventListener("click", () => {
          idRolInput.value = rol.IdRol;
          nombreRolInput.value = rol.NombreRol;
        });
        tablaBody.appendChild(fila);
      });
    } catch (err) {
      console.error("❌ Error al buscar roles:", err);
    }
  });

  btnLimpiar.addEventListener("click", limpiarFormulario);

  cargarRoles();
});
