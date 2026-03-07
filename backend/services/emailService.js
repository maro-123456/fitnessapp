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
  welcomeEmail: (userInfo) => ({
    subject: '🎉 Bienvenue dans FitLife - Votre voyage fitness commence !',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FitLife - Bienvenue</title>
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
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 2.5rem;
            font-weight: 700;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 1.1rem;
          }
          .content {
            padding: 40px 30px;
          }
          .welcome-message {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            text-align: center;
          }
          .welcome-message h2 {
            color: #6366f1;
            margin: 0 0 15px 0;
            font-size: 1.8rem;
          }
          .user-info {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
            margin: 20px 0;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
          }
          .info-item {
            background: white;
            padding: 15px;
            border-radius: 10px;
            border-left: 4px solid #6366f1;
          }
          .info-item strong {
            color: #6366f1;
            display: block;
            margin-bottom: 5px;
          }
          .cta-section {
            text-align: center;
            margin: 30px 0;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            margin: 10px;
            transition: transform 0.3s ease;
          }
          .cta-button:hover {
            transform: translateY(-2px);
          }
          .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #666;
          }
          .next-steps {
            margin: 30px 0;
          }
          .step {
            display: flex;
            align-items: center;
            margin: 15px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
          }
          .step-number {
            background: #6366f1;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 15px;
            flex-shrink: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bienvenue dans FitLife !</h1>
            <p>Votre voyage vers une meilleure forme physique commence maintenant</p>
          </div>
          
          <div class="content">
            <div class="welcome-message">
              <h2>Bonjour ${userInfo.userName} !</h2>
              <p>Nous sommes ravis de vous accueillir dans la communauté FitLife. Votre transformation fitness commence aujourd'hui !</p>
            </div>

            <div class="user-info">
              <h3 style="color: #6366f1; margin-bottom: 20px;">📋 Vos Informations</h3>
              <div class="info-grid">
                <div class="info-item">
                  <strong>🎯 Objectif</strong>
                  ${userInfo.userGoal || "Définir votre objectif"}
                </div>
                <div class="info-item">
                  <strong>⚖️ Poids</strong>
                  ${userInfo.userWeight || "Non spécifié"} kg
                </div>
                <div class="info-item">
                  <strong>📏 Taille</strong>
                  ${userInfo.userHeight || "Non spécifié"} cm
                </div>
                <div class="info-item">
                  <strong>🎂 Âge</strong>
                  ${userInfo.userAge || "Non spécifié"} ans
                </div>
              </div>
            </div>

            <div class="next-steps">
              <h3 style="color: #6366f1; margin-bottom: 20px;">🚀 Vos Prochaines Étapes</h3>
              
              <div class="step">
                <div class="step-number">1</div>
                <div>
                  <strong>Explorez votre tableau de bord</strong>
                  <p>Découvrez vos statistiques et suivez votre progression</p>
                </div>
              </div>
              
              <div class="step">
                <div class="step-number">2</div>
                <div>
                  <strong>Découvrez nos exercices</strong>
                  <p>Accédez à des centaines d'exercices pour tous niveaux</p>
                </div>
              </div>
              
              <div class="step">
                <div class="step-number">3</div>
                <div>
                  <strong>Personnalisez votre nutrition</strong>
                  <p>Suivez un plan alimentaire adapté à vos objectifs</p>
                </div>
              </div>
            </div>

            <div class="cta-section">
              <h3 style="color: #6366f1; margin-bottom: 20px;">🎯 Prêt à Commencer ?</h3>
              <a href="http://localhost:3000/dashboard" class="cta-button">🏠 Tableau de Bord</a>
              <a href="http://localhost:3000/exercises" class="cta-button">🏋️ Exercices</a>
              <a href="http://localhost:3000/nutrition" class="cta-button">🥗 Nutrition</a>
            </div>

            <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h4 style="color: #0ea5e9; margin: 0 0 10px 0;">📧 Emails de Coaching</h4>
              <p style="margin: 0;">Vous recevrez régulièrement des emails de coaching pour vous motiver et vous guider dans votre progression. Activez les notifications dans votre profil pour ne rien manquer !</p>
            </div>
          </div>

          <div class="footer">
            <p><strong>FitLife</strong> - Votre partenaire fitness</p>
            <p style="font-size: 0.9rem; margin-top: 10px;">
              Cet email a été envoyé à ${userInfo.userEmail}<br>
              Vous pouvez gérer vos préférences d'email dans votre profil.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  newNutritionPlan: (userName, planInfo) => ({
    subject: '🥗 Nouveau Plan Nutritionnel Disponible !',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FitLife - Nouveau Plan Nutritionnel</title>
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
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 2.5rem;
            font-weight: 700;
          }
          .content {
            padding: 40px 30px;
          }
          .plan-details {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 30px;
            border-radius: 15px;
            margin: 20px 0;
          }
          .plan-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
          }
          .plan-item {
            background: white;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #10b981;
            text-align: center;
          }
          .plan-item strong {
            color: #10b981;
            display: block;
            margin-bottom: 10px;
            font-size: 1.2rem;
          }
          .cta-section {
            text-align: center;
            margin: 30px 0;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: transform 0.3s ease;
          }
          .cta-button:hover {
            transform: translateY(-2px);
          }
          .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🥗 Nouveau Plan Nutritionnel !</h1>
            <p>Votre plan personnalisé est prêt</p>
          </div>
          
          <div class="content">
            <div class="plan-details">
              <h2 style="color: #10b981; margin-bottom: 20px;">📋 Détails du Plan</h2>
              <div class="plan-grid">
                <div class="plan-item">
                  <strong>📝 Nom du Plan</strong>
                  ${planInfo.planName}
                </div>
                <div class="plan-item">
                  <strong>🔥 Calories</strong>
                  ${planInfo.calories} kcal/jour
                </div>
                <div class="plan-item">
                  <strong>📅 Durée</strong>
                  ${planInfo.duration}
                </div>
                <div class="plan-item">
                  <strong>🍽️ Repas</strong>
                  ${planInfo.meals} repas par jour
                </div>
              </div>
            </div>

            <div style="background: #f0fdf4; padding: 25px; border-radius: 15px; margin: 20px 0;">
              <h3 style="color: #10b981; margin: 0 0 15px 0;">💚 Pourquoi ce plan est parfait pour vous ?</h3>
              <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Adapté à vos objectifs et votre métabolisme</li>
                <li>Équilibré en macronutriments</li>
                <li>Recettes simples et délicieuses</li>
                <li>Facile à suivre au quotidien</li>
              </ul>
            </div>

            <div class="cta-section">
              <h3 style="color: #10b981; margin-bottom: 20px;">🚀 Découvrez votre plan maintenant !</h3>
              <a href="http://localhost:3000/nutrition" class="cta-button">🥗 Voir mon Plan Nutritionnel</a>
            </div>
          </div>

          <div class="footer">
            <p><strong>FitLife</strong> - Votre nutrition personnalisée</p>
            <p style="font-size: 0.9rem; margin-top: 10px;">
              Cet email a été envoyé automatiquement.<br>
              Vous pouvez gérer vos préférences d'email dans votre profil.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  dailyMotivation: (motivationInfo) => ({
    subject: '💪 Votre Motivation Quotidienne FitLife',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FitLife - Motivation Quotidienne</title>
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
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 2.5rem;
            font-weight: 700;
          }
          .content {
            padding: 40px 30px;
          }
          .quote-section {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            padding: 40px;
            border-radius: 20px;
            margin: 20px 0;
            text-align: center;
          }
          .quote {
            font-size: 1.5rem;
            font-style: italic;
            color: #92400e;
            margin-bottom: 20px;
            line-height: 1.6;
          }
          .author {
            color: #78350f;
            font-weight: 600;
            font-size: 1.1rem;
          }
          .tip-section {
            background: #f0f9ff;
            padding: 30px;
            border-radius: 15px;
            margin: 20px 0;
          }
          .tip-section h3 {
            color: #0ea5e9;
            margin: 0 0 15px 0;
          }
          .cta-section {
            text-align: center;
            margin: 30px 0;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            margin: 10px;
            transition: transform 0.3s ease;
          }
          .cta-button:hover {
            transform: translateY(-2px);
          }
          .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💪 Motivation Quotidienne</h1>
            <p>Bonjour ${motivationInfo.userName} !</p>
          </div>
          
          <div class="content">
            <div class="quote-section">
              <div class="quote">"${motivationInfo.quote}"</div>
              <div class="author">— ${motivationInfo.author}</div>
            </div>

            <div class="tip-section">
              <h3>🎯 Conseil du Jour</h3>
              <p style="font-size: 1.1rem; line-height: 1.6; margin: 0;">${motivationInfo.tip}</p>
            </div>

            <div style="background: #fef3c7; padding: 25px; border-radius: 15px; margin: 20px 0;">
              <h3 style="color: #92400e; margin: 0 0 15px 0;">🌟 Rappel Positif</h3>
              <p style="margin: 0; line-height: 1.6;">Chaque jour est une nouvelle opportunité de progresser. Vous avez déjà fait le premier pas en vous inscrivant à FitLife. Continuez comme ça !</p>
            </div>

            <div class="cta-section">
              <h3 style="color: #6366f1; margin-bottom: 20px;">🚀 Prêt pour aujourd'hui ?</h3>
              <a href="http://localhost:3000/dashboard" class="cta-button">🏠 Tableau de Bord</a>
              <a href="http://localhost:3000/exercises" class="cta-button">🏋️ Exercices</a>
            </div>
          </div>

          <div class="footer">
            <p><strong>FitLife</strong> - Votre partenaire motivationnel</p>
            <p style="font-size: 0.9rem; margin-top: 10px;">
              Cet email de motivation vous est envoyé chaque jour.<br>
              Vous pouvez gérer vos préférences d'email dans votre profil.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

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

  static async sendNewNutritionPlan(userId, planInfo) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.emailNotifications) return;

      const emailContent = emailTemplates.newNutritionPlan(user.name, planInfo);
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        ...emailContent
      });

      console.log(`Email nouveau plan nutritionnel envoyé à ${user.email}`);
    } catch (error) {
      console.error('Erreur envoi email nouveau plan nutritionnel:', error);
    }
  }

  static async sendDailyMotivation(userId, motivationInfo) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.emailNotifications) return;

      const emailContent = emailTemplates.dailyMotivation(motivationInfo);
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        ...emailContent
      });

      console.log(`Email motivation quotidienne envoyé à ${user.email}`);
    } catch (error) {
      console.error('Erreur envoi email motivation quotidienne:', error);
    }
  }

  static async sendWelcomeEmail(userId, userInfo) {
    try {
      // Utiliser directement les userInfo passées en paramètre
      const emailContent = emailTemplates.welcomeEmail(userInfo);
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userInfo.userEmail,
        ...emailContent
      });

      console.log(`Email de bienvenue envoyé à ${userInfo.userEmail}`);
    } catch (error) {
      console.error('Erreur envoi email de bienvenue:', error);
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
