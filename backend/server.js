require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const EmailController = require('./controllers/emailController');

const app = express();
connectDB();

// Initialiser les emails automatiques
EmailController.initializeScheduledEmails();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const emailRoutes = require('./routes/emailRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const gymRoutes = require('./routes/gymRoutes');

app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/gyms", gymRoutes);

// Route de test pour l'email de bienvenue
app.post("/api/test-welcome-email", async (req, res) => {
  try {
    const EmailService = require('./services/emailService');
    const User = require('./models/User');
    
    // Créer un utilisateur de test
    const testUser = {
      _id: "507f1f77bcf86cd799439011",
      name: "Utilisateur Test",
      email: "test@example.com",
      goal: "Perte de poids",
      weight: "75",
      height: "175",
      age: "30"
    };
    
    await EmailService.sendWelcomeEmail(testUser._id, {
      userName: testUser.name,
      userEmail: testUser.email,
      userGoal: testUser.goal,
      userWeight: testUser.weight,
      userHeight: testUser.height,
      userAge: testUser.age
    });
    
    res.json({ message: "Email de bienvenue envoyé avec succès !" });
  } catch (error) {
    console.error('Erreur test email:', error);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email", error: error.message });
  }
});

// Route de test pour la motivation quotidienne
app.post("/api/test-daily-motivation", async (req, res) => {
  try {
    const EmailService = require('./services/emailService');
    const EmailController = require('./controllers/emailController');
    
    const testUser = {
      _id: "507f1f77bcf86cd799439011",
      name: "Utilisateur Test",
      email: "test@example.com"
    };
    
    const motivationQuote = EmailController.getRandomMotivationQuote();
    
    await EmailService.sendDailyMotivation(testUser._id, {
      userName: testUser.name,
      quote: motivationQuote.quote,
      author: motivationQuote.author,
      tip: motivationQuote.tip
    });
    
    res.json({ message: "Email de motivation quotidienne envoyé avec succès !" });
  } catch (error) {
    console.error('Erreur test motivation:', error);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email", error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server lancé sur http://localhost:${PORT}`));