import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import admin from 'firebase-admin';
import { Worker } from 'worker_threads';
import path from 'path';
import { readFileSync } from 'fs';
import rateLimit from 'express-rate-limit';
import os from 'node-os-utils';
const serviceAccount = JSON.parse(readFileSync(new URL('../serviceAccountKey.json', import.meta.url)));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://binary-brawlers-default-rtdb.firebaseio.com/'
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = admin.firestore();

//Funciton
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

const cpu = os.cpu;
const mem = os.mem;

setInterval(async () => {
  try {
    const cpuUsage = await cpu.usage();
    console.log(`CPU Usage: ${cpuUsage}%`);
  } catch (error) {
    console.error('Error fetching resource usage:', error);
  }
}, 5000);


const executeCode = async (code, input) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve('./codeExecutor.js'), {  
      workerData: { code, input },
    });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
};





//Function end
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
    const output = await executeCode(code, input);
    res.json(output)
  } catch (error) {
    console.error('Error adding job to queue:', error);
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
