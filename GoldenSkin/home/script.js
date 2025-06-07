// Barra de búsqueda con sugerencias
const searchInput = document.getElementById('search-input');
const searchSuggestions = document.getElementById('search-suggestions');

searchInput.addEventListener('focus', () => {
    searchSuggestions.style.display = 'block';
});

searchInput.addEventListener('blur', () => {
    setTimeout(() => {
        searchSuggestions.style.display = 'none';
    }, 200);
});

// Carrusel automático
let currentIndex = 0;
const carouselSlide = document.querySelector('.carousel-slide');
const productCards = document.querySelectorAll('.product-card');
const cardWidth = productCards[0].offsetWidth + 20; // Ancho + gap

function moveCarousel(direction) {
    currentIndex = (currentIndex + direction + productCards.length) % productCards.length;
    carouselSlide.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

// Carrusel automático cada 3 segundos
setInterval(() => {
    moveCarousel(1);
}, 3000);