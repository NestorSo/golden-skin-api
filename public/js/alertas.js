// Alerta simple
function mostrarAlerta(mensaje) {
  const alerta = document.createElement('div');
  alerta.className = 'alert-popup';
  alerta.textContent = mensaje;
  document.body.appendChild(alerta);

  setTimeout(() => {
    alerta.remove();
  }, 2500);
}

// Alerta de confirmación
function mostrarAlertaConfirmación(mensaje, onConfirmar) {
  const confirmDiv = document.createElement('div');
  confirmDiv.className = 'confirm-popup';
  confirmDiv.innerHTML = `
    <p>${mensaje}</p>
    <div class="popup-actions">
      <button class="popup-confirm">Sí</button>
      <button class="popup-cancel">Cancelar</button>
    </div>
  `;
  document.body.appendChild(confirmDiv);

  confirmDiv.querySelector('.popup-confirm').onclick = () => {
    confirmDiv.remove();
    onConfirmar();
  };
  confirmDiv.querySelector('.popup-cancel').onclick = () => {
    confirmDiv.remove();
  };
}
