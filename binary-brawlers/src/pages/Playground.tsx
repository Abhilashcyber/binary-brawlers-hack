import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import './css/Playground.css';

const Playground: React.FC = () => {
  const initialCode = `#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}`;
  
  const [code, setCode] = useState<string>(initialCode);
  const [output, setOutput] = useState<string>('');

  useEffect(() => {
    // Load code from local storage on mount
    const savedCode = localStorage.getItem('code');
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      // Save code to local storage
      localStorage.setItem('code', value);
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
          language: 'cpp',
          code: code,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.error ? `Error: ${data.error}` : `${data.output}`);
      } else {
        setOutput(`Error: ${data.error || 'An unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput('Network error');
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    localStorage.setItem('code', initialCode);
  };

  return (
    <div className="playground-container">
      <div className="header">
        <button onClick={runCode} className="run-code-button">Run Code</button>
        <button onClick={resetCode} className="reset-code-button">Reset Code</button>
      </div>
      <div className="playground-content">
        <CodeEditor className="code-editor" value={code} onChange={handleCodeChange} />
        <div className="output">
          <h2 className='output-head'>Output</h2>
          <hr />
          <pre className='output-message'>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default Playground;
