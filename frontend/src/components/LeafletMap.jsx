import React, { useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const center = [48.8566, 2.3522]; // Paris par défaut

// Composant pour gérer les clics sur la carte
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    },
  });
  return null;
}

export default function LeafletMap({ onLocationSelect, initialLocation = null }) {
  const [markerPosition, setMarkerPosition] = useState(initialLocation || center);
  const [mapKey, setMapKey] = useState(0);
  const mapRef = useRef(null);

  const handleLocationSelect = useCallback((location) => {
    setMarkerPosition(location);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  }, [onLocationSelect]);

  // Forcer la recréation de la carte si la position initiale change
  React.useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [initialLocation]);

  const customIcon = new L.Icon({
    iconUrl: `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"%3E%3Cpath fill="%236366f1" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/%3E%3C/svg%3E`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowUrl: null
  });

  return (
    <div>
      <MapContainer
        key={mapKey}
        center={markerPosition}
        zoom={15}
        style={{
          width: '100%',
          height: '300px',
          borderRadius: '12px',
          border: '1px solid #404040'
        }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onLocationSelect={handleLocationSelect} />
        
        <Marker
          position={markerPosition}
          icon={customIcon}
        >
        </Marker>
      </MapContainer>
    </div>
  );
}
