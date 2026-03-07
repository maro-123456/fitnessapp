const nodemailer = require('nodemailer');
const User = require('../models/User');
const Workout = require('../models/Workout');

// Configuration du transporteur d'emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Templates d'emails
const emailTemplates = {
  weeklyRecap: (userName, stats) => ({
    subject: '🏋️ Votre Récap Hebdomadaire FitLife',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FitLife - Récap Hebdomadaire</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 2rem;
            font-weight: 700;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
          }
          .content {
            padding: 40px 30px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin: 30px 0;
          }
          .stat-card {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            border: 1px solid #dee2e6;
          }
          .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #6366f1;
            margin: 0 0 5px 0;
          }
          .stat-label {
            color: #6c757d;
            font-size: 0.9rem;
            margin: 0;
          }
          .progress-section {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
            margin: 30px 0;
            border: 1px solid #dee2e6;
          }
          .progress-title {
            color: #1a1a1a;
            margin: 0 0 20px 0;
            font-size: 1.3rem;
            font-weight: 600;
          }
          .achievement {
            background: #e7f3ff;
            border-left: 4px solid #6366f1;
            padding: 15px;
            margin: 10px 0;
            border-radius: 0 8px 8px 0;
          }
          .achievement-title {
            color: #6366f1;
            font-weight: 600;
            margin: 0 0 5px 0;
          }
          .cta-section {
            text-align: center;
            margin: 40px 0;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 0.9rem;
          }
          .emoji {
            font-size: 1.2rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1><span class="emoji">💪</span> FitLife</h1>
            <p>Votre récapitulatif hebdomadaire</p>
          </div>
          
          <div class="content">
            <h2>Salut ${userName} !</h2>
            <p>Voici votre performance de cette semaine. Continuez comme ça !</p>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">${stats.workouts}</div>
                <div class="stat-label">Entraînements</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${stats.calories}</div>
                <div class="stat-label">Calories brûlées</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${stats.duration}</div>
                <div class="stat-label">Minutes totales</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${stats.streak}</div>
                <div class="stat-label">Jours consécutifs</div>
              </div>
            </div>
            
            <div class="progress-section">
              <h3 class="progress-title">🏆 Vos réalisations</h3>
              ${stats.achievements.map(achievement => `
                <div class="achievement">
                  <div class="achievement-title">${achievement.title}</div>
                  <div>${achievement.description}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="progress-section">
              <h3 class="progress-title">📈 Objectifs de la semaine prochaine</h3>
              <ul>
                <li>${stats.nextWeekGoals.workouts} séances d'entraînement</li>
                <li>${stats.nextWeekGoals.calories} calories à brûler</li>
                <li>Essayer ${stats.nextWeekGoals.newExercise} nouvel exercice</li>
              </ul>
            </div>
            
            <div class="cta-section">
              <a href="http://localhost:3000/dashboard" class="cta-button">
                Voir votre tableau de bord
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>FitLife - Votre partenaire fitness</p>
            <p>Cet email est généré automatiquement. Ne répondez pas à cet email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  workoutReminder: (userName, workoutInfo) => ({
    subject: '🏋️ Rappel : Votre séance aujourd\'hui !',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FitLife - Rappel d'entraînement</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .content {
            padding: 40px 30px;
          }
          .workout-info {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
            margin: 20px 0;
            border: 1px solid #dee2e6;
          }
          .workout-title {
            color: #1a1a1a;
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0 0 15px 0;
          }
          .exercise-list {
            list-style: none;
            padding: 0;
          }
          .exercise-item {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            border: 1px solid #dee2e6;
          }
          .motivation {
            background: linear-gradient(135deg, #e7f3ff 0%, #d4edda 100%);
            padding: 20px;
            border-radius: 15px;
            margin: 20px 0;
            text-align: center;
            border: 1px solid #c3e6cb;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            margin: 20px 10px;
            transition: all 0.3s ease;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏋️ Rappel d'entraînement</h1>
            <p>C'est l'heure de votre séance !</p>
          </div>
          
          <div class="content">
            <h2>Salut ${userName} !</h2>
            <p>N'oubliez pas votre séance d'entraînement aujourd'hui. Voici votre programme :</p>
            
            <div class="workout-info">
              <h3 class="workout-title">${workoutInfo.title}</h3>
              <p><strong>Durée prévue :</strong> ${workoutInfo.duration} minutes</p>
              <p><strong>Difficulté :</strong> ${workoutInfo.difficulty}</p>
              
              <h4>Exercices prévus :</h4>
              <ul class="exercise-list">
                ${workoutInfo.exercises.map(exercise => `
                  <li class="exercise-item">
                    <strong>${exercise.name}</strong> - ${exercise.sets} × ${exercise.reps}
                  </li>
                `).join('')}
              </ul>
            </div>
            
            <div class="motivation">
              <h3>💪 Motivation du jour</h3>
              <p>"${workoutInfo.motivationQuote}"</p>
            </div>
            
            <div style="text-align: center;">
              <a href="http://localhost:3000/dashboard/exercises" class="cta-button">
                Commencer la séance
              </a>
              <a href="http://localhost:3000/dashboard" class="cta-button" style="background: #6c757d;">
                Plus tard
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  goalAchieved: (userName, goalInfo) => ({
    subject: '🎉 Félicitations ! Objectif atteint !',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FitLife - Objectif atteint !</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .content {
            padding: 40px 30px;
          }
          .achievement-box {
            background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
            padding: 30px;
            border-radius: 15px;
            margin: 20px 0;
            text-align: center;
            border: 2px solid #28a745;
          }
          .achievement-icon {
            font-size: 4rem;
            margin: 0 0 20px 0;
          }
          .stats-highlight {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin: 30px 0;
          }
          .stat-highlight {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            border: 1px solid #dee2e6;
          }
          .next-steps {
            background: #e7f3ff;
            padding: 25px;
            border-radius: 15px;
            margin: 20px 0;
            border: 1px solid #6366f1;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Objectif Atteint !</h1>
            <p>Félicitations ${userName} !</p>
          </div>
          
          <div class="content">
            <div class="achievement-box">
              <div class="achievement-icon">🏆</div>
              <h2>Vous avez atteint votre objectif !</h2>
              <p><strong>${goalInfo.goalType}</strong> : ${goalInfo.goalDescription}</p>
            </div>
            
            <h3>📊 Vos performances</h3>
            <div class="stats-highlight">
              <div class="stat-highlight">
                <div style="font-size: 1.5rem; font-weight: 700; color: #28a745;">
                  ${goalInfo.achievementValue}
                </div>
                <div>Résultat final</div>
              </div>
              <div class="stat-highlight">
                <div style="font-size: 1.5rem; font-weight: 700; color: #6366f1;">
                  ${goalInfo.targetValue}
                </div>
                <div>Objectif initial</div>
              </div>
              <div class="stat-highlight">
                <div style="font-size: 1.5rem; font-weight: 700; color: #ffc107;">
                  ${goalInfo.daysToAchieve}
                </div>
                <div>Jours pour y arriver</div>
              </div>
            </div>
            
            <div class="next-steps">
              <h3>🎯 Prochains défis</h3>
              <ul>
                ${goalInfo.nextGoals.map(goal => `<li>${goal}</li>`).join('')}
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/dashboard/progress" class="cta-button">
                Voir votre progression
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  inactivityAlert: (userName, inactivityDays) => ({
    subject: '📍 On ne vous voit plus beaucoup...',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FitLife - Alerte d'inactivité</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .content {
            padding: 40px 30px;
          }
          .alert-box {
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
            padding: 30px;
            border-radius: 15px;
            margin: 20px 0;
            text-align: center;
            border: 2px solid #ffc107;
          }
          .motivation-section {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
            margin: 20px 0;
            border: 1px solid #dee2e6;
          }
          .quick-actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 30px 0;
          }
          .action-button {
            display: block;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            text-align: center;
            transition: all 0.3s ease;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📍 On vous pense !</h1>
            <p>Revenez nous voir</p>
          </div>
          
          <div class="content">
            <h2>Salut ${userName} !</h2>
            
            <div class="alert-box">
              <h3>⏰ Cela fait ${inactivityDays} jours...</h3>
              <p>...que nous ne vous avons pas vu à la salle !</p>
              <p>Votre progression nous manque !</p>
            </div>
            
            <div class="motivation-section">
              <h3>💪 Pourquoi reprendre ?</h3>
              <ul>
                <li>Vous étiez à ${inactivityDays <= 7 ? 'un excellent rythme' : 'un bon rythme'} !</li>
                <li>Chaque séance vous rapproche de vos objectifs</li>
                <li>Nous avons de nouveaux exercices à vous proposer</li>
                <li>La communauté FitLife vous soutient !</li>
              </ul>
            </div>
            
            <h3>🚀 Reprenez facilement</h3>
            <div class="quick-actions">
              <a href="http://localhost:3000/dashboard/exercises" class="action-button">
                🏋️ Session légère
              </a>
              <a href="http://localhost:3000/dashboard/progress" class="action-button">
                📈 Voir mes stats
              </a>
              <a href="http://localhost:3000/dashboard/gyms" class="action-button">
                🗺️ Trouver une salle
              </a>
              <a href="http://localhost:3000/dashboard/profile" class="action-button">
                ⚙️ Ajuster mes objectifs
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Fonctions d'envoi d'emails
class EmailService {
  static async sendWeeklyRecap() {
    try {
      const users = await User.find({ emailNotifications: true });
      
      for (const user of users) {
        // Calculer les stats de la semaine
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        
        const workouts = await Workout.find({
          userId: user._id,
          date: { $gte: weekStart }
        });

        const stats = {
          workouts: workouts.length,
          calories: workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
          duration: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
          streak: this.calculateStreak(user._id),
          achievements: await this.getUserAchievements(user._id),
          nextWeekGoals: {
            workouts: Math.max(3, workouts.length + 1),
            calories: Math.round(workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0) * 1.1),
            newExercise: "Pompes"
          }
        };

        const emailContent = emailTemplates.weeklyRecap(user.name, stats);
        
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          ...emailContent
        });

        console.log(`Email hebdomadaire envoyé à ${user.email}`);
      }
    } catch (error) {
      console.error('Erreur envoi emails hebdomadaires:', error);
    }
  }

  static async sendWorkoutReminder(userId, workoutInfo) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.emailNotifications) return;

      const emailContent = emailTemplates.workoutReminder(user.name, workoutInfo);
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        ...emailContent
      });

      console.log(`Rappel d'entraînement envoyé à ${user.email}`);
    } catch (error) {
      console.error('Erreur envoi rappel entraînement:', error);
    }
  }

  static async sendGoalAchieved(userId, goalInfo) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.emailNotifications) return;

      const emailContent = emailTemplates.goalAchieved(user.name, goalInfo);
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        ...emailContent
      });

      console.log(`Email objectif atteint envoyé à ${user.email}`);
    } catch (error) {
      console.error('Erreur envoi email objectif:', error);
    }
  }

  static async sendInactivityAlert(userId, inactivityDays) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.emailNotifications) return;

      const emailContent = emailTemplates.inactivityAlert(user.name, inactivityDays);
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        ...emailContent
      });

      console.log(`Alerte inactivité envoyée à ${user.email}`);
    } catch (error) {
      console.error('Erreur envoi alerte inactivité:', error);
    }
  }

  static async calculateStreak(userId) {
    // Logique pour calculer la série de jours consécutifs
    const workouts = await Workout.find({ userId }).sort({ date: -1 });
    let streak = 0;
    let currentDate = new Date();
    
    for (const workout of workouts) {
      const workoutDate = new Date(workout.date);
      const daysDiff = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  static async getUserAchievements(userId) {
    // Simuler des réalisations
    return [
      { title: "🔥 Série d'or", description: "7 jours consécutifs d'entraînement" },
      { title: "💪 Force", description: "Soulevé 1000kg total cette semaine" },
      { title: "🏃 Endurance", description: "10km courus cette semaine" }
    ];
  }

  static async testEmailConnection() {
    try {
      await transporter.verify();
      console.log('✅ Service email connecté avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur connexion email:', error);
      return false;
    }
  }
}

module.exports = EmailService;
