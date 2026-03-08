require('dotenv').config();
const mongoose = require('mongoose');
const Gym = require('./models/Gym');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitnessapp')
  .then(async () => {
    console.log('🏋️ Salles de sport dans la base:');
    const gyms = await Gym.find({});
    if (gyms.length === 0) {
      console.log('❌ Aucune salle de sport trouvée');
    } else {
      gyms.forEach(gym => {
        console.log(`- ${gym.name}: ${gym.coordinates?.lat || 'N/A'}, ${gym.coordinates?.lng || 'N/A'}`);
      });
    }
    mongoose.connection.close();
  })
  .catch(err => console.error('Erreur:', err));
