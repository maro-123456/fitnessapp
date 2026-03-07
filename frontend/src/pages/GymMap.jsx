import React, { useState, useEffect } from "react";
import axios from "axios";

export default function GymMap() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGym, setSelectedGym] = useState(null);

  // Charger les salles de sport depuis l'API
  const loadGyms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:5000/api/gyms');
      setGyms(response.data.gyms || []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur API:", error);
      setError("Impossible de charger les salles de sport");
      setLoading(false);
    }
  };

  // Charger les salles au montage du composant
  useEffect(() => {
    loadGyms();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        width: 'calc(100vw - 220px)', 
        height: '100vh', 
        backgroundColor: '#1a1a1a', 
        color: '#ffffff',
        marginLeft: '220px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>
          🏋️ Chargement...
        </h1>
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
      <div style={{ 
        width: 'calc(100vw - 220px)', 
        height: '100vh', 
        backgroundColor: '#1a1a1a', 
        color: '#ffffff',
        marginLeft: '220px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>
          ❌ Erreur
        </h1>
        <p style={{ marginBottom: '20px' }}>{error}</p>
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
      width: 'calc(100vw - 220px)', 
      height: '100vh', 
      backgroundColor: '#1a1a1a', 
      color: '#ffffff',
      marginLeft: '220px',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        🗺️ Carte des Salles de Sport
      </h1>
      
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <p>📍 {gyms.length} salles de sport trouvées</p>
        <p style={{ fontSize: '12px', color: '#a1a1a1' }}>
          Données depuis MongoDB API
        </p>
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
          <p style={{ marginBottom: '20px' }}>
            {gyms.length > 0 ? `${gyms.length} salles trouvées` : 'Aucune salle trouvée'}
          </p>
          
          {/* Marqueurs simulés */}
          <div style={{ position: 'relative', width: '300px', height: '200px' }}>
            {gyms.slice(0, 6).map((gym, index) => (
              <div
                key={gym._id || index}
                style={{
                  position: 'absolute',
                  left: `${20 + (index * 40)}px`,
                  top: `${30 + (index * 25)}px`,
                  fontSize: '24px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onClick={() => setSelectedGym(gym)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.2)';
                  e.target.style.zIndex = '10';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.zIndex = '1';
                }}
              >
                🏋️
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Liste des Salles */}
      <div style={{ backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '10px' }}>
        <h3 style={{ marginBottom: '20px' }}>📍 Liste des Salles ({gyms.length})</h3>
        
        {gyms.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#a1a1a1' }}>
            <p>Aucune salle de sport trouvée</p>
            <button 
              onClick={loadGyms}
              style={{ 
                background: '#6366f1', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '15px'
              }}
            >
              🔄 Recharger
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {gyms.map((gym, index) => (
              <div
                key={gym._id || index}
                style={{
                  backgroundColor: '#404040',
                  padding: '20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: selectedGym?._id === gym._id ? '2px solid #6366f1' : '1px solid #555',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setSelectedGym(gym)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h4 style={{ margin: 0, color: '#ffffff' }}>{gym.name}</h4>
                  <div style={{ color: '#fbbf24', fontSize: '14px' }}>
                    ⭐ {gym.rating?.average?.toFixed(1) || 'N/A'} ({gym.rating?.count || 0})
                  </div>
                </div>
                
                <div style={{ marginTop: '10px', color: '#a1a1a1' }}>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>📍 {gym.address}</p>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>{gym.city}</p>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>📞 {gym.phone}</p>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>💰 {gym.priceRange}</p>
                </div>
                
                {gym.facilities && gym.facilities.length > 0 && (
                  <div style={{ marginTop: '15px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {gym.facilities.slice(0, 4).map((facility) => (
                        <span
                          key={facility}
                          style={{
                            backgroundColor: '#6366f1',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}
                        >
                          {facility}
                        </span>
                      ))}
                      {gym.facilities.length > 4 && (
                        <span style={{
                          backgroundColor: '#555',
                          color: '#ffffff',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          +{gym.facilities.length - 4} plus
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                  <button
                    style={{
                      flex: 1,
                      background: '#6366f1',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    📞 Contacter
                  </button>
                  <button
                    style={{
                      flex: 1,
                      background: '#10b981',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    🗺️ Itinéraire
                  </button>
                </div>
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
              border: '1px solid #404040',
              marginLeft: '220px'
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
              <p style={{ margin: '10px 0' }}>📍 {selectedGym.address}</p>
              <p style={{ margin: '10px 0' }}>{selectedGym.city}</p>
              <p style={{ margin: '10px 0' }}>📞 {selectedGym.phone}</p>
              {selectedGym.email && <p style={{ margin: '10px 0' }}>📧 {selectedGym.email}</p>}
              {selectedGym.website && (
                <p style={{ margin: '10px 0' }}>
                  🌐{' '}
                  <a 
                    href={selectedGym.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: '#6366f1', textDecoration: 'underline' }}
                  >
                    {selectedGym.website}
                  </a>
                </p>
              )}
              <p style={{ margin: '10px 0' }}>💰 {selectedGym.priceRange}</p>
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedGym.facilities.map((facility) => (
                    <span
                      key={facility}
                      style={{
                        backgroundColor: '#6366f1',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
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
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                📞 Contacter
              </button>
              <button
                style={{
                  flex: 1,
                  background: '#10b981',
                  color: 'white',
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🗺️ Itinéraire
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
