// 📦 Importation de mongoose pour définir un modèle MongoDB
const mongoose = require('mongoose');

/* ============================================
   🧱 Définition du schéma de l’utilisateur
   (structure des données stockées en base)
============================================ */
const userSchema = new mongoose.Schema({
  // 🧑 Pseudo de l’utilisateur
  username: {
    type: String,
    required: true,   // Obligatoire
    unique: true,     // Aucun doublon autorisé
    trim: true        // Supprime les espaces au début/fin
  },

  // 📧 Adresse e-mail
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,  // Convertit automatiquement en minuscules
    trim: true
  },

  // 🔑 Mot de passe (sera hashé)
  password: {
    type: String,
    required: true,
    minlength: 6
  },

  // 🖼️ Chemin vers l’image de profil (si elle existe)
  avatar: {
    type: String,     // Ex : "/uploads/nomdufichier.jpg"
    default: ''       // Vide par défaut si l'utilisateur n’a rien uploadé
  },

  // 🕒 Date d’inscription
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/* ============================================
   📦 Création et export du modèle
============================================ */
const User = mongoose.model('User', userSchema);
module.exports = User;
