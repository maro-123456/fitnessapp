const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);

// Obtenir les informations de l'utilisateur connecté
router.get("/me", auth, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      age: req.user.age,
      weight: req.user.weight,
      height: req.user.height,
      goal: req.user.goal,
      language: req.user.language
    });
  } catch (error) {
    console.error("Erreur /auth/me:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;