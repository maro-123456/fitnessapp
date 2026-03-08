require('dotenv').config();
const mongoose = require('mongoose');

// Importer le schéma Gym
const Gym = require('./models/Gym');

// Se connecter à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitnessapp')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Script pour ajouter des salles de sport à Agadir
async function addGyms() {
  try {
    console.log('🏋️ Ajout des salles de sport à Agadir...');
    
    // Supprimer les anciennes salles
    await Gym.deleteMany({});
    
    const gyms = [
      {
        name: "FitLife Agadir",
        address: "Boulevard du 20 Août",
        city: "Agadir",
        coordinates: { lat: 30.4278, lng: -9.5981 },
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
        description: "Salle de sport moderne avec équipements de pointe au cœur d'Agadir"
      },
      {
        name: "Muscle Club Agadir",
        address: "Avenue des Nations Unies",
        city: "Agadir",
        coordinates: { lat: 30.4256, lng: -9.5995 },
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
        description: "Salle spécialisée musculation et cardio à Agadir"
      },
      {
        name: "CrossFit Agadir Bay",
        address: "Route d'Essaouira",
        city: "Agadir",
        coordinates: { lat: 30.4128, lng: -9.6203 },
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
        description: "Box CrossFit professionnelle avec coachs certifiés à Agadir"
      },
      {
        name: "Yoga Zen Agadir",
        address: "Quartier Founti",
        city: "Agadir",
        coordinates: { lat: 30.4156, lng: -9.5857 },
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
        description: "Studio dédié au yoga et bien-être à Agadir"
      },
      {
        name: "Elite Fitness Agadir",
        address: "Boulevard Mohammed V",
        city: "Agadir",
        coordinates: { lat: 30.4201, lng: -9.6132 },
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
        description: "Club premium avec toutes les commodités à Agadir"
      }
    ];
    
    // Ajouter les salles de sport
    const insertedGyms = await Gym.insertMany(gyms);
    console.log(`✅ ${insertedGyms.length} salles de sport ajoutées avec succès!`);
    
    // Afficher les salles ajoutées
    console.log('\n📋 Salles de sport ajoutées à Agadir:');
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
