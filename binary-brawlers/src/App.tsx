import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import OutputDisplay from './components/OutputDisplay';
import './App.css';


const App: React.FC = () => {
  const [code, setCode] = useState<string>('console.log("Hello, World!");');
  const [output, setOutput] = useState<string>('');

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const runCode = async () => {
    try {
      const response = await fetch('http://localhost:3000/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: 'node',
          code: code,
        }),
      });
      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      console.error('Error executing code:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <CodeEditor value={code} onChange={handleCodeChange} />
        <OutputDisplay output={output} />
      </div>
      <button onClick={runCode}>Run Code</button>
    </div>
  );
};

export default App;
