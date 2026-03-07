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

app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/email", emailRoutes);
// Ajouter les routes exercises, nutrition, progress, admin

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server lancé sur http://localhost:${PORT}`));