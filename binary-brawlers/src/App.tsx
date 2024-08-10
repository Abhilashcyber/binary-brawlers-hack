// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Playground from './pages/Playground';
import Arena from './pages/Arena'; //not exists
import Leaderboard from './pages/Leaderboard';
import ContestDetails from './pages/ContestDetails';
import Contests from './pages/Contests';
import CreateContest from './pages/CreateContest';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/arena" element={<Arena />} />
        <Route path="/contests" element={<Contests />} />
        <Route path="/contests/:id" element={<ContestDetails />} />
        <Route path="/contests/:id/leaderboard" element={<Leaderboard />} />
        <Route path="/create-contest" element={<CreateContest />} />
      </Routes>
    </Router>
  );
};

export default App;
