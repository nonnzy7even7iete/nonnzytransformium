document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const menuMobile = document.getElementById("menu-mobile");

  // 1. Toggle menu sur clic burger
  burger.addEventListener("click", () => {
    menuMobile.classList.toggle("show");
  });

  // 2. Ferme menu si on clique ailleurs
  document.addEventListener("click", (e) => {
    if (
      menuMobile.classList.contains("show") &&
      !menuMobile.contains(e.target) &&
      !burger.contains(e.target)
    ) {
      menuMobile.classList.remove("show");
    }
  });

  // 3. Ferme si on clique sur un lien du menu
  const menuLinks = menuMobile.querySelectorAll("a, button");
  menuLinks.forEach(link => {
    link.addEventListener("click", () => {
      menuMobile.classList.remove("show");
    });
  });

  // 4. Swipe pour fermer (détection glissement vers la gauche)
  let touchStartX = 0;
  let touchEndX = 0;

  menuMobile.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  menuMobile.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      // Glissement vers la gauche
      menuMobile.classList.remove("show");
    }
  });
});
