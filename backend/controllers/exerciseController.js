const Exercise = require("../models/Exercise");
const User = require("../models/User");


// GET ALL EXERCISES
exports.getExercises = async (req, res) => {
  const exercises = await Exercise.find();
  res.json(exercises);
};


// GET FAVORITES
exports.getFavorites = async (req, res) => {
  try {
    console.log("Get favorites - User ID:", req.user.id);
    
    const user = await User.findById(req.user.id).populate("favorites");
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    console.log("User favorites:", user.favorites);
    res.json(user.favorites || []);
  } catch (error) {
    console.error("Error in getFavorites:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


// ADD OR REMOVE FAVORITE
exports.toggleFavorite = async (req, res) => {
  try {
    console.log("Toggle favorite - User ID:", req.user.id);
    console.log("Toggle favorite - Exercise ID:", req.params.id);
    
    const user = await User.findById(req.user.id);
    const exerciseId = req.params.id;

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // S'assurer que le tableau favorites existe
    if (!user.favorites) {
      user.favorites = [];
    }

    const index = user.favorites.indexOf(exerciseId);
    console.log("Current favorites:", user.favorites);
    console.log("Exercise index in favorites:", index);

    if (index === -1) {
      // Ajouter aux favoris
      user.favorites.push(exerciseId);
      console.log("Added to favorites");
    } else {
      // Retirer des favoris
      user.favorites.splice(index, 1);
      console.log("Removed from favorites");
    }

    await user.save();
    console.log("User saved successfully");
    
    res.json({ 
      message: index === -1 ? "Ajouté aux favoris" : "Retiré des favoris",
      favorites: user.favorites 
    });
  } catch (error) {
    console.error("Error in toggleFavorite:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};