/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

import { readFileSync } from 'fs';
import { join } from 'path';

declare const google: any;

let map: google.maps.Map, heatmap: google.maps.visualization.HeatmapLayer;

async function initMap() {
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    zoom: 13,
    center: { lat: 37.775, lng: -122.434 },
    mapTypeId: "satellite",
  });

  const points = await getPoints();

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: points,
    map: map,
  });

  document
    .getElementById("toggle-heatmap")!
    .addEventListener("click", toggleHeatmap);
  document
    .getElementById("change-gradient")!
    .addEventListener("click", changeGradient);
  document
    .getElementById("change-opacity")!
    .addEventListener("click", changeOpacity);
  document
    .getElementById("change-radius")!
    .addEventListener("click", changeRadius);
}

function toggleHeatmap(): void {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient(): void {
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

function changeRadius(): void {
  heatmap.set("radius", heatmap.get("radius") ? null : 20);
}

function changeOpacity(): void {
  heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
}

async function getPoints(): Promise<google.maps.LatLng[]> {
  const response = await fetch('/data/coordinates.txt');
  const fileContent = await response.text();
  const lines = fileContent.split('\n');

  return lines.map(line => {
    const [lat, lng] = line.split(',').map(Number);
    return new google.maps.LatLng(lat, lng);
  });
}

// // Heatmap data: 500 Points
// function getPoints() {
//   return [

// }

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};