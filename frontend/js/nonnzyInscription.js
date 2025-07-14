// Sélection du formulaire d'inscription
const registerForm = document.querySelector('#popup-register form');
const registerMessage = document.getElementById('register-message');

registerForm.addEventListener('submit', async function (e) {
  e.preventDefault(); // Empêche le rechargement de la page

  // Récupération des champs
  const username = registerForm.querySelector('input[name="username"]').value.trim();
  const email = registerForm.querySelector('input[name="email"]').value.trim();
  const password = registerForm.querySelector('input[name="password"]').value.trim();

  try {
    // Requête d'inscription au backend
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      // ✅ Inscription réussie : stocker le token dans localStorage
      localStorage.setItem('token', data.token);

      // Message de succès
      registerMessage.textContent = "Inscription réussie ! Redirection...";
      registerMessage.style.color = "lightgreen";

      // ✅ Redirection vers la page profil après 1 seconde
      setTimeout(() => {
        window.location.href = 'profilNonnzy.html';
      }, 1000);

    } else {
      // ❌ Erreur d'inscription (email déjà utilisé, etc.)
      registerMessage.textContent = data.message || "Erreur lors de l'inscription.";
      registerMessage.style.color = "orange";
    }

  } catch (err) {
    console.error("Erreur côté frontend :", err);
    registerMessage.textContent = "Erreur serveur.";
    registerMessage.style.color = "red";
  }
});
