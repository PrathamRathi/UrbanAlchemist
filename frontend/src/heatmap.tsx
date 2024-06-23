import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface LocationPoint {
  lat: number;
  lng: number;
}

interface Link {
  points: LocationPoint[];
}

interface Shape {
  links: Link[];
}

interface CurrentFlow {
  speed: number;
  freeFlow: number;
  jamFactor: number;
  confidence: number;
  speedUncapped: number;
}

interface Result {
  location: { shape: Shape };
  currentFlow: CurrentFlow;
}

interface DataResponse {
  results: Result[];
}

const HeatmapComponent: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [heatmap, setHeatmap] = useState<google.maps.visualization.HeatmapLayer | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const google = window.google;
      const mapInstance = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        zoom: 8,
        center: { lat: 32.81980144224803, lng: -96.72321373493184 },
        mapTypeId: "satellite",
      });
      setMap(mapInstance);

      const points = await getPoints();
      console.log(points);

      const heatmapInstance = new google.maps.visualization.HeatmapLayer({
        data: points,
        map: mapInstance,
      });
      setHeatmap(heatmapInstance);
    };

    initMap();
  }, []);

  const getPoints = async (): Promise<google.maps.LatLng[]> => {
    const response = await fetch('/data/data.txt');
    const data: DataResponse = await response.json();
    
    const points: google.maps.LatLng[] = [];
    const HOUSE_LENGTH = 0.00015;

    for (const result of data.results) {
      for (const link of result.location.shape.links) {
        for (let i = 0; i < link.points.length - 1; i++) {
          const start = link.points[i];
          const end = link.points[i + 1];
          
          const distance = Math.sqrt(
            Math.pow(end.lat - start.lat, 2) + 
            Math.pow(end.lng - start.lng, 2)
          );
          
          const steps = Math.ceil(distance / HOUSE_LENGTH);
          
          for (let step = 0; step <= steps; step++) {
            const fraction = step / steps;
            const lat = start.lat + (end.lat - start.lat) * fraction;
            const lng = start.lng + (end.lng - start.lng) * fraction;
            
            let score = calculateTrafficScore(
              result.currentFlow.speed,
              result.currentFlow.freeFlow,
              result.currentFlow.jamFactor,
              result.currentFlow.confidence,
              result.currentFlow.speedUncapped
            );
            
            score = isNaN(score) ? 0 : score;
            
            const numPoints = Math.ceil(score / 10);
            for (let j = 0; j < numPoints; j++) {
              const offsetLat = (Math.random() - 0.5) * 0.0001;
              const offsetLng = (Math.random() - 0.5) * 0.0001;
              points.push(new google.maps.LatLng(lat + offsetLat, lng + offsetLng));
            }
          }
        }
      }
    }
    return points;
  };

  const calculateTrafficScore = (
    speed: number,
    freeFlow: number,
    jamFactor: number,
    confidence: number,
    speedUncapped: number
  ): number => {
    return Math.min(100, Math.max(0, (
      0.4 * (1 - speedUncapped / freeFlow) +
      0.6 * (jamFactor / 10)
    ) * 100));
  };

  const toggleHeatmap = () => {
    if (heatmap && map) {
      heatmap.setMap(heatmap.getMap() ? null : map);
    }
  };

  const changeGradient = () => {
    if (heatmap) {
      const gradient = [
        "rgba(0, 255, 255, 0)",
        "rgba(0, 255, 255, 1)",
        "rgba(0, 191, 255, 1)",
        "rgba(0, 127, 255, 1)",
        "rgba(0, 63, 255, 1)",
        "rgba(0, 0, 255, 1)",
        "rgba(0, 0, 223, 1)",
        "rgba(0, 0, 191, 1)",
        "rgba(0, 0, 159, 1)",
        "rgba(0, 0, 127, 1)",
        "rgba(63, 0, 91, 1)",
        "rgba(127, 0, 63, 1)",
        "rgba(191, 0, 31, 1)",
        "rgba(255, 0, 0, 1)",
      ];
      heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
    }
  };

  const changeRadius = () => {
    if (heatmap) {
      heatmap.set("radius", heatmap.get("radius") ? null : 20);
    }
  };

  const changeOpacity = () => {
    if (heatmap) {
      heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
    }
  };

  const saveMapAsPNG = () => {
    html2canvas(document.getElementById("map") as HTMLElement).then(canvas => {
      canvas.toBlob(blob => {
        const link = document.createElement('a');
        link.download = 'map.png';
        link.href = URL.createObjectURL(blob!);
        link.click();
      }, 'image/png');
    });
  };

  return (
    <div>
      <div id="map" style={{ height: '500px', width: '100%' }}></div>
      <button onClick={toggleHeatmap}>Toggle Heatmap</button>
      <button onClick={changeGradient}>Change Gradient</button>
      <button onClick={changeRadius}>Change Radius</button>
      <button onClick={changeOpacity}>Change Opacity</button>
      <button onClick={saveMapAsPNG}>Save Map as PNG</button>
    </div>
  );
};

export default HeatmapComponent;
