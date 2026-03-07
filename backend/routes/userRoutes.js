const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Mettre à jour le profil utilisateur
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, age, weight, goal, language } = req.body;
    
    // Validation
    const updateData = {};
    if (name) updateData.name = name;
    if (age) updateData.age = parseInt(age);
    if (weight) updateData.weight = parseFloat(weight);
    if (goal) updateData.goal = goal;
    if (language) updateData.language = language;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      message: 'Profil mis à jour avec succès',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        weight: user.weight,
        goal: user.goal,
        language: user.language
      }
    });
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir les statistiques de l'utilisateur
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Statistiques de démonstration (à remplacer avec des vraies données)
    const stats = {
      totalWorkouts: 45,
      totalCaloriesBurned: 12500,
      avgWorkoutDuration: 45,
      favoriteExercise: "Développé couché",
      currentStreak: 12,
      longestStreak: 21,
      achievements: ["Premier entraînement", "Semaine parfaite", "Objectif atteint"],
      level: "Intermédiaire",
      experiencePoints: 1250,
      nextLevelPoints: 250
    };

    res.json(stats);
  } catch (error) {
    console.error('Erreur stats utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
