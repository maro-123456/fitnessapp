const express = require("express");
const router = express.Router();
const { 
  createWorkout, 
  getWorkouts, 
  getWorkout, 
  updateWorkout, 
  deleteWorkout, 
  completeWorkout,
  getWorkoutStats
} = require("../controllers/workoutController");

// Middleware d'authentification (à implémenter)
const auth = require("../middleware/auth");

// Routes principales
router.post("/", auth, createWorkout);
router.get("/", auth, getWorkouts);
router.get("/stats", auth, getWorkoutStats);
router.get("/:id", auth, getWorkout);
router.put("/:id", auth, updateWorkout);
router.delete("/:id", auth, deleteWorkout);
router.patch("/:id/complete", auth, completeWorkout);

module.exports = router;
