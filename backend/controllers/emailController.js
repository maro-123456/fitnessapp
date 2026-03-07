const EmailService = require('../services/emailService');
const User = require('../models/User');
const NutritionPlan = require('../models/NutritionPlan');
const cron = require('node-cron');

// Planification des emails automatiques
class EmailController {
  // Initialiser les tâches cron
  static initializeScheduledEmails() {
    // Email hebdomadaire - tous les dimanches à 9h
    cron.schedule('0 9 * * 0', async () => {
      console.log('📧 Envoi des emails hebdomadaires...');
      await EmailService.sendWeeklyRecap();
    });

    // Vérification des inactivités - tous les jours à 10h
    cron.schedule('0 10 * * *', async () => {
      console.log('📧 Vérification des inactivités...');
      await this.checkInactiveUsers();
    });

    // Rappels d'entraînements - tous les jours à 8h et 18h
    cron.schedule('0 8,18 * * *', async () => {
      console.log('📧 Envoi des rappels d\'entraînements...');
      await this.sendWorkoutReminders();
    });

    // Vérification des nouveaux plans nutritionnels - tous les jours à 11h
    cron.schedule('0 11 * * *', async () => {
      console.log('📧 Vérification des nouveaux plans nutritionnels...');
      await this.checkNewNutritionPlans();
    });

    // Motivation quotidienne - tous les jours à 7h
    cron.schedule('0 7 * * *', async () => {
      console.log('📧 Envoi des emails de motivation quotidienne...');
      await this.sendDailyMotivation();
    });

    console.log('✅ Tâches d\'emails automatiques initialisées');
  }

  // Vérifier les nouveaux plans nutritionnels
  static async checkNewNutritionPlans() {
    try {
      const users = await User.find({ emailNotifications: true });
      
      for (const user of users) {
        // Vérifier si l'utilisateur a un nouveau plan nutritionnel créé récemment
        const recentNutritionPlan = await NutritionPlan.findOne({
          userId: user._id,
          createdAt: {
            $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Dernières 24h
          }
        });

        if (recentNutritionPlan) {
          await EmailService.sendNewNutritionPlan(user._id, {
            planName: recentNutritionPlan.name || 'Plan personnalisé',
            calories: recentNutritionPlan.calories || '2000',
            duration: recentNutritionPlan.duration || '7 jours',
            meals: recentNutritionPlan.meals?.length || 3
          });
        }
      }
    } catch (error) {
      console.error('Erreur vérification plans nutritionnels:', error);
    }
  }

  // Envoyer la motivation quotidienne
  static async sendDailyMotivation() {
    try {
      const users = await User.find({ emailNotifications: true });
      
      for (const user of users) {
        const motivationQuote = this.getRandomMotivationQuote();
        await EmailService.sendDailyMotivation(user._id, {
          userName: user.name,
          quote: motivationQuote.quote,
          author: motivationQuote.author,
          tip: motivationQuote.tip
        });
      }
    } catch (error) {
      console.error('Erreur envoi motivation quotidienne:', error);
    }
  }

