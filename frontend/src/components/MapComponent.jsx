import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useCallback, useState } from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '12px',
  border: '1px solid #404040'
};

const center = {
  lat: 48.8566, // Paris par défaut
  lng: 2.3522
};

export default function MapComponent({ onLocationSelect, initialLocation = null }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg"
  });

  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(initialLocation || center);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newPosition = { lat, lng };
    setMarkerPosition(newPosition);
    if (onLocationSelect) {
      onLocationSelect(newPosition);
    }
  }, [onLocationSelect]);

  if (!isLoaded) {
    return (
      <div style={{
        width: '100%',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#2d2d2d',
        borderRadius: '12px',
        border: '1px solid #404040'
      }}>
        <div style={{ color: '#a1a1a1' }}>Chargement de la carte...</div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={markerPosition}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={onMapClick}
      options={{
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
      }}
    >
      <Marker 
        position={markerPosition}
        icon={{
          url: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="%236366f1" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/%3E%3C/svg%3E',
          scaledSize: new window.google.maps.Size(32, 32)
        }}
      />
    </GoogleMap>
  );
}
