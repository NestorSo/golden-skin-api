// let productosCargados = [];

// document.addEventListener('DOMContentLoaded', async () => {
//   const contenedor = document.getElementById('catalogo');
//   const params = new URLSearchParams(window.location.search);
//   const categoriaDesdeURL = params.get('data-category');

//   try {
//     const res = await fetch('/api/productos/todos');
//     productosCargados = await res.json();

//     // 🔹 Si hay filtro desde URL, aplicar directamente sin mostrar todos
//     if (categoriaDesdeURL) {
//       document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));

//       const btn = document.querySelector(`.filter-btn[data-category="${categoriaDesdeURL}"]`);
//       if (btn) btn.classList.add('active');

//       const filtrados = productosCargados.filter(p =>
//         (p.Categoria || '').toLowerCase().includes(categoriaDesdeURL.toLowerCase())
//       );
//       renderProductos(filtrados);
//     } else {
//       renderProductos(productosCargados);
//     }

//   } catch (err) {
//     console.error('Error al cargar productos:', err);
//     contenedor.innerHTML = '<p style="color:red">No se pudieron cargar los productos.</p>';
//   }

//   // 🔹 Filtro por categoría
//   document.querySelectorAll('.filter-btn').forEach(btn => {
//     btn.addEventListener('click', () => {
//       document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
//       btn.classList.add('active');

//       const categoria = btn.dataset.category;
//       const filtrados = categoria === 'all'
//         ? productosCargados
//         : productosCargados.filter(p =>
//             (p.Categoria || '').toLowerCase().includes(categoria.toLowerCase())
//           );
//       renderProductos(filtrados);
//     });
//   });

//   // 🔹 Búsqueda por nombre o marca
//   const input = document.querySelector('.search-input');
//   input.addEventListener('input', () => {
//     const texto = input.value.toLowerCase();
//     const filtrados = productosCargados.filter(p =>
//       p.NombreProducto.toLowerCase().includes(texto) ||
//       (p.Marca || '').toLowerCase().includes(texto)
//     );
//     renderProductos(filtrados);
//   });
// });

// // 🔹 Mostrar productos
// async function renderProductos(productos) {
//   const contenedor = document.getElementById('catalogo');
//   contenedor.innerHTML = '';

//   for (const p of productos) {
//     let img = '';
//     try {
//       const res = await fetch(`/api/productos/imagen/${p.IdProducto}`);
//       img = await res.text();
//     } catch (e) {
//       img = '/images/default.png';
//     }

//     const card = document.createElement('div');
//     card.className = `product-card ${p.Categoria || ''}`;

//     card.addEventListener('click', () => verProducto(p.IdProducto));

//     card.innerHTML = `
//       <img src="${img}" alt="${p.NombreProducto}" />
//       <p class="brand">${p.Marca || 'Sin marca'}</p>
//       <p class="name">${p.NombreProducto}</p>
//       <p class="price">$${p.Precio.toFixed(2)}</p>
//       <button class="add-to-cart" data-id="${p.IdProducto}">Agregar al carrito</button>
//     `;

//     card.querySelector('.add-to-cart').addEventListener('click', e => {
//       e.stopPropagation();
//       agregarAlCarrito(p.IdProducto);
//     });

//     contenedor.appendChild(card);
//   }
// }

// // 🔹 Ir al detalle de producto
// function verProducto(id) {
//   window.location.href = `../HTML/producto.html?id=${id}`;
// }

// function aplicarBusquedaDesdeURL() {
//   const params = new URLSearchParams(window.location.search);
//   const texto = (params.get('busqueda') || '').toLowerCase();

//   if (texto) {
//     const filtrados = productosCargados.filter(p =>
//       p.NombreProducto.toLowerCase().includes(texto) ||
//       (p.Marca || '').toLowerCase().includes(texto) ||
//       (p.Categoria || '').toLowerCase().includes(texto)
//     );
//     renderProductos(filtrados);
//   }
// }



let productosCargados = [];

document.addEventListener('DOMContentLoaded', async () => {
  const contenedor = document.getElementById('catalogo');
  const params = new URLSearchParams(window.location.search);
  const categoriaDesdeURL = params.get('data-category');
  const textoBusqueda = (params.get('busqueda') || '').toLowerCase();

  try {
    const res = await fetch('/api/productos/todos');
    productosCargados = await res.json();

    let productosMostrados = productosCargados;

    // 🔹 Filtro por categoría desde URL
    if (categoriaDesdeURL) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      const btn = document.querySelector(`.filter-btn[data-category="${categoriaDesdeURL}"]`);
      if (btn) btn.classList.add('active');

      productosMostrados = productosMostrados.filter(p =>
        (p.Categoria || '').toLowerCase().includes(categoriaDesdeURL.toLowerCase())
      );
    }

    // 🔹 Búsqueda desde URL (nombre, marca o categoría)
    if (textoBusqueda) {
      productosMostrados = productosMostrados.filter(p =>
        p.NombreProducto.toLowerCase().includes(textoBusqueda) ||
        (p.Marca || '').toLowerCase().includes(textoBusqueda) ||
        (p.Categoria || '').toLowerCase().includes(textoBusqueda)
      );
    }

    await renderProductos(productosMostrados);

  } catch (err) {
    console.error('Error al cargar productos:', err);
    contenedor.innerHTML = '<p style="color:red">No se pudieron cargar los productos.</p>';
  }

  // 🔹 Filtro por categoría (clic en botones)
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const categoria = btn.dataset.category;
      const filtrados = categoria === 'all'
        ? productosCargados
        : productosCargados.filter(p =>
            (p.Categoria || '').toLowerCase().includes(categoria.toLowerCase())
          );
      renderProductos(filtrados);
    });
  });

  // 🔹 Búsqueda en vivo por nombre, marca o categoría
  const input = document.querySelector('.search-input');
  input.addEventListener('input', () => {
    const texto = input.value.toLowerCase();
    const filtrados = productosCargados.filter(p =>
      p.NombreProducto.toLowerCase().includes(texto) ||
      (p.Marca || '').toLowerCase().includes(texto) ||
      (p.Categoria || '').toLowerCase().includes(texto)
    );
    renderProductos(filtrados);
  });
});

// 🔹 Mostrar productos
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

    card.addEventListener('click', () => verProducto(p.IdProducto));

    card.innerHTML = `
      <img src="${img}" alt="${p.NombreProducto}" />
      <p class="brand">${p.Marca || 'Sin marca'}</p>
      <p class="name">${p.NombreProducto}</p>
      <p class="price">$${p.Precio.toFixed(2)}</p>
      <button class="add-to-cart" data-id="${p.IdProducto}">Agregar al carrito</button>
    `;

    card.querySelector('.add-to-cart').addEventListener('click', e => {
      e.stopPropagation();
      agregarAlCarrito(p.IdProducto);
    });

    contenedor.appendChild(card);
  }
}

// 🔹 Ir al detalle de producto
function verProducto(id) {
  window.location.href = `../HTML/producto.html?id=${id}`;
}
