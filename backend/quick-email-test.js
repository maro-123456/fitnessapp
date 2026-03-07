const EmailService = require('./services/emailService');
const EmailController = require('./controllers/emailController');

// Test 1: Email de bienvenue
async function testWelcomeEmail() {
  console.log('📧 Test: Email de bienvenue...');
  try {
    const testUserInfo = {
      userName: 'Utilisateur Test',
      userEmail: process.env.EMAIL_USER || 'test@example.com', // Utilise l'email du .env
      userGoal: 'Perte de poids',
      userWeight: '75',
      userHeight: '175',
      userAge: '30'
    };
    
    await EmailService.sendWelcomeEmail('test-id', testUserInfo);
    console.log('✅ Email de bienvenue envoyé avec succès !');
    console.log(`📬 Envoyé à: ${testUserInfo.userEmail}`);
  } catch (error) {
    console.error('❌ Erreur envoi email de bienvenue:', error.message);
    console.log('💡 Solution: Vérifiez EMAIL_USER et EMAIL_PASS dans .env');
  }
}

// Test 2: Motivation quotidienne
async function testDailyMotivation() {
  console.log('\n📧 Test: Motivation quotidienne...');
  try {
    const motivationQuote = EmailController.getRandomMotivationQuote();
    
    await EmailService.sendDailyMotivation('test-id', {
      userName: 'Utilisateur Test',
      quote: motivationQuote.quote,
      author: motivationQuote.author,
      tip: motivationQuote.tip
    });
    console.log('✅ Email de motivation quotidienne envoyé avec succès !');
  } catch (error) {
    console.error('❌ Erreur envoi motivation quotidienne:', error.message);
  }
}

// Test 3: Nouveau plan nutritionnel
async function testNutritionPlan() {
  console.log('\n📧 Test: Nouveau plan nutritionnel...');
  try {
    await EmailService.sendNewNutritionPlan('test-id', {
      planName: 'Plan Perte de Poids',
      calories: '1800',
      duration: '7 jours',
      meals: 3
    });
    console.log('✅ Email nouveau plan nutritionnel envoyé avec succès !');
  } catch (error) {
    console.error('❌ Erreur envoi plan nutritionnel:', error.message);
  }
}

// Vérifier la configuration
function checkConfig() {
  console.log('🔍 Vérification de la configuration...\n');
  
  if (!process.env.EMAIL_USER) {
    console.log('❌ EMAIL_USER manquant dans .env');
    return false;
  }
  
  if (!process.env.EMAIL_PASS) {
    console.log('❌ EMAIL_PASS manquant dans .env');
    return false;
  }
  
  console.log('✅ Configuration Gmail trouvée:');
  console.log(`   Email: ${process.env.EMAIL_USER}`);
  console.log(`   Pass: ${process.env.EMAIL_PASS ? '***' : 'manquant'}`);
  return true;
}

// Exécuter tous les tests
async function runAllTests() {
  console.log('🚀 DÉBUT DES TESTS D\'EMAILS FITLIFE\n');
  
  if (!checkConfig()) {
    console.log('\n❌ Configurez EMAIL_USER et EMAIL_PASS dans .env');
    console.log('📖 Voir EMAIL-SETUP.md pour les instructions');
    return;
  }
  
  await testWelcomeEmail();
  await testDailyMotivation();
  await testNutritionPlan();
  
  console.log('\n✅ TOUS LES TESTS TERMINÉS !');
  console.log('📬 Vérifiez votre boîte de réception (et spam) pour les emails.');
}

runAllTests().catch(console.error);
