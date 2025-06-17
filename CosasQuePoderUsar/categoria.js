let productosCargados = [];

document.addEventListener('DOMContentLoaded', async () => {
  const contenedor = document.getElementById('catalogo');
  const params = new URLSearchParams(window.location.search);
  const categoriaSeleccionada = params.get('categoria');

  try {
    const res = await fetch('/api/productos/todos');
    const todos = await res.json();

    const normalizar = str => (str || '').toLowerCase().trim();

    productosCargados = categoriaSeleccionada
      ? todos.filter(p => normalizar(p.Categoria) === normalizar(categoriaSeleccionada))
      : todos;

    renderProductos(productosCargados);
  } catch (err) {
    console.error('Error al cargar productos:', err);
    contenedor.innerHTML = '<p style="color:red">No se pudieron cargar los productos.</p>';
  }
});

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

function verProducto(id) {
  window.location.href = `/productos/producto.html?id=${id}`;
}

function agregarAlCarrito(idProducto) {
  alert(`🛒 Producto ${idProducto} agregado al carrito`);
  // Aquí podés integrarlo con localStorage o backend
}

//deberia de mostrar el título de la categoría
//haz que me muestre el título de la categoría en la parte superior ya que se queda el h2 del html estatico sin cambiar
const params = new URLSearchParams(window.location.search);
const categoriaSeleccionada = params.get('categoria');



const tituloCategoria = document.getElementById('categoryTitle');
if (categoriaSeleccionada) {
  // Capitaliza la primera letra de cada palabra
  const nombreBonito = categoriaSeleccionada
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');

  tituloCategoria.textContent = `Categoría: ${nombreBonito}`;
} else {
  tituloCategoria.textContent = 'Todos los productos';
}



// // categoria.js
// let productosCargados = [];

// document.addEventListener('DOMContentLoaded', async () => {
//   const contenedor = document.getElementById('catalogo');
//   const params = new URLSearchParams(window.location.search);
//   const categoriaSeleccionada = params.get('categoria');

//   try {
//     const res = await fetch('/api/productos/todos'); // Podés hacer una ruta /api/productos/categoria/:cat si preferís
//     const todos = await res.json();

//     productosCargados = categoriaSeleccionada && categoriaSeleccionada !== 'all'
//       ? todos.filter(p => (p.Categoria || '').toLowerCase().includes(categoriaSeleccionada.toLowerCase()))
//       : todos;

//     renderProductos(productosCargados);
//   } catch (err) {
//     console.error('Error al cargar productos:', err);
//     contenedor.innerHTML = '<p style="color:red">No se pudieron cargar los productos.</p>';
//   }
//   const titulo = document.getElementById('tituloCategoria');
//   if (categoriaSeleccionada) {
//   titulo.textContent = `Productos de la categoría: ${categoriaSeleccionada}`;
//   }

// });

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

//     // 👉 Clic en toda la tarjeta para ver producto
//     card.addEventListener('click', () => verProducto(p.IdProducto));

//     card.innerHTML = `
//       <img src="${img}" alt="${p.NombreProducto}" />
//       <p class="brand">${p.Marca || 'Sin marca'}</p>
//       <p class="name">${p.NombreProducto}</p>
//       <p class="price">$${p.Precio.toFixed(2)}</p>
//       <button class="add-to-cart" data-id="${p.IdProducto}">Agregar al carrito</button>
//     `;

//     // 👉 Evita redirección si se hace clic en el botón
//     card.querySelector('.add-to-cart').addEventListener('click', e => {
//       e.stopPropagation(); // ← evita que se dispare el evento del card
//       const id = e.target.getAttribute('data-id');
//       agregarAlCarrito(id);
//     });

//     contenedor.appendChild(card);
//   }
// }

// function verProducto(id) {
//   window.location.href = `/productos/producto.html?id=${id}`;
// }
