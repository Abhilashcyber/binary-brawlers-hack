import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Contest {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  problems: Array<any>;
}

const Contests: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    const fetchContests = async () => {
      const response = await fetch('http://localhost:3000/contests');
      const result = await response.json();
      setContests(result);
    };

    fetchContests();
  }, []);

  const handleCreateContest = () => {
    navigate('/create-contest'); // Navigate to the CreateContest component
  };

  return (
    <div>
      <h1>Contests</h1>
      <button onClick={handleCreateContest}>Create Contest</button> {/* Button to create contest */}
      <ul>
        {contests.map(contest => (
          <li key={contest.id}>
            <h2>{contest.name}</h2>
            <p>Start: {new Date(contest.startTime).toLocaleString()}</p>
            <p>End: {new Date(contest.endTime).toLocaleString()}</p>
            <a href={`/contests/${contest.id}`}>View Details</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contests;
