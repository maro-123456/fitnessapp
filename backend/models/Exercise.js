const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'sports', 'yoga', 'crossfit', 'bodyweight'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  duration: {
    type: Number,
    required: true
  },
  calories: {
    type: Number,
    default: 0
  },
  equipment: [{
    type: String
  }],
  instructions: [{
    type: String
  }],
  muscleGroups: [{
    type: String,
    enum: ['chest', 'back', 'legs', 'shoulders', 'core', 'arms', 'legs']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Exercise", exerciseSchema);