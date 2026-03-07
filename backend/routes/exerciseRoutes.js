const router = require("express").Router();
const {
  getExercises,
  getFavorites,
  toggleFavorite
} = require("../controllers/exerciseController");
const authMiddleware = require("../middlewares/authMiddleware");

// ==========================
// ROUTES EXERCICES
// ==========================

// 1️⃣ Récupérer tous les exercices (publique)
router.get("/", getExercises);

// 2️⃣ Récupérer les favoris d'un utilisateur (protégé)
router.get("/favorites", authMiddleware, getFavorites);

// 3️⃣ Ajouter / retirer un exercice aux favoris (protégé)
router.post("/favorite/:id", authMiddleware, toggleFavorite);

module.exports = router;