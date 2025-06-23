// document.addEventListener('DOMContentLoaded', async () => {
//   const params = new URLSearchParams(window.location.search);
//   const id = params.get('id');
//   const contenedor = document.getElementById('producto');

//   if (!id) {
//     contenedor.innerHTML = '<p style="color:red">❌ Producto no encontrado.</p>';
//     return;
//   }

//   try {
//     const res = await fetch(`/api/productos/${id}`);
//     const producto = await res.json();

//     contenedor.innerHTML = `
//   <div class="product-image">
//     <img src="/api/productos/imagen/${producto.IdProducto}" alt="${producto.NombreProducto}" onerror="this.src='../images/default.png'" />
//   </div>
//       <div class="product-info">
//         <p class="product-brand">${producto.Marca || 'Sin marca'}</p>
//         <h1 class="product-title">${producto.NombreProducto}</h1>
//         <p class="product-description">${producto.Descripcion}</p>
//         <div class="price-section">
//           <p class="regular-price">$${(producto.Precio * 1.1).toFixed(2)}</p>
//           <p class="promo-price">$${producto.Precio.toFixed(2)}</p>
//         </div>
//         <button class="add-to-cart">Agregar al carrito</button>
//       </div>
//     `;

//     document.querySelector('.add-to-cart').addEventListener('click', () => {
//       mostrarAlerta('✅ Producto agregado al carrito');
//       // Aquí puedes agregar lógica de carrito
//     });

//   } catch (err) {
//     console.error('❌ Error:', err);
//     contenedor.innerHTML = '<p style="color:red">❌ No se pudo cargar el producto.</p>';
//   }
// });
// document.addEventListener('DOMContentLoaded', async () => {
//     const params = new URLSearchParams(window.location.search);
//     const productId = params.get('id'); // Get the 'id' from the URL

//     if (!productId) {
//         console.error('No product ID found in URL.');
//         document.getElementById('product-detail-container').innerHTML = '<p style="color:red">Producto no encontrado.</p>';
//         return;
//     }

//     const productImage = document.getElementById('product-image');
//     const productName = document.getElementById('product-name');
//     const productBrand = document.getElementById('product-brand');
//     const productPrice = document.getElementById('product-price');
//     const productDescription = document.getElementById('product-description');
//     const addToCartButton = document.getElementById('add-to-cart-button');

//     try {
//         // Fetch product details
//         const productRes = await fetch(`/api/productos/${productId}`); // Assuming an endpoint for single product details
//         if (!productRes.ok) {
//             throw new Error(`HTTP error! status: ${productRes.status}`);
//         }
//         const product = await productRes.json();

//         // Populate details
//         productName.textContent = product.NombreProducto;
//         productBrand.textContent = product.Marca || 'Sin marca';
//         productPrice.textContent = `$${product.Precio.toFixed(2)}`;
//         // Assuming your product object might have a description field, if not, remove or adjust
//         productDescription.textContent = product.Descripcion || 'No hay descripción disponible.';

//         // Fetch and set product image
//         try {
//             const imageRes = await fetch(`/api/productos/imagen/${productId}`);
//             const imageUrl = await imageRes.text();
//             productImage.src = imageUrl;
//         } catch (imgErr) {
//             console.error('Error al cargar la imagen del producto:', imgErr);
//             productImage.src = '/images/default.png'; // Fallback image
//         }

//         // Set data-id for add to cart button
//         addToCartButton.setAttribute('data-id', product.IdProducto);
//         addToCartButton.addEventListener('click', () => {
//             agregarAlCarrito(product.IdProducto);
//         });

//     } catch (err) {
//         console.error('Error al cargar los detalles del producto:', err);
//         document.getElementById('product-detail-container').innerHTML = '<p style="color:red">No se pudieron cargar los detalles del producto.</p>';
//     }
// });

// // Assuming you have this function defined globally or can import it
// function agregarAlCarrito(id) {
//     console.log(`Producto ${id} agregado al carrito.`);
//     // Implement your add to cart logic here (e.g., update local storage, send to server)
//     alert(`¡Producto ${id} agregado al carrito!`);
// }
// // Alerta bonita
// function mostrarAlerta(texto) {
//   const alerta = document.getElementById('alerta');
//   alerta.textContent = texto;
//   alerta.style.display = 'block';

//   setTimeout(() => {
//     alerta.style.display = 'none';
//   }, 2500);
// }

// ✅ producto.js

// Cargar detalle del producto y agregar al carrito
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const contenedor = document.getElementById('producto');

  if (!id || isNaN(id)) {
    contenedor.innerHTML = '<p style="color:red">❌ Producto no encontrado.</p>';
    return;
  }

  try {
    // Cargar producto desde backend
    const res = await fetch(`/api/productos/${id}`);
    if (!res.ok) throw new Error('No se pudo obtener el producto');
    const producto = await res.json();

    // Cargar imagen
    let imagenBase64 = '/images/default.png';
    try {
      const resImg = await fetch(`/api/productos/imagen/${producto.IdProducto}`);
      if (resImg.ok) {
        imagenBase64 = await resImg.text();
      }
    } catch (e) {
      console.warn('⚠️ No se pudo cargar la imagen del producto. Se usará default.');
    }

    // Mostrar producto
    contenedor.innerHTML = `
      <div class="product-detail">
        <div class="product-image">
          <img src="${imagenBase64}" alt="${producto.NombreProducto}" onerror="this.src='/images/default.png'">
        </div>
        <div class="product-info">
          <p class="product-brand">${producto.Marca || 'Sin marca'}</p>
          <h1 class="product-title">${producto.NombreProducto}</h1>
          <p class="product-description">${producto.Descripcion}</p>
          <div class="price-section">
            <p class="regular-price">$${(producto.Precio * 1.1).toFixed(2)}</p>
            <p class="promo-price">$${producto.Precio.toFixed(2)}</p>
          </div>
          <button class="add-to-cart" id="addToCart">Agregar al carrito</button>
        </div>
      </div>
    `;

    // Manejo del botón "Agregar al carrito"
    document.getElementById('addToCart').addEventListener('click', () => {
      agregarAlCarrito(producto.IdProducto); // Esta función está definida en carrito.js
    });

  } catch (err) {
    console.error('❌ Error al cargar producto:', err);
    contenedor.innerHTML = '<p style="color:red">❌ No se pudo cargar el producto.</p>';
  }
});



