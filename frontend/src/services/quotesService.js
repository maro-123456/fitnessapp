import api from './api';

class QuotesService {
  // Obtenir une citation de motivation aléatoire
  static async getMotivationQuote() {
    try {
      const response = await api.get('/quotes/motivation');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la citation:', error);
      throw error;
    }
  }

  // Obtenir plusieurs citations de motivation
  static async getMultipleMotivationQuotes(count = 3) {
    try {
      const response = await api.get(`/quotes/motivation/multiple?count=${count}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des citations multiples:', error);
      throw error;
    }
  }

  // Obtenir la citation du jour (avec cache)
  static async getDailyQuote() {
    try {
      const response = await api.get('/quotes/motivation/daily');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la citation du jour:', error);
      throw error;
    }
  }

  // Formater une citation pour l'affichage
  static formatQuote(quote) {
    if (!quote) return null;
    
    return {
      text: quote.q || quote.text || quote.quote,
      author: quote.a || quote.author || 'Inconnu',
      source: quote.source || 'ZenQuotes'
    };
  }

  // Obtenir une citation de motivation fitness (fallback local)
  static getFitnessMotivationQuote() {
    const fitnessQuotes = [
      { text: "Le corps atteint ce que l'esprit croit.", author: "Napoleon Hill" },
      { text: "La seule façon de faire du grand travail est d'aimer ce que vous faites.", author: "Steve Jobs" },
      { text: "Le succès est la somme de petits efforts répétés jour après jour.", author: "Robert Collier" },
      { text: "Ne comptez pas les jours, rendez chaque jour compte.", author: "Muhammad Ali" },
      { text: "La douleur que tu ressens aujourd'hui sera la force que tu ressentiras demain.", author: "Inconnu" },
      { text: "Chaque répétition te rapproche de ton objectif.", author: "Inconnu" },
      { text: "La discipline est le pont entre les objectifs et les accomplissements.", author: "Jim Rohn" },
      { text: "Le seul échec est de ne pas essayer.", author: "Inconnu" },
      { text: "Ton corps peut supporter à peu près tout. C'est ton esprit que tu dois convaincre.", author: "Inconnu" },
      { text: "La différence entre l'impossible et le possible s'appelle la détermination.", author: "Inconnu" }
    ];

    return fitnessQuotes[Math.floor(Math.random() * fitnessQuotes.length)];
  }
}

export default QuotesService;
