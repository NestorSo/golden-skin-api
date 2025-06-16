
//pedidos
btnPedido.addEventListener('click', async () => {
  if (carrito.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }

const usuario = JSON.parse(localStorage.getItem('usuario'));
if (!usuario || !usuario.IdCliente) {
  alert('Debes iniciar sesión para realizar un pedido.');
  return;
}

const payload = {
  clienteId: usuario.IdCliente,
  descripcion: 'Pedido web',
  productos: carrito.map(p => ({
    id: p.id,
    cantidad: p.quantity,
    precio: p.price
  }))
};



  try {
    const res = await fetch('/api/pedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    alert('✅ Pedido realizado. ID: ' + data.id);
    carrito = [];
    localStorage.removeItem('carrito');
    actualizarCarritoUI();
  } catch (err) {
    console.error('Error al enviar pedido:', err);
    alert('❌ Error al procesar pedido');
  }
});
