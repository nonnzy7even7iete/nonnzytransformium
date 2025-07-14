// ✅ Importation du modèle User
const User = require('../models/user');

exports.updateUserProfile = async (req, res) => {
  try {
    console.log("📥 Requête de mise à jour de profil reçue !");

    // 🔐 ID de l'utilisateur connecté
    const userId = req.user.userId;

    // ✅ Récupération du nouveau pseudo
    const username = req.body.username;

    // 🧾 Préparation des données à mettre à jour
    const updateData = { username };

    // 📎 Si une nouvelle image est envoyée
    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }

    // 🛠 Mise à jour du document MongoDB
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    // 🔁 Renvoi des infos mises à jour au frontend
    res.json({
      username: updatedUser.username,
      avatar: updatedUser.avatar,
    });

  } catch (err) {
    console.error("❌ Erreur lors de la mise à jour du profil :", err);
    res.status(500).json({ message: "Erreur serveur pendant la mise à jour." });
  }
};
