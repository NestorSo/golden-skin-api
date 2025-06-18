// Elementos del carrito
const cartCount = document.getElementById('cartCount');
const contentProducts = document.getElementById('contentProducts');
const totalElement = document.getElementById('total');
const cartPanel = document.getElementById('cartPanel');
const toggleCartBtn = document.getElementById('toggleCart');
const btnEmpty = document.getElementById('emptyCart');
const btnPedido = document.getElementById('realizarPedido');

// Cargar carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Mostrar/Ocultar carrito
toggleCartBtn?.addEventListener('click', () => {
  cartPanel?.classList.toggle('active');
});

// Vaciar carrito
btnEmpty?.addEventListener('click', () => {
  carrito = [];
  actualizarCarritoUI();
});

// Simulación de realizar pedido
btnPedido?.addEventListener('click', () => {
  if (carrito.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }

  alert('✅ Pedido realizado correctamente.');
  carrito = [];
  actualizarCarritoUI();
});

// ✅ Recibe el objeto producto directamente
function agregarAlCarrito(producto) {
  if (!producto) return;

  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  const existente = carrito.find(p => p.id === producto.IdProducto);
  if (existente) {
    existente.quantity++;
  } else {
    carrito.push({
      id: producto.IdProducto,
      title: producto.NombreProducto,
      price: producto.Precio,
      img: `/api/productos/imagen/${producto.IdProducto}`,
      quantity: 1
    });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarritoUI();
}


// 🔁 Actualizar vista del carrito
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

  // Botones
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
