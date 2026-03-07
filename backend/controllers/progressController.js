const Progress = require("../models/Progress");

// Liste progression utilisateur
exports.getProgress = async (req,res)=>{
  const progresses = await Progress.find({ user: req.userId }).sort({ date: 1 });
  res.json(progresses);
}

// Ajouter progression
exports.addProgress = async (req,res)=>{
  const { weight, imc, performance } = req.body;
  const progress = await Progress.create({ user: req.userId, weight, imc, performance });
  res.status(201).json(progress);
}