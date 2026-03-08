import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import SimpleGymMap from "../components/SimpleGymMap";

export default function GymMap() {
  console.log('GymMap component starting...');
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [gyms, setGyms] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    distance: 10,
    maxPrice: 100
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Données de base MongoDB (simulées localement)
  const mongoDBGyms = [
    {
      id: 1,
      name: "FitClub Paris Centre",
      address: "75002 Paris, France",
      phone: "01 42 34 56 78",
      hours: "6h00 - 23h00",
      price: 49,
      type: "fitness",
      equipment: ["Tapis roulant", "Vélo elliptique", "Haltérophilie", "Musculation"],
      rating: 4.5,
      coordinates: { lat: 48.8566, lng: 2.352 }
    },
    {
      id: 2,
      name: "CrossFit Bastille",
      address: "75011 Paris, France",
      phone: "01 42 34 12 34",
      hours: "6h00 - 22h00",
      price: 79,
      type: "crossfit",
      equipment: ["Kettlebells", "Barres", "Corde à sauter", "Poids libres"],
      rating: 4.8,
      coordinates: { lat: 48.853, lng: 2.349 }
    },
    {
      id: 3,
      name: "Yoga Zen Marais",
      address: "75004 Paris, France",
      phone: "01 42 34 98 76",
      hours: "7h00 - 21h00",
      price: 35,
      type: "yoga",
      equipment: ["Tapis de yoga", "Coussins", "Blocs", "Sangles"],
      rating: 4.9,
      coordinates: { lat: 48.846, lng: 2.33 }
    },
    {
      id: 4,
      name: "Piscine Municipale",
      address: "75013 Paris, France",
      phone: "01 42 34 23 45",
      hours: "7h00 - 21h00",
      price: 25,
      type: "swimming",
      equipment: ["Piscine 25m", "Piscine 50m", "Toboggan", "Solarium"],
      rating: 4.2,
      coordinates: { lat: 48.8606, lng: 2.277 }
    }
  ];

  // Charger les données depuis MongoDB (simulation)
  const loadGyms = useCallback(() => {
    console.log('Loading gyms from MongoDB...');
    setLoading(true);
    
    // Simuler un appel à MongoDB
    setTimeout(() => {
      console.log('MongoDB gyms loaded:', mongoDBGyms);
      setGyms(mongoDBGyms);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrer les salles selon les critères
  const filteredGyms = useMemo(() => {
    if (!Array.isArray(gyms)) {
      console.log('gyms is not an array:', gyms);
      return [];
    }
    
    return gyms.filter(gym => {
      if (filters.type !== 'all' && gym.type !== filters.type) {
        return false;
      }
      if (gym.price > filters.maxPrice) {
        return false;
      }
      if (searchTerm && !gym.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [gyms, filters, searchTerm]);

  // Charger les données au montage
  useEffect(() => {
    console.log('useEffect triggered');
    loadGyms();
  }, [loadGyms]);

  console.log('About to render, loading:', loading, 'gyms count:', gyms.length);

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
          🏋️ {t('loading')}
        </h1>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #404040',
          borderTop: '4px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p style={{ color: '#a1a1a1', fontSize: '1rem' }}>
          Chargement depuis MongoDB...
        </p>
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
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🗺️ {t('gymMap')}
        </h1>
        <p style={{ color: '#a1a1a1', fontSize: '1.1rem' }}>
          Données depuis MongoDB
        </p>
      </div>

      {/* Filtres */}
      <div style={{
        backgroundColor: '#2d2d2d',
      }}>
        <h2 style={{
          color: '#ffffff',
          marginBottom: '15px',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          🗺️ Carte des salles de sport
        </h2>
        <SimpleGymMap />
      </div>

      {/* Filtres et recherche */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#404040',
              color: '#ffffff',
              border: '1px solid #555555',
              fontSize: '14px'
            }}
          >
            <option value="all">🏋️ Tous types</option>
            <option value="fitness">💪 Fitness</option>
            <option value="crossfit">🔥 CrossFit</option>
            <option value="yoga">🧘 Yoga</option>
          </select>

          <input
            type="number"
            placeholder="Distance max (km)"
            value={filters.distance}
            onChange={(e) => setFilters(prev => ({ ...prev, distance: parseInt(e.target.value) || 10 }))}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#404040',
              color: '#ffffff',
              border: '1px solid #555555',
              fontSize: '14px',
              width: '150px'
            }}
          />

          <input
            type="number"
            placeholder="Prix max (€)"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) || 100 }))}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#404040',
              color: '#ffffff',
              border: '1px solid #555555',
              fontSize: '14px',
              width: '150px'
            }}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="🔍 Rechercher une salle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#404040',
              color: '#ffffff',
              border: '1px solid #555555',
              fontSize: '14px',
              width: '100%',
              maxWidth: '400px'
            }}
          />
        </div>
      </div>

      {/* Statistiques */}
      <div style={{
        textAlign: 'center',
        color: '#a1a1a1',
        fontSize: '14px',
        marginBottom: '20px'
      }}>
        {filteredGyms.length} salles trouvées
      </div>

      {/* Liste des salles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {filteredGyms.map((gym) => (
          <div
            key={gym.id}
            style={{
              backgroundColor: '#2d2d2d',
              borderRadius: '10px',
              padding: '15px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
              border: '1px solid #404040',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <h3 style={{ 
              color: '#ffffff', 
              margin: '0 0 10px 0',
              fontSize: '1.2rem'
            }}>
              {gym.name}
            </h3>
            <div style={{ 
              color: '#a1a1a1', 
              fontSize: '0.9rem',
              marginBottom: '5px'
            }}>
              📍 {gym.address}
            </div>
            <div style={{ 
              color: '#a1a1a1', 
              fontSize: '0.9rem',
              marginBottom: '5px'
            }}>
              📞 {gym.phone}
            </div>
            <div style={{ 
              color: '#a1a1a1', 
              fontSize: '0.9rem',
              marginBottom: '5px'
            }}>
              ⏰ {gym.hours}
            </div>
            <div style={{ 
              color: '#a1a1a1', 
              fontSize: '0.9rem',
              marginBottom: '5px'
            }}>
              💰 {gym.price}€/mo
            </div>
            <div style={{ 
              color: '#a1a1a1', 
              fontSize: '0.9rem',
              marginBottom: '5px'
            }}>
              🏋️ {gym.equipment ? gym.equipment.join(', ') : 'N/A'}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '10px'
            }}>
              <span style={{ color: '#ffc107', fontSize: '0.8rem' }}>
                ⭐ {gym.rating || 'N/A'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
