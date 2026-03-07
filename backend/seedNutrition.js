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
    name: "Perte rapide",
    objective: "perte",
    duration: 30,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    name: "Perte douce",
    objective: "perte",
    duration: 60,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    name: "Maintien forme",
    objective: "maintien",
    duration: 30,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    name: "Maintien actif",
    objective: "maintien",
    duration: 45,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    name: "Prise de masse rapide",
    objective: "prise",
    duration: 30,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    name: "Prise de masse douce",
    objective: "prise",
    duration: 60,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    name: "Perte & énergie",
    objective: "perte",
    duration: 40,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    name: "Maintien santé",
    objective: "maintien",
    duration: 50,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    name: "Prise de force",
    objective: "prise",
    duration: 35,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    name: "Équilibre nutrition",
    objective: "maintien",
    duration: 25,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
];

// Insérer les plans dans MongoDB
NutritionPlan.insertMany(plans)
  .then(() => {
    console.log("✅ Plans nutrition ajoutés !");
    mongoose.disconnect();
  })
  .catch((err) => console.log(err));