const User = require('../models/user');

exports.updateUserProfile = async (req, res) => {
  try {
    console.log("🔥 DÉBUT updateUserProfile");
    console.log("📥 req.body:", req.body);
    console.log("📸 req.file:", req.file);
    console.log("🔐 req.user:", req.user);

    const userId = req.user.userId;
    const updateData = {};
    
    // Mise à jour du username si fourni
    if (req.body.username) {
      updateData.username = req.body.username;
      console.log("📝 Nouveau username:", req.body.username);
    }
    
    // Mise à jour de l'avatar si un fichier est uploadé
    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
      console.log("📸 Nouveau avatar:", updateData.avatar);
    }

    console.log("🔄 Données à mettre à jour:", updateData);
    
    // Mise à jour en base de données
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { 
      new: true // Retourne le document mis à jour
    });
    
    if (!updatedUser) {
      console.log("❌ Utilisateur non trouvé");
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    console.log("✅ Utilisateur mis à jour:", updatedUser.username);
    
    // Réponse de succès
    const response = {
      message: "Profil mis à jour avec succès",
      username: updatedUser.username,
      avatarUrl: updatedUser.avatar
    };
    
    console.log("📤 Envoi de la réponse:", response);
    res.status(200).json(response);
    console.log("🎉 Réponse envoyée avec succès !");
    
  } catch (err) {
    console.error("❌ Erreur lors de la mise à jour du profil:", err);
    res.status(500).json({ 
      message: "Erreur serveur pendant la mise à jour",
      error: err.message 
    });
  }
};