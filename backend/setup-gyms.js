const mongoose = require('mongoose');
require('dotenv').config();

// Importer les modèles
const Gym = require('./models/Gym');
const User = require('./models/User');

// Se connecter à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitnessapp')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Données de test pour les salles de sport
const gymsData = [
  {
    name: "FitLife Premium",
    address: "123 Avenue des Champs-Élysées",
    city: "Paris",
    coordinates: {
      latitude: 48.8566,
      longitude: 2.3522
    },
    phone: "+33 1 23 45 67 89",
    email: "contact@fitlifepremium.fr",
    website: "https://www.fitlifepremium.fr",
    description: "Salle de sport haut de gamme avec équipements modernes et coachs personnels",
    facilities: ["cardio", "weights", "pool", "sauna", "group_classes", "personal_training", "parking", "showers", "lockers"],
    openingHours: {
      monday: { open: "06:00", close: "23:00" },
      tuesday: { open: "06:00", close: "23:00" },
      wednesday: { open: "06:00", close: "23:00" },
      thursday: { open: "06:00", close: "23:00" },
      friday: { open: "06:00", close: "23:00" },
      saturday: { open: "07:00", close: "21:00" },
      sunday: { open: "08:00", close: "20:00" }
    },
    priceRange: "$$$$",
    rating: { average: 4.5, count: 128 },
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3"
    ]
  },
  {
    name: "Muscle Factory",
    address: "45 Rue de la Victoire",
    city: "Lyon",
    coordinates: {
      latitude: 45.7640,
      longitude: 4.8357
    },
    phone: "+33 4 12 34 56 78",
    email: "info@musclefactory.fr",
    website: "https://www.musclefactory.fr",
    description: "Spécialiste en musculation et bodybuilding avec équipements professionnels",
    facilities: ["weights", "cardio", "group_classes", "personal_training", "showers", "lockers"],
    openingHours: {
      monday: { open: "07:00", close: "22:00" },
      tuesday: { open: "07:00", close: "22:00" },
      wednesday: { open: "07:00", close: "22:00" },
      thursday: { open: "07:00", close: "22:00" },
      friday: { open: "07:00", close: "22:00" },
      saturday: { open: "08:00", close: "20:00" },
      sunday: { open: "09:00", close: "18:00" }
    },
    priceRange: "$$",
    rating: { average: 4.2, count: 89 },
    images: [
      "https://images.unsplash.com/photo-1550345336-09e3ac987658?ixlib=rb-4.0.3"
    ]
  },
  {
    name: "Yoga & Wellness Center",
    address: "78 Boulevard du Soleil",
    city: "Marseille",
    coordinates: {
      latitude: 43.2965,
      longitude: 5.3698
    },
    phone: "+33 4 91 23 45 67",
    email: "contact@yogawellness.fr",
    website: "https://www.yogawellness.fr",
    description: "Centre de bien-être spécialisé en yoga, pilates et relaxation",
    facilities: ["group_classes", "sauna", "steam_room", "showers", "lockers"],
    openingHours: {
      monday: { open: "08:00", close: "20:00" },
      tuesday: { open: "08:00", close: "20:00" },
      wednesday: { open: "08:00", close: "20:00" },
      thursday: { open: "08:00", close: "20:00" },
      friday: { open: "08:00", close: "20:00" },
      saturday: { open: "09:00", close: "18:00" },
      sunday: { open: "10:00", close: "16:00" }
    },
    priceRange: "$$",
    rating: { average: 4.8, count: 156 },
    images: [
      "https://images.unsplash.com/photo-1506126613408-eca61ce6f13f?ixlib=rb-4.0.3"
    ]
  },
  {
    name: "CrossFit Box",
    address: "12 Rue de l'Industrie",
    city: "Toulouse",
    coordinates: {
      latitude: 43.6047,
      longitude: 1.4442
    },
    phone: "+33 5 61 23 45 67",
    email: "info@crossfitbox.fr",
    website: "https://www.crossfitbox.fr",
    description: "Box CrossFit avec coaching de groupe et équipements fonctionnels",
    facilities: ["weights", "group_classes", "personal_training", "showers", "lockers"],
    openingHours: {
      monday: { open: "06:30", close: "21:00" },
      tuesday: { open: "06:30", close: "21:00" },
      wednesday: { open: "06:30", close: "21:00" },
      thursday: { open: "06:30", close: "21:00" },
      friday: { open: "06:30", close: "21:00" },
      saturday: { open: "08:00", close: "18:00" },
      sunday: { open: "10:00", close: "14:00" }
    },
    priceRange: "$$$",
    rating: { average: 4.6, count: 92 },
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3"
    ]
  },
  {
    name: "SportClub 24/7",
    address: "34 Avenue du Stade",
    city: "Bordeaux",
    coordinates: {
      latitude: 44.8378,
      longitude: -0.5792
    },
    phone: "+33 5 56 78 90 12",
    email: "contact@sportclub24.fr",
    website: "https://www.sportclub24.fr",
    description: "Salle de sport ouverte 24h/24 et 7j/7 avec accès par badge",
    facilities: ["cardio", "weights", "parking", "showers", "lockers"],
    openingHours: {
      monday: { open: "00:00", close: "23:59" },
      tuesday: { open: "00:00", close: "23:59" },
      wednesday: { open: "00:00", close: "23:59" },
      thursday: { open: "00:00", close: "23:59" },
      friday: { open: "00:00", close: "23:59" },
      saturday: { open: "00:00", close: "23:59" },
      sunday: { open: "00:00", close: "23:59" }
    },
    priceRange: "$",
    rating: { average: 3.9, count: 201 },
    images: [
      "https://images.unsplash.com/photo-1540497077202-7c8a89910c28?ixlib=rb-4.0.3"
    ]
  },
  {
    name: "AquaFit Center",
    address: "89 Boulevard de la Plage",
    city: "Nice",
    coordinates: {
      latitude: 43.7102,
      longitude: 7.2620
    },
    phone: "+33 4 93 45 67 89",
    email: "info@aquafit.fr",
    website: "https://www.aquafit.fr",
    description: "Centre aquatique avec piscine, spa et activités nautiques",
    facilities: ["pool", "sauna", "steam_room", "cardio", "group_classes", "showers", "lockers"],
    openingHours: {
      monday: { open: "07:00", close: "22:00" },
      tuesday: { open: "07:00", close: "22:00" },
      wednesday: { open: "07:00", close: "22:00" },
      thursday: { open: "07:00", close: "22:00" },
      friday: { open: "07:00", close: "22:00" },
      saturday: { open: "08:00", close: "20:00" },
      sunday: { open: "09:00", close: "18:00" }
    },
    priceRange: "$$$",
    rating: { average: 4.4, count: 143 },
    images: [
      "https://images.unsplash.com/photo-1576610616656-d3aa5d1f473c?ixlib=rb-4.0.3"
    ]
  }
];

