import express from 'express';
import { exec } from 'child_process';
import bodyParser from 'body-parser';
import fs from 'fs/promises'; 
import path from 'path';
import tmp from 'tmp';
import cors from 'cors';
import admin from 'firebase-admin';


import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync(new URL('../serviceAccountKey.json', import.meta.url)));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://binary-brawlers-default-rtdb.firebaseio.com/'
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = admin.firestore();

app.post('/questions', async (req, res) => {
  const { title, description, constraints, testCases, driverCode, questionNumber } = req.body;

  if (!title || !description || !constraints || !testCases || !driverCode || questionNumber === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newProblem = {
      title,
      description,
      constraints,
      testCases,
      driverCode,
      questionNumber, // Store question number
    };

    const problemRef = await db.collection('questions').add(newProblem);
    res.status(201).json({ id: problemRef.id, ...newProblem });
  } catch (error) {
    console.error('Error adding problem:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/questions', async (req, res) => {
  try {
    const questionsSnapshot = await db.collection('questions').get();
    const questions = questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/execute', async (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: 'Language and code are required' });
  }

  if (language !== 'cpp') {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  try {
    const tempSourceFile = tmp.fileSync({ postfix: '.cpp' });
    const tempExecutableFile = path.join(path.dirname(tempSourceFile.name), 'a.out');

    await fs.writeFile(tempSourceFile.name, code);

    const compileCommand = `g++ ${tempSourceFile.name} -o ${tempExecutableFile}`;
    exec(compileCommand, (compileError, compileStdout, compileStderr) => {
      if (compileError) {
        console.error('Compilation error:', compileError);
        tempSourceFile.removeCallback(); // Clean up temporary file
        return res.status(500).json({
          output: compileStdout,
          error: compileStderr || compileError.message,
        });
      }

      exec(tempExecutableFile, { input }, (runError, stdout, stderr) => {
        tempSourceFile.removeCallback(); // Clean up temporary file
        fs.unlink(tempExecutableFile).catch(err => console.error('Error removing executable:', err));

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
  } catch (error) {
    console.error('Error during execution:', error);
    res.status(500).json({ error: 'An error occurred during code execution' });
  }
});




app.get('/questions/:id', async (req, res) => {
  const problemId = req.params.id;
  try {
    const problemRef = db.collection('questions').doc(problemId);
    const doc = await problemRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
