// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">
import html2canvas from 'html2canvas';
const google = window.google;
export default function GetMap(){
let map, heatmap;


async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: { lat: 37.775, lng: -122.434 },
    mapTypeId: "satellite",
  });
  console.log(map);

  const points = await getPoints();

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

function saveMapAsPNG() {
    console.log("SAVING")
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
    }, 'image/png');
  });
}

window.initMap = initMap;
}