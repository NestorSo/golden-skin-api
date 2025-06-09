// /public/js/catalogo.js
fetch('/api/productos')
  .then(res => res.json())
  .then(productos => {
    const container = document.getElementById('catalogo-container');
    productos.forEach(prod => {
      const card = document.createElement('div');
      card.classList.add('producto');
      card.innerHTML = `
        <a href="producto.html?id=${prod.IdProducto}">
          <img src="${prod.ImagenUrl}" alt="${prod.NombreProducto}" />
          <h3>${prod.NombreProducto}</h3>
          <p>$${prod.Precio}</p>
        </a>
      `;
      container.appendChild(card);
    });
  });

    const filterButtons = document.querySelectorAll(".filter-btn");
  const products = document.querySelectorAll(".product-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Quitar clase activa de todos los botones
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const category = button.dataset.category;

      products.forEach(product => {
        product.style.display =
          category === "all" || product.classList.contains(category)
            ? "block"
            : "none";
      });
    });
  });