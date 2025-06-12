document.addEventListener('DOMContentLoaded', async () => {
  const contenedor = document.getElementById('catalogo');

  try {
    const res = await fetch('/api/productos/todos');
    const productos = await res.json();
    
    productos.forEach(p => {
      const card = document.createElement('div');
      card.className = `product-card ${p.Categoria || ''}`;
      card.innerHTML = `
        <img src="/api/productos/imagen/${p.IdProducto}" alt="${p.NombreProducto}" />
        <p class="brand">${p.Marca || 'Sin marca'}</p>
        <p class="name">${p.NombreProducto}</p>
        <p class="price">$${p.Precio.toFixed(2)}</p>
        <button onclick="verProducto(${p.IdProducto})">Ver más</button>
      `;
      contenedor.appendChild(card);
    });
  } catch (err) {
    console.error('Error al cargar productos:', err);
    contenedor.innerHTML = '<p style="color:red">No se pudieron cargar los productos.</p>';
  }
});

function verProducto(id) {
  window.location.href = `/productos/producto.html?id=${id}`;
}






















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