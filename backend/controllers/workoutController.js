const Workout = require('../models/Workout');

// Créer un workout
exports.createWorkout = async (req, res) => {
  try {
    const { date, type, duration, caloriesBurned, exercises, notes, difficulty } = req.body;
    
    const workout = await Workout.create({
      userId: req.user.id,
      date: date || new Date(),
      type,
      duration,
      caloriesBurned,
      exercises,
      notes,
      difficulty
    });

    res.status(201).json({ workout });
  } catch (error) {
    console.error('Erreur création workout:', error);
    res.status(500).json({ message: "Erreur lors de la création du workout" });
  }
};

// Obtenir tous les workouts d'un utilisateur
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id })
      .sort({ date: -1 });
    
    res.json({ workouts });
  } catch (error) {
    console.error('Erreur récupération workouts:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des workouts" });
  }
};

// Obtenir un workout spécifique
exports.getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!workout) {
      return res.status(404).json({ message: "Workout non trouvé" });
    }
    
    res.json({ workout });
  } catch (error) {
    console.error('Erreur récupération workout:', error);
    res.status(500).json({ message: "Erreur lors de la récupération du workout" });
  }
};

// Mettre à jour un workout
exports.updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    
    if (!workout) {
      return res.status(404).json({ message: "Workout non trouvé" });
    }
    
    res.json({ workout });
  } catch (error) {
    console.error('Erreur mise à jour workout:', error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du workout" });
  }
};

// Supprimer un workout
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!workout) {
      return res.status(404).json({ message: "Workout non trouvé" });
    }
    
    res.json({ message: "Workout supprimé avec succès" });
  } catch (error) {
    console.error('Erreur suppression workout:', error);
    res.status(500).json({ message: "Erreur lors de la suppression du workout" });
  }
};

// Marquer un workout comme complété
exports.completeWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { completed: true },
      { new: true }
    );
    
    if (!workout) {
      return res.status(404).json({ message: "Workout non trouvé" });
    }
    
    res.json({ workout });
  } catch (error) {
    console.error('Erreur complétion workout:', error);
    res.status(500).json({ message: "Erreur lors de la complétion du workout" });
  }
};

// Obtenir les statistiques des workouts
exports.getWorkoutStats = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id });
    
    const stats = {
      totalWorkouts: workouts.length,
      completedWorkouts: workouts.filter(w => w.completed).length,
      totalDuration: workouts.reduce((sum, w) => sum + w.duration, 0),
      totalCalories: workouts.reduce((sum, w) => sum + w.caloriesBurned, 0),
      workoutsThisWeek: workouts.filter(w => {
        const workoutDate = new Date(w.date);
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return workoutDate >= oneWeekAgo;
      }).length
    };
    
    res.json({ stats });
  } catch (error) {
    console.error('Erreur statistiques workouts:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
  }
};
