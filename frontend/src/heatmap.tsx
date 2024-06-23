import * as React from 'react';
import html2canvas from "html2canvas";

declare global {
  interface Window {
    google?: any;
    initMap: () => void;
  }
}

const MapComponent = () => {
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [heatmap, setHeatmap] = React.useState<google.maps.visualization.HeatmapLayer | null>(null);
  const mapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Load the Google Maps JavaScript API library
    const script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization&callback=initMap";
    script.async = true;
    document.body.appendChild(script);
    window.initMap = () => { // Initialize map in the global scope
        if (mapRef.current) { // Check that the ref is not null
            setMap(new window.google.maps.Map(mapRef.current, {
                zoom: 8,
                center: { lat: 32.819801442, lng: -96.79703597 },
            }));
        }
    };
    return () => { // Clean up function to remove the script tag when the component unmounts
        window.initMap = () => {};
        document.body.removeChild(script);
        };
    }, []);
    React.useEffect(() => {
        if (map) getHeatMapData();
    }, [map]);

    const calculateTrafficScore = (speed: number, freeFlowSpeed: number, jamFactor: number, confidence: number, currentSpeed: number): number => {
        return Math.min(100, Math.max(0, ((0.4 * (1 - (currentSpeed / freeFlowSpeed))) + (0.6 * (jamFactor / 10))) * 100));
    };
    const getHeatMapData = async () => {
      // let response = await fetch('https://your-api-url');
      // let data = await response.json();
      // let points: google.maps.visualization.WeightedLocation[] = [];
    
      // for (let item of data) {
      //   const trafficScore = calculateTrafficScore(item.speed, item.freeFlowSpeed, item.jamFactor, item.confidence, item.currentSpeed);
      //   points.push({ location: new google.maps.LatLng(item.latitude, item.longitude), weight: trafficScore });
      // }
    
      // const heatmap = new google.maps.visualization.HeatmapLayer({ data: points });
      // setHeatmap(heatmap);
      // Read data from local file
      const response = await fetch('data/data.txt');
      const text = await response.text();
      const data = JSON.parse(text);

      let points: google.maps.visualization.WeightedLocation[] = [];

      for (let item of data) {
        const trafficScore = calculateTrafficScore(item.speed, item.freeFlowSpeed, item.jamFactor, item.confidence, item.currentSpeed);
        points.push({ location: new google.maps.LatLng(item.latitude, item.longitude), weight: trafficScore });
      }

      const heatmap = new google.maps.visualization.HeatmapLayer({ data: points });
      setHeatmap(heatmap);
    };
    const toggleHeatMap = () => {
        if (heatmap) {
            heatmap.setMap(heatmap.getMap() ? null : map);
        }
    };

  const saveMapAsPNG = async () => {
    if (mapRef.current && window.google) { // Check that the map and google object are not null
      await exportAsImage(mapRef.current, 'map_image.png');
    }
  };

  return (
    <div>
      <div ref={mapRef} style={{ height: '400px', width: '600px' }} />
      {heatmap && <button onClick={toggleHeatMap}>Toggle HeatMap</button>}
      <button onClick={saveMapAsPNG}>Save Map as PNG</button>
    </div>
  );
};

export const exportAsImage = async (el: HTMLElement, imageFileName: string) => {
  const canvas = await html2canvas(el);
  const image = canvas.toDataURL('image/png', 1.0);
  downloadImage(image, imageFileName);
};

const downloadImage = (blob: string, fileName: string) => {
  const fakeLink = window.document.createElement("a");
  fakeLink.style.display = 'none';
  fakeLink.download = fileName;
  fakeLink.href = blob;

  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);
};

export default MapComponent;