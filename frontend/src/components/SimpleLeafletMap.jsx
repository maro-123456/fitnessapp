import React, { useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function SimpleLeafletMap({ onLocationSelect, initialLocation = null }) {
  const [mapId] = useState(() => `simple-map-${Date.now()}-${Math.random()}`);
  const mapContainerRef = React.useRef(null);
  const mapRef = React.useRef(null);

  const center = initialLocation || [48.8566, 2.3522]; // Paris par défaut

  React.useEffect(() => {
    if (!mapContainerRef.current) return;

    // Nettoyer la carte existante
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Créer une nouvelle carte
    const map = L.map(mapContainerRef.current).setView(center, 15);

    // Ajouter la couche de tuiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Créer un marqueur personnalisé
    const customIcon = L.divIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#6366f1" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      className: 'custom-marker'
    });

    // Ajouter un marqueur initial
    const marker = L.marker(center, { icon: customIcon }).addTo(map);
    
    // Gérer les clics sur la carte
    map.on('click', function(e) {
      const { lat, lng } = e.latlng;
      
      // Mettre à jour la position du marqueur
      marker.setLatLng([lat, lng]);
      
      // Appeler le callback
      if (onLocationSelect) {
        onLocationSelect({ lat, lng });
      }
    });

    mapRef.current = map;

    // Nettoyer lors du démontage
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, onLocationSelect]);

  return (
    <div>
      <div 
        id={mapId}
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '300px',
          borderRadius: '12px',
          border: '1px solid #404040',
          background: '#2d2d2d'
        }}
      />
    </div>
  );
}
