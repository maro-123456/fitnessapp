import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
  border: '1px solid #404040'
};

const center = {
  lat: 46.6034, // Centre de la France
  lng: 1.8883
};

const mapOptions = {
  styles: [
    {
      "featureType": "all",
      "elementType": "geometry",
      "stylers": [{"color": "#2d2d2d"}]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#a1a1a1"}]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [{"color": "#1a1a1a"}]
    }
  ],
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: true
};

export default function GymMapComponent({ userLocation = null }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg"
  });

  const [map, setMap] = useState(null);
  const [gyms, setGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger les salles de sport
  const fetchGyms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/gyms');
      setGyms(res.data);
    } catch (error) {
      console.error('Erreur chargement salles:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGyms();
  }, [fetchGyms]);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
    if (gyms.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      gyms.forEach(gym => {
        bounds.extend({ lat: gym.coordinates.lat, lng: gym.coordinates.lng });
      });
      map.fitBounds(bounds);
    }
  }, [gyms]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const getGymIcon = (priceRange) => {
    const colors = {
      '$': '#10b981',      // Vert - économique
      '$$': '#6366f1',    // Bleu - moyen
      '$$$': '#f59e0b',   // Orange - cher
      '$$$$': '#ef4444'   // Rouge - très cher
    };
    
    return {
      url: `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"%3E%3Cpath fill="${colors[priceRange]}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/%3E%3C/svg%3E`,
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 32)
    };
  };

  const getUserIcon = () => ({
    url: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="%238b5cf6" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/%3E%3C/svg%3E',
    scaledSize: new window.google.maps.Size(24, 24),
    anchor: new window.google.maps.Point(12, 12)
  });

  if (!isLoaded || loading) {
    return (
      <div style={{
        width: '100%',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#2d2d2d',
        borderRadius: '12px',
        border: '1px solid #404040'
      }}>
        <div style={{ color: '#a1a1a1' }}>
          {loading ? 'Chargement des salles...' : 'Chargement de la carte...'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation || center}
        zoom={userLocation ? 15 : 6}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* Salles de sport */}
        {gyms.map((gym) => (
          <Marker
            key={gym._id}
            position={{ lat: gym.coordinates.lat, lng: gym.coordinates.lng }}
            icon={getGymIcon(gym.priceRange)}
            onClick={() => setSelectedGym(gym)}
          />
        ))}

        {/* Position utilisateur */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={getUserIcon()}
            title="Votre position"
          />
        )}

        {/* InfoWindow pour la salle sélectionnée */}
        {selectedGym && (
          <InfoWindow
            position={{ lat: selectedGym.coordinates.lat, lng: selectedGym.coordinates.lng }}
            onCloseClick={() => setSelectedGym(null)}
          >
            <div style={{ padding: '10px', minWidth: '200px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{selectedGym.name}</h4>
              <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                📍 {selectedGym.address}, {selectedGym.city}
              </p>
              <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                ⭐ {selectedGym.rating?.average || 'N/A'} ({selectedGym.rating?.count || 0} avis)
              </p>
              <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                💰 {selectedGym.priceRange}
              </p>
              <div style={{ margin: '8px 0' }}>
                {selectedGym.facilities?.map((facility, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-block',
                      padding: '2px 6px',
                      margin: '2px',
                      background: '#f3f4f6',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#374151'
                    }}
                  >
                    {facility}
                  </span>
                ))}
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>
                {selectedGym.description}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Légende */}
      <div style={{
        marginTop: '12px',
        padding: '12px',
        background: '#2d2d2d',
        borderRadius: '8px',
        border: '1px solid #404040',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        fontSize: '12px',
        color: '#a1a1a1'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '50%' }}></div>
          <span>$ Économique</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', background: '#6366f1', borderRadius: '50%' }}></div>
          <span>$$ Moyen</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '50%' }}></div>
          <span>$$$ Cher</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%' }}></div>
          <span>$$$$ Très cher</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', background: '#8b5cf6', borderRadius: '50%' }}></div>
          <span>👤 Votre position</span>
        </div>
      </div>
    </div>
  );
}
