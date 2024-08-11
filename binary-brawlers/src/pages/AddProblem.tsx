import React, { useState } from 'react';
import axios from 'axios';

interface AddProblemProps {
  onClose: () => void;
}

const AddProblem: React.FC<AddProblemProps> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [constraints, setConstraints] = useState('');
  const [testCases, setTestCases] = useState<{ input: string, expectedOutput: string }[]>([]);
  const [driverCode, setDriverCode] = useState('');

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '' }]);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:3000/questions', {
        title,
        description,
        constraints,
        testCases,
        driverCode, 
      });
      alert('Problem added successfully');
      onClose(); 
      window.location.reload(); 
    } catch (error) {
      console.error('Error adding problem:', error);
    }
  };

  return (
    <div style={{
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: '#2c2c2c',
      color: '#fff',
      maxWidth: '800px',
      margin: 'auto',
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Coding Problem</h2>
      
      <div style={{ maxWidth: '600px', margin: 'auto' }}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          style={{
            width: '90%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #444',
            backgroundColor: '#1e1e1e',
            color: '#fff',
          }}
        />
        
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          rows={4}
          style={{
            width: '90%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #444',
            backgroundColor: '#1e1e1e',
            color: '#fff',
          }}
        />
        
        <textarea
          value={constraints}
          onChange={e => setConstraints(e.target.value)}
          placeholder="Constraints"
          rows={3}
          style={{
            width: '90%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #444',
            backgroundColor: '#1e1e1e',
            color: '#fff',
          }}
        />
        
        <textarea
          value={driverCode}
          onChange={e => setDriverCode(e.target.value)}
          placeholder="Driver Code"
          rows={4}
          style={{
            width: '90%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #444',
            backgroundColor: '#1e1e1e',
            color: '#fff',
          }}
        />
        
        <h3 style={{ marginTop: '20px' }}>Test Cases</h3>
        {testCases.map((testCase, index) => (
          <div key={index} style={{
            display: 'flex',
            marginBottom: '10px',
            alignItems: 'center',
            gap: '10px',
          }}>
            <input
              type="text"
              value={testCase.input}
              onChange={e => {
                const newTestCases = [...testCases];
                newTestCases[index].input = e.target.value;
                setTestCases(newTestCases);
              }}
              placeholder="Test Case Input"
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #444',
                backgroundColor: '#1e1e1e',
                color: '#fff',
              }}
            />
            <input
              type="text"
              value={testCase.expectedOutput}
              onChange={e => {
                const newTestCases = [...testCases];
                newTestCases[index].expectedOutput = e.target.value;
                setTestCases(newTestCases);
              }}
              placeholder="Expected Output"
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #444',
                backgroundColor: '#1e1e1e',
                color: '#fff',
              }}
            />
          </div>
        ))}
        <button
          onClick={handleAddTestCase}
          style={{
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '20px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Add Test Case
        </button>
        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            marginRight: '10px',
            display: 'inline-block',
          }}
        >
          Submit
        </button>
        <button
          onClick={onClose}
          style={{
            backgroundColor: '#f44336',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'inline-block',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddProblem;
