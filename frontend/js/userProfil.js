// ✅ Attendre que le DOM soit totalement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  // Si l'utilisateur n'est pas connecté → redirection
  if (!token) {
    alert("Accès refusé : vous devez être connecté.");
    window.location.href = "index.html";
    return;
  }

  // Charger le profil de l'utilisateur
  await loadUserProfile();
});

// Variable globale pour stocker l'image sélectionnée
let photoFile = null;

/**
 * 📡 Notifier les autres pages (et la page actuelle) qu'un avatar a été mis à jour
 * Cela permet de rafraîchir les images sur toutes les pages sans recharger le site
 */
function notifyAvatarUpdate(newAvatarUrl) {
  console.log('📡 Signal envoyé: avatar mis à jour ->', newAvatarUrl);

  // Sauvegarde temporaire dans localStorage pour partager l'info
  localStorage.setItem('avatarUpdated', newAvatarUrl);

  // Déclencher un événement personnalisé dans la page actuelle
  window.dispatchEvent(new CustomEvent('avatarChanged', {
    detail: { avatarUrl: newAvatarUrl }
  }));

  // Nettoyage automatique après 5 secondes
  setTimeout(() => {
    localStorage.removeItem('avatarUpdated');
  }, 5000);
}

/**
 * 🔄 Charger les infos de l'utilisateur depuis le backend
 */
async function loadUserProfile() {
  console.log("🔄 Chargement du profil utilisateur...");
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    // Appel API pour récupérer les infos utilisateur
    const res = await fetch("http://localhost:5000/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) throw new Error("Échec de récupération du profil.");

    const data = await res.json();
    console.log("✅ Profil chargé:", data);

    // Mettre à jour le champ username (input)
    const usernameInput = document.getElementById("username");
    if (usernameInput) {
      usernameInput.value = data.username || "";
    }

    // 👤 Mise à jour du nom d'utilisateur dans le header (ajouté)
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
      usernameDisplay.textContent = data.username || 'Utilisateur inconnu';
    }

    // Construire l'URL de l'image de profil
    const avatarUrl = data.avatar
      ? `http://localhost:5000${data.avatar}?t=${Date.now()}` // forcer le rafraîchissement
      : "./images/defaultavatar.jpg";

    console.log("🔄 Tentative de chargement de l'image:", avatarUrl);

    // 🔧 CORRECTION: Appeler les deux fonctions de mise à jour
    await updateProfileImage(avatarUrl);  // Pour les images de profil principales
    updateHeaderAvatar(avatarUrl);        // Pour l'avatar du header

  } catch (err) {
    console.error("❌ Erreur lors du chargement du profil:", err);
  }
}

/**
 * 🖼️ Mettre à jour l'image de profil dans tous les endroits du DOM
 */
async function updateProfileImage(imageUrl) {
  // Sélectionner toutes les balises qui portent l'avatar (SAUF celle du header)
  const profileImgs = document.querySelectorAll("#profile-img:not(.header-avatar)");
  const fullImage = document.getElementById("full-image");

  // Vérifier si on a bien trouvé des images
  if (!profileImgs.length) {
    console.warn("⚠️ Aucun élément avec l'ID #profile-img trouvé (hors header) !");
  }

  // Mettre à jour toutes les images #profile-img
  profileImgs.forEach(img => {
    img.src = ''; // vider le src avant pour forcer le navigateur à recharger
    img.src = imageUrl;

    // Gestion du succès et de l'erreur de chargement
    img.onload = () => {
      console.log("✅ Image chargée avec succès:", imageUrl);
    };
    img.onerror = () => {
      console.error("❌ Erreur de chargement de l'image:", imageUrl);
      img.src = "./images/defaultavatar.jpg"; // Fallback vers l'image par défaut
    };
  });

  // Mettre à jour l'image plein écran si elle existe
  if (fullImage) {
    fullImage.src = '';
    fullImage.src = imageUrl;
  }

  console.log(`✅ ${profileImgs.length} image(s) de profil mise(s) à jour`);
}

/**
 * 📸 Fonction pour mettre à jour l'avatar du header (reprise du 2ème fichier)
 */
