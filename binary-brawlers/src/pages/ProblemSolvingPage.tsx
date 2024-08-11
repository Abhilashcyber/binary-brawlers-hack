import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Editor } from '@monaco-editor/react'; 

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface Problem {
  id: string;
  title: string;
  description: string;
  constraints: string;
  testCases: TestCase[];
  driverCode: string;
  questionNumber: number;
}

const ProblemSolvingPage: React.FC<{ problemId: string }> = ({ problemId }) => {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get<Problem>(`http://localhost:3000/questions/${problemId}`);
        setProblem(response.data);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setError('Failed to fetch problem');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!problem) return <p>No problem found</p>;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px',width: '100vw' }}>
      <div style={{ width: '45%' }}>
        <h2>Problem Description</h2>
        <p>{problem.description}</p>
        <h3>Constraints</h3>
        <p>{problem.constraints}</p>
        <h3>Test Cases</h3>
        <ul>
          {(problem.testCases || []).map((testCase, index) => (
            <li key={index}>
              <p><strong>Input:</strong> {testCase.input}</p>
              <p><strong>Expected Output:</strong> {testCase.expectedOutput}</p>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ width: '45%' }}>
        <h2>Code Editor</h2>
        <div style={{ height: '40vh' }}>
          <Editor
            height="50vh"
            defaultLanguage="javascript"
            defaultValue={problem.driverCode}
            theme='vs-dark'
          />
        </div>
        <h3>Output</h3>
        <div style={{ height: '40vh', border: '1px solid #ddd', borderRadius: '5px' }}>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolvingPage;
