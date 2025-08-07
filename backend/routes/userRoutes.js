// 📦 Importation des modules nécessaires
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

// 🧠 Importation de la fonction qui met à jour le profil
const { updateUserProfile } = require('../controllers/userController');

// 🔐 Middleware de sécurité : vérifie le token
const authMiddleware = require('../middleware/auth');

// 🎒 Configuration de multer pour le stockage des images
const storage = multer.diskStorage({
  // Où enregistrer les fichiers
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  // Comment les nommer (ex: 1720156722.jpg)
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage }); // Middleware prêt à gérer les fichiers

// 🚀 Route POST : mise à jour du profil (pseudo + image)
router.post('/update', authMiddleware, upload.single('avatar'), updateUserProfile);

// 📤 Exportation du routeur
module.exports = router;

