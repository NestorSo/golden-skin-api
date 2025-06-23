function goBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // Si no hay historial previo, ir al home como última opción
    window.location.href = '/HTML/home.html';
  }
}
