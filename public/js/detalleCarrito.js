
document.addEventListener('DOMContentLoaded', () => {
  renderDetalleCarrito();

  document.getElementById('vaciarCarritoDetalle')?.addEventListener('click', () => {
    vaciarCarrito();                  // ← Vacía el carrito
    actualizarCarritoUI();           // ← Refresca el carrito flotante
    renderDetalleCarrito();          // ← Refresca la vista de detalle
    mostrarAlerta('🗑️ Carrito vaciado');
  });

  document.getElementById('realizarPedidoDetalle')?.addEventListener('click', async () => {
    const nombre = document.getElementById('nombreCliente').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const metodoPago = document.getElementById('metodoPago').value;

    if (!nombre || !direccion || !telefono || !metodoPago) {
      mostrarAlerta('❌ Por favor completa todos los campos de envío');
      return;
    }

    const datosEnvio = { nombre, direccion, telefono, metodoPago };
    await realizarPedido(datosEnvio); // ← Llama al del carrito.js

    // Actualiza ambas vistas
    actualizarCarritoUI();
    renderDetalleCarrito();
  });
});
// Después de mostrar alerta y vaciar:
actualizarCarritoUI(); // ← Asegura actualización desde cualquier lugar


async function renderDetalleCarrito() {
  const contenedor = document.getElementById('detalleProductos');
  const totalSpan = document.getElementById('totalDetalle');
  contenedor.innerHTML = '';

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p style="color:gray">Tu carrito está vacío.</p>';
    totalSpan.textContent = '$0.00';
    return;
  }

  let total = 0;
  for (const p of carrito) {
    let img = '/images/default.png';
    try {
      const res = await fetch(`/api/productos/imagen/${p.id}`);
      if (res.ok) img = await res.text();
    } catch {}

    const item = document.createElement('div');
    item.className = 'detalle-item';
    item.innerHTML = `
      <img src="${img}" alt="${p.title}">
      <div>
        <p><strong>${p.title}</strong></p>
        <p>Cantidad: ${p.quantity}</p>
        <p>Precio: $${p.price.toFixed(2)}</p>
        <p>Subtotal: $${(p.price * p.quantity).toFixed(2)}</p>
      </div>
    `;
    contenedor.appendChild(item);
    total += p.price * p.quantity;
  }

  totalSpan.textContent = `$${total.toFixed(2)}`;
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}
window.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (usuario) {
    document.getElementById('nombreCliente').value = usuario.nombre || '';
    document.getElementById('telefono').value = usuario.telefono || '';
    document.getElementById('direccion').value = usuario.direccion || '';
  }

  renderDetalleCarrito();
  // ...
});





// 🔁 Exponer funciones y variables globales
window.vaciarCarrito = function () {
  carrito = [];
  guardarCarrito();
};

window.realizarPedido = async function (datosEnvio) {
  if (carrito.length === 0) {
    mostrarAlerta('⚠️ Tu carrito está vacío');
    return;
  }

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || !usuario.id) {
    mostrarAlerta('❌ Debes iniciar sesión');
    return;
  }

  const payload = {
    clienteId: usuario.id,
    descripcion: `Pedido web - ${datosEnvio.metodoPago}`,
    productos: carrito.map(p => ({
      id: p.id,
      cantidad: p.quantity,
      precio: p.price
    }))
  };

  try {
    const res = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    mostrarAlerta('✅ Pedido realizado. ID: ' + data.id);
    carrito = [];
    guardarCarrito();
  } catch (err) {
    console.error('❌ Error al enviar pedido:', err);
    mostrarAlerta('❌ Error al procesar pedido');
  }
};
