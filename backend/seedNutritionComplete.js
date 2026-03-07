const mongoose = require("mongoose");
const dotenv = require("dotenv");
const NutritionPlan = require("./models/NutritionPlan");

dotenv.config();

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.log(err));

const plans = [
  {
    name: "Perte de poids rapide",
    description: "Plan nutritionnel conçu pour une perte de poids rapide et saine en réduisant les calories tout en maintenant un bon équilibre nutritionnel.",
    objective: "perte",
    duration: 30,
    caloriesPerDay: 1500,
    macros: {
      proteins: 120,
      carbs: 150,
      fats: 50
    },
    meals: [
      {
        name: "Petit-déjeuner énergétique",
        type: "petit-déjeuner",
        calories: 400,
        foods: [
          { name: "Flocons d'avoine", quantity: "50g", calories: 180, proteins: 6, carbs: 30, fats: 3 },
          { name: "Banane", quantity: "1 moyenne", calories: 100, proteins: 1, carbs: 25, fats: 0 },
          { name: "Amandes", quantity: "15g", calories: 90, proteins: 3, carbs: 3, fats: 8 },
          { name: "Thé vert", quantity: "1 tasse", calories: 30, proteins: 0, carbs: 0, fats: 0 }
        ],
        instructions: "Mélanger les flocons d'avoine avec de l'eau chaude, ajouter la banane en tranches et les amandes concassées."
      },
      {
        name: "Déjeuner protéiné",
        type: "déjeuner",
        calories: 500,
        foods: [
          { name: "Poulet grillé", quantity: "150g", calories: 250, proteins: 45, carbs: 0, fats: 5 },
          { name: "Quinoa", quantity: "100g", calories: 120, proteins: 4, carbs: 21, fats: 2 },
          { name: "Brocoli", quantity: "200g", calories: 70, proteins: 6, carbs: 10, fats: 1 },
          { name: "Huile d'olive", quantity: "1 cuillère", calories: 60, proteins: 0, carbs: 0, fats: 7 }
        ],
        instructions: "Griller le poulet, cuire le quinoa et vapeur le brocoli. Assaisonner avec l'huile d'olive."
      },
      {
        name: "Collation légère",
        type: "collation",
        calories: 200,
        foods: [
          { name: "Yaourt grec", quantity: "150g", calories: 100, proteins: 15, carbs: 8, fats: 2 },
          { name: "Fruits rouges", quantity: "100g", calories: 50, proteins: 1, carbs: 12, fats: 0 },
          { name: "Noix", quantity: "10g", calories: 50, proteins: 2, carbs: 2, fats: 5 }
        ]
      },
      {
        name: "Dîner léger",
        type: "dîner",
        calories: 400,
        foods: [
          { name: "Saumon", quantity: "120g", calories: 200, proteins: 35, carbs: 0, fats: 8 },
          { name: "Asperges", quantity: "200g", calories: 50, proteins: 4, carbs: 8, fats: 1 },
          { name: "Riz complet", quantity: "80g", calories: 100, proteins: 2, carbs: 20, fats: 1 },
          { name: "Citron", quantity: "1/2", calories: 20, proteins: 0, carbs: 2, fats: 0 }
        ],
        instructions: "Cuire le saumon au four avec les asperges. Servir avec le riz complet et un filet de citron."
      }
    ],
    shoppingList: [
      { item: "Flocons d'avoine", quantity: "500g", category: "céréales" },
      { item: "Bananes", quantity: "10 unités", category: "fruits" },
      { item: "Amandes", quantity: "200g", category: "protéines" },
      { item: "Poulet", quantity: "1kg", category: "protéines" },
      { item: "Quinoa", quantity: "500g", category: "céréales" },
      { item: "Brocoli", quantity: "1kg", category: "légumes" },
      { item: "Yaourt grec", quantity: "1L", category: "produits laitiers" },
      { item: "Saumon", quantity: "500g", category: "protéines" },
      { item: "Asperges", quantity: "500g", category: "légumes" },
      { item: "Riz complet", quantity: "1kg", category: "céréales" }
    ],
    tips: [
      {
        title: "Hydratation",
        content: "Buvez au moins 2L d'eau par jour pour optimiser la perte de poids et éliminer les toxines."
      },
      {
        title: "Timing des repas",
        content: "Espacez les repas de 3-4 heures pour maintenir un métabolisme actif et éviter les fringales."
      },
      {
        title: "Activité physique",
        content: "Combinez ce plan avec 30 minutes d'exercice modéré par jour pour de meilleurs résultats."
      }
    ]
  },
  {
    name: "Prise de masse musculaire",
    description: "Plan nutritionnel riche en protéines et calories pour favoriser la prise de masse musculaire saine et efficace.",
    objective: "prise",
    duration: 60,
    caloriesPerDay: 2800,
    macros: {
      proteins: 180,
      carbs: 300,
      fats: 80
    },
    meals: [
      {
        name: "Petit-déjeuner bodybuilder",
        type: "petit-déjeuner",
        calories: 700,
        foods: [
          { name: "Oeufs", quantity: "4 unités", calories: 280, proteins: 24, carbs: 2, fats: 20 },
          { name: "Flocons d'avoine", quantity: "100g", calories: 360, proteins: 12, carbs: 60, fats: 6 },
          { name: "Protéine en poudre", quantity: "30g", calories: 120, proteins: 25, carbs: 3, fats: 1 },
          { name: "Beurre de cacahuète", quantity: "30g", calories: 180, proteins: 8, carbs: 6, fats: 15 }
        ],
        instructions: "Préparer les oeufs brouillés, mélanger avec les flocons d'avoine cuits et ajouter la protéine et le beurre de cacahuète."
      },
      {
        name: "Déjeuner mass",
        type: "déjeuner",
        calories: 800,
        foods: [
          { name: "Steak de boeuf", quantity: "200g", calories: 400, proteins: 40, carbs: 0, fats: 25 },
          { name: "Pâtes complètes", quantity: "150g", calories: 250, proteins: 10, carbs: 50, fats: 2 },
          { name: "Sauce tomate", quantity: "100g", calories: 50, proteins: 2, carbs: 10, fats: 1 },
          { name: "Fromage râpé", quantity: "30g", calories: 100, proteins: 8, carbs: 1, fats: 8 }
        ],
        instructions: "Cuire les pâtes al dente, faire griller le steak. Mélanger avec la sauce tomate et le fromage."
      },
      {
        name: "Collation protéinée",
        type: "collation",
        calories: 400,
        foods: [
          { name: "Sh protéiné", quantity: "1 shaker", calories: 250, proteins: 30, carbs: 15, fats: 5 },
          { name: "Barre protéinée", quantity: "1 unité", calories: 150, proteins: 20, carbs: 10, fats: 5 }
        ]
      },
      {
        name: "Dîner récupération",
        type: "dîner",
        calories: 900,
        foods: [
          { name: "Dinde", quantity: "250g", calories: 400, proteins: 50, carbs: 0, fats: 10 },
          { name: "Patates douces", quantity: "300g", calories: 300, proteins: 6, carbs: 60, fats: 1 },
          { name: "Petits pois", quantity: "150g", calories: 100, proteins: 6, carbs: 15, fats: 1 },
          { name: "Huile de coco", quantity: "1 cuillère", calories: 100, proteins: 0, carbs: 0, fats: 15 }
        ],
        instructions: "Cuire la dinde au four avec les patates douces. Servir avec les petits pois et l'huile de coco."
      }
    ],
    shoppingList: [
      { item: "Oeufs", quantity: "2 douzaines", category: "protéines" },
      { item: "Flocons d'avoine", quantity: "1kg", category: "céréales" },
      { item: "Protéine en poudre", quantity: "1kg", category: "protéines" },
      { item: "Beurre de cacahuète", quantity: "500g", category: "protéines" },
      { item: "Steak de boeuf", quantity: "2kg", category: "protéines" },
      { item: "Pâtes complètes", quantity: "1kg", category: "céréales" },
      { item: "Dinde", quantity: "1.5kg", category: "protéines" },
      { item: "Patates douces", quantity: "2kg", category: "légumes" }
    ],
    tips: [
      {
        title: "Protéines",
        content: "Consommez 1.6-2g de protéines par kg de poids corporel pour optimiser la prise de masse."
      },
      {
        title: "Repos",
        content: "Dormez 7-9 heures par nuit. La récupération est essentielle pour la croissance musculaire."
      },
      {
        title: "Entraînement",
        content: "Combinez ce plan avec un programme de musculation progressif 3-4 fois par semaine."
      }
    ]
  },
  {
    name: "Équilibre et maintien",
    description: "Plan nutritionnel équilibré pour maintenir un poids santé et une énergie stable tout au long de la journée.",
    objective: "maintien",
    duration: 45,
    caloriesPerDay: 2000,
    macros: {
      proteins: 120,
      carbs: 250,
      fats: 65
    },
    meals: [
      {
        name: "Petit-déjeuner complet",
        type: "petit-déjeuner",
        calories: 500,
        foods: [
          { name: "Pain complet", quantity: "2 tranches", calories: 200, proteins: 8, carbs: 35, fats: 4 },
          { name: "Fromage blanc", quantity: "150g", calories: 120, proteins: 15, carbs: 6, fats: 2 },
          { name: "Miel", quantity: "1 cuillère", calories: 30, proteins: 0, carbs: 8, fats: 0 },
          { name: "Fruits rouges", quantity: "100g", calories: 50, proteins: 1, carbs: 12, fats: 0 },
          { name: "Café", quantity: "1 tasse", calories: 100, proteins: 0, carbs: 0, fats: 0 }
        ],
        instructions: "Tartiner le fromage blanc sur le pain complet, ajouter le miel et les fruits rouges."
      },
      {
        name: "Déjeuner méditerranéen",
        type: "déjeuner",
        calories: 600,
        foods: [
          { name: "Poulet", quantity: "120g", calories: 200, proteins: 35, carbs: 0, fats: 4 },
          { name: "Riz basmati", quantity: "100g", calories: 130, proteins: 3, carbs: 28, fats: 1 },
          { name: "Légumes grillés", quantity: "200g", calories: 100, proteins: 4, carbs: 15, fats: 2 },
          { name: "Houmous", quantity: "50g", calories: 80, proteins: 3, carbs: 6, fats: 5 },
          { name: "Vinaigrette", quantity: "1 cuillère", calories: 90, proteins: 0, carbs: 2, fats: 10 }
        ],
        instructions: "Griller le poulet et les légumes. Servir avec le riz et le houmous."
      },
      {
        name: "Goûter énergie",
        type: "collation",
        calories: 300,
        foods: [
          { name: "Pomme", quantity: "1 moyenne", calories: 80, proteins: 0, carbs: 20, fats: 0 },
          { name: "Amandes", quantity: "20g", calories: 120, proteins: 4, carbs: 4, fats: 10 },
          { name: "Chocolat noir", quantity: "20g", calories: 100, proteins: 2, carbs: 10, fats: 7 }
        ]
      },
      {
        name: "Dîner léger",
        type: "dîner",
        calories: 600,
        foods: [
          { name: "Saumon", quantity: "150g", calories: 250, proteins: 40, carbs: 0, fats: 12 },
          { name: "Quinoa", quantity: "80g", calories: 100, proteins: 4, carbs: 17, fats: 2 },
          { name: "Épinards", quantity: "200g", calories: 50, proteins: 6, carbs: 8, fats: 1 },
          { name: "Avocat", quantity: "1/2", calories: 150, proteins: 2, carbs: 8, fats: 14 },
          { name: "Yaourt grec", quantity: "100g", calories: 50, proteins: 10, carbs: 3, fats: 1 }
        ],
        instructions: "Cuire le saumon en papillote avec les épinards. Servir avec le quinoa et l'avocat."
      }
    ],
    shoppingList: [
      { item: "Pain complet", quantity: "1 pain", category: "céréales" },
      { item: "Fromage blanc", quantity: "500g", category: "produits laitiers" },
      { item: "Fruits rouges", quantity: "500g", category: "fruits" },
      { item: "Poulet", quantity: "1kg", category: "protéines" },
      { item: "Riz basmati", quantity: "1kg", category: "céréales" },
      { item: "Saumon", quantity: "500g", category: "protéines" },
      { item: "Quinoa", quantity: "500g", category: "céréales" },
      { item: "Épinards", quantity: "500g", category: "légumes" },
      { item: "Avocats", quantity: "3 unités", category: "fruits" }
    ],
    tips: [
      {
        title: "Variété",
        content: "Variez les aliments chaque semaine pour assurer un apport complet en nutriments."
      },
      {
        title: "Écoutez votre corps",
        content: "Mangez quand vous avez faim et arrêtez quand vous êtes rassasié."
      },
      {
        title: "Activité modérée",
        content: "30 minutes de marche quotidienne suffisent pour maintenir une bonne santé."
      }
    ]
  }
];

// Supprimer les anciens plans et insérer les nouveaux
NutritionPlan.deleteMany({})
  .then(() => {
    console.log("🗑️ Anciens plans supprimés");
    return NutritionPlan.insertMany(plans);
  })
  .then(() => {
    console.log("✅ Plans nutrition complets ajoutés !");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.log("❌ Erreur:", err);
    mongoose.disconnect();
  });
