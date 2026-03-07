const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  objective: {
    type: String,
    enum: ["perte", "maintien", "prise"],
    required: true
  },
  duration: {
    type: Number, // durée en jours
    required: true
  },
  caloriesPerDay: {
    type: Number,
    required: true
  },
  macros: {
    proteins: { type: Number, required: true }, // en grammes
    carbs: { type: Number, required: true }, // en grammes
    fats: { type: Number, required: true } // en grammes
  },
  meals: [{
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["petit-déjeuner", "déjeuner", "dîner", "collation"],
      required: true
    },
    calories: { type: Number, required: true },
    foods: [{
      name: { type: String, required: true },
      quantity: { type: String, required: true }, // ex: "100g", "1 tasse"
      calories: { type: Number, required: true },
      proteins: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fats: { type: Number, default: 0 }
    }],
    instructions: { type: String } // instructions de préparation
  }],
  shoppingList: [{
    item: { type: String, required: true },
    quantity: { type: String, required: true },
    category: {
      type: String,
      enum: ["légumes", "fruits", "protéines", "produits laitiers", "céréales", "autres"],
      required: true
    }
  }],
  tips: [{
    title: { type: String, required: true },
    content: { type: String, required: true }
  }],
  pdfUrl: String, // lien vers le PDF généré
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("NutritionPlan", nutritionSchema);