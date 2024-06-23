import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';

declare global {
  interface Window {
    initMap: () => void;
  }
}

const HeatmapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [heatmapImage, setHeatmapImage] = useState<string | null>(null);

  useEffect(() => {
    window.initMap = initMap;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAYPCPC3qF1lro_PG7SDUIfHksMt-8Ro5w&libraries=visualization&callback=initMap`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initMap = async () => {
    if (mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        zoom: 13,
        center: { lat: 37.775, lng: -122.434 },
        mapTypeId: 'satellite',
      });

      const points = await getPoints();
      const heatmap = new google.maps.visualization.HeatmapLayer({
        data: points,
        map: map,
      });

      saveMapAsPNG(mapRef.current);
    }
  };

  const getPoints = async () => {
    const response = await fetch('/data/coordinates.txt');
    const fileContent = await response.text();
    const lines = fileContent.split('\n');

    return lines.map(line => {
      const [lat, lng] = line.split(',').map(Number);
      return new google.maps.LatLng(lat, lng);
    });
  };

  const saveMapAsPNG = (mapElement: HTMLDivElement) => {
    html2canvas(mapElement).then(canvas => {
      setHeatmapImage(canvas.toDataURL('image/png'));
    });
  };

  return (
    <div>
      <div ref={mapRef} id="map" style={{ height: '600px', width: '100%' }}></div>
      {heatmapImage && <img src={heatmapImage} alt="Heatmap" />}
    </div>
  );
};

export default HeatmapComponent;
