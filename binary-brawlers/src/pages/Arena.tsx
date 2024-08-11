import React, { useState } from 'react';
import ProblemList from './ProblemList';
import AddProblem from './AddProblem';

const Arena: React.FC = () => {
  const [showAddProblem, setShowAddProblem] = useState(false);

  const handleAddProblemClick = () => {
    setShowAddProblem(true);
  };

  const handleClose = () => {
    setShowAddProblem(false);
  };

  return (
    <div style={{
      backgroundColor: '#1e1e1e',
      color: '#fff',
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <h1 style={{ marginBottom: '20px', color: '#e0e0e0' }}>Coding Arena</h1>
      
      <button
        onClick={handleAddProblemClick}
        style={{
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Add Coding Problem
      </button>
      
      {showAddProblem && <AddProblem onClose={handleClose} />}

      <ProblemList />
    </div>
  );
};

export default Arena;
