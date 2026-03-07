const express = require('express');
const router = express.Router();
const EmailController = require('../controllers/emailController');
const auth = require('../middleware/auth');

// Routes protégées (nécessitent d'être connecté)
router.post('/test', auth, EmailController.sendTestEmail);
router.put('/preferences', auth, EmailController.updateEmailPreferences);
router.get('/preferences', auth, EmailController.getEmailPreferences);
router.get('/history', auth, EmailController.getEmailHistory);

// Route publique pour tester la connexion email
router.get('/test-connection', async (req, res) => {
  const EmailService = require('../services/emailService');
  const isConnected = await EmailService.testEmailConnection();
  res.json({ connected: isConnected });
});

module.exports = router;
