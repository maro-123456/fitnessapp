import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const center = [46.6034, 1.8883]; // Centre de la France

// Composant pour ajuster la vue de la carte
function MapView({ gyms, userLocation }) {
  const map = useMap();
  
  useEffect(() => {
    if (gyms.length > 0) {
      const bounds = [];
      gyms.forEach(gym => {
        bounds.push([gym.coordinates.lat, gym.coordinates.lng]);
      });
      
      if (userLocation) {
        bounds.push([userLocation.lat, userLocation.lng]);
      }
      
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [gyms, userLocation, map]);
  
  return null;
}

export default function LeafletGymMap({ userLocation = null }) {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGym, setSelectedGym] = useState(null);
  const [mapId] = useState(() => `map-${Date.now()}-${Math.random()}`);
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  // Nettoyer le conteneur avant de créer une nouvelle carte
  useEffect(() => {
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

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

  // Créer des icônes personnalisées selon le prix
  const createCustomIcon = (priceRange) => {
    const colors = {
      '$': '#10b981',      // Vert - économique
      '$$': '#6366f1',    // Bleu - moyen
      '$$$': '#f59e0b',   // Orange - cher
      '$$$$': '#ef4444'   // Rouge - très cher
    };
    
    const color = colors[priceRange] || '#6366f1';
    
    const customIcon = new L.Icon({
      iconUrl: `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"%3E%3Cpath fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/%3E%3C/svg%3E`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      shadowUrl: null
    });
    return customIcon;
  };

  // Icône pour l'utilisateur
  const userIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="%238b5cf6" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/%3E%3C/svg%3E',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
    shadowUrl: null
  });

  if (loading) {
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
          Chargement des salles...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div 
        ref={containerRef}
        id={mapId}
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '12px',
          border: '1px solid #404040'
        }}
      >
        <MapContainer
          center={userLocation ? [userLocation.lat, userLocation.lng] : center}
          zoom={userLocation ? 15 : 6}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '12px'
          }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapView gyms={gyms} userLocation={userLocation} />

          {/* Salles de sport */}
          {gyms.map((gym) => (
            <Marker
              key={gym._id}
              position={[gym.coordinates.lat, gym.coordinates.lng]}
              icon={createCustomIcon(gym.priceRange)}
              eventHandlers={{
                click: () => setSelectedGym(gym)
              }}
            >
              <Popup>
                <div style={{ padding: '8px', minWidth: '200px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{gym.name}</h4>
                  <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                    📍 {gym.address}, {gym.city}
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                    ⭐ {gym.rating?.average || 'N/A'} ({gym.rating?.count || 0} avis)
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                    💰 {gym.priceRange}
                  </p>
                  <div style={{ margin: '8px 0' }}>
                    {gym.facilities?.map((facility, index) => (
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
                    {gym.description}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Position utilisateur */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            >
              <Popup>
                <div style={{ padding: '8px' }}>
                  <h4 style={{ margin: '0 0 4px 0', color: '#333' }}>Votre position</h4>
                  <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                    {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

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
