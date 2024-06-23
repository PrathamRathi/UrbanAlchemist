import * as React from 'react';
import html2canvas from "html2canvas";
import data from './data/data.json'
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
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAYPCPC3qF1lro_PG7SDUIfHksMt-8Ro5w&libraries=visualization&callback=initMap";
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
        // console.log(currentSpeed);
        // console.log(speed);
        // console.log(freeFlowSpeed);
        // console.log(jamFactor);
        return Math.min(100, Math.max(0.1, ((0.4 * (1 - (currentSpeed / freeFlowSpeed))) + (0.6 * (jamFactor / 10))) * 100)); // Need to change min to 0
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
      // @ts-ignore
      let vals:any = data['results'];
      console.log(vals);
      console.log(data);
      // (async () => {
      //   try {
      //     const response = await fetch('./data/data.json');
      //     console.log(response)
      //     if (!response.ok) {
      //       throw new Error('Network response was not ok ' + response.statusText);
      //     }
      //     data = await response.json();
      //     console.log(data); // Use the data as needed
      //   } catch (error) {
      //     console.error('There has been a problem with your fetch operation:', error);
      //   }
      // })();
      

      let points: google.maps.visualization.WeightedLocation[] = [];
      const HOUSE_LENGTH = 0.00015; // Approximately 15-20 meters in lat/lng units
      // @ts-ignore
      for (let result of vals) {
        console.log(result.currentFlow);
        for (let link of result.location.shape.links) {
          for (let i = 0; i < link.points.length - 1; i++) {
            const start = link.points[i];
            const end = link.points[i + 1];

            const dist = Math.sqrt(
              Math.pow(end.lat - start.lat, 2) +
              Math.pow(end.lng - start.lng, 2)
            );

            const steps = Math.ceil(dist / HOUSE_LENGTH);

            for (let step = 0; step <= steps; step++) {
              const fraction = step / steps;
              const lat = start.lat + (end.lat - start.lat) * fraction;
              const lng = start.lng + (end.lng - start.lng) * fraction;
              // console.log(lat);
              // console.log(result);
              // console.log(result.currentFlow.speedUncapped);
              const trafficScore = calculateTrafficScore(result.currentFlow.speed, result.currentFlow.freeFlow, result.currentFlow.jamFactor, result.currentFlow.confidence, result.currentFlow.speedUncapped);
              // console.log(trafficScore);
              const score = isNaN(trafficScore) ? 0 : trafficScore;
              // Add more points for higher scores
              const numPoints = Math.ceil(score / 10); // Add up to 10 additional points
              // console.log(numPoints);
              for (let j = 0; j < numPoints; j++) {
                const offsetLat = (Math.random() - 0.5) * 0.0001; // Small random offset
                const offsetLng = (Math.random() - 0.5) * 0.0001;
                // console.log(offsetLat);
                // console.log(offsetLng);
                const center = {
                  lat: lat + offsetLat  as number,
                  lng: lng + offsetLng  as number,
                };
                console.log(center.lat);
                console.log(center.lng);
                console.log(trafficScore);
                // points.push(new google.maps.LatLng(center.lat as number, center.lng as number));
                points.push({ location: new google.maps.LatLng(center.lat as number, center.lng as number), weight: trafficScore });
              }
            }
          }
        }
      }
      console.log(points);
      // <HeatmapLayer data={data} />
      // const heatmap = new google.maps.visualization.HeatmapLayer({ data: points });
      // heatmap.setMap(map);
      const heatmap = new google.maps.visualization.HeatmapLayer({
        data: points,
        map: map,
      });
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