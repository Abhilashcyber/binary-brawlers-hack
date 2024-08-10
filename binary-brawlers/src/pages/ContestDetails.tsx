import React, { useState, useEffect, FormEvent } from 'react';
import { useParams } from 'react-router-dom';

interface Problem {
  id: string;
  description: string;
  constraints: string;
  testCases: Array<{ input: string; expectedOutput: string }>;
}

interface Contest {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  problems: Problem[];
}

const ContestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [contest, setContest] = useState<Contest | null>(null);
  const [problemId, setProblemId] = useState<string>('');
  const [language, setLanguage] = useState<string>('cpp');
  const [code, setCode] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchContest = async () => {
      const response = await fetch(`http://localhost:3000/contests/${id}`);
      const result = await response.json();
      setContest(result);
    };

    fetchContest();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/contests/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code, input, problemId, userId: 'user123' })
      });

      const result = await response.json();
      setOutput(result.output);
      setError(result.error);
    } catch (err) {
      setError('Error submitting code');
    }
  };

  if (!contest) return <p>Loading...</p>;

  return (
    <div>
      <h1>{contest.name}</h1>
      <h2>Problems</h2>
      <ul>
        {contest.problems.map(problem => (
          <li key={problem.id}>{problem.description}</li>
        ))}
      </ul>
      <h2>Submit Solution</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Problem ID:
          <input
            type="text"
            value={problemId}
            onChange={(e) => setProblemId(e.target.value)}
          />
        </label>
        <br />
        <label>
          Language:
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="cpp">C++</option>
          </select>
        </label>
        <br />
        <label>
          Code:
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={10}
            cols={50}
          ></textarea>
        </label>
        <br />
        <label>
          Input:
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            cols={50}
          ></textarea>
        </label>
        <br />
        <button type="submit">Submit Code</button>
      </form>
      <h2>Output</h2>
      <pre>{output}</pre>
      <h2>Error</h2>
      <pre style={{ color: 'red' }}>{error}</pre>
    </div>
  );
};

export default ContestDetails;
