document.addEventListener("DOMContentLoaded", () => {
  const toggleBtns = document.querySelectorAll("#toggle-dark");
  const body = document.body;

  // Appliquer un thème à tous les boutons
  const applyTheme = (theme) => {
    toggleBtns.forEach((btn) => {
      const icon = btn.querySelector("i");
      if (theme === "light") {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
      } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
      }
    });

    if (theme === "light") {
      body.classList.add("light-mode");
    } else {
      body.classList.remove("light-mode");
    }
  };

  // Initialisation
  const savedTheme = localStorage.getItem("theme");
  applyTheme(savedTheme || "dark");

  // Toggle sur clic pour chaque bouton
  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isLight = body.classList.toggle("light-mode");
      const theme = isLight ? "light" : "dark";
      localStorage.setItem("theme", theme);
      applyTheme(theme);
    });
  });
});