  // Obtenir une citation de motivation aléatoire
  static getRandomMotivationQuote() {
    const quotes = [
      {
        quote: "Le seul échec est de ne pas essayer.",
        author: "Chris Bradford",
        tip: "Aujourd'hui, concentrez-vous sur la progression, pas la perfection."
      },
      {
        quote: "Votre corps peut supporter presque tout. C'est votre esprit que vous devez convaincre.",
        author: "Inconnu",
        tip: "Commencez petit, progressez chaque jour."
      },
      {
        quote: "La discipline est le pont entre les objectifs et les accomplissements.",
        author: "Jim Rohn",
        tip: "Fixez-vous un objectif réalisable pour aujourd'hui."
      },
      {
        quote: "Le succès est la somme de petits efforts répétés jour après jour.",
        author: "Robert Collier",
        tip: "Chaque entraînement compte, même les plus courts."
      },
      {
        quote: "Ne vous comparez pas aux autres. Soyez la meilleure version de vous-même.",
        author: "Inconnu",
        tip: "Célébrez vos progrès, même les plus petits."
      }
    ];
    
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  // Vérifier les utilisateurs inactifs
  static async checkInactiveUsers() {
    try {
      const users = await User.find({ emailNotifications: true });
      
      for (const user of users) {
        const lastWorkout = await this.getLastWorkoutDate(user._id);
        const daysInactive = this.calculateDaysInactive(lastWorkout);
        
        // Envoyer une alerte après 7, 14, et 30 jours d'inactivité
        if (daysInactive === 7 || daysInactive === 14 || daysInactive === 30) {
          await EmailService.sendInactivityAlert(user._id, daysInactive);
        }
      }
    } catch (error) {
      console.error('Erreur vérification inactivité:', error);
    }
  }

  // Envoyer les rappels d'entraînements
  static async sendWorkoutReminders() {
    try {
      const users = await User.find({ emailNotifications: true });
      
      for (const user of users) {
        const shouldRemind = await this.shouldSendWorkoutReminder(user._id);
        
        if (shouldRemind) {
          const workoutInfo = await this.generateWorkoutReminder(user._id);
          await EmailService.sendWorkoutReminder(user._id, workoutInfo);
        }
      }
    } catch (error) {
      console.error('Erreur envoi rappels entraînements:', error);
    }
  }

  // API Routes
  static async sendTestEmail(req, res) {
    try {
      const { userId, emailType } = req.body;
      
      if (!userId || !emailType) {
        return res.status(400).json({ message: "userId et emailType requis" });
      }

      let result;
      switch (emailType) {
        case 'weekly':
          await EmailService.sendWeeklyRecap();
          result = "Email hebdomadaire envoyé";
          break;
        case 'reminder':
          const workoutInfo = await this.generateWorkoutReminder(userId);
          await EmailService.sendWorkoutReminder(userId, workoutInfo);
          result = "Rappel d'entraînement envoyé";
          break;
        case 'goal':
          const goalInfo = {
            goalType: "Perte de poids",
            goalDescription: "Perdre 5kg",
            achievementValue: "5.2kg",
            targetValue: "5kg",
            daysToAchieve: "45",
            nextGoals: ["Maintenir le poids", "Gagner en masse musculaire"]
          };
          await EmailService.sendGoalAchieved(userId, goalInfo);
          result = "Email objectif atteint envoyé";
          break;
        case 'inactivity':
          await EmailService.sendInactivityAlert(userId, 7);
          result = "Alerte inactivité envoyée";
          break;
        default:
          return res.status(400).json({ message: "Type d'email invalide" });
      }

      res.json({ message: result });
    } catch (error) {
      console.error('Erreur envoi email test:', error);
      res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
    }
  }

  static async updateEmailPreferences(req, res) {
    try {
      const { emailNotifications, weeklyRecap, workoutReminders, inactivityAlerts } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          emailPreferences: {
            emailNotifications: emailNotifications !== false,
            weeklyRecap: weeklyRecap !== false,
            workoutReminders: workoutReminders !== false,
            inactivityAlerts: inactivityAlerts !== false
          }
        },
        { new: true }
      );

      res.json({ 
        message: "Préférences email mises à jour",
        preferences: user.emailPreferences
      });
    } catch (error) {
      console.error('Erreur mise à jour préférences email:', error);
      res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
  }

  static async getEmailPreferences(req, res) {
    try {
      const user = await User.findById(req.user.id);
      
      res.json({
        preferences: user.emailPreferences || {
          emailNotifications: true,
          weeklyRecap: true,
          workoutReminders: true,
          inactivityAlerts: true
        }
      });
    } catch (error) {
      console.error('Erreur récupération préférences email:', error);
      res.status(500).json({ message: "Erreur lors de la récupération" });
    }
  }

  static async getEmailHistory(req, res) {
    try {
      // Simuler un historique d'emails (à implémenter avec une vraie base de données)
      const mockHistory = [
        {
          id: 1,
          type: "weekly_recap",
          subject: "🏋️ Votre Récap Hebdomadaire FitLife",
          sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          status: "sent"
        },
        {
          id: 2,
          type: "workout_reminder",
          subject: "🏋️ Rappel : Votre séance aujourd'hui !",
          sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: "sent"
        },
        {
          id: 3,
          type: "goal_achieved",
          subject: "🎉 Félicitations ! Objectif atteint !",
          sentAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          status: "sent"
        }
      ];

      res.json({ history: mockHistory });
    } catch (error) {
      console.error('Erreur récupération historique emails:', error);
      res.status(500).json({ message: "Erreur lors de la récupération" });
    }
  }

  // Fonctions utilitaires
  static async getLastWorkoutDate(userId) {
    // Simuler la récupération de la date du dernier entraînement
    return new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 jours ago
  }

  static calculateDaysInactive(lastWorkoutDate) {
    if (!lastWorkoutDate) return 999;
    return Math.floor((new Date() - lastWorkoutDate) / (1000 * 60 * 60 * 24));
  }

  static async shouldSendWorkoutReminder(userId) {
    // Logique pour déterminer si un rappel doit être envoyé
    // Par exemple, vérifier si l'utilisateur n'a pas d'entraînement prévu aujourd'hui
    return Math.random() > 0.7; // 30% de chance pour la démo
  }

  static async generateWorkoutReminder(userId) {
    // Générer un programme d'entraînement pour le rappel
    const exercises = [
      { name: "Pompes", sets: "3", reps: "15" },
      { name: "Squats", sets: "4", reps: "12" },
      { name: "Planche", sets: "3", reps: "45s" },
      { name: "Burpees", sets: "3", reps: "10" }
    ];

    const quotes = [
      "Le seul mauvais entraînement est celui que vous ne faites pas.",
      "Chaque répétition vous rapproche de votre objectif.",
      "La discipline est le pont entre les objectifs et les accomplissements.",
      "Votre corps peut supporter presque tout. C'est votre esprit que vous devez convaincre.",
      "Commencez où vous êtes. Utilisez ce que vous avez. Faites ce que vous pouvez."
    ];

    return {
      title: "Session Force Complète",
      duration: "45",
      difficulty: "Intermédiaire",
      exercises,
      motivationQuote: quotes[Math.floor(Math.random() * quotes.length)]
    };
  }
}

module.exports = EmailController;
