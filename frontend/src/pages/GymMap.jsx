import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import api from "../services/api";

// Importer Google Maps
const { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } = require("@react-google-maps/api");

export default function GymMap() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [gyms, setGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    distance: 10,
    maxPrice: 100
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [directions, setDirections] = useState(null);

  // Charger Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyB41DrUjB8OPq9hVdL5Dd5O6S8t7Wy9HvX0Y"
  });

  // Calculer la distance entre deux points
  const calculateDistance = useCallback((point1, point2) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Obtenir la position de l'utilisateur
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          // Position par défaut (Paris)
          setUserLocation({ lat: 48.856, lng: 2.352 });
        }
      );
    } else {
      // Position par défaut si la géolocalisation n'est pas supportée
      setUserLocation({ lat: 48.856, lng: 2.352 });
    }
  }, []);

  // Charger les salles depuis l'API
  const loadGyms = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await api.get('/gyms');
      console.log('API Response:', response.data);
      setGyms(response.data || []);
      setLoading(false);
      
    } catch (error) {
      console.error("Erreur API:", error);
      setLoading(false);
    }
  }, []);

  // Filtrer les salles selon les critères
  const filteredGyms = useMemo(() => {
    return gyms.filter(gym => {
      // Filtre par type
      if (filters.type !== 'all' && gym.type !== filters.type) {
        return false;
      }
      
      // Filtre par prix
      if (gym.price > filters.maxPrice) {
        return false;
      }
      
      // Filtre par recherche
      if (searchTerm && !gym.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filtre par distance
      if (userLocation && gym.coordinates) {
        const distance = calculateDistance(userLocation, gym.coordinates);
        if (distance > filters.distance) {
          return false;
        }
      }
      
      return true;
    });
  }, [gyms, filters, userLocation, searchTerm, calculateDistance]);

  // Obtenir les directions vers une salle
  const getDirections = useCallback((gym) => {
    if (!userLocation || !gym.coordinates) return;

    const directionsService = new window.google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: userLocation,
        destination: gym.coordinates,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error('Erreur directions:', status);
        }
      }
    );
  }, [userLocation]);

  // Charger les données au montage
  useEffect(() => {
    if (isLoaded) {
      getUserLocation();
      loadGyms();
    }
  }, [isLoaded, getUserLocation, loadGyms]);

  if (!isLoaded) {
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
          🗺️ {t('loading')}
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
          {t('gymsLoadError')}
        </p>
      </div>
    );
  }

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
          {t('gymsLoadError')}
        </p>
      </div>
    );
  }

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    marginBottom: '20px',
    borderRadius: '10px',
    overflow: 'hidden'
  };

  const mapStyles = [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [
        { saturation: -20 },
        { lightness: 40 },
        { visibility: "simplified" }
      ]
    },
    {
      featureType: "all",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];

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
          {t('dataFromMongoDB')}
        </p>
      </div>

      {/* Filtres */}
      <div style={{
        backgroundColor: '#2d2d2d',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '30px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{ color: '#ffffff', marginBottom: '15px', fontSize: '1.3rem' }}>
          🔍 {t('filters')}
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
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
            <option value="all">{t('allTypes')}</option>
            <option value="fitness">{t('fitness')}</option>
            <option value="crossfit">{t('crossfit')}</option>
            <option value="yoga">{t('yoga')}</option>
            <option value="swimming">{t('swimming')}</option>
          </select>
          
          <select
            value={filters.distance}
            onChange={(e) => setFilters(prev => ({ ...prev, distance: parseInt(e.target.value) }))}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#404040',
              color: '#ffffff',
              border: '1px solid #555555',
              fontSize: '14px'
            }}
          >
            <option value={5}>5 {t('km')}</option>
            <option value={10}>10 {t('km')}</option>
            <option value={20}>20 {t('km')}</option>
            <option value={50}>50 {t('km')}</option>
          </select>
          
          <input
            type="number"
            placeholder={t('maxPrice')}
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) || 100 }))}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#404040',
              color: '#ffffff',
              border: '1px solid #555555',
              fontSize: '14px',
              width: '120px'
            }}
          />
          
          <input
            type="text"
            placeholder={t('searchGym')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#404040',
              color: '#ffffff',
              border: '1px solid #555555',
              fontSize: '14px',
              width: '200px'
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
        {t('gymsFound', { count: filteredGyms.length })}
      </div>

      {/* Carte Google Maps */}
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={userLocation || { lat: 48.856, lng: 2.352 }}
          options={{
            styles: mapStyles,
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true
          }}
        >
          {/* Marqueur pour la position de l'utilisateur */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new window.google.maps.Size(32, 32),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(16, 32)
              }}
              title={t('yourLocation')}
            />
          )}

          {/* Marqueurs pour les salles de sport */}
          {filteredGyms.map((gym) => (
            <Marker
              key={gym.id}
              position={gym.coordinates}
              onClick={() => setSelectedGym(gym)}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new window.google.maps.Size(32, 32),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(16, 32)
              }}
              title={gym.name}
            />
          ))}

          {/* Fenêtre d'informations pour la salle sélectionnée */}
          {selectedGym && (
            <InfoWindow
              position={selectedGym.coordinates}
              onLoad={(infoWindow) => {
                infoWindow.setContent(`
                  <div style="padding: 10px; max-width: 300px;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">${selectedGym.name}</h3>
                    <p style="margin: 5px 0; color: #666;"><strong>📍 ${t('address')}:</strong> ${selectedGym.address || 'N/A'}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>📞 ${t('phone')}:</strong> ${selectedGym.phone || 'N/A'}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>⏰ ${t('hours')}:</strong> ${selectedGym.hours || 'N/A'}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>💰 ${t('price')}:</strong> ${selectedGym.price ? selectedGym.price + '€/mo' : 'N/A'}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>🏋️ ${t('equipment')}:</strong> ${selectedGym.equipment ? selectedGym.equipment.join(', ') : 'N/A'}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>⭐ ${t('rating')}:</strong> ${selectedGym.rating || 'N/A'}</p>
                    <div style="margin-top: 15px; text-align: center;">
                      <button 
                        onClick={() => getDirections(selectedGym)}
                        style="padding: 8px 16px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer;"
                      >
                        ${t('getDirections')}
                      </button>
                    </div>
                  </div>
                `);
              }}
            />
          )}

          {/* Directions */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              panelStyle={{ backgroundColor: '#2d2d2d', padding: '10px' }}
            />
          )}
        </GoogleMap>
      )}

      {/* Liste des salles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {filteredGyms.map((gym) => (
          <div
            key={gym._id}
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
            onClick={() => setSelectedGym(gym)}
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
              🏋️ {gym.equipment.join(', ')}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '10px'
            }}>
              <span style={{ color: '#ffc107', fontSize: '0.8rem' }}>
                ⭐ {gym.rating}
              </span>
              <button
                onClick={() => getDirections(gym)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                {t('getDirections')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Script pour les directions */}
      <script dangerouslySetInnerHTML={{
        __html: `
          window.getGymDirections = function(gymId) {
            const gyms = ${JSON.stringify(gyms)};
            const selectedGym = gyms.find(g => g.id === gymId);
            if (selectedGym && window.userLocation) {
              window.getDirections(selectedGym);
            }
          };
          
          window.getDirections = function(gym) {
            if (!window.userLocation || !gym.coordinates) return;
            
            const directionsService = new google.maps.DirectionsService();
            
            directionsService.route({
              origin: window.userLocation,
              destination: gym.coordinates,
              travelMode: google.maps.TravelMode.DRIVING
            }, (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                window.setDirections(result);
              } else {
                console.error('Erreur directions:', status);
              }
            });
          };
        `
      }} />
    </div>
  );
}
