// Test script for hydration API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/hydration';

// Test data
const testHydration = {
  amount: 250,
  unit: 'ml',
  notes: 'Verre d\'eau après le sport'
};

async function testHydrationAPI() {
  try {
    console.log('🧪 Testing Hydration API...\n');

    // Test 1: Add hydration record
    console.log('1. Adding hydration record...');
    const addResponse = await axios.post(`${BASE_URL}`, testHydration, {
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Add hydration:', addResponse.data);
    const hydrationId = addResponse.data.hydration._id;

    // Test 2: Get all hydration records
    console.log('\n2. Getting all hydration records...');
    const getResponse = await axios.get(`${BASE_URL}`, {
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE'
      }
    });
    console.log('✅ Get hydrations:', getResponse.data);

    // Test 3: Get daily stats
    console.log('\n3. Getting daily hydration stats...');
    const statsResponse = await axios.get(`${BASE_URL}/stats/daily`, {
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE'
      }
    });
    console.log('✅ Daily stats:', statsResponse.data);

    // Test 4: Get hydration trends
    console.log('\n4. Getting hydration trends...');
    const trendsResponse = await axios.get(`${BASE_URL}/trends?days=7`, {
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE'
      }
    });
    console.log('✅ Trends:', trendsResponse.data);

    // Test 5: Update hydration record
    console.log('\n5. Updating hydration record...');
    const updateResponse = await axios.put(`${BASE_URL}/${hydrationId}`, {
      amount: 300,
      notes: 'Verre d\'eau mis à jour'
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Update hydration:', updateResponse.data);

    // Test 6: Delete hydration record
    console.log('\n6. Deleting hydration record...');
    const deleteResponse = await axios.delete(`${BASE_URL}/${hydrationId}`, {
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE'
      }
    });
    console.log('✅ Delete hydration:', deleteResponse.data);

    console.log('\n🎉 All hydration API tests completed successfully!');

  } catch (error) {
    console.error('❌ Error testing hydration API:', error.response?.data || error.message);
  }
}

// API Documentation
console.log(`
📖 Hydration API Documentation:

🔹 POST /api/hydration
   Add a hydration record
   Body: { amount (number), unit (ml|oz|l), notes (string) }
   
🔹 GET /api/hydration
   Get all hydration records for authenticated user
   Query: ?startDate=&endDate=&limit=50
   
🔹 GET /api/hydration/stats/daily
   Get daily hydration statistics
   Query: ?date=YYYY-MM-DD
   
🔹 GET /api/hydration/trends
   Get hydration trends over time
   Query: ?days=7
   
🔹 PUT /api/hydration/:id
   Update a hydration record
   Body: { amount, unit, notes }
   
🔹 DELETE /api/hydration/:id
   Delete a hydration record

📝 Note: All endpoints require authentication (JWT token in Authorization header)
`);

// Uncomment to run tests
// testHydrationAPI();

module.exports = { testHydrationAPI };