// Fonction pour créer les salles de sport de test
async function createTestGyms() {
  try {
    console.log('🏋️ Création des salles de sport de test...\n');
    
    // Supprimer les anciennes salles de test
    await Gym.deleteMany({});
    console.log('✅ Anciennes salles supprimées');
    
    // Trouver un utilisateur pour l'association
    let testUser = await User.findOne({ email: 'test@example.com' });
    
    if (!testUser) {
      testUser = await User.create({
        name: 'Admin Test',
        email: 'test@example.com',
        password: 'password123',
        age: 30,
        weight: 75,
        height: 175,
        goal: 'loss'
      });
      console.log('✅ Utilisateur de test créé');
    }
    
    // Ajouter l'ID de l'utilisateur à chaque salle
    const gymsWithUser = gymsData.map(gym => ({
      ...gym,
      addedBy: testUser._id
    }));
    
    // Insérer les nouvelles salles
    const createdGyms = await Gym.insertMany(gymsWithUser);
    console.log(`✅ ${createdGyms.length} salles de sport créées avec succès !\n`);
    
    // Afficher les salles créées
    console.log('📍 LISTE DES SALLES CRÉÉES:');
    createdGyms.forEach((gym, index) => {
      console.log(`${index + 1}. ${gym.name}`);
      console.log(`   📍 ${gym.address}, ${gym.city}`);
      console.log(`   📞 ${gym.phone}`);
      console.log(`   ⭐ ${gym.rating.average}/5 (${gym.rating.count} avis)`);
      console.log(`   🏋️ ${gym.facilities.length} équipements`);
      console.log(`   💰 ${gym.priceRange}`);
      console.log('');
    });
    
    return createdGyms;
  } catch (error) {
    console.error('❌ Erreur création salles de sport:', error);
  }
}

// Fonction pour tester l'API
async function testGymAPI() {
  try {
    console.log('🧪 TEST DE L\'API GYMS\n');
    
    // Test 1: Obtenir toutes les salles
    const response1 = await fetch('http://localhost:5000/api/gyms');
    const data1 = await response1.json();
    console.log(`✅ GET /api/gyms - ${data1.gyms.length} salles trouvées`);
    
    // Test 2: Obtenir les statistiques
    const response2 = await fetch('http://localhost:5000/api/gyms/stats');
    const data2 = await response2.json();
    console.log(`✅ GET /api/gyms/stats - ${data2.stats.totalGyms} salles au total`);
    console.log(`   ⭐ Note moyenne: ${data2.stats.averageRating.toFixed(1)}/5`);
    
    // Test 3: Recherche à proximité
    const response3 = await fetch('http://localhost:5000/api/gyms/nearby?latitude=48.8566&longitude=2.3522');
    const data3 = await response3.json();
    console.log(`✅ GET /api/gyms/nearby - ${data3.gyms.length} salles à proximité de Paris`);
    
    console.log('\n🎯 API GYMS FONCTIONNELLE !');
    
  } catch (error) {
    console.error('❌ Erreur test API:', error.message);
  }
}

// Fonction principale
async function runGymSetup() {
  console.log('🚀 CONFIGURATION DES SALLES DE SPORT FITLIFE\n');
  
  // 1. Créer les salles de test
  await createTestGyms();
  
  // 2. Tester l'API (si le serveur est en cours d'exécution)
  try {
    await testGymAPI();
  } catch (error) {
    console.log('\n💡 Démarrez le serveur avec "npm start" pour tester l\'API');
  }
  
  // Fermer la connexion
  mongoose.connection.close();
  console.log('\n✅ Configuration terminée !');
}

// Lancer la configuration
runGymSetup().catch(console.error);