function updateHeaderAvatar(avatarUrl) {
  console.log('🖼️ Mise à jour avatar header:', avatarUrl);

  // Sélectionner spécifiquement l'avatar du header
  const headerProfileImg = document.querySelector('#profile-img.header-avatar, .profile-image #profile-img');

  if (headerProfileImg && avatarUrl) {
    // Animation de transition
    headerProfileImg.classList.add('updating');

    // Forcer le rechargement de l'image avec timestamp
    const imageUrl = avatarUrl.startsWith('http')
      ? avatarUrl
      : `http://localhost:5000${avatarUrl}`;

    // Précharger l'image avant de l'afficher
    const newImg = new Image();
    newImg.onload = () => {
      headerProfileImg.src = `${imageUrl}?t=${Date.now()}`;
      // Retirer l'animation après chargement
      setTimeout(() => {
        headerProfileImg.classList.remove('updating');
      }, 200);
    };
    newImg.onerror = () => {
      console.error('❌ Erreur chargement nouvel avatar, conservation de l\'actuel');
      headerProfileImg.classList.remove('updating');
    };
    newImg.src = `${imageUrl}?t=${Date.now()}`;

    // Sauvegarder pour les autres pages
    localStorage.setItem('currentAvatar', avatarUrl);
  }
}

/**
 * ✏️ Fonction pour mettre à jour le profil (username + avatar)
 */
async function updateProfile() {
  console.log("🚀 Début de updateProfile");

  const token = localStorage.getItem("token");
  const newUsername = document.getElementById("username")?.value;

  // Vérifier qu'un fichier a été sélectionné
  console.log("🔍 Fichier dans updateProfile:", photoFile ? photoFile.name : "AUCUN FICHIER");

  if (!newUsername && !photoFile) {
    alert("Veuillez modifier au moins un champ.");
    return;
  }

  console.log("📸 Fichier sélectionné:", photoFile?.name || "aucun", photoFile?.size, photoFile?.type);

  try {
    // Préparer les données pour l'envoi
    const formData = new FormData();
    if (newUsername) formData.append("username", newUsername);
    if (photoFile) formData.append("avatar", photoFile);

    console.log("📤 Envoi de la requête de mise à jour...");

    /**
     * 🔁 Système de retry : retente 3 fois en cas d'échec
     */
    const makeRequest = async (attempt = 1) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // Timeout 60s

        const response = await fetch("http://localhost:5000/api/users/update", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData,
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log("📥 Réponse reçue, status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur serveur: ${response.status} - ${errorText}`);
        }

        return await response.json();

      } catch (error) {
        console.error(`❌ Tentative ${attempt} échouée:`, error.message);

        if (attempt < 3 && error.name !== 'AbortError') {
          console.log(`🔄 Retry dans 2 secondes... (${attempt}/3)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          return makeRequest(attempt + 1);
        }
        throw error;
      }
    };

    // Récupération de la réponse du serveur
    const data = await makeRequest();
    console.log("📋 Données reçues du serveur:", data);

    // ✅ Mise à jour de l'image
    if (data.avatarUrl) {
      notifyAvatarUpdate(data.avatarUrl); // Notifier les autres pages

      // Forcer un petit délai pour que le serveur ait bien enregistré l'image
      setTimeout(async () => {
        const imageUrl = `http://localhost:5000${data.avatarUrl}?t=${Date.now()}`;
        await updateProfileImage(imageUrl);  // Mettre à jour l'image principale
        updateHeaderAvatar(imageUrl);        // Mettre à jour l'avatar du header
      }, 500);
    }

    // ✅ Mise à jour du nom d'utilisateur
    if (data.username) {
      const usernameInput = document.getElementById("username");
      if (usernameInput) {
        usernameInput.value = data.username;
      }

      // Mettre à jour aussi le nom dans le header
      const usernameDisplay = document.getElementById('username-display');
      if (usernameDisplay) {
        usernameDisplay.textContent = data.username;
      }
    }

    alert("Profil mis à jour avec succès !");
    resetFileInput();

  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour :", error);

    // Si le serveur a quand même traité malgré un "Failed to fetch"
    if (error.message.includes("Failed to fetch")) {
      console.log("⚠️ Serveur a traité la requête malgré l'erreur - mise à jour forcée...");
      setTimeout(async () => {
        await loadUserProfile();
      }, 1000);
    }
  }
}

