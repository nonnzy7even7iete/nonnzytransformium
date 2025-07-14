// 📦 Importation des dépendances nécessaires
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// 📂 Importation des routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// 🚀 Création de l'application Express
const app = express();

// 🧰 Middlewares globaux
app.use(express.json()); // Pour lire les données JSON envoyées par le frontend
app.use(cors());         // Autorise les requêtes depuis un domaine différent

// 📁 Sert les fichiers statiques frontend (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, '../frontend')));

// 📸 Sert les fichiers uploadés par l’utilisateur (images de profil)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🧭 Middleware des routes API
app.use('/api/auth', authRoutes);     // 🔐 Authentification
app.use('/api/users', userRoutes);    // 👤 Gestion du profil utilisateur

// 🔌 Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB');
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion MongoDB :', err.message);
  });

// 🎧 Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
