require('dotenv').config();
const mongoose = require('mongoose');

// Importer le schéma Exercise
const Exercise = require('./models/Exercise');

// Se connecter à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitnessapp')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Script pour modifier les photos des exercices
async function updateExercisePhotos() {
  try {
    console.log('🖼️ Mise à jour des photos des exercices...');
    
    // Photos spécifiques pour chaque exercice
    const exercisePhotos = {
      // Cardio
      "Course à pied": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Vélo stationnaire": "https://images.unsplash.com/photo-1558618047-3c8c5c2f4245?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Saut à corde": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      
      // Strength
      "Bicep Curl": "https://images.unsplash.com/photo-1583450416278-24e2d6e4c9b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Squat": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Développé couché": "https://images.unsplash.com/photo-1583450416278-24e2d6e4c9b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Rowing": "https://images.unsplash.com/photo-1518611012388-79444f797f0c?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      
      // Flexibility
      "Étirement des ischios": "https://images.unsplash.com/photo-1506126613408-eca61ce6f13f?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Posture du cobra": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Rotation des épaules": "https://images.unsplash.com/photo-1599908486966-8e9b6c4a5b9a?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      
      // CrossFit
      "Burpees": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Kettlebell Swing": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Box Jumps": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      
      // Bodyweight
      "Pompes": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Planche": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Mountain Climbers": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Lunges": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Dips": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Crunchs": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop"
    };
    
    // Mettre à jour chaque exercice avec sa photo spécifique
    for (const [exerciseName, imageUrl] of Object.entries(exercisePhotos)) {
      const result = await Exercise.updateOne(
        { name: exerciseName },
        { image: imageUrl }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Photo mise à jour pour: ${exerciseName}`);
      } else {
        console.log(`⚠️ Exercice non trouvé: ${exerciseName}`);
      }
    }
    
    console.log('🎯 Toutes les photos ont été mises à jour!');
    
    // Afficher les exercices avec leurs nouvelles photos
    const exercises = await Exercise.find({});
    console.log('\n📋 Liste des exercices avec photos mises à jour:');
    exercises.forEach(ex => {
      console.log(`🏋️ ${ex.name} - ${ex.category} - ${ex.image.substring(0, 50)}...`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateExercisePhotos();
