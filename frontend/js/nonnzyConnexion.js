// 🎯 Sélection du formulaire de connexion dans la popup avec l'id #popup-login
const loginForm = document.querySelector('#popup-login form');

// 🎯 Sélection du paragraphe qui affichera les messages (succès ou erreur)
// ⚠️ Attention : dans ton HTML, il s'appelle "register-message" même pour la connexion
const loginMessage = document.getElementById('login-message');

// ✅ On vérifie que le formulaire existe avant d'ajouter le gestionnaire d'événement
if (loginForm) {
  // 🔁 Événement lors de la soumission du formulaire
  loginForm.addEventListener('submit', async function (e) {
    // 🔒 Empêche le rechargement automatique de la page (comportement par défaut des formulaires)
    e.preventDefault();

    // 📨 On récupère l'email saisi par l'utilisateur
    const email = loginForm.querySelector('input[name="email"]').value.trim();

    // 🔐 On récupère le mot de passe saisi par l'utilisateur
    const password = loginForm.querySelector('input[name="password"]').value.trim();

    try {
      // 📡 Envoi d'une requête POST vers le backend Express pour se connecter
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST', // méthode HTTP
        headers: { 'Content-Type': 'application/json' }, // envoi en JSON
        body: JSON.stringify({ email, password }) // contenu : email et mot de passe
      });

      // 📦 Récupération de la réponse JSON du backend
      const data = await response.json();

      // ✅ Si la connexion est réussie (status HTTP 200)
      if (response.ok) {
        // 🛡️ On stocke le token JWT dans le navigateur pour authentification future
        localStorage.setItem('token', data.token);

        // ✅ Affichage d’un message de succès
        loginMessage.textContent = "Connexion réussie ! Redirection...";
        loginMessage.style.color = "lightgreen";

        // ⏱️ Petite pause avant redirection vers la page profil
        setTimeout(() => {
          window.location.href = 'profilNonnzy.html'; // tu peux adapter le nom si besoin
        }, 1000);

      } else {
        // ❌ En cas d’erreur côté backend (mauvais identifiants, utilisateur inconnu, etc.)
        loginMessage.textContent = data.message || "Email ou mot de passe incorrect.";
        loginMessage.style.color = "orange";
      }

    } catch (err) {
      // 🚨 Si une erreur côté navigateur survient (ex : backend éteint)
      console.error("Erreur côté frontend :", err);
      loginMessage.textContent = "Erreur serveur.";
      loginMessage.style.color = "red";
    }
  });
}
