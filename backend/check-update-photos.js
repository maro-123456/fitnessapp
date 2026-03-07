require('dotenv').config();
const mongoose = require('mongoose');
const Exercise = require('./models/Exercise');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitnessapp')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

async function checkAndUpdatePhotos() {
  try {
    // Récupérer tous les exercices
    const exercises = await Exercise.find({});
    console.log('📋 Exercices actuels:');
    exercises.forEach(ex => {
      console.log(`- ${ex.name} (${ex.category})`);
    });
    
    // Photos spécifiques pour chaque exercice
    const photoMap = {
      "Course à pied": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Vélo stationnaire": "https://images.unsplash.com/photo-1558618047-3c8c5c2f4245?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Saut à corde": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Bicep Curl": "https://images.unsplash.com/photo-1583450416278-24e2d6e4c9b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Squat": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Développé couché": "https://images.unsplash.com/photo-1583450416278-24e2d6e4c9b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Rowing": "https://images.unsplash.com/photo-1518611012388-79444f797f0c?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Étirement des ischios": "https://images.unsplash.com/photo-1506126613408-eca61ce6f13f?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Posture du cobra": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Rotation des épaules": "https://images.unsplash.com/photo-1599908486966-8e9b6c4a5b9a?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Burpees": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Kettlebell Swing": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Box Jumps": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Pompes": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Planche": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Mountain Climbers": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Lunges": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Dips": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      "Crunchs": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop"
    };
    
    console.log('\n🖼️ Mise à jour des photos...');
    
    // Mettre à jour chaque exercice avec la photo appropriée
    for (const exercise of exercises) {
      if (photoMap[exercise.name]) {
        await Exercise.updateOne(
          { _id: exercise._id },
          { image: photoMap[exercise.name] }
        );
        console.log(`✅ Photo mise à jour: ${exercise.name}`);
      } else {
        // Si l'exercice n'a pas de photo spécifique, utiliser une photo générique
        const genericPhoto = `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop`;
        await Exercise.updateOne(
          { _id: exercise._id },
          { image: genericPhoto }
        );
        console.log(`🔄 Photo générique mise à jour: ${exercise.name}`);
      }
    }
    
    console.log('\n🎯 Toutes les photos ont été mises à jour!');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkAndUpdatePhotos();
