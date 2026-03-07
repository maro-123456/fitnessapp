const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const EmailService = require("../services/emailService");

exports.register = async (req,res)=>{
  try{
    const { name,email,password,age,weight,height,goal,language } = req.body;
    if(await User.findOne({ email })) return res.status(400).json({ message:"Email déjà utilisé" });

    const hashed = await bcrypt.hash(password,10);
    const user = await User.create({ name,email,password:hashed,age,weight,height,goal,language, emailNotifications: true });
    const token = jwt.sign({ id:user._id, role:user.role }, process.env.JWT_SECRET,{ expiresIn:"7d" });
    
    // Envoyer l'email de bienvenue après inscription
    try {
      await EmailService.sendWelcomeEmail(user._id, {
        userName: user.name,
        userEmail: user.email,
        userGoal: user.goal,
        userWeight: user.weight,
        userHeight: user.height,
        userAge: user.age
      });
      console.log(`Email de bienvenue envoyé à ${user.email}`);
    } catch (emailError) {
      console.error("Erreur envoi email de bienvenue:", emailError);
      // Ne pas bloquer l'inscription si l'email échoue
    }
    
    res.status(201).json({ token,user });
  }catch(e){ res.status(500).json({ error:e.message }); }
}

exports.login = async (req,res)=>{
  try{
    const { email,password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(404).json({ message:"Utilisateur non trouvé" });

    if(!await bcrypt.compare(password,user.password)) return res.status(401).json({ message:"Mot de passe invalide" });

    const token = jwt.sign({ id:user._id, role:user.role }, process.env.JWT_SECRET,{ expiresIn:"7d" });
    res.json({ token,user });
  }catch(e){ res.status(500).json({ error:e.message }); }
}