// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import GoogleMapComponent from './GoogleMapComponent';
import ResultPage from './ResultPage';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [heatMapSrc, setHeatMapSrc] = useState('');

  const handleLocationSubmit = (location: { lat: number; lng: number }, bounds: { ne: { lat: number, lng: number }, sw: { lat: number, lng: number } }) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/result', { state: { location, bounds } });
    }, 2000); // Simulate loading screen for 2 seconds
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>Urban Alchemist</h1>
          <p>Please move around the map with your mouse. Place a marker by clicking on the map! Once placed, use the auto-zoom-in button to see the scope of optimizations. If you are satisfied with the scope, press the submit button!</p>
          <GoogleMapComponent onSubmit={handleLocationSubmit} zoom={11} initialZoom={5} />
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
};

export default App;
