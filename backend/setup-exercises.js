const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'sports', 'yoga', 'crossfit', 'bodyweight'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  duration: {
    type: Number,
    required: true
  },
  calories: {
    type: Number,
    default: 0
  },
  equipment: [{
    type: String
  }],
  instructions: [{
    type: String
  }],
  muscleGroups: [{
    type: String,
    enum: ['chest', 'back', 'legs', 'shoulders', 'core', 'arms', 'legs']
  }],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Exercise", exerciseSchema);

// Script pour ajouter des exercices de test
async function addTestExercises() {
  try {
    const exercises = [
      {
        name: "Bicep Curl",
        category: "arms",
        description: "Exercice de biceps curling avec haltères",
        image: "https://i.imgur.com/bicep.jpg",
        difficulty: "intermediate",
        duration: 15,
        calories: 120,
        equipment: ["dumbbells", "bench", "resistance bands"],
        instructions: ["3 séries de 10 répétitions", "Pause 60s entre chaque série"],
        muscleGroups: ["biceps", "forearms"]
      },
      {
        name: "Squatat", 
        category: "legs",
        description: "Squat classique avec poids du corps",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
        difficulty: "beginner",
        duration: 20,
        calories: 50,
        equipment: ["barbell", "rack"],
        instructions: ["3 séries de 15 répétitions", "Descendre jusqu'à parallèle"],
        muscleGroups: ["quads", "hamstrings", "glutes"]
      },
      {
        name: "Traction",
        category: "cardio",
        description: "Traction sur tapis roulant",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        difficulty: "intermediate",
        duration: 30,
        calories: 200,
        equipment: ["treadmill", "rope"],
        instructions: ["30 minutes d'échauffement constant"],
        muscleGroups: ["legs", "core"]
      },
      {
        name: "Planche",
        category: "flexibility",
        description: "Planche et étirements de souples",
        image: "https://images.unsplash.com/photo-1506423246-5f8b1c8c1a?w=400&h=300&fit=crop",
        difficulty: "beginner",
        duration: 30,
        calories: 100,
        equipment: ["yoga mat", "blocks", "straps"],
        instructions: ["Postures tenues", "Respiration consciente"],
        muscleGroups: ["core", "flexibility"]
      },
      {
        name: "Burpees",
        category: "cardio",
        description: "Exercice de burpees rapides",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        difficulty: "beginner",
        duration: 15,
        calories: 100,
        equipment: ["tapis"],
        instructions: ["4 séries de 15 burpees", "Explosion sur la poussée"],
        muscleGroups: ["chest", "shoulders", "triceps"]
      }
    ];

    // Supprimer les anciens exercices
    await mongoose.model('Exercise').deleteMany({});
    
    // Ajouter les nouveaux exercices
    const createdExercises = await mongoose.model('Exercise').insertMany(exercises);
    
    console.log(`✅ ${createdExercises.length} exercices créés avec succès !`);
    
    return createdExercises;
  } catch (error) {
    console.error('❌ Erreur ajout d\'exercices:', error);
    return [];
  }
}

module.exports = mongoose.model("Exercise", exerciseSchema);
