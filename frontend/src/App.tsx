// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import GoogleMapComponent from './GoogleMapComponent';
import ResultPage from './ResultPage';

type responseData = {
  claudeResponse: string;
  highTraffic: string;
  path: string;
}
interface HomePageProps {
  setHeatMapSrc: React.Dispatch<React.SetStateAction<string>>,
  setClaudeText: React.Dispatch<React.SetStateAction<string>>,
  setHighTrafficAreas: React.Dispatch<React.SetStateAction<string>>
}
const HomePage: React.FC<HomePageProps> = ({setHeatMapSrc, setClaudeText, setHighTrafficAreas}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const handleLocationSubmit = (location: { lat: number; lng: number }, bounds: { ne: { lat: number, lng: number }, sw: { lat: number, lng: number } },
    data:responseData
  ) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/result', { state: { location, bounds } });
    }, 2000); // Simulate loading screen for 2 seconds
    setHeatMapSrc("./publicheatmap15.jpeg");
    setClaudeText(data.claudeResponse);
    setHighTrafficAreas(data.highTraffic);
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
  const [heatMapSrc, setHeatMapSrc] = useState('');
  const [claudeText, setClaudeText] = useState('');
  const [highTrafficAreas, setHighTrafficAreas] = useState('');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage setHeatMapSrc={(name) => setHeatMapSrc(name)}
                                          setClaudeText={(name) => setClaudeText(name)}
                                          setHighTrafficAreas={(name) => setHighTrafficAreas(name)}
        />} />
        <Route path="/result" element={<ResultPage claudeResponse={claudeText} path={heatMapSrc} highTraffic={highTrafficAreas}/>} />
      </Routes>
    </Router>
  );
};

export default App;
