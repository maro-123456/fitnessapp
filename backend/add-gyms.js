require('dotenv').config();
const mongoose = require('mongoose');

// Importer le schéma Gym
const Gym = require('./models/Gym');

// Se connecter à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitnessapp')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Script pour ajouter des salles de sport
async function addGyms() {
  try {
    console.log('🏋️ Ajout des salles de sport...');
    
    // Supprimer les anciennes salles
    await Gym.deleteMany({});
    
    const gyms = [
      {
        name: "FitLife Paris",
        address: "123 Rue de la Santé",
        city: "Paris",
        coordinates: { lat: 48.8366, lng: 2.3542 },
        facilities: ["cardio", "weights", "group_classes", "showers", "lockers"],
        openingHours: {
          monday: { open: "06:00", close: "23:00" },
          tuesday: { open: "06:00", close: "23:00" },
          wednesday: { open: "06:00", close: "23:00" },
          thursday: { open: "06:00", close: "23:00" },
          friday: { open: "06:00", close: "23:00" },
          saturday: { open: "07:00", close: "21:00" },
          sunday: { open: "08:00", close: "20:00" }
        },
        priceRange: "$$",
        rating: { average: 4.5, count: 128 },
        description: "Salle de sport moderne avec équipements de pointe"
      },
      {
        name: "Muscle Club Lyon",
        address: "45 Avenue Jean Jaurès",
        city: "Lyon",
        coordinates: { lat: 45.7786, lng: 4.8534 },
        facilities: ["weights", "group_classes", "showers", "lockers"],
        openingHours: {
          monday: { open: "07:00", close: "22:00" },
          tuesday: { open: "07:00", close: "22:00" },
          wednesday: { open: "07:00", close: "22:00" },
          thursday: { open: "07:00", close: "22:00" },
          friday: { open: "07:00", close: "22:00" },
          saturday: { open: "08:00", close: "20:00" },
          sunday: { open: "09:00", close: "19:00" }
        },
        priceRange: "$$",
        rating: { average: 4.2, count: 89 },
        description: "Salle spécialisée musculation et cardio"
      },
      {
        name: "CrossFit Box Marseille",
        address: "78 Rue Paradis",
        city: "Marseille",
        coordinates: { lat: 43.2965, lng: 5.3698 },
        facilities: ["weights", "group_classes", "showers", "lockers"],
        openingHours: {
          monday: { open: "06:00", close: "21:00" },
          tuesday: { open: "06:00", close: "21:00" },
          wednesday: { open: "06:00", close: "21:00" },
          thursday: { open: "06:00", close: "21:00" },
          friday: { open: "06:00", close: "21:00" },
          saturday: { open: "07:00", close: "18:00" },
          sunday: { open: "08:00", close: "16:00" }
        },
        priceRange: "$$$",
        rating: { average: 4.8, count: 67 },
        description: "Box CrossFit professionnelle avec coachs certifiés"
      },
      {
        name: "Yoga Studio Bordeaux",
        address: "12 Place de la Victoire",
        city: "Bordeaux",
        coordinates: { lat: 44.8378, lng: -0.5792 },
        facilities: ["group_classes", "showers", "lockers"],
        openingHours: {
          monday: { open: "07:00", close: "20:00" },
          tuesday: { open: "07:00", close: "20:00" },
          wednesday: { open: "07:00", close: "20:00" },
          thursday: { open: "07:00", close: "20:00" },
          friday: { open: "07:00", close: "20:00" },
          saturday: { open: "08:00", close: "18:00" },
          sunday: { open: "09:00", close: "17:00" }
        },
        priceRange: "$",
        rating: { average: 4.6, count: 45 },
        description: "Studio dédié au yoga et bien-être"
      },
      {
        name: "Elite Fitness Lille",
        address: "89 Rue Esquermoise",
        city: "Lille",
        coordinates: { lat: 50.6292, lng: 3.0573 },
        facilities: ["cardio", "weights", "pool", "sauna", "group_classes", "showers", "lockers"],
        openingHours: {
          monday: { open: "05:30", close: "23:30" },
          tuesday: { open: "05:30", close: "23:30" },
          wednesday: { open: "05:30", close: "23:30" },
          thursday: { open: "05:30", close: "23:30" },
          friday: { open: "05:30", close: "23:30" },
          saturday: { open: "06:00", close: "22:00" },
          sunday: { open: "07:00", close: "21:00" }
        },
        priceRange: "$$$$",
        rating: { average: 4.7, count: 156 },
        description: "Club premium avec toutes les commodités"
      }
    ];
    
    // Ajouter les salles de sport
    const insertedGyms = await Gym.insertMany(gyms);
    console.log(`✅ ${insertedGyms.length} salles de sport ajoutées avec succès!`);
    
    // Afficher les salles ajoutées
    console.log('\n📋 Salles de sport ajoutées:');
    insertedGyms.forEach(gym => {
      console.log(`🏋️ ${gym.name} - ${gym.coordinates.lat}, ${gym.coordinates.lng}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    mongoose.connection.close();
  }
}

addGyms();
