// new Swiper('.card-wrapper', {
//     loop: true,
//     spaceBetween: 30,
  
//     // If we need pagination
//     pagination: {
//       el: '.swiper-pagination',
//     },
  
//     // Navigation arrows
//     navigation: {
//       nextEl: '.swiper-button-next',
//       prevEl: '.swiper-button-prev',
//     },

//     //BREAKPOINTS RESPONSIVOS
//     breakpoints: {
//         0:{
//             slidesPerView: 1
//         },
//         768:{
//             slidesPerView: 2
//         },
//         1024:{
//             slidesPerView: 3
//         },
//     }
  
//   });

 document.addEventListener('DOMContentLoaded', () => {
  const carrusel = document.querySelector('.carrusel');
  const carruselInner = document.querySelector('.carrusel-inner');
  const btnIzq = document.getElementById('btn-izquierda');
  const btnDer = document.getElementById('btn-derecha');

  // Duplica los elementos
  carruselInner.innerHTML += carruselInner.innerHTML;

  let scrollSpeed = 0.5;
  let animationFrameId;
  let autoScrollTimeout;

  function autoScroll() {
    carrusel.scrollLeft += scrollSpeed;

    // Si llegó a la mitad (donde termina la parte original), vuelve al inicio de forma suave
    if (carrusel.scrollLeft >= carrusel.scrollWidth / 2) {
      carrusel.scrollLeft = 0;
    }

    animationFrameId = requestAnimationFrame(autoScroll);
  }

  function detenerAutoScroll() {
    cancelAnimationFrame(animationFrameId);
    clearTimeout(autoScrollTimeout);
  }

  function reanudarAutoScrollConDelay(ms = 1000) {
    clearTimeout(autoScrollTimeout);
    autoScrollTimeout = setTimeout(() => {
      autoScroll();
    }, ms);
  }

  carrusel.addEventListener('mouseenter', detenerAutoScroll);
  carrusel.addEventListener('mouseleave', () => {
    reanudarAutoScrollConDelay(0);
  });

  btnIzq.addEventListener('click', () => {
    detenerAutoScroll();
    carrusel.scrollBy({ left: -320, behavior: 'smooth' });
    reanudarAutoScrollConDelay();
  });

  btnDer.addEventListener('click', () => {
    detenerAutoScroll();
    carrusel.scrollBy({ left: 320, behavior: 'smooth' });
    reanudarAutoScrollConDelay();
  });

  autoScroll();
});
