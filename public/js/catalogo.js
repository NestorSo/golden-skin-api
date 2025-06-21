let productosCargados = [];

document.addEventListener('DOMContentLoaded', async () => {
  const contenedor = document.getElementById('catalogo');

  try {
    const res = await fetch('/api/productos/todos');
    productosCargados = await res.json();

    // Carga inicial: mostrar todos
    renderProductos(productosCargados);
  } catch (err) {
    console.error('Error al cargar productos:', err);
    contenedor.innerHTML = '<p style="color:red">No se pudieron cargar los productos.</p>';
  }

  // Filtro por categoría
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const categoria = btn.dataset.category;
      const filtrados = categoria === 'all'
        ? productosCargados
        : productosCargados.filter(p => (p.Categoria || '').toLowerCase().includes(categoria.toLowerCase()));
      renderProductos(filtrados);
    });
  });

  // Búsqueda por nombre o marca
  const input = document.querySelector('.search-input');
  input.addEventListener('input', () => {
    const texto = input.value.toLowerCase();
    const filtrados = productosCargados.filter(p =>
      p.NombreProducto.toLowerCase().includes(texto) ||
      (p.Marca || '').toLowerCase().includes(texto)
    );
    renderProductos(filtrados);
  });
});

// Función para mostrar productos
async function renderProductos(productos) {
  const contenedor = document.getElementById('catalogo');
  contenedor.innerHTML = '';

  for (const p of productos) {
    let img = '';
    try {
      const res = await fetch(`/api/productos/imagen/${p.IdProducto}`);
      img = await res.text();
    } catch (e) {
      img = '/images/default.png';
    }

    const card = document.createElement('div');
    card.className = `product-card ${p.Categoria || ''}`;

    // 👉 Clic en toda la tarjeta para ver producto
    card.addEventListener('click', () => verProducto(p.IdProducto));

    card.innerHTML = `
      <img src="${img}" alt="${p.NombreProducto}" />
      <p class="brand">${p.Marca || 'Sin marca'}</p>
      <p class="name">${p.NombreProducto}</p>
      <p class="price">$${p.Precio.toFixed(2)}</p>
      <button class="add-to-cart" data-id="${p.IdProducto}">Agregar al carrito</button>
    `;

    // 👉 Evita redirección si se hace clic en el botón
    card.querySelector('.add-to-cart').addEventListener('click', e => {
      e.stopPropagation(); // ← evita que se dispare el evento del card
      const id = e.target.getAttribute('data-id');
      agregarAlCarrito(id);
    });

    contenedor.appendChild(card);
  }
}

// Función para redirigir al producto
function verProducto(id) {
  window.location.href = `../HTML/producto.html?id=${id}`;
}





// // Simula la función para agregar al carrito
// function agregarAlCarrito(idProducto) {
//   alert(`🛒 Producto ${idProducto} agregado al carrito`);
//   // Aquí podrías hacer POST a /api/carrito o manejar localStorage, etc.
// }








  // try {
  //   const res = await fetch('/api/productos/todos');
  //   productosCargados = await res.json();

  //   // Carga inicial: mostrar todos
  //   renderProductos(productosCargados);
  // } catch (err) {
  //   console.error('Error al cargar productos:', err);
  //   contenedor.innerHTML = '<p style="color:red">No se pudieron cargar los productos.</p>';
  // }

  // // Filtro por categoría
  // document.querySelectorAll('.filter-btn').forEach(btn => {
  //   btn.addEventListener('click', () => {
  //     document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  //     btn.classList.add('active');

  //     const categoria = btn.dataset.category;
  //     const filtrados = categoria === 'all'
  //       ? productosCargados
  //       : productosCargados.filter(p => (p.Categoria || '').toLowerCase().includes(categoria.toLowerCase()));
  //     renderProductos(filtrados);
  //   });
  // });



// function actualizarCarritoUI() {
//   contentProducts.innerHTML = '';
//   let total = 0;

//   if (carrito.length === 0) {
//     contentProducts.innerHTML = '<p class="empty-msg">Tu carrito está vacío.</p>';
//     totalElement.textContent = `$0.00`;
//     cartCount.textContent = `0`;
//     return;
//   }

//   carrito.forEach(prod => {
//     total += prod.price * prod.quantity;

//     const item = document.createElement('div');
//     item.className = 'cart-item';
//     item.innerHTML = `
//       <img src="${prod.img}" alt="${prod.title}" onerror="this.src='/images/default.png'">
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
//   });

//   cartCount.textContent = carrito.reduce((acc, p) => acc + p.quantity, 0);
//   totalElement.textContent = `$${total.toFixed(2)}`;

//   // Eventos
//   document.querySelectorAll('.increase').forEach(btn => {
//     btn.addEventListener('click', () => {
//       const id = parseInt(btn.dataset.id);
//       const item = carrito.find(p => p.id == id);
//       if (item) {
//         item.quantity++;
//         actualizarCarritoUI(); // vuelve a pintar, pero sin async/await => más fluido
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






// /public/js/catalogo.js
// fetch('/api/productos')
//   .then(res => res.json())
//   .then(productos => {
//     const container = document.getElementById('catalogo-container');
//     productos.forEach(prod => {
//       const card = document.createElement('div');
//       card.classList.add('producto');
//       card.innerHTML = `
//         <a href="producto.html?id=${prod.IdProducto}">
//           <img src="${prod.ImagenUrl}" alt="${prod.NombreProducto}" />
//           <h3>${prod.NombreProducto}</h3>
//           <p>$${prod.Precio}</p>
//         </a>
//       `;
//       container.appendChild(card);
//     });
//   });

//     const filterButtons = document.querySelectorAll(".filter-btn");
//   const products = document.querySelectorAll(".product-card");

//   filterButtons.forEach(button => {
//     button.addEventListener("click", () => {
//       // Quitar clase activa de todos los botones
//       filterButtons.forEach(btn => btn.classList.remove("active"));
//       button.classList.add("active");

//       const category = button.dataset.category;

//       products.forEach(product => {
//         product.style.display =
//           category === "all" || product.classList.contains(category)
//             ? "block"
//             : "none";
//       });
//     });
//   });