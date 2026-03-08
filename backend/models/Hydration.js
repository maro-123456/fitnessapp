const mongoose = require("mongoose");

const hydrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    enum: ["ml", "oz", "l"],
    default: "ml"
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: 200
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Hydration", hydrationSchema);
