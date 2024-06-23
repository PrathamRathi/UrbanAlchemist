// GoogleMapComponent.tsx
import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const center = {
  lat: -3.745,
  lng: -38.523,
};
type responseData = {
  claudeResponse: string;
  highTraffic: string;
  path: string;
}
interface GoogleMapComponentProps {
  onSubmit: (location: { lat: number; lng: number }, bounds: { ne: { lat: number, lng: number }, sw: { lat: number, lng: number } },
    data: responseData
  ) => void;
  zoom: number;
  initialZoom: number;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ onSubmit, zoom, initialZoom }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAYPCPC3qF1lro_PG7SDUIfHksMt-8Ro5w',
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback((map: google.maps.Map) => {
    setMap(null);
  }, []);

  const handleClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarker({ lat, lng });
    }
  };

  const handleSubmit = async () => {
    if (marker && map) {
      const bounds = map.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast(); // Northeast corner
        const sw = bounds.getSouthWest(); // Southwest corner

        try {
          const response = await axios.get('http://localhost:8000/heatmap/', {
            params: {
              "lat": marker.lat,
              "lon": marker.lng,
              "z": 14,
              "neLat": ne.lat(), "neLng": ne.lng(), "swLat": sw.lat(), "swLng": sw.lng()
            }
          }
          );
          onSubmit(marker, { ne: { lat: ne.lat(), lng: ne.lng() }, sw: { lat: sw.lat(), lng: sw.lng() } }, response.data);
        } catch (error) {
          console.error('Error making heatmap', error);
        }
      }
    }
  };

  const handleAutoZoomIn = () => {
    if (marker && map) {
      map.setZoom(14);
      map.panTo(marker);
    }
  };

  const handleAutoZoomOut = () => {
    if (map) {
      setMarker(null);
      map.setZoom(initialZoom);
      map.panTo(center);
    }
  };

  const options = {
    minZoom: 2,
    maxZoom: 17,
    zoomControl: true,
    scrollwheel: true,
    disableDefaultUI: false,
    gestureHandling: 'auto',
  };

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={initialZoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleClick}
        options={options}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
      <div style={{ marginTop: '10px' }}>
        <button style={{ marginRight: '10px', padding: '10px', fontSize: '16px' }} onClick={handleAutoZoomIn}>
          Auto-Zoom-In
        </button>
        <button style={{ marginRight: '10px', padding: '10px', fontSize: '16px' }} onClick={handleAutoZoomOut}>
          Auto-Zoom-Out
        </button>
        <button style={{ padding: '10px', fontSize: '16px', backgroundColor: '#4CAF50', color: 'white' }} onClick={handleSubmit}>
          Submit for Optimization
        </button>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default React.memo(GoogleMapComponent);
