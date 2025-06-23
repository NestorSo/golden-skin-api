


function goBackAndReload() {
  const ref = document.referrer;
  if (ref) {
    window.location.href = ref; // Regresa y recarga
  } else {
    window.history.back(); // Fallback
  }
}
