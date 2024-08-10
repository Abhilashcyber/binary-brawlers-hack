import React from 'react';

interface OutputDisplayProps {
  output: string;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output }) => {
  return (
    <>
    <div className="output-container">
      <pre>{output}</pre>
    </div>
    </>
  );
};

export default OutputDisplay;
