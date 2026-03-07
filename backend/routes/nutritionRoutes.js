const router = require("express").Router();
const {
  getPlans,
  getPlanById,
  generatePDF,
  createPlan
} = require("../controllers/nutritionController");

// GET /api/nutrition → renvoie tous les plans
router.get("/", getPlans);

// GET /api/nutrition/:id → renvoie un plan spécifique
router.get("/:id", getPlanById);

// POST /api/nutrition/:id/pdf → génère et télécharge le PDF
router.post("/:id/pdf", generatePDF);

// POST /api/nutrition → crée un nouveau plan (admin)
router.post("/", createPlan);

module.exports = router;