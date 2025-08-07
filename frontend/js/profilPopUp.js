// 🖼️ Logique d'ouverture/fermeture du popup de photo de profil
document.addEventListener("DOMContentLoaded", () => {

       // Sélection des éléments
       const showFullImgBtn = document.querySelector('#show-full-img');
       const imagePopup = document.querySelector('#image-popup');
       const fullImage = document.querySelector('#full-image');
       const closePopupBtn = document.querySelector('#close-popup');
       const profileImg = document.querySelector('.profil-left .user-img');

       // 👁️ Ouvrir le popup quand on clique sur "Voir la photo"
       if (showFullImgBtn && imagePopup && fullImage && profileImg) {
              showFullImgBtn.addEventListener('click', (e) => {
                     e.preventDefault();

                     // Copier l'image actuelle du profil dans le popup
                     fullImage.src = profileImg.src;

                     // Afficher le popup
                     imagePopup.classList.remove('hidden');
              });
       }

       // ❌ Fermer le popup avec le bouton X
       if (closePopupBtn && imagePopup) {
              closePopupBtn.addEventListener('click', (e) => {
                     e.preventDefault();
                     imagePopup.classList.add('hidden');
              });
       }

       // ❌ Fermer le popup en cliquant à côté de l'image
       if (imagePopup) {
              imagePopup.addEventListener('click', (e) => {
                     // Si on clique sur le fond (pas sur l'image ou le bouton)
                     if (e.target === imagePopup) {
                            imagePopup.classList.add('hidden');
                     }
              });
       }
});