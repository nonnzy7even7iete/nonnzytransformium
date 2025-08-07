// Charge dynamiquement le contenu de sidebar.html dans le conteneur
fetch("sidebar.html")
  .then(response => response.text())
  .then(html => {
    document.getElementById("sidebar-container").innerHTML = html;

    const burger = document.getElementById("burger");
    const sidebar = document.getElementById("sidebar");

    if (burger && sidebar) {

      // 👉 Au clic sur le bouton burger : toggle (ouvrir/fermer) la sidebar
      burger.addEventListener("click", (e) => {
        e.stopPropagation();
        sidebar.classList.toggle("show");
      });

      // 👉 Fermer la sidebar au clic partout sauf sur le sidebar ou le burger
      document.addEventListener("click", (event) => {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnBurger = burger.contains(event.target);

        if (!isClickInsideSidebar && !isClickOnBurger) {
          sidebar.classList.remove("show");
        }
      });

      // 👉 SWIPE : détecter un swipe gauche sur toute la page
      let startX = 0;
      let isSwiping = false;

      document.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
      });

      document.addEventListener("touchmove", (e) => {
        if (!isSwiping) return;
        const currentX = e.touches[0].clientX;
        const diffX = currentX - startX;

        // 👉 Si on swipe vers la gauche de plus de 30px
        if (diffX < -30) {
          sidebar.classList.remove("show");
          isSwiping = false;
        }
      });

      document.addEventListener("touchend", () => {
        isSwiping = false;
      });

    }
  })
  .catch(error => console.error("Erreur sidebar :", error));
