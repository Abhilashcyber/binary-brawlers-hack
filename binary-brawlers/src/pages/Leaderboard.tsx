import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface LeaderboardEntry {
  userId: string;
  score: number;
}

const Leaderboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const response = await fetch(`http://localhost:3000/contests/${id}/leaderboard`);
      const result = await response.json();
      setLeaderboard(result);
    };

    fetchLeaderboard();
  }, [id]);

  return (
    <div>
      <h1>Leaderboard</h1>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            User: {entry.userId}, Score: {entry.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
