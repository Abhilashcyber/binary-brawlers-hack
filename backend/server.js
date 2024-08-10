import express from 'express';
import { exec } from 'child_process';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import tmp from 'tmp';
import cors from 'cors';
import admin from 'firebase-admin';


import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync(new URL('../serviceAccountKey.json', import.meta.url)));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://binary-brawlers-default-rtdb.firebaseio.com/'
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = admin.firestore();

// Playground: Execute user code
app.post('/execute', (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: 'Language and code are required' });
  }

  if (language !== 'cpp') {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  const tempSourceFile = tmp.fileSync({ postfix: '.cpp' });
  const tempExecutableFile = path.join(path.dirname(tempSourceFile.name), 'a.out');

  fs.writeFileSync(tempSourceFile.name, code);

  const compileCommand = `g++ ${tempSourceFile.name} -o ${tempExecutableFile}`;
  const runCommand = tempExecutableFile;

  exec(compileCommand, (compileError, compileStdout, compileStderr) => {
    if (compileError) {
      console.error('Compilation error:', compileError);
      tempSourceFile.removeCallback();
      return res.status(500).json({
        output: compileStdout,
        error: compileStderr || compileError.message,
      });
    }

    exec(runCommand, { input }, (runError, stdout, stderr) => {
      tempSourceFile.removeCallback();
      fs.unlink(tempExecutableFile, (unlinkError) => {
        if (unlinkError) {
          console.error('Error removing executable:', unlinkError);
        }
      });

      if (runError) {
        console.error('Execution error:', runError);
        return res.status(500).json({
          output: stdout,
          error: stderr || runError.message,
        });
      }

      res.json({
        output: stdout,
        error: stderr,
      });
    });
  });
});

// Battleground: Contest Management
app.post('/contests', async (req, res) => {
  const { name, startTime, endTime, problems } = req.body;

  if (!name || !startTime || !endTime || !problems) {
    return res.status(400).json({ error: 'Name, startTime, endTime, and problems are required' });
  }

  try {
    const contestRef = admin.firestore().collection('contests').doc();
    await contestRef.set({ name, startTime, endTime, problems });

    res.status(201).json({ id: contestRef.id, name, startTime, endTime, problems });
  } catch (error) {
    console.error('Error creating contest:', error);
    res.status(500).json({ error: 'Error creating contest' });
  }
});


app.get('/contests', async (req, res) => {
  try {
    const contestsRef = db.collection('contests');
    const snapshot = await contestsRef.get();
    const contests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(contests);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/contests/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const contestRef = db.collection('contests').doc(id);
    const doc = await contestRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/contests/:id/problems', async (req, res) => {
  const { id } = req.params;
  const { problem } = req.body; // { description, constraints, testCases }

  if (!problem) {
    return res.status(400).json({ error: 'Problem details are required' });
  }

  try {
    const contestRef = db.collection('contests').doc(id);
    const contestDoc = await contestRef.get();

    if (!contestDoc.exists) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    const problems = contestDoc.data().problems || [];
    problems.push(problem);

    await contestRef.update({ problems });
    res.status(201).send('Problem added to contest');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Handle code submission and evaluation for contests
app.post('/contests/:id/submit', async (req, res) => {
  const { id } = req.params;
  const { language, code, input, problemId, userId } = req.body;

  if (!language || !code || !input || !problemId || !userId) {
    return res.status(400).json({ error: 'Language, code, input, problemId, and userId are required' });
  }

  if (language !== 'cpp') {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  const tempSourceFile = tmp.fileSync({ postfix: '.cpp' });
  const tempExecutableFile = path.join(path.dirname(tempSourceFile.name), 'a.out');

  fs.writeFileSync(tempSourceFile.name, code);

  const compileCommand = `g++ ${tempSourceFile.name} -o ${tempExecutableFile}`;
  const runCommand = tempExecutableFile;

  exec(compileCommand, (compileError, compileStdout, compileStderr) => {
    if (compileError) {
      console.error('Compilation error:', compileError);
      tempSourceFile.removeCallback();
      return res.status(500).json({
        output: compileStdout,
        error: compileStderr || compileError.message,
      });
    }

    exec(runCommand, { input }, async (runError, stdout, stderr) => {
      tempSourceFile.removeCallback();
      fs.unlink(tempExecutableFile, (unlinkError) => {
        if (unlinkError) {
          console.error('Error removing executable:', unlinkError);
        }
      });

      if (runError) {
        console.error('Execution error:', runError);
        return res.status(500).json({
          output: stdout,
          error: stderr || runError.message,
        });
      }

      const contestRef = db.collection('contests').doc(id);
      const contestDoc = await contestRef.get();
      const problems = contestDoc.data().problems || [];
      const problem = problems.find(p => p.id === problemId);

      if (problem) {
        const isCorrect = problem.testCases.every(testCase => {
          return stdout.trim() === testCase.expectedOutput.trim();
        });

        await db.collection('submissions').add({
          contestId: id,
          problemId,
          userId,
          output: stdout,
          error: stderr,
          isCorrect,
        });

        res.json({
          output: stdout,
          error: stderr,
          isCorrect,
        });
      } else {
        res.status(404).json({ error: 'Problem not found in the contest' });
      }
    });
  });
});

// Get leaderboard
app.get('/contests/:id/leaderboard', async (req, res) => {
  const { id } = req.params;

  try {
    const submissionsRef = db.collection('submissions').where('contestId', '==', id);
    const snapshot = await submissionsRef.get();
    const submissions = snapshot.docs.map(doc => doc.data());

    const scores = {};
    submissions.forEach(submission => {
      if (submission.isCorrect) {
        scores[submission.userId] = (scores[submission.userId] || 0) + 1;
      }
    });

    const leaderboard = Object.entries(scores).map(([userId, score]) => ({ userId, score }));
    leaderboard.sort((a, b) => b.score - a.score);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
