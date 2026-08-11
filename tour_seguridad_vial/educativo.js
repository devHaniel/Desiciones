// Cambio de pestañas del menú lateral en "Contenido educativo"
const menuCards = document.querySelectorAll(".menu-card");
const tabPanels = document.querySelectorAll(".tab-panel");

function activarPanel(nombre) {
  menuCards.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.panel === nombre);
  });

  tabPanels.forEach(panel => {
    panel.classList.toggle("active", panel.dataset.panel === nombre);
  });
}

menuCards.forEach(btn => {
  btn.addEventListener("click", () => {
    activarPanel(btn.dataset.panel);
  });
});

activarPanel("fichas");