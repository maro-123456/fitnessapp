const axios = require('axios');

async function testAPI() {
  try {
    // Test de l'endpoint /auth/me
    console.log('Test de l\'API...');
    
    // Créer un utilisateur de test
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      age: 25,
      weight: 70,
      height: 175,
      goal: "maintien",
      language: "fr"
    });
    
    console.log('Utilisateur créé:', registerResponse.data);
    
    // Test de l'endpoint /auth/me
    const meResponse = await axios.get('http://localhost:5000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${registerResponse.data.token}`
      }
    });
    
    console.log('Utilisateur connecté:', meResponse.data);
    
  } catch (error) {
    console.error('Erreur API:', error.message);
  }
}

testAPI();
