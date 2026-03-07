const express = require("express");
const router = express.Router();
const { getProgress, addProgress } = require("../controllers/progressController");
const authMiddleware = require("../middlewares/authMiddleware");

// Récupérer progression utilisateur
router.get("/", authMiddleware, getProgress);

// Ajouter progression utilisateur
router.post("/", authMiddleware, addProgress);

module.exports = router;