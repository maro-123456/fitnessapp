const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  age: Number,
  favorites: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise"
  }
],
  weight: Number,
  height: Number,
  goal: { type: String, enum: ["loss","gain","maintain"] },
  language: { type: String, enum: ["fr","en","ar"], default:"fr" },
  role: { type: String, default:"user" },
  favoritesExercises: [{ type: mongoose.Schema.Types.ObjectId, ref:"Exercise" }],
  createdAt: { type: Date, default: Date.now }
  
});

module.exports = mongoose.model("User", userSchema);
