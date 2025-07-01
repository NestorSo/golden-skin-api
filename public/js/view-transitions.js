document.addEventListener("DOMContentLoaded", () => {
  const supportsViewTransition = document.startViewTransition !== undefined;

  if (!supportsViewTransition) return;

  document.querySelectorAll("a[href]").forEach(link => {
    const href = link.getAttribute("href");

    if (
      href.startsWith("#") ||               // ignorar anclas
      href.startsWith("mailto:") ||         // ignorar correo
      href.startsWith("tel:") ||            // ignorar teléfonos
      link.target === "_blank" ||           // ignorar target blank
      link.hostname !== window.location.hostname // ignorar enlaces externos
    ) {
      return;
    }

    link.addEventListener("click", (e) => {
      e.preventDefault();
      const url = link.href;

      document.startViewTransition(() => {
        window.location.href = url;
      });
    });
  });
});
