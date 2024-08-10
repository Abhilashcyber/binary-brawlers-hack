// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Playground from './pages/Playground';
import Arena from './pages/Arena'; // Create these components
import Battleground from './pages/Battleground'; // Create these components

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/arena" element={<Arena />} />
        <Route path="/battleground" element={<Battleground />} />
      </Routes>
    </Router>
  );
};

export default App;
