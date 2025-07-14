// 🎯 Récupération des éléments DOM
const profileImg = document.getElementById("profile-img");
const fullImage = document.getElementById("full-image");
const showFullImgBtn = document.getElementById("show-full-img");
const imagePopup = document.getElementById("image-popup");
const closePopupBtn = document.getElementById("close-popup");
const uploadPhotoInput = document.getElementById("upload-photo");
const usernameInput = document.getElementById("username");
const editUsernameBtn = document.getElementById("edit-username");
const logoutBtn = document.getElementById("logout-btn");

// 📌 1. Affichage de la photo de profil en grand
showFullImgBtn.addEventListener("click", () => {
  fullImage.src = profileImg.src;
  imagePopup.classList.remove("hidden");
});

// 📌 2. Fermeture de la popup d’image
closePopupBtn.addEventListener("click", () => {
  imagePopup.classList.add("hidden");
});

// 📌 3. Changement de la photo de profil
uploadPhotoInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    profileImg.src = reader.result;
    fullImage.src = reader.result;
    // 💡 Tu peux ici ajouter une requête fetch() pour envoyer la nouvelle image au backend
  };
  reader.readAsDataURL(file);
});

// 📌 4. Modification du username
editUsernameBtn.addEventListener("click", () => {
  const newUsername = usernameInput.value.trim();
  if (!newUsername) return alert("Le nom d'utilisateur ne peut pas être vide.");
  
  // 💡 Ajoute ici la logique fetch POST/PUT vers ton backend
  console.log("Username modifié :", newUsername);
  alert("Nom d'utilisateur mis à jour !");
});

// 📌 5. Déconnexion
logoutBtn.addEventListener("click", () => {
  // 🧼 Suppression du token local
  localStorage.removeItem("token");
  
  // 🔒 Redirection vers la page de connexion
  window.location.href = "nonnzy.html"; // ou autre nom de page selon ton projet
});
