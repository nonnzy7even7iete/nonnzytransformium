// 📦 Importation des dépendances nécessaires
const User = require('../models/user');         // Modèle mongoose
const bcrypt = require('bcryptjs');             // Pour hacher les mots de passe
const jwt = require('jsonwebtoken');            // Pour générer et vérifier les tokens
require('dotenv').config();                     // Pour charger les variables d’environnement

/* ============================================
   📌 Contrôleur : Inscription d’un utilisateur
============================================ */
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hachage sécurisé du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Création du nouvel utilisateur
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Génération du token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    console.log("✅ Utilisateur inscrit :", newUser.username);

    // Réponse au frontend
    res.status(201).json({
      message: '✅ Utilisateur inscrit et connecté avec succès',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });

  } catch (err) {
    console.error('❌ Erreur pendant inscription :', err);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
};

/* =============================================
   📌 Contrôleur : Connexion d’un utilisateur
============================================= */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifie que l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe invalide' });
    }

    // Vérifie le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe invalide' });
    }

    // Génération du token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '365d' }
    );

    console.log("✅ Utilisateur connecté :", user.username);

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error('❌ Erreur pendant connexion :', err);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};

/* =====================================================
   📌 Contrôleur : Récupérer les infos du profil connecté
===================================================== */
exports.getUserProfile = async (req, res) => {
  try {
    console.log("🛡️ Requête profil reçue. ID utilisateur :", req.user?.userId);

    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);

  } catch (err) {
    console.error('❌ Erreur lors de la récupération du profil :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
