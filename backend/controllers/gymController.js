const Gym = require('../models/Gym');

// Obtenir toutes les salles de sport
exports.getGyms = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, city, search, facilities, priceRange } = req.query;
    
    // Construire le filtre
    let filter = { isActive: true };
    
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }
    
    if (facilities) {
      const facilityArray = facilities.split(',');
      filter.facilities = { $in: facilityArray };
    }
    
    if (priceRange) {
      filter.priceRange = priceRange;
    }
    
    if (search) {
      filter.$text = { $regex: search, $options: 'i' };
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    const gyms = await Gym.find(filter)
      .populate('addedBy', 'name')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit * 1);
    
    const total = await Gym.countDocuments(filter);
    
    // Données de test si aucune salle trouvée
    let gymsData = [];
    if (gyms.length > 0) {
      gymsData = gyms.map(gym => ({
        id: gym._id,
        name: gym.name,
        address: gym.address,
        phone: gym.phone,
        hours: gym.hours,
        price: gym.price,
        type: gym.type,
        equipment: gym.equipment,
        rating: gym.rating,
        coordinates: gym.coordinates
      }));
    } else {
      // Données de test si aucune salle trouvée
      gymsData = [
        {
          id: 1,
          name: "FitClub Paris Centre",
          address: "75002 Paris, France",
          phone: "01 42 34 56 78",
          hours: "6h00 - 23h00",
          price: 49,
          type: "fitness",
          equipment: ["Tapis roulant", "Vélo elliptique", "Haltérophilie", "Musculation"],
          rating: 4.5,
          coordinates: { lat: 48.8566, lng: 2.352 }
        },
        {
          id: 2,
          name: "CrossFit Bastille",
          address: "75011 Paris, France",
          phone: "01 42 34 12 34",
          hours: "6h00 - 22h00",
          price: 79,
          type: "crossfit",
          equipment: ["Kettlebells", "Barres", "Corde à sauter", "Poids libres"],
          rating: 4.8,
          coordinates: { lat: 48.853, lng: 2.349 }
        },
        {
          id: 3,
          name: "Yoga Zen Marais",
          address: "75004 Paris, France",
          phone: "01 42 34 98 76",
          hours: "7h00 - 21h00",
          price: 35,
          type: "yoga",
          equipment: ["Tapis de yoga", "Coussins", "Blocs", "Sangles"],
          rating: 4.9,
          coordinates: { lat: 48.846, lng: 2.33 }
        },
        {
          id: 4,
          name: "Piscine Municipale",
          address: "75013 Paris, France",
          phone: "01 42 34 23 45",
          hours: "7h00 - 21h00",
          price: 25,
          type: "swimming",
          equipment: ["Piscine 25m", "Piscine 50m", "Toboggan", "Solarium"],
          rating: 4.2,
          coordinates: { lat: 48.8606, lng: 2.277 }
        }
      ];
    }
    
    console.log('Gyms data:', gymsData);
    console.log('Gyms array:', Array.isArray(gymsData));
    
    // Renvoyer directement le tableau de gyms
    res.json(gymsData);
  } catch (error) {
    console.error('Erreur get gyms:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir une salle spécifique
exports.getGym = async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id)
      .populate('addedBy', 'name');
    
    if (!gym) {
      return res.status(404).json({ message: "Salle de sport non trouvée" });
    }
    
    res.json({ gym });
  } catch (error) {
    console.error('Erreur récupération salle de sport:', error);
    res.status(500).json({ message: "Erreur lors de la récupération de la salle de sport" });
  }
};

// Créer une nouvelle salle de sport
exports.createGym = async (req, res) => {
  try {
    const gymData = {
      ...req.body,
      addedBy: req.user.id
    };
    
    const gym = await Gym.create(gymData);
    
    res.status(201).json({ 
      message: "Salle de sport créée avec succès",
      gym 
    });
  } catch (error) {
    console.error('Erreur création salle de sport:', error);
    res.status(500).json({ message: "Erreur lors de la création de la salle de sport" });
  }
};

// Mettre à jour une salle de sport
exports.updateGym = async (req, res) => {
  try {
    const gym = await Gym.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!gym) {
      return res.status(404).json({ message: "Salle de sport non trouvée" });
    }
    
    res.json({ 
      message: "Salle de sport mise à jour avec succès",
      gym 
    });
  } catch (error) {
    console.error('Erreur mise à jour salle de sport:', error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la salle de sport" });
  }
};

// Supprimer une salle de sport
exports.deleteGym = async (req, res) => {
  try {
    const gym = await Gym.findByIdAndDelete(req.params.id);
    
    if (!gym) {
      return res.status(404).json({ message: "Salle de sport non trouvée" });
    }
    
    res.json({ message: "Salle de sport supprimée avec succès" });
  } catch (error) {
    console.error('Erreur suppression salle de sport:', error);
    res.status(500).json({ message: "Erreur lors de la suppression de la salle de sport" });
  }
};

// Rechercher des salles à proximité (géolocalisation)
exports.getNearbyGyms = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 10000 } = req.query; // maxDistance en mètres
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude et longitude requises" });
    }
    
    const gyms = await Gym.find({
      isActive: true,
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).populate('addedBy', 'name');
    
    res.json({ gyms });
  } catch (error) {
    console.error('Erreur recherche salles à proximité:', error);
    res.status(500).json({ message: "Erreur lors de la recherche des salles à proximité" });
  }
};

// Noter une salle de sport
exports.rateGym = async (req, res) => {
  try {
    const { rating } = req.body;
    const gymId = req.params.id;
    const userId = req.user.id;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "La note doit être entre 1 et 5" });
    }
    
    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ message: "Salle de sport non trouvée" });
    }
    
    // Logique pour ajouter/mettre à jour la note
    // Note: Cette logique nécessite une collection séparée pour les notes
    // Pour l'instant, nous allons simuler une mise à jour simple
    
    const newAverage = ((gym.rating.average * gym.rating.count) + rating) / (gym.rating.count + 1);
    
    await Gym.findByIdAndUpdate(gymId, {
      'rating.average': newAverage,
      'rating.count': gym.rating.count + 1
    });
    
    res.json({ message: "Note ajoutée avec succès" });
  } catch (error) {
    console.error('Erreur notation salle de sport:', error);
    res.status(500).json({ message: "Erreur lors de la notation de la salle de sport" });
  }
};

// Obtenir les statistiques des salles de sport
exports.getGymStats = async (req, res) => {
  try {
    const stats = await Gym.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalGyms: { $sum: 1 },
          averageRating: { $avg: '$rating.average' },
          gymsByCity: {
            $push: {
              city: '$city',
              count: 1
            }
          },
          facilitiesCount: {
            $sum: { $size: '$facilities' }
          }
        }
      }
    ]);
    
    const facilitiesStats = await Gym.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$facilities' },
      {
        $group: {
          _id: '$facilities',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      stats: stats[0] || { totalGyms: 0, averageRating: 0 },
      facilitiesStats
    });
  } catch (error) {
    console.error('Erreur statistiques salles de sport:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
  }
};
