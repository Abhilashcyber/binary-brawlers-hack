import React, { useState, FormEvent } from 'react';

const CreateContest: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [problems, setProblems] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, startTime, endTime, problems: JSON.parse(problems) })
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(`Contest created with ID: ${result.id}`);
        setError('');
      } else {
        setSuccess('');
        setError(result.error || 'Error creating contest');
      }
    } catch (err) {
      setSuccess('');
      setError('Error creating contest');
    }
  };

  return (
    <div>
      <h1>Create Contest</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Start Time:
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          End Time:
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Problems (JSON format):
          <textarea
            value={problems}
            onChange={(e) => setProblems(e.target.value)}
            rows={5}
            cols={50}
            required
          ></textarea>
        </label>
        <br />
        <button type="submit">Create Contest</button>
      </form>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateContest;
