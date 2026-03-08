const mongoose = require('mongoose');
const Hydration = require('../models/Hydration');

// Ajouter un enregistrement d'hydratation
const addHydration = async (req, res) => {
  try {
    const { amount, unit, notes } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Le montant doit être un nombre positif" });
    }

    const hydration = new Hydration({
      user: req.user.id,
      amount,
      unit: unit || 'ml',
      notes
    });

    await hydration.save();
    await hydration.populate('user', 'name email');

    res.status(201).json({
      message: "Enregistrement d'hydratation ajouté avec succès",
      hydration
    });
  } catch (error) {
    console.error('Erreur ajout hydratation:', error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Obtenir tous les enregistrements d'hydratation d'un utilisateur
const getHydrationRecords = async (req, res) => {
  try {
    const { startDate, endDate, limit = 50 } = req.query;
    
    let filter = { user: req.user.id };
    
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const hydrations = await Hydration.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('user', 'name email');

    res.json(hydrations);
  } catch (error) {
    console.error('Erreur récupération hydratation:', error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Obtenir les statistiques d'hydratation quotidiennes
const getDailyHydrationStats = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const dailyHydration = await Hydration.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          timestamp: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: '$unit',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalMl = dailyHydration.reduce((total, record) => {
      if (record._id === 'l') return total + (record.totalAmount * 1000);
      if (record._id === 'oz') return total + (record.totalAmount * 29.5735);
      return total + record.totalAmount;
    }, 0);

    res.json({
      date: targetDate.toISOString().split('T')[0],
      totalMl: Math.round(totalMl),
      totalLiters: (totalMl / 1000).toFixed(2),
      records: dailyHydration,
      recordCount: dailyHydration.reduce((sum, record) => sum + record.count, 0)
    });
  } catch (error) {
    console.error('Erreur statistiques hydratation:', error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Mettre à jour un enregistrement d'hydratation
const updateHydration = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, unit, notes } = req.body;

    const hydration = await Hydration.findOne({ _id: id, user: req.user.id });
    
    if (!hydration) {
      return res.status(404).json({ message: "Enregistrement d'hydratation non trouvé" });
    }

    if (amount && amount > 0) hydration.amount = amount;
    if (unit) hydration.unit = unit;
    if (notes !== undefined) hydration.notes = notes;

    await hydration.save();
    await hydration.populate('user', 'name email');

    res.json({
      message: "Enregistrement d'hydratation mis à jour avec succès",
      hydration
    });
  } catch (error) {
    console.error('Erreur mise à jour hydratation:', error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Supprimer un enregistrement d'hydratation
const deleteHydration = async (req, res) => {
  try {
    const { id } = req.params;

    const hydration = await Hydration.findOneAndDelete({ _id: id, user: req.user.id });
    
    if (!hydration) {
      return res.status(404).json({ message: "Enregistrement d'hydratation non trouvé" });
    }

    res.json({ message: "Enregistrement d'hydratation supprimé avec succès" });
  } catch (error) {
    console.error('Erreur suppression hydratation:', error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Obtenir les tendances d'hydratation sur une période
const getHydrationTrends = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const trends = await Hydration.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    const formattedTrends = trends.map(trend => ({
      date: new Date(trend._id.year, trend._id.month - 1, trend._id.day).toISOString().split('T')[0],
      totalAmount: trend.totalAmount,
      recordCount: trend.count
    }));

    res.json({
      period: `${days} jours`,
      trends: formattedTrends,
      averageDaily: trends.length > 0 
        ? Math.round(trends.reduce((sum, t) => sum + t.totalAmount, 0) / trends.length)
        : 0
    });
  } catch (error) {
    console.error('Erreur tendances hydratation:', error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = {
  addHydration,
  getHydrationRecords,
  getDailyHydrationStats,
  updateHydration,
  deleteHydration,
  getHydrationTrends
};
