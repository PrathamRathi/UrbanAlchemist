// ResultPage.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import MapComponent from './MapComponent';

const ResultPage: React.FC = () => {
  const location = useLocation();
  const { location: markerLocation, bounds } = location.state as { location: { lat: number; lng: number }, bounds: { ne: { lat: number, lng: number }, sw: { lat: number, lng: number } } };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Result Page</h1>
      <h2>Selected Location:</h2>
      <p>Latitude: {markerLocation.lat}</p>
      <p>Longitude: {markerLocation.lng}</p>
      <h3>Map Bounds:</h3>
      <p>Northeast Corner: Latitude: {bounds.ne.lat}, Longitude: {bounds.ne.lng}</p>
      <p>Southwest Corner: Latitude: {bounds.sw.lat}, Longitude: {bounds.sw.lng}</p>
      {/* Placeholder for the image to be rendered after the backend call */}
      <div>
        <h2>Optimized Image Placeholder</h2>
        <div style={{ width: '100%', height: '400px', backgroundColor: '#e0e0e0' }}></div>
      </div>
      <MapComponent/>
    </div>
  );
};

export default ResultPage;
