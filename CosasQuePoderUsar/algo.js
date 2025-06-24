
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

// Esperamos a que todo el contenido de la página se haya cargado
  window.addEventListener('DOMContentLoaded', function() {
  
    // 1. Obtenemos los parámetros de la URL actual
    const params = new URLSearchParams(window.location.search);
  
    // 2. Buscamos específicamente el parámetro llamado 'categoria'
    const categoriaDesdeURL = params.get('data-category');
  
    // 3. Si el parámetro 'categoria' existe en la URL...
    if (categoriaDesdeURL) {
      
      console.log('Filtrar automáticamente por:', categoriaDesdeURL);
      
      // 4. Buscamos el botón de filtro que corresponda a esa categoría
      //    usando el atributo data-filtro que pusimos en el Paso 2.
      const botonActivar = document.querySelector(`.filter-btn[data-category="${categoriaDesdeURL}"]`);
      
      // 5. Si encontramos el botón...
      if (botonActivar) {
        // ...¡Simulamos un clic sobre él!
        // Esto ejecutará la misma función de filtrado que ya tienes.
        botonActivar.click();
      }
    }
  });



  //🔸 Opción 1: Hacer múltiples llamadas desde el frontend (una por cada producto)
js
Copiar
Editar
for (const item of productos) {
  await fetch('/api/productos/inventario', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ IdProducto: item.id, CantidadAgregada: item.cantidad })
  });
}