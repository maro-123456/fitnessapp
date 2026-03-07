require('dotenv').config();
const mongoose = require('mongoose');

// Importer le schéma Exercise
const Exercise = require('./models/Exercise');

// Se connecter à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitnessapp')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Script pour ajouter des exercices de test
async function addTestExercises() {
  try {
    console.log('🏋️ Ajout des exercices de test...');
    
    // Supprimer les anciens exercices
    await Exercise.deleteMany({});
    
    // Créer les exercices avec des données simples
    const exercises = [
      {
        name: "Bicep Curl",
        category: "strength",
        image: "https://i.imgur.com/bicep.jpg",
        difficulty: "intermediate",
        duration: 15,
        calories: 120
      },
      {
        name: "Squat", 
        category: "strength",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
        difficulty: "beginner",
        duration: 20,
        calories: 50
      },
      {
        name: "Traction",
        category: "cardio",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        difficulty: "intermediate",
        duration: 30,
        calories: 200
      },
      {
        name: "Planche",
        category: "flexibility",
        image: "https://images.unsplash.com/photo-1506423246-5f8b1c8c1a?w=400&h=300&fit=crop",
        difficulty: "beginner",
        duration: 30,
        calories: 100
      },
      {
        name: "Burpees",
        category: "cardio",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        difficulty: "beginner",
        duration: 15,
        calories: 100
      }
    ];
    
    // Insérer les nouveaux exercices
    const createdExercises = await Exercise.insertMany(exercises);
    
    console.log(`✅ ${createdExercises.length} exercices créés avec succès !`);
    console.log('\n📋 LISTE DES EXERCICES CRÉÉS:');
    
    createdExercises.forEach((exercise, index) => {
      console.log(`${index + 1}. ${exercise.name} (${exercise.category})`);
    });
    
    return createdExercises;
  } catch (error) {
    console.error('❌ Erreur ajout d\'exercices:', error);
    return [];
  }
}

// Exécuter le script
addTestExercises().then(() => {
  console.log('🎯 Script terminé !');
  mongoose.connection.close();
  process.exit(0);
}).catch(error => {
  console.error('❌ Erreur:', error);
  mongoose.connection.close();
  process.exit(1);
});
