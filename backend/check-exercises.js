require('dotenv').config();
const mongoose = require('mongoose');
const Exercise = require('./models/Exercise');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitnessapp')
  .then(async () => {
    console.log('📋 Exercices dans la base:');
    const exercises = await Exercise.find({}, {name: 1, category: 1});
    exercises.forEach(ex => console.log(`- ${ex.name} (${ex.category})`));
    mongoose.connection.close();
  })
  .catch(err => console.error('Erreur:', err));
