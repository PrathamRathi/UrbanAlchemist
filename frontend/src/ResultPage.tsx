// ResultPage.tsx
import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import MapComponent from './MapComponent';
import html2canvas from "html2canvas";

const ResultPage: React.FC = () => {
  const location = useLocation();
  const { location: markerLocation, bounds } = location.state as { location: { lat: number; lng: number }, bounds: { ne: { lat: number, lng: number }, sw: { lat: number, lng: number } } };
  const pageRef = useRef<HTMLDivElement>(null);

  const handleSaveAsPNG = () => {
    if (pageRef.current) {
      html2canvas(pageRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'page.png';
        link.click();
    });
  }
  };
  return (
    <div>
      <div ref={pageRef} style={{ textAlign: 'center', padding: '20px' }}>
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
          <img src="/heatmap.jpeg" alt="Traffic Heatmap" />
        </div>
        {/* <MapComponent/>
        <button onClick={handleSaveAsPNG}>Save as PNG, love</button> */}
      </div>
    </div>
  );
};

export default ResultPage;
