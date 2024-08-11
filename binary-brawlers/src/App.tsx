// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Playground from './pages/Playground';
import Arena from './pages/Arena'; //not exists
import ContestDetails from './pages/ContestDetails';
import ProblemSolvingPage from './pages/ProblemSolvingPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/arena" element={<Arena />} />
        <Route path="/contests/:id" element={<ContestDetails />} />
        <Route path="/problem/:id" element={<ProblemSolvingPage problemId={''} />} />
      </Routes>
    </Router>
  );
};

export default App;
