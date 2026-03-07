# 📧 GUIDE COMPLET - CONFIGURATION EMAILS FITLIFE

## ❌ PROBLÈME : Vous ne recevez pas d'emails

La raison est simple : **les variables d'environnement Gmail ne sont pas configurées**.

---

## 🔧 ÉTAPE 1 : Configurer Gmail pour l'envoi d'emails

### 📋 Option A : Utiliser un App Password (Recommandé)

1. **Activer la vérification en 2 étapes** sur votre compte Gmail
   - Allez dans : https://myaccount.google.com/security
   - Activez "Vérification en deux étapes"

2. **Créer un App Password**
   - Allez dans : https://myaccount.google.com/apppasswords
   - Sélectionnez :
     - App: "Autre (nom personnalisé)"
     - Nom: "FitLife Backend"
   - Copiez le mot de passe généré (16 caractères)

### 📋 Option B : Utiliser Gmail SMTP moins sécurisé (Non recommandé)

1. **Activer l'accès moins sécurisé**
   - Allez dans : https://myaccount.google.com/lesssecureapps
   - Activez "Autoriser les applications moins sécurisées"

---

## 🔧 ÉTAPE 2 : Mettre à jour le fichier .env

Modifiez le fichier `backend/.env` :

```env
MONGO_URI=mongodb://127.0.0.1:27017/fitnessApp
JWT_SECRET=supersecret
PORT=5000

# Configuration Email Gmail
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-app-password-16-caracteres
```

**IMPORTANT :**
- `EMAIL_USER` : Votre adresse Gmail complète
- `EMAIL_PASS` : Le mot de passe d'application de 16 caractères (pas votre mot de passe normal !)

---

## 🔧 ÉTAPE 3 : Tester la configuration

### 📧 Test 1 : Script rapide
```bash
cd backend
# MODIFIEZ votre-email@gmail.com dans quick-email-test.js
node quick-email-test.js
```

### 📧 Test 2 : Via l'API
```bash
# Démarrez le serveur
npm start

# Dans un autre terminal, testez l'email
curl -X POST http://localhost:5000/api/test-welcome-email
```

---

## 🔧 ÉTAPE 4 : Vérifier les logs du serveur

Les logs devraient montrer :
```
✅ Tâches d'emails automatiques initialisées
Email de bienvenue envoyé à votre-email@gmail.com
```

Si vous voyez des erreurs comme :
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
→ **Le mot de passe est incorrect**

---

## 🚨 DÉPANNAGE

### ❌ Erreur : "Username and Password not accepted"
**Solution** : Utilisez un App Password, pas votre mot de passe Gmail normal

### ❌ Erreur : "Greeting never received"
**Solution** : Vérifiez votre connexion internet et firewall

### ❌ Erreur : "Connection timeout"
**Solution** : Redémarrez le serveur après avoir modifié .env

### ❌ Email dans les spams
**Solution** : Vérifiez le dossier "Spam" ou "Promotions"

---

## 📧 Test complet avec inscription

1. **Configurez Gmail** (étape 1)
2. **Mettez à jour .env** (étape 2)  
3. **Redémarrez le serveur** :
   ```bash
   cd backend
   npm start
   ```
4. **Inscrivez-vous** sur http://localhost:3000
5. **Vérifiez votre email** (y compris spam)

---

## ✅ Vérification finale

Après configuration, vous devriez voir :

- ✅ **Email de bienvenue** : Immédiat après inscription
- ✅ **Motivation quotidienne** : Tous les jours à 7h
- ✅ **Rappels workouts** : Tous les jours à 8h et 18h
- ✅ **Récap hebdomadaire** : Tous les dimanches à 9h

---

## 🎯 CONFIGURATION RAPIDE

1. **Créez un App Password Gmail** : https://myaccount.google.com/apppasswords
2. **Modifiez .env** avec vos vraies informations
3. **Redémarrez le serveur**
4. **Testez avec** : `node quick-email-test.js`

C'est tout ! 🎯
