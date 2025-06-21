// Carrito de compras
const cartCount = document.getElementById('cartCount');
const contentProducts = document.getElementById('contentProducts');
const totalElement = document.getElementById('total');
const cartPanel = document.getElementById('cartPanel');
const toggleCartBtn = document.getElementById('toggleCart');
const btnEmpty = document.getElementById('emptyCart');
const btnPedido = document.getElementById('realizarPedido');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Mostrar/Ocultar carrito
toggleCartBtn.addEventListener('click', () => {
  cartPanel.classList.toggle('active');
});

// Vaciar carrito
btnEmpty.addEventListener('click', () => {
  carrito = [];
  actualizarCarritoUI();
  mostrarAlerta('🗑️ Carrito vaciado');
});

// Realizar pedido
btnPedido.addEventListener('click', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario) {
    mostrarAlerta('❌ Debes iniciar sesión para realizar un pedido.');
    return;
  }

  if (carrito.length === 0) {
    mostrarAlerta('⚠️ Tu carrito está vacío.');
    return;
  }

  // Aquí puedes hacer un POST al backend
  mostrarAlerta('✅ Pedido realizado correctamente.');
  carrito = [];
  actualizarCarritoUI();
});

// Agregar producto
function agregarAlCarrito(idProducto) {
  const producto = productosCargados.find(p => p.IdProducto == idProducto);
  if (!producto) return;

  const existente = carrito.find(p => p.id == idProducto);
  if (existente) {
    existente.quantity++;
  } else {
    carrito.push({
      id: idProducto,
      title: producto.NombreProducto,
      price: producto.Precio,
      img: `/api/productos/imagen/${idProducto}`,
      quantity: 1
    });
  }

  actualizarCarritoUI();
  mostrarAlerta(`🛒 Producto "${producto.NombreProducto}" agregado`);
}

// Actualizar HTML del carrito
async function actualizarCarritoUI() {
  contentProducts.innerHTML = '';
  let total = 0;
  localStorage.setItem('carrito', JSON.stringify(carrito));

  if (carrito.length === 0) {
    contentProducts.innerHTML = '<p class="empty-msg">Tu carrito está vacío.</p>';
    totalElement.textContent = `$0.00`;
    cartCount.textContent = `0`;
    return;
  }

  for (const prod of carrito) {
    total += prod.price * prod.quantity;

    let imgData = '';
    try {
      const response = await fetch(prod.img);
      imgData = await response.text();
    } catch (e) {
      imgData = '/images/default.png';
    }

    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
      <img src="${imgData}" alt="${prod.title}" onerror="this.src='/images/default.png'">
      <div class="item-info">
        <p>${prod.title}</p>
        <p>$${prod.price.toFixed(2)}</p>
        <div class="quantity-controls">
          <button class="decrease" data-id="${prod.id}">−</button>
          <span class="qty-span" data-id="${prod.id}">${prod.quantity}</span>
          <button class="increase" data-id="${prod.id}">+</button>
        </div>
      </div>
      <button class="remove-item" data-id="${prod.id}">X</button>
    `;
    contentProducts.appendChild(item);
  }

  cartCount.textContent = carrito.reduce((acc, p) => acc + p.quantity, 0);
  totalElement.textContent = `$${total.toFixed(2)}`;

  // Botones de control
  document.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const item = carrito.find(p => p.id == id);
      if (item) {
        item.quantity++;
        actualizarCarritoUI();
      }
    });
  });

  document.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const item = carrito.find(p => p.id == id);
      if (item) {
        item.quantity--;
        if (item.quantity <= 0) {
          carrito = carrito.filter(p => p.id != id);
        }
        actualizarCarritoUI();
      }
    });
  });

  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      carrito = carrito.filter(p => p.id != id);
      actualizarCarritoUI();
    });
  });
}

// ✅ Alerta visual bonita
function mostrarAlerta(mensaje) {
  const alerta = document.createElement('div');
  alerta.className = 'alert-popup';
  alerta.textContent = mensaje;

  document.body.appendChild(alerta);

  setTimeout(() => {
    alerta.remove();
  }, 3000);
}
