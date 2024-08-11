import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Problem {
  id: string;
  title: string;
  description: string;
  constraints: string;
  testCases: Array<{ input: string; expectedOutput: string }>;
  driverCode: string;
  questionNumber: number;
}

const ProblemList: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get<Problem[]>('http://localhost:3000/questions');
        setProblems(response.data);
      } catch (error) {
        console.error('Error fetching problems:', error);
        setError('Failed to fetch problems');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleSolve = (id: string) => {
    navigate(`/problem/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Coding Problems</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {problems.map(problem => (
          <div key={problem.id} style={{
            margin: '10px',
            flexBasis: '200px',
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: '#333',
            color: '#fff',
          }}>
            <h3>Question {problem.questionNumber}</h3>
            <p>{problem.title}</p>
            <button
              onClick={() => handleSolve(problem.id)}
              style={{
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '10px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Solve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemList;
