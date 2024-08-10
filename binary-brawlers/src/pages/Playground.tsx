import React, { useState } from 'react';
import CodeEditor from '../components/CodeEditor';

import './css/Playground.css';

const Playground: React.FC = () => {
  const [code, setCode] = useState<string>('#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}\n');
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

  return (
    <div className="playground-container">
      <div className="header">
        <button onClick={runCode} className="run-code-button">Run Code</button>
      </div>
      <div className="playground-content">
        <CodeEditor className="code-editor" value={code} onChange={handleCodeChange} />
        <div className="output">
          <h2 className='output-head'>Output</h2>
          <hr />
          <div className='output-message'>{output}</div>
        </div>
      </div>
    </div>
  );
};

export default Playground;



// import React, { useState } from 'react';
// import CodeEditor from '../components/CodeEditor';
// import OutputDisplay from '../components/OutputDisplay';
// import './css/Playground.css'; // Create a CSS file for styling

// const Playground: React.FC = () => {
//   const [code, setCode] = useState<string>('#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}\n');
//   const [output, setOutput] = useState<string>('');

//   const handleCodeChange = (value: string | undefined) => {
//     if (value !== undefined) {
//       setCode(value);
//     }
//   };

//   const runCode = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/execute', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           language: 'cpp',
//           code: code,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setOutput(data.error ? `Error: ${data.error}` : `${data.output}`);
//       } else {
//         setOutput(`Error: ${data.error || 'An unknown error occurred'}`);
//       }
//     } catch (error) {
//       console.error('Error executing code:', error);
//       setOutput('Network error');
//     }
//   };

//   return (
//     <div className="playground-container">
//       <div className="playground-content">
//         <CodeEditor value={code} onChange={handleCodeChange} />
//         <div className="output">
//           <h2 className='output-head'>Output</h2>
//           <OutputDisplay output={output} />
//         </div>
//       </div>
//       <button onClick={runCode} className="run-code-button">Run Code</button>
//     </div>
//   );
// };

// export default Playground;
