// 🌟 Sélection des éléments
const profileImage = document.querySelector('.profile-image');
const profileBox = document.querySelector('.profile-box');
const viewProfileBtn = document.getElementById('view-profile-btn');
const logoutBtn = document.getElementById('logout-btn');
const usernameDisplay = document.getElementById('username-display');

// 🔒 Récupération du token JWT dans le localStorage
const token = localStorage.getItem('token');

// ✅ Si le token existe, on appelle l'API pour récupérer les infos utilisateur
if (token) {
  fetch('http://localhost:5000/api/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(async response => {
    if (!response.ok) {
      throw new Error('Utilisateur non authentifié');
    }
    const data = await response.json();
    console.log('👀 Données reçues depuis /api/auth/me :', data);


    // 👤 Affiche le nom d'utilisateur
    if (data && data.username) {
      usernameDisplay.textContent = data.username;
    } else {
      usernameDisplay.textContent = 'Utilisateur inconnu';
    }
  })
  .catch(err => {
    console.error('Erreur :', err.message);
    usernameDisplay.textContent = 'Utilisateur non connecté';
  });
} else {
  usernameDisplay.textContent = 'Aucun token trouvé';
}

// ✅ Affichage/Masquage de la boîte profil au clic sur l'image
if (profileImage && profileBox) {
  profileImage.addEventListener('click', () => {
    profileBox.classList.toggle('hidden');
  });

  // 👆 Clique en dehors de la boîte pour la fermer
  document.addEventListener('click', (e) => {
    if (!profileBox.contains(e.target) && !profileImage.contains(e.target)) {
      profileBox.classList.add('hidden');
    }
  });
}

// 🔁 Bouton "Voir / Modifier le profil"
if (viewProfileBtn) {
  viewProfileBtn.addEventListener('click', () => {
    window.location.href = 'userProfil.html'; // à adapter si besoin
  });
}

// 🚪 Déconnexion = suppression du token + redirection
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'nonnzy.html'; // page d'accueil ou login
  });
}
