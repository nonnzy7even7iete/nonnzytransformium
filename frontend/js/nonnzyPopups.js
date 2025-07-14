document.addEventListener('DOMContentLoaded', () => {
       const btnRegister = document.getElementById('btn-register');
       const btnLogin = document.getElementById('btn-login');
       const popupRegister = document.getElementById('popup-register');
       const popupLogin = document.getElementById('popup-login');
     
       // Fonction pour basculer l'affichage d'un popup et fermer l'autre
       function togglePopup(popupToToggle, otherPopup) {
         if (popupToToggle.hasAttribute('hidden')) {
           popupToToggle.removeAttribute('hidden');
           otherPopup.setAttribute('hidden', '');
         } else {
           popupToToggle.setAttribute('hidden', '');
         }
       }
     
       btnRegister.addEventListener('click', (e) => {
         e.stopPropagation(); // Empêche le clic de remonter au document
         togglePopup(popupRegister, popupLogin);
       });
     
       btnLogin.addEventListener('click', (e) => {
         e.stopPropagation();
         togglePopup(popupLogin, popupRegister);
       });
     
       // Cliquer n'importe où en dehors des popups et boutons ferme les popups
       document.addEventListener('click', () => {
         popupRegister.setAttribute('hidden', '');
         popupLogin.setAttribute('hidden', '');
       });
     
       // Empêcher la fermeture quand on clique à l'intérieur du popup (formulaire)
       popupRegister.addEventListener('click', (e) => {
         e.stopPropagation();
       });
       popupLogin.addEventListener('click', (e) => {
         e.stopPropagation();
       });
     });
     