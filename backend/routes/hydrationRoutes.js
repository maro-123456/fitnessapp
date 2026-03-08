const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  addHydration,
  getHydrationRecords,
  getDailyHydrationStats,
  updateHydration,
  deleteHydration,
  getHydrationTrends
} = require('../controllers/hydrationController');

// Ajouter un enregistrement d'hydratation
router.post('/', auth, addHydration);

// Obtenir tous les enregistrements d'hydratation d'un utilisateur
router.get('/', auth, getHydrationRecords);

// Obtenir les statistiques d'hydratation quotidiennes
router.get('/stats/daily', auth, getDailyHydrationStats);

// Obtenir les tendances d'hydratation sur une période
router.get('/trends', auth, getHydrationTrends);

// Mettre à jour un enregistrement d'hydratation
router.put('/:id', auth, updateHydration);

// Supprimer un enregistrement d'hydratation
router.delete('/:id', auth, deleteHydration);

module.exports = router;
