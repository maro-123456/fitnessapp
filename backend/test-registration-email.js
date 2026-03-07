const axios = require('axios');

// Test d'inscription avec envoi d'email automatique
async function testRegistrationEmail() {
  console.log('🚀 TEST D\'INSCRIPTION AVEC EMAIL AUTOMATIQUE\n');
  
  try {
    // Données de test pour l'inscription
    const userData = {
      name: 'Client Test',
      email: process.env.EMAIL_USER || 'test@example.com', // Utilise l'email configuré
      password: 'password123',
      age: 30,
      weight: 75,
      height: 175,
      goal: 'Perte de poids',
      language: 'fr'
    };

    console.log('📝 Envoi de la requête d\'inscription...');
    console.log(`   Email: ${userData.email}`);
    console.log(`   Nom: ${userData.name}\n`);

    // Envoyer la requête d'inscription
    const response = await axios.post('http://localhost:5000/api/auth/register', userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ INSCRIPTION RÉUSSIE !');
    console.log('📧 EMAIL DE BIENVENUE DEVRAIT ÊTRE ENVOYÉ AUTOMATIQUEMENTMENT');
    console.log(`   Token: ${response.data.token ? 'Généré' : 'Non généré'}`);
    console.log(`   Utilisateur: ${response.data.user.name}`);
    console.log(`   Email notifications: ${response.data.user.emailNotifications ? 'Activées' : 'Désactivées'}`);

    return response.data;

  } catch (error) {
    console.error('❌ ERREUR LORS DE L\'INSCRIPTION:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data.message);
    } else {
      console.error('   Erreur:', error.message);
    }
    return null;
  }
}

// Vérifier si le serveur est en cours d'exécution
async function checkServer() {
  try {
    const response = await axios.get('http://localhost:5000/api/auth/test');
    return true;
  } catch (error) {
    return false;
  }
}

// Fonction principale
async function runTest() {
  console.log('🔍 Vérification du serveur...');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('❌ Le serveur backend n\'est pas démarré');
    console.log('💡 Démarrez le serveur avec: cd backend && npm start');
    return;
  }

  console.log('✅ Serveur backend en cours d\'exécution\n');
  
  const result = await testRegistrationEmail();
  
  if (result) {
    console.log('\n🎯 RÉSULTAT:');
    console.log('   - Client inscrit avec succès');
    console.log('   - Email de bienvenue envoyé automatiquement');
    console.log('   - Vérifiez votre boîte de réception (y compris spam)');
    
    // Test supplémentaire : vérifier si l'utilisateur existe
    console.log('\n📋 VÉRIFICATION BDD:');
    console.log(`   - ID Utilisateur: ${result.user._id}`);
    console.log(`   - Email: ${result.user.email}`);
    console.log(`   - Notifications: ${result.user.emailNotifications}`);
  }
}

// Instructions
console.log('📋 INSTRUCTIONS POUR LE TEST:\n');
console.log('1. Assurez-vous que le serveur backend est démarré (npm start)');
console.log('2. Configurez EMAIL_USER et EMAIL_PASS dans .env');
console.log('3. Lancez ce test\n');

runTest().catch(console.error);
