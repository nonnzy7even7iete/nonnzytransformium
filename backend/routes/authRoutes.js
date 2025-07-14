// Importation d’Express pour créer un routeur
const express = require('express');

// Création du routeur Express
const router = express.Router();

// Importation des fonctions d'inscription et de connexion
const { registerUser, loginUser , getUserProfile} = require('../controllers/authController');

// Importe le middleware d'authentification (celui qui vérifie le token)
const authMiddleware = require('../middleware/auth');


// 🔒 ROUTE D’INSCRIPTION : POST /api/auth/register
// Permet à un utilisateur de s’inscrire (envoyer username, email, password)
router.post('/register', registerUser);

// 🔐 ROUTE DE CONNEXION : POST /api/auth/login
// Permet à un utilisateur de se connecter avec son email et son mot de passe
router.post('/login', loginUser);

// Route profil utilisateur (protégée par le middleware)
router.get('/me', authMiddleware, getUserProfile);

// Exportation du routeur pour l’utiliser dans server.js
module.exports = router;
