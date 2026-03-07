const express = require("express");
const router = express.Router();
const {
  getGyms,
  getGym,
  createGym,
  updateGym,
  deleteGym,
  getNearbyGyms,
  rateGym,
  getGymStats
} = require("../controllers/gymController");

const auth = require("../middleware/auth");

// Routes publiques
router.get("/", getGyms);
router.get("/stats", getGymStats);
router.get("/nearby", getNearbyGyms);
router.get("/:id", getGym);

// Routes protégées (nécessitent authentification)
router.post("/", auth, createGym);
router.put("/:id", auth, updateGym);
router.delete("/:id", auth, deleteGym);
router.post("/:id/rate", auth, rateGym);

module.exports = router;
