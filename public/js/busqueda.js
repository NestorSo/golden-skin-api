// ✅ buscadorHome.js
let productosTotales = [];

const inputBusqueda = document.querySelector('.search-input');
const popup = document.createElement('div');
popup.className = 'search-popup';
document.body.appendChild(popup);

// Posicionar el popup debajo del input
function posicionarPopup() {
  const rect = inputBusqueda.getBoundingClientRect();
  popup.style.top = rect.bottom + window.scrollY + 'px';
  popup.style.left = rect.left + window.scrollX + 'px';
  popup.style.width = rect.width + 'px';
}

// Escuchar input
inputBusqueda?.addEventListener('input', async () => {
  const texto = inputBusqueda.value.toLowerCase().trim();
  if (!texto) return popup.style.display = 'none';

  if (!productosTotales.length) {
    try {
      const res = await fetch('/api/productos/todos');
      productosTotales = await res.json();
    } catch (e) {
      console.error('❌ No se pudo cargar productos para búsqueda');
      return;
    }
  }

  const filtrados = productosTotales.filter(p =>
    p.NombreProducto.toLowerCase().includes(texto) ||
    (p.Marca || '').toLowerCase().includes(texto) ||
    (p.Categoria || '').toLowerCase().includes(texto)
  );

  popup.innerHTML = '';
  posicionarPopup();

  if (filtrados.length === 0) {
    popup.innerHTML = `<div class="no-result">Sin resultados</div>`;
    popup.style.display = 'block';
    return;
  }

  for (const p of filtrados.slice(0, 5)) {
    let img = '/images/default.png';
    try {
      const res = await fetch(`/api/productos/imagen/${p.IdProducto}`);
      if (res.ok) img = await res.text();
    } catch (e) {}

    const item = document.createElement('div');
    item.className = 'search-item';
    item.innerHTML = `
      <img src="${img}" alt="${p.NombreProducto}" onerror="this.src='/images/default.png'">
      <div>
        <p class="prod-name">${p.NombreProducto}</p>
        <p class="prod-price">${p.Marca || ''} - $${p.Precio.toFixed(2)}</p>
      </div>
    `;
    item.addEventListener('click', () => {
      window.location.href = `../HTML/producto.html?id=${p.IdProducto}`;
    });
    popup.appendChild(item);
  }
  popup.style.display = 'block';
});

// Cerrar popup si se hace clic fuera
window.addEventListener('click', e => {
  if (!popup.contains(e.target) && e.target !== inputBusqueda) {
    popup.style.display = 'none';
  }
});

// 🔎 Botón de búsqueda manual (redirigir al catálogo con el texto)
const btnSearch = document.querySelector('.search-button');
btnSearch?.addEventListener('click', () => {
  const texto = inputBusqueda.value.trim();
  if (texto) {
    window.location.href = `../HTML/catalogo.html?busqueda=${encodeURIComponent(texto)}`;
  }
});


document.querySelector('.search-button')?.addEventListener('click', () => {
  const input = document.querySelector('.search-input');
  const texto = input.value.trim();
  if (texto !== '') {
    window.location.href = `../HTML/catalogo.html?busqueda=${encodeURIComponent(texto)}`;
  }
});
