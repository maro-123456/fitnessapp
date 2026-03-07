const mongoose = require('mongoose');
require('dotenv').config();

// Importer les modèles
const User = require('./models/User');
const Workout = require('./models/Workout');

// Se connecter à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitnessapp')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Fonction pour créer des workouts de test
async function createTestWorkouts() {
  try {
    // Trouver un utilisateur existant ou en créer un
    let user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      user = await User.create({
        name: 'Utilisateur Test',
        email: 'test@example.com',
        password: 'password123',
        age: 30,
        weight: 75,
        height: 175,
        goal: 'Perte de poids',
        emailNotifications: true
      });
      console.log('Utilisateur de test créé:', user.email);
    }

    // Créer quelques workouts de test
    const workouts = [
      {
        userId: user._id,
        date: new Date(),
        type: 'strength',
        duration: 45,
        caloriesBurned: 300,
        exercises: [
          { name: 'Pompes', sets: 3, reps: 15, weight: 0 },
          { name: 'Squats', sets: 4, reps: 12, weight: 50 },
          { name: 'Développé couché', sets: 3, reps: 10, weight: 60 }
        ],
        notes: 'Séance intense',
        difficulty: 'intermediate',
        completed: true
      },
      {
        userId: user._id,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Hier
        type: 'cardio',
        duration: 30,
        caloriesBurned: 250,
        exercises: [
          { name: 'Course', duration: 30, sets: 0, reps: 0, weight: 0 }
        ],
        notes: 'Cardio modéré',
        difficulty: 'beginner',
        completed: true
      },
      {
        userId: user._id,
        date: new Date(Date.now() - 48 * 60 * 60 * 1000), // Avant-hier
        type: 'flexibility',
        duration: 20,
        caloriesBurned: 100,
        exercises: [
          { name: 'Yoga', duration: 20, sets: 0, reps: 0, weight: 0 }
        ],
        notes: 'Étirements',
        difficulty: 'beginner',
        completed: false
      }
    ];

    // Supprimer les anciens workouts de test
    await Workout.deleteMany({ userId: user._id });

    // Insérer les nouveaux workouts
    const createdWorkouts = await Workout.insertMany(workouts);
    console.log(`${createdWorkouts.length} workouts créés avec succès !`);

    // Afficher les workouts créés
    const allWorkouts = await Workout.find({ userId: user._id });
    console.log('\n📋 Liste des workouts dans MongoDB:');
    allWorkouts.forEach((workout, index) => {
      console.log(`${index + 1}. ${workout.type} - ${workout.date.toDateString()} - ${workout.duration}min - ${workout.caloriesBurned} cal`);
    });

    return createdWorkouts;
  } catch (error) {
    console.error('Erreur création workouts:', error);
  }
}

// Fonction pour tester l'email de bienvenue
async function testWelcomeEmail() {
  try {
    const EmailService = require('./services/emailService');
    
    const testUserInfo = {
      userName: 'Utilisateur Test',
      userEmail: 'test@example.com',
      userGoal: 'Perte de poids',
      userWeight: '75',
      userHeight: '175',
      userAge: '30'
    };
    
    await EmailService.sendWelcomeEmail('test-id', testUserInfo);
    console.log('✅ Email de bienvenue envoyé avec succès !');
  } catch (error) {
    console.error('❌ Erreur envoi email de bienvenue:', error);
  }
}

// Fonction pour tester la motivation quotidienne
async function testDailyMotivation() {
  try {
    const EmailService = require('./services/emailService');
    const EmailController = require('./controllers/emailController');
    
    const motivationQuote = EmailController.getRandomMotivationQuote();
    
    await EmailService.sendDailyMotivation('test-id', {
      userName: 'Utilisateur Test',
      quote: motivationQuote.quote,
      author: motivationQuote.author,
      tip: motivationQuote.tip
    });
    console.log('✅ Email de motivation quotidienne envoyé avec succès !');
  } catch (error) {
    console.error('❌ Erreur envoi motivation quotidienne:', error);
  }
}

// Exécuter les tests
async function runTests() {
  console.log('🚀 Début des tests...\n');
  
  // 1. Créer des workouts
  await createTestWorkouts();
  
  // 2. Tester l'email de bienvenue
  await testWelcomeEmail();
  
  // 3. Tester la motivation quotidienne
  await testDailyMotivation();
  
  console.log('\n✅ Tests terminés !');
  
  // Fermer la connexion
  mongoose.connection.close();
}

// Lancer les tests
runTests().catch(console.error);
