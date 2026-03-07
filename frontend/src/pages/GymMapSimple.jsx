import { useEffect, useState } from "react";
import api from "../services/api";

export default function GymMap() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGym, setSelectedGym] = useState(null);

  // Charger les salles de sport
  useEffect(() => {
    loadGyms();
  }, []);

  const loadGyms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/gyms');
      console.log('Données reçues:', response.data);
      setGyms(response.data.gyms || []);
    } catch (error) {
      console.error("Erreur chargement salles:", error);
      setError("Impossible de charger les salles de sport");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>🏋️ Chargement des salles de sport...</h2>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #404040',
          borderTop: '4px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '20px auto'
        }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>❌ Erreur</h2>
        <p>{error}</p>
        <button 
          onClick={loadGyms}
          style={{ 
            background: '#6366f1', 
            color: 'white', 
            padding: '10px 20px', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1a1a1a', 
      minHeight: '100vh',
      color: '#ffffff'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        🗺️ Carte des Salles de Sport
      </h1>
      
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <p>📍 {gyms.length} salles de sport trouvées</p>
      </div>

      {/* Section Carte */}
      <div style={{ 
        backgroundColor: '#2d2d2d', 
        padding: '20px', 
        borderRadius: '10px', 
        marginBottom: '20px',
        minHeight: '400px'
      }}>
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
          🗺️ Carte Interactive
        </h3>
        <div style={{ 
          backgroundColor: '#404040', 
          padding: '20px', 
          borderRadius: '8px',
          textAlign: 'center',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <p style={{ marginBottom: '20px' }}>Intégration Google Maps prévue</p>
          
          {/* Marqueurs simulés */}
          <div style={{ position: 'relative', width: '200px', height: '150px' }}>
            {gyms.slice(0, 5).map((gym, index) => (
              <div
                key={gym._id}
                style={{
                  position: 'absolute',
                  left: `${20 + (index * 30)}px`,
                  top: `${30 + (index * 20)}px`,
                  fontSize: '20px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onClick={() => setSelectedGym(gym)}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                🏋️
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Liste des Salles */}
      <div style={{ backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '10px' }}>
        <h3 style={{ marginBottom: '20px' }}>📍 Liste des Salles</h3>
        
        {gyms.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#a1a1a1' }}>
            Aucune salle de sport trouvée
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {gyms.map((gym) => (
              <div
                key={gym._id}
                style={{
                  backgroundColor: '#404040',
                  padding: '15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: selectedGym?._id === gym._id ? '2px solid #6366f1' : '1px solid #555',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setSelectedGym(gym)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#4a4a4a'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#404040'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, color: '#ffffff' }}>{gym.name}</h4>
                  <div style={{ color: '#fbbf24' }}>
                    ⭐ {gym.rating?.average?.toFixed(1) || 'N/A'} ({gym.rating?.count || 0})
                  </div>
                </div>
                
                <div style={{ marginTop: '10px', color: '#a1a1a1' }}>
                  <p style={{ margin: '5px 0' }}>📍 {gym.address}, {gym.city}</p>
                  <p style={{ margin: '5px 0' }}>💰 {gym.priceRange || '$$'}</p>
                  <p style={{ margin: '5px 0' }}>📞 {gym.phone}</p>
                </div>
                
                {gym.facilities && gym.facilities.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ margin: '5px 0', fontSize: '12px', color: '#ffffff' }}>
                      🏋️ {gym.facilities.slice(0, 3).join(', ')}
                      {gym.facilities.length > 3 && ` +${gym.facilities.length - 3} plus`}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal pour les détails */}
      {selectedGym && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setSelectedGym(null)}
        >
          <div
            style={{
              backgroundColor: '#2d2d2d',
              padding: '30px',
              borderRadius: '15px',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflowY: 'auto',
              border: '1px solid #404040'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#ffffff' }}>{selectedGym.name}</h2>
              <button
                onClick={() => setSelectedGym(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a1a1a1',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ color: '#a1a1a1' }}>
              <p style={{ margin: '10px 0' }}>📍 {selectedGym.address}, {selectedGym.city}</p>
              <p style={{ margin: '10px 0' }}>📞 {selectedGym.phone}</p>
              {selectedGym.email && <p style={{ margin: '10px 0' }}>📧 {selectedGym.email}</p>}
              {selectedGym.website && (
                <p style={{ margin: '10px 0' }}>
                  🌐{' '}
                  <a href={selectedGym.website} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>
                    {selectedGym.website}
                  </a>
                </p>
              )}
              <p style={{ margin: '10px 0' }}>💰 {selectedGym.priceRange || '$$'}</p>
              <p style={{ margin: '10px 0' }}>
                ⭐ {selectedGym.rating?.average?.toFixed(1) || 'N/A'}/5 ({selectedGym.rating?.count || 0} avis)
              </p>
            </div>
            
            {selectedGym.description && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>Description</h3>
                <p style={{ color: '#a1a1a1', margin: 0 }}>{selectedGym.description}</p>
              </div>
            )}
            
            {selectedGym.facilities && selectedGym.facilities.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>Équipements</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {selectedGym.facilities.map((facility) => (
                    <span
                      key={facility}
                      style={{
                        backgroundColor: '#6366f1',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '15px',
                        fontSize: '12px'
                      }}
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                style={{
                  flex: 1,
                  background: '#6366f1',
                  color: 'white',
                  padding: '10px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                📞 Contacter
              </button>
              <button
                style={{
                  flex: 1,
                  background: '#10b981',
                  color: 'white',
                  padding: '10px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                🗺️ Itinéraire
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
