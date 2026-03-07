const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  weight: Number,
  imc: Number,
  performance: Number
});

module.exports = mongoose.model("Progress", progressSchema);