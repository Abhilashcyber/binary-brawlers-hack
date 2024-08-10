import React, { useState } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';

const CodeExecutor: React.FC = () => {
  const [code, setCode] = useState<string>('print("Hello, World!")');
  const [language, setLanguage] = useState<string>('python');
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const executeCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/execute', {
        language,
        code,
        input,
      });

      setOutput(response.data.output);
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput('Execution failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="language">Language:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="python">Python</option>
          <option value="node">Node.js</option>
        </select>
      </div>

      <Editor
        height="60vh"
        width="70vw"
        defaultLanguage={language}
        value={code}
        onChange={handleEditorChange}
        options={{ minimap: { enabled: false } }}
        theme='vs-dark'
      />

      <div>
        <button onClick={executeCode} disabled={loading}>
          {loading ? 'Executing...' : 'Run Code'}
        </button>
      </div>

      <div>
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodeExecutor;
