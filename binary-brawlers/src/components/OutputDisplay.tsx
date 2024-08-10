import React from 'react';

interface OutputDisplayProps {
  output: string;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output }) => {
  return (
    <>
      <h2>Output</h2>
    <div className="output-container">
      <pre>{output}</pre>
    </div>
    </>
  );
};

export default OutputDisplay;