/**
 * 🗑️ Réinitialiser le champ input file après mise à jour
 */
function resetFileInput() {
  const input = document.getElementById("upload-photo");
  if (input) input.value = "";
  photoFile = null;
}

// =======================================================================
// 🔧 INTÉGRATION DU CODE DU HEADER (ajouté depuis le 2ème fichier)
// =======================================================================

// 🌟 Sélection des éléments du header
const profileImage = document.querySelector('.profile-image');
const profileBox = document.querySelector('.profile-box');
const viewProfileBtn = document.getElementById('view-profile-btn');
const logoutBtn = document.getElementById('logout-btn');

// 🎧 Écouter les changements d'avatar depuis d'autres pages
window.addEventListener('storage', (e) => {
  if (e.key === 'avatarUpdated' && e.newValue) {
    console.log('🔔 Avatar mis à jour depuis une autre page!');
    const newAvatarUrl = e.newValue;
    updateHeaderAvatar(newAvatarUrl);
    // Nettoyer le signal
    localStorage.removeItem('avatarUpdated');
  }
});

// 📱 Écouter quand on revient sur cette page (focus)
window.addEventListener('focus', () => {
  console.log('🔍 Page redevient active - vérification avatar...');

  // Vérifier s'il y a eu une mise à jour d'avatar
  const updatedAvatar = localStorage.getItem('avatarUpdated');
  if (updatedAvatar) {
    updateHeaderAvatar(updatedAvatar);
    localStorage.removeItem('avatarUpdated');
  }
});

// 🔙 Écouter la navigation avec les boutons du navigateur (Précédent/Suivant)
window.addEventListener('pageshow', (event) => {
  console.log('🔄 Événement pageshow détecté - Navigation navigateur');

  // Vérifier s'il y a eu une mise à jour d'avatar
  const updatedAvatar = localStorage.getItem('avatarUpdated');
  if (updatedAvatar) {
    console.log('🔙 Avatar mis à jour détecté via navigation navigateur:', updatedAvatar);
    updateHeaderAvatar(updatedAvatar);
    localStorage.removeItem('avatarUpdated');
  }

  // Si c'est un retour depuis le cache (bouton Précédent)
  if (event.persisted) {
    console.log('🔄 Page chargée depuis le cache navigateur - rechargement avatar...');
    // Recharger le profil pour être sûr d'avoir la dernière version
    setTimeout(() => {
      loadUserProfile();
    }, 100);
  }
});

// 🔗 Écouter les changements d'URL via l'historique du navigateur
window.addEventListener('popstate', (event) => {
  console.log('🔙 Navigation via historique navigateur détectée');

  // Vérifier et mettre à jour l'avatar
  const updatedAvatar = localStorage.getItem('avatarUpdated');
  if (updatedAvatar) {
    updateHeaderAvatar(updatedAvatar);
    localStorage.removeItem('avatarUpdated');
  }
});

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
  ` `
}
// 🔁 Bouton "Voir / Modifier le profil"
if (viewProfileBtn) {
  viewProfileBtn.addEventListener('click', () => {
    window.location.href = 'userProfil.html';
  });
}

// 🚪 Déconnexion = suppression du token + redirection
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentAvatar');
    localStorage.removeItem('avatarUpdated');
    window.location.href = 'index.html';
  });
}

// =======================================================================
// 🎯 EVENT LISTENERS POUR LA GESTION DE PROFIL
// =======================================================================

/**
 * 🎯 Gestion de la sélection d'un fichier (input file)
 */
document.getElementById("upload-photo")?.addEventListener("change", (e) => {
  photoFile = e.target.files[0] || null;
});

/**
 * 🎯 Bouton "Mettre à jour le profil"
 */
document.getElementById("update-profile")?.addEventListener("click", updateProfile);