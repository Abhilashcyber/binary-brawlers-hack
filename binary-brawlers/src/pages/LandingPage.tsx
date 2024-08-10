// src/components/LandingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './css/LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <div className="container">
        <div className="card">
          <Link to="/playground">
            <img src="binary-brawlers\src\assets\arena.jpg" alt="Playground" />
            <h2>Playground</h2>
          </Link>
        </div>
        <div className="card">
          <Link to="/arena">
            <img src="path/to/arena-image.png" alt="Arena" />
            <h2>Arena</h2>
          </Link>
        </div>
        <div className="card">
          <Link to="/battleground">
            <img src="path/to/battleground-image.png" alt="Battleground" />
            <h2>Battleground</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
