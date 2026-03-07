require('dotenv').config();
const mongoose = require('mongoose');

// Importer le schéma Exercise
const Exercise = require('./models/Exercise');

// Se connecter à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitnessapp')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Script pour ajouter plus d'exercices avec photos
async function addMoreExercises() {
  try {
    console.log('🏋️ Ajout de nouveaux exercices avec photos...');
    
    // Supprimer les anciens exercices
    await Exercise.deleteMany({});
    
    const exercises = [
      // Cardio
      {
        name: "Course à pied",
        category: "cardio",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "beginner",
        duration: 30,
        calories: 300,
        equipment: [],
        instructions: ["Courir à un rythme modéré", "Maintenir une bonne posture", "Respirer régulièrement"],
        muscleGroups: ["legs", "core"],
        description: "Course à pied pour améliorer l'endurance cardiovasculaire"
      },
      {
        name: "Vélo stationnaire",
        category: "cardio",
        image: "https://images.unsplash.com/photo-1540497077202-7c8a89910c28?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "intermediate",
        duration: 25,
        calories: 250,
        equipment: ["vélo stationnaire"],
        instructions: ["Ajuster la selle", "Pédaler à rythme constant", "Varier la résistance"],
        muscleGroups: ["legs", "core"],
        description: "Exercice cardio sur vélo stationnaire"
      },
      {
        name: "Saut à corde",
        category: "cardio",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "intermediate",
        duration: 20,
        calories: 200,
        equipment: ["corde à sauter"],
        instructions: ["Sauter sur la pointe des pieds", "Maintenir le rythme", "Varier les sauts"],
        muscleGroups: ["legs", "core", "arms"],
        description: "Exercice de coordination et cardio"
      },
      
      // Strength
      {
        name: "Bicep Curl",
        category: "strength",
        image: "https://images.unsplash.com/photo-1550345336-09e3ac987658?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "beginner",
        duration: 15,
        calories: 120,
        equipment: ["haltères"],
        instructions: ["Garder les coudes près du corps", "Monter et descendre lentement", "Ne pas balancer"],
        muscleGroups: ["arms"],
        description: "Exercice pour les biceps"
      },
      {
        name: "Squat",
        category: "strength",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "beginner",
        duration: 20,
        calories: 150,
        equipment: ["barre", "poids"],
        instructions: ["Garder le dos droit", "Descendre jusqu'à 90°", "Pousser avec les talons"],
        muscleGroups: ["legs", "core"],
        description: "Exercice fondamental pour les jambes"
      },
      {
        name: "Développé couché",
        category: "strength",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "intermediate",
        duration: 25,
        calories: 180,
        equipment: ["barre", "banc"],
        instructions: ["Garder les coudes à 45°", "Descendre lentement", "Pousser explosivement"],
        muscleGroups: ["chest", "arms", "shoulders"],
        description: "Exercice pour la poitrine"
      },
      {
        name: "Rowing",
        category: "strength",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "intermediate",
        duration: 20,
        calories: 160,
        equipment: ["haltères", "banc"],
        instructions: ["Garder le dos droit", "Tirer avec les dorsaux", "Serrer les omoplates"],
        muscleGroups: ["back", "arms"],
        description: "Exercice pour le dos"
      },
      
      // Flexibility
      {
        name: "Étirement des ischios",
        category: "flexibility",
        image: "https://images.unsplash.com/photo-1506126613408-eca61ce6f13f?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "beginner",
        duration: 15,
        calories: 50,
        equipment: [],
        instructions: ["Assis au sol", "Tendre une jambe", "Maintenir 30 secondes"],
        muscleGroups: ["legs"],
        description: "Étirement des muscles ischio-jambiers"
      },
      {
        name: "Posture du cobra",
        category: "flexibility",
        image: "https://images.unsplash.com/photo-1506126613408-eca61ce6f13f?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "beginner",
        duration: 10,
        calories: 30,
        equipment: ["tapis de yoga"],
        instructions: ["Allongé sur le ventre", "Pousser avec les bras", "Regarder vers le haut"],
        muscleGroups: ["back", "core"],
        description: "Posture de yoga pour la flexibilité"
      },
      {
        name: "Rotation des épaules",
        category: "flexibility",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "beginner",
        duration: 8,
        calories: 20,
        equipment: [],
        instructions: ["Cercles avec les épaules", "Vers l'avant puis l'arrière", "Mouvements lents"],
        muscleGroups: ["shoulders"],
        description: "Mobilité des épaules"
      },
      
      // CrossFit
      {
        name: "Burpees",
        category: "crossfit",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "advanced",
        duration: 15,
        calories: 250,
        equipment: [],
        instructions: ["Position de planche", "Saut vers le haut", "Squat puis planche"],
        muscleGroups: ["chest", "back", "legs", "shoulders", "core", "arms"],
        description: "Exercice complet CrossFit"
      },
      {
        name: "Kettlebell Swing",
        category: "crossfit",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "intermediate",
        duration: 20,
        calories: 200,
        equipment: ["kettlebell"],
        instructions: ["Balançer la kettlebell", "Hanches moteur", "Garder le dos droit"],
        muscleGroups: ["legs", "core", "arms"],
        description: "Exercice CrossFit avec kettlebell"
      },
      {
        name: "Box Jumps",
        category: "crossfit",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "advanced",
        duration: 12,
        calories: 180,
        equipment: ["boîte de saut"],
        instructions: ["Sauter sur la boîte", "Atterrir souplement", "Enchaîner rapidement"],
        muscleGroups: ["legs", "core"],
        description: "Sauts plyométriques"
      },
      
      // Bodyweight
      {
        name: "Pompes",
        category: "bodyweight",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "beginner",
        duration: 15,
        calories: 100,
        equipment: [],
        instructions: ["Position de planche", "Descendre jusqu'au sol", "Pousser avec les bras"],
        muscleGroups: ["chest", "arms", "core"],
        description: "Exercice de base au poids du corps"
      },
      {
        name: "Planche",
        category: "bodyweight",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "advanced",
        duration: 30,
        calories: 150,
        equipment: [],
        instructions: ["Position de planche", "Garder le corps aligné", "Contracter les abdominaux"],
        muscleGroups: ["core", "arms", "shoulders"],
        description: "Exercice de gainage au poids du corps"
      },
      {
        name: "Mountain Climbers",
        category: "bodyweight",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "intermediate",
        duration: 20,
        calories: 180,
        equipment: [],
        instructions: ["Position de planche", "Ramener les genoux", "Alterner rapidement"],
        muscleGroups: ["core", "legs", "arms"],
        description: "Exercice cardio au poids du corps"
      },
      {
        name: "Lunges",
        category: "bodyweight",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "beginner",
        duration: 20,
        calories: 120,
        equipment: [],
        instructions: ["Faire un grand pas", "Descendre jusqu'à 90°", "Revenir à la position debout"],
        muscleGroups: ["legs", "core"],
        description: "Exercice pour les jambes au poids du corps"
      },
      {
        name: "Dips",
        category: "bodyweight",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "intermediate",
        duration: 15,
        calories: 140,
        equipment: ["barres parallèles"],
        instructions: ["Soutenir le corps", "Descendre lentement", "Pousser avec les bras"],
        muscleGroups: ["arms", "chest", "shoulders"],
        description: "Exercice pour les triceps au poids du corps"
      },
      {
        name: "Crunchs",
        category: "bodyweight",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
        difficulty: "beginner",
        duration: 12,
        calories: 80,
        equipment: [],
        instructions: ["Allongé sur le dos", "Main derrière la tête", "Soulever les épaules"],
        muscleGroups: ["core"],
        description: "Exercice pour les abdominaux"
      }
    ];

    // Insérer les exercices
    const result = await Exercise.insertMany(exercises);
    console.log(`✅ ${result.length} exercices ajoutés avec succès!`);
    
    // Afficher les exercices par catégorie
    const categories = ['cardio', 'strength', 'flexibility', 'crossfit', 'bodyweight'];
    for (const category of categories) {
      const count = await Exercise.countDocuments({ category });
      console.log(`📊 ${category}: ${count} exercices`);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    mongoose.connection.close();
  }
}

addMoreExercises();
