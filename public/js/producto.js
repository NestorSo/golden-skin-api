// /public/js/producto.js
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

fetch(`/api/productos/${id}`)
  .then(res => res.json())
  .then(prod => {
    document.querySelector('.product-title').textContent = prod.NombreProducto;
    document.querySelector('.product-brand').textContent = prod.IdMarca; // puedes hacer JOIN para el nombre
    document.querySelector('.product-description').textContent = prod.Descripcion;
    document.querySelector('.regular-price').textContent = `$${(prod.Precio + 1.8).toFixed(2)}`;
    document.querySelector('.promo-price').textContent = `$${prod.Precio.toFixed(2)}`;
    document.querySelector('.product-image img').src = prod.ImagenUrl;
  })
  .catch(err => {
    document.querySelector('.product-container').innerHTML = "<p>Error al cargar el producto.</p>";
    console.error(err);
  });
