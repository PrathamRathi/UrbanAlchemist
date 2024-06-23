// ResultPage.tsx
import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import MapComponent from './MapComponent';
import html2canvas from "html2canvas";


interface ResultPageProps {
  claudeResponse: string;
  highTraffic: string;
  path: string;
}
const extractParts = (input: string): [string, string, string] => {
  // Regular expression to match the parts
  const pattern = /(.*)\nGrade_Report: (.)?(.*)/s;

  const match = input.match(pattern);

  if (match) {
      const firstPart = match[1].trim();
      const secondPart = match[2]?.trim() || 'B'; // First character after "Grade_Report: "
      const thirdPart = match[3].trim();
      return [firstPart, secondPart, thirdPart];
  } else {
      throw new Error("Pattern not found in the string.");
  }
  
};
const ResultPage: React.FC<ResultPageProps> = ({claudeResponse, highTraffic, path}) => {
  const location = useLocation();
  const { location: markerLocation, bounds } = location.state as { location: { lat: number; lng: number }, bounds: { ne: { lat: number, lng: number }, sw: { lat: number, lng: number } } };
  const pageRef = useRef<HTMLDivElement>(null);

  // const handleSaveAsPNG = () => {
  //   if (pageRef.current) {
  //     html2canvas(pageRef.current).then((canvas) => {
  //       const link = document.createElement('a');
  //       link.href = canvas.toDataURL('image/png');
  //       link.download = 'page.png';
  //       link.click();
  //   });
  // }
  // };
  let parts: [string, string, string] = ['', '', '']; // Initialize with default values

    try {
        parts = extractParts(claudeResponse);
        console.log("First Part:", parts[0]);
        console.log("Second Part:", parts[1]);
        console.log("Third Part:", parts[2]);
    } catch (error) {
        console.error(error);
    }
  return (
        <div ref={pageRef} style={{ padding: '20px' }}>
            <h1>Results</h1>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ flex: '0 0 auto', color: 'red', fontWeight: 'bold', fontSize: '24px' }}>
                    GRADE: {parts[1]}
                </div>
                <div style={{ flex: '1', paddingLeft: '20px' }}>
                    <p><strong>Reason for the grade:</strong> {parts[2]}</p>
                </div>
            </div>
            <div style={{ marginTop: '20px' }}>
                <p><strong>Proposed Solution:</strong> {parts[0]}</p>
            </div>
            <div style={{ marginTop: '20px' }}>
                <h2>Selected Location:</h2>
                <p>Latitude: {markerLocation.lat}</p>
                <p>Longitude: {markerLocation.lng}</p>
                <div>
                    <h2>Traffic Heatmap</h2>
                    <img src={'./' + path} alt="Traffic Heatmap" />
                </div>
                <p>High traffic areas: {highTraffic} </p>
                <p>Optimizations: {claudeResponse}</p>
            </div>
        </div>
  );
};

export default ResultPage;
