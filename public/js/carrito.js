// // Carrito de compras
// const cartCount = document.getElementById('cartCount');
// const contentProducts = document.getElementById('contentProducts');
// const totalElement = document.getElementById('total');
// const cartPanel = document.getElementById('cartPanel');
// const toggleCartBtn = document.getElementById('toggleCart');
// const btnEmpty = document.getElementById('emptyCart');
// const btnPedido = document.getElementById('realizarPedido');

// let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// // Mostrar/Ocultar carrito
// toggleCartBtn.addEventListener('click', () => {
//   cartPanel.classList.toggle('active');
// });

// // Vaciar carrito
// btnEmpty.addEventListener('click', () => {
//   carrito = [];
//   actualizarCarritoUI();
//   mostrarAlerta('🗑️ Carrito vaciado');
// });

// // Realizar pedido
// btnPedido.addEventListener('click', () => {
//   const usuario = JSON.parse(localStorage.getItem('usuario'));

//   if (!usuario) {
//     mostrarAlerta('❌ Debes iniciar sesión para realizar un pedido.');
//     return;
//   }

//   if (carrito.length === 0) {
//     mostrarAlerta('⚠️ Tu carrito está vacío.');
//     return;
//   }

//   // Aquí puedes hacer un POST al backend
//   mostrarAlerta('✅ Pedido realizado correctamente.');
//   carrito = [];
//   actualizarCarritoUI();
// });

// // Agregar producto
// function agregarAlCarrito(idProducto) {
//   const producto = productosCargados.find(p => p.IdProducto == idProducto);
//   if (!producto) return;

//   const existente = carrito.find(p => p.id == idProducto);
//   if (existente) {
//     existente.quantity++;
//   } else {
//     carrito.push({
//       id: idProducto,
//       title: producto.NombreProducto,
//       price: producto.Precio,
//       img: `/api/productos/imagen/${idProducto}`,
//       quantity: 1
//     });
//   }

//   actualizarCarritoUI();
//   mostrarAlerta(`🛒 Producto "${producto.NombreProducto}" agregado`);
// }

// // Actualizar HTML del carrito
// async function actualizarCarritoUI() {
//   contentProducts.innerHTML = '';
//   let total = 0;
//   localStorage.setItem('carrito', JSON.stringify(carrito));

//   if (carrito.length === 0) {
//     contentProducts.innerHTML = '<p class="empty-msg">Tu carrito está vacío.</p>';
//     totalElement.textContent = `$0.00`;
//     cartCount.textContent = `0`;
//     return;
//   }

//   for (const prod of carrito) {
//     total += prod.price * prod.quantity;

//     let imgData = '';
//     try {
//       const response = await fetch(prod.img);
//       imgData = await response.text();
//     } catch (e) {
//       imgData = '/images/default.png';
//     }

//     const item = document.createElement('div');
//     item.className = 'cart-item';
//     item.innerHTML = `
//       <img src="${imgData}" alt="${prod.title}" onerror="this.src='../images/default.png'">
//       <div class="item-info">
//         <p>${prod.title}</p>
//         <p>$${prod.price.toFixed(2)}</p>
//         <div class="quantity-controls">
//           <button class="decrease" data-id="${prod.id}">−</button>
//           <span class="qty-span" data-id="${prod.id}">${prod.quantity}</span>
//           <button class="increase" data-id="${prod.id}">+</button>
//         </div>
//       </div>
//       <button class="remove-item" data-id="${prod.id}">X</button>
//     `;
//     contentProducts.appendChild(item);
//   }

//   cartCount.textContent = carrito.reduce((acc, p) => acc + p.quantity, 0);
//   totalElement.textContent = `$${total.toFixed(2)}`;

//   // Botones de control
//   document.querySelectorAll('.increase').forEach(btn => {
//     btn.addEventListener('click', () => {
//       const id = parseInt(btn.dataset.id);
//       const item = carrito.find(p => p.id == id);
//       if (item) {
//         item.quantity++;
//         actualizarCarritoUI();
//       }
//     });
//   });

//   document.querySelectorAll('.decrease').forEach(btn => {
//     btn.addEventListener('click', () => {
//       const id = parseInt(btn.dataset.id);
//       const item = carrito.find(p => p.id == id);
//       if (item) {
//         item.quantity--;
//         if (item.quantity <= 0) {
//           carrito = carrito.filter(p => p.id != id);
//         }
//         actualizarCarritoUI();
//       }
//     });
//   });

//   document.querySelectorAll('.remove-item').forEach(btn => {
//     btn.addEventListener('click', () => {
//       const id = parseInt(btn.dataset.id);
//       carrito = carrito.filter(p => p.id != id);
//       actualizarCarritoUI();
//     });
//   });
// }

// // ✅ Alerta visual bonita
// function mostrarAlerta(mensaje) {
//   const alerta = document.createElement('div');
//   alerta.className = 'alert-popup';
//   alerta.textContent = mensaje;

//   document.body.appendChild(alerta);

//   setTimeout(() => {
//     alerta.remove();
//   }, 3000);
// }

// carrito.js
// ✅ carrito.js (Fusionado con pedido.js y corregido para funcionar desde catálogo y producto)
// Elementos del DOM
const cartCount = document.getElementById('cartCount');
const contentProducts = document.getElementById('contentProducts');
const totalElement = document.getElementById('total');
const cartPanel = document.getElementById('cartPanel');
const toggleCartBtn = document.getElementById('toggleCart');
const btnEmpty = document.getElementById('emptyCart');
const btnPedido = document.getElementById('realizarPedido');

// Carrito persistente
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Mostrar/Ocultar panel
toggleCartBtn?.addEventListener('click', () => {
  cartPanel.classList.toggle('active');
});

// Vaciar carrito
btnEmpty?.addEventListener('click', () => {
  carrito = [];
  guardarCarrito();
  actualizarCarritoUI();
  mostrarAlerta('🗑️ Carrito vaciado');
});

// Realizar pedido
btnPedido?.addEventListener('click', async () => {
  if (carrito.length === 0) return mostrarAlerta('⚠️ Tu carrito está vacío');

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || !usuario.id) return mostrarAlerta('❌ Debes iniciar sesión');

  const payload = {
    clienteId: usuario.id,
    descripcion: 'Pedido web',
    productos: carrito.map(p => ({ id: p.id, cantidad: p.quantity, precio: p.price }))
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
    actualizarCarritoUI();
  } catch (err) {
    console.error('❌ Error al enviar pedido:', err);
    mostrarAlerta('❌ Error al procesar pedido');
  }
});

// ✅ Agregar producto (desde catálogo o producto)
async function agregarAlCarrito(idProducto) {
  let producto;

  // 1. Si venimos desde catálogo
  if (typeof productosCargados !== 'undefined') {
    producto = productosCargados.find(p => p.IdProducto == idProducto);
  }

  // 2. Si no lo encontramos, lo pedimos al backend
  if (!producto) {
    try {
      const res = await fetch(`/api/productos/${idProducto}`);
      if (!res.ok) throw new Error('Producto no encontrado');
      producto = await res.json();
    } catch (err) {
      console.error('❌ No se pudo cargar el producto:', err);
      mostrarAlerta('❌ Error al cargar producto');
      return;
    }
  }

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

  guardarCarrito();
  actualizarCarritoUI();
  mostrarAlerta(`🛒 "${producto.NombreProducto}" agregado`);
}

// ✅ Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// ✅ Dibujar UI del carrito
async function actualizarCarritoUI() {
  contentProducts.innerHTML = '';
  guardarCarrito();

  let total = 0;

  if (carrito.length === 0) {
    contentProducts.innerHTML = '<p class="empty-msg">Tu carrito está vacío.</p>';
    cartCount.textContent = `0`;
    totalElement.textContent = `$0.00`;
    return;
  }

  for (const prod of carrito) {
    total += prod.price * prod.quantity;

    let imgData = '/images/default.png';
    try {
      const response = await fetch(prod.img);
      if (response.ok) {
        imgData = await response.text(); // base64
      }
    } catch (e) {
      console.warn('⚠️ Imagen no cargada, usando default');
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
          <span class="qty-span">${prod.quantity}</span>
          <button class="increase" data-id="${prod.id}">+</button>
        </div>
      </div>
      <button class="remove-item" data-id="${prod.id}">X</button>
    `;
    contentProducts.appendChild(item); // ← ¡No olvides esto!
  }

  totalElement.textContent = `$${total.toFixed(2)}`;
  cartCount.textContent = carrito.reduce((acc, p) => acc + p.quantity, 0);

  // Controles
  document.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const item = carrito.find(p => p.id == id);
      if (item) item.quantity++;
      guardarCarrito();
      actualizarCarritoUI();
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
        guardarCarrito();
        actualizarCarritoUI();
      }
    });
  });

  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      carrito = carrito.filter(p => p.id != id);
      guardarCarrito();
      actualizarCarritoUI();
    });
  });
}

// ✅ Alerta bonita
function mostrarAlerta(mensaje) {
  const alerta = document.createElement('div');
  alerta.className = 'alert-popup';
  alerta.textContent = mensaje;
  document.body.appendChild(alerta);
  setTimeout(() => alerta.remove(), 2500);
}

// ✅ Al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  actualizarCarritoUI();
});
