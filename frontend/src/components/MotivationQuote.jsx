import React, { useState, useEffect } from 'react';
import QuotesService from '../services/quotesService';

const MotivationQuote = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Utiliser directement les citations locales pour le moment
      console.log('Chargement d\'une citation locale...');
      const localQuote = QuotesService.getFitnessMotivationQuote();
      console.log('Citation chargée:', localQuote);
      setQuote({
        q: localQuote.text,
        a: localQuote.author
      });
      
      // Essayer l'API en arrière-plan (optionnel)
      try {
        const motivationData = await QuotesService.getMotivationQuote();
        console.log('Données API reçues:', motivationData);
        if (motivationData && motivationData.q) {
          setQuote(motivationData);
        }
      } catch (apiError) {
        console.log('API non disponible, citation locale utilisée');
      }
    } catch (err) {
      console.error('Erreur complète:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  if (loading) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        background: '#2d2d2d',
        borderRadius: '12px',
        border: '1px solid #404040',
        margin: '20px 0'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #6366f1',
          borderTop: '4px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#a1a1a1', marginTop: '10px' }}>
          Chargement de la citation...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        background: '#2d2d2d',
        borderRadius: '12px',
        border: '1px solid #ef4444',
        margin: '20px 0'
      }}>
        <p style={{ color: '#ef4444' }}>
          ❌ Erreur: {error}
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #404040',
      margin: '20px 0',
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Debug info */}
      <div style={{ 
        background: '#333', 
        color: '#fff', 
        padding: '10px', 
        borderRadius: '5px', 
        marginBottom: '10px',
        fontSize: '12px',
        textAlign: 'left'
      }}>
        Debug: loading={loading.toString()}, error={error}, quote={quote ? 'exists' : 'null'}
      </div>
      
      <div style={{
        background: '#2d2d2d',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #404040',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{
          color: '#ffffff',
          marginBottom: '15px',
          fontSize: '1.5rem',
          fontWeight: '700'
        }}>
          💪 Citation du Jour
        </h2>
        
        {quote && (
          <div style={{
            marginBottom: '20px',
            padding: '20px',
            background: 'rgba(99, 102, 241, 0.1)',
            borderRadius: '8px',
            border: '1px solid #404040'
          }}>
            <p style={{
              color: '#ffffff',
              fontSize: '1.2rem',
              fontStyle: 'italic',
              marginBottom: '10px',
              lineHeight: '1.5'
            }}>
              "{quote.q}"
            </p>
            
            <p style={{
              color: '#a1a1a1',
              fontSize: '1rem',
              textAlign: 'right'
            }}>
              — {quote.a}
            </p>
          </div>
        )}
        
        <button
          onClick={fetchQuote}
          style={{
            background: '#6366f1',
            color: '#ffffff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#8b5cf6';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#6366f1';
          }}
        >
          🔄 Nouvelle citation
        </button>
      </div>
    </div>
  );
};

export default MotivationQuote;
