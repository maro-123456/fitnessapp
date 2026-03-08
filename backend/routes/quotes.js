const express = require('express');
const router = express.Router();

// ZenQuotes API - Citations de motivation
router.get('/motivation', async (req, res) => {
  try {
    // Options pour la requête à ZenQuotes API
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Appel à ZenQuotes API
    const response = await fetch('https://zenquotes.io/api/quotes', options);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des citations');
    }

    const data = await response.json();
    
    // Filtrer les citations de motivation/fitness si possible
    let motivationQuotes = data;
    
    // Si nous avons plusieurs citations, prendre la première
    if (Array.isArray(data) && data.length > 0) {
      motivationQuotes = data[0];
    }

    // Logging pour voir quand les citations changent
    console.log(`[${new Date().toISOString()}] API ZenQuotes appelée - Citations reçues: ${data.length}`);
    console.log(`[${new Date().toISOString()}] Citation sélectionnée: ${motivationQuotes.q || 'N/A'} - Auteur: ${motivationQuotes.a || 'N/A'}`);

    res.json({
      success: true,
      quote: motivationQuotes,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur API ZenQuotes:', error);
    
    // Citation de fallback en cas d'erreur
    res.json({
      success: false,
      quote: {
        q: "Le succès est la somme de petits efforts répétés jour après jour.",
        a: "Robert Collier"
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Obtenir plusieurs citations de motivation
router.get('/motivation/multiple', async (req, res) => {
  try {
    const { count = 3 } = req.query;
    
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await fetch('https://zenquotes.io/api/quotes', options);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des citations');
    }

    const data = await response.json();
    
    // Prendre le nombre demandé de citations
    const quotes = Array.isArray(data) ? data.slice(0, parseInt(count)) : [data];

    res.json({
      success: true,
      quotes: quotes,
      count: quotes.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur API ZenQuotes multiples:', error);
    
    // Citations de fallback
    res.json({
      success: false,
      quotes: [
        { q: "Le succès est la somme de petits efforts répétés jour après jour.", a: "Robert Collier" },
        { q: "La seule façon de faire du grand travail est d'aimer ce que vous faites.", a: "Steve Jobs" },
        { q: "Le corps atteint ce que l'esprit croit.", a: "Napoleon Hill" }
      ],
      count: 3,
      timestamp: new Date().toISOString()
    });
  }
});

// Citation du jour (cache pour éviter trop d'appels API)
let dailyQuote = null;
let dailyQuoteDate = null;

router.get('/motivation/daily', async (req, res) => {
  try {
    const today = new Date().toDateString();
    
    // Si nous avons déjà une citation pour aujourd'hui, la retourner
    if (dailyQuote && dailyQuoteDate === today) {
      return res.json({
        success: true,
        quote: dailyQuote,
        isCached: true,
        timestamp: new Date().toISOString()
      });
    }

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await fetch('https://zenquotes.io/api/quotes', options);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des citations');
    }

    const data = await response.json();
    const quote = Array.isArray(data) ? data[0] : data;
    
    // Mettre en cache pour aujourd'hui
    dailyQuote = quote;
    dailyQuoteDate = today;

    res.json({
      success: true,
      quote: quote,
      isCached: false,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur API citation du jour:', error);
    
    res.json({
      success: false,
      quote: {
        q: "Chaque jour est une nouvelle opportunité d'améliorer.",
        a: "Inconnu"
      },
      isCached: false,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
