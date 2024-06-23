// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

let map, heatmap;
import html2canvas from 'html2canvas';

async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: { lat: 32.81980144224803, lng: -96.72321373493184 },
    mapTypeId: "satellite",
  });


  const points = await getPoints();
  console.log(points);
  console.log('derozan');

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: points,
    map: map,
  });

  document
    .getElementById("toggle-heatmap")
    .addEventListener("click", toggleHeatmap);
  document
    .getElementById("change-gradient")
    .addEventListener("click", changeGradient);
  document
    .getElementById("change-opacity")
    .addEventListener("click", changeOpacity);
  // document
  //   .getElementById("change-radius")
  //   .addEventListener("click", changeRadius);
  
  // Add event listener for saving the map
  document
    .getElementById("change-radius")
    .addEventListener("click", saveMapAsPNG);
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
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

function changeRadius() {
  heatmap.set("radius", heatmap.get("radius") ? null : 20);
}

function changeOpacity() {
  heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
}

async function getPoints() {
  const response = await fetch('/data/coordinates.txt');
  const fileContent = await response.text();
  const lines = fileContent.split('\n');

  return lines.map(line => {
    const [lat, lng] = line.split(',').map(Number);
    return new google.maps.LatLng(lat, lng);
  });
}

// async function getPoints() {
//   const response = await fetch('/data/data.txt');
//   const data = await response.json();
  
//   const points = [];
//   const HOUSE_LENGTH = 0.00015; // Approximately 15-20 meters in lat/lng units

//   for (const result of data.results) {
//     for (const link of result.location.shape.links) {
//       for (let i = 0; i < link.points.length - 1; i++) {
//         const start = link.points[i];
//         const end = link.points[i + 1];
        
//         const distance = Math.sqrt(
//           Math.pow(end.lat - start.lat, 2) + 
//           Math.pow(end.lng - start.lng, 2)
//         );
        
//         const steps = Math.ceil(distance / HOUSE_LENGTH);
        
//         for (let step = 0; step <= steps; step++) {
//           const fraction = step / steps;
//           const lat = start.lat + (end.lat - start.lat) * fraction;
//           const lng = start.lng + (end.lng - start.lng) * fraction;
          
//           let score = calculateTrafficScore(
//             result.currentFlow.speed,
//             result.currentFlow.freeFlow,
//             result.currentFlow.jamFactor,
//             result.currentFlow.confidence,
//             result.currentFlow.speedUncapped
//           );
          
//           // Handle NaN scores
//           score = isNaN(score) ? 0 : score;
          
//           // Add more points for higher scores
//           const numPoints = Math.ceil(score / 10); // Add up to 10 additional points
//           for (let j = 0; j < numPoints; j++) {
//             const offsetLat = (Math.random() - 0.5) * 0.0001; // Small random offset
//             const offsetLng = (Math.random() - 0.5) * 0.0001;
//             points.push(new google.maps.LatLng(lat + offsetLat, lng + offsetLng));
//           }
//         }
//       }
//     }
//   }
//   console.log('doe');
//   return points;
// }

function calculateTrafficScore(speed, freeFlow, jamFactor, confidence, speedUncapped) {
  return Math.min(100, Math.max(0, (
    0.4 * (1 - speedUncapped / freeFlow) +
    0.6 * (jamFactor / 10)
  ) * 100));
}
function saveMapAsPNG() {
  html2canvas(document.getElementById("map")).then(function(canvas) {
    // const link = document.createElement('a');
    // link.download = 'map.png';
    // link.href = canvas.toDataURL('image/png');
    // link.click();
    canvas.toBlob(function(blob) {
      const link = document.createElement('a');
      link.download = 'map.png';
      link.href = URL.createObjectURL(blob); // just save blob to server side now
      link.click();
      console.log('hi');
    }, 'image/png');
  });
}

window.initMap = initMap;