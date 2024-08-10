import React from 'react';
import { Link } from 'react-router-dom';
import './css/LandingPage.css';
import PlaygroundImage from '../assets/playgroundjpg.jpg';
import ArenaImage from '../assets/Arena.jpg';
import BattlegroundImage from '../assets/battleground.jpg';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <div className="container">
        <div className="card">
          <Link to="/playground">
            <img src={PlaygroundImage} alt="Playground" />
            <h2>Playground</h2>
          </Link>
        </div>
        <div className="card">
          <Link to="/arena">
            <img src={ArenaImage} alt="Arena" />
            <h2>Arena</h2>
          </Link>
        </div>
        <div className="card">
          <Link to="/contests">
            <img src={BattlegroundImage} alt="Battleground" />
            <h2>Battleground</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
