import express from 'express';
import { exec } from 'child_process';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import tmp from 'tmp';
import cors from 'cors';

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/execute', (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: 'Language and code are required' });
  }

  const tempSourceFile = tmp.fileSync({ postfix: '.cpp' });
  const tempExecutableFile = path.join(path.dirname(tempSourceFile.name), 'a.out');

  fs.writeFileSync(tempSourceFile.name, code);

  let compileCommand = `g++ ${tempSourceFile.name} -o ${tempExecutableFile}`;
  let runCommand = tempExecutableFile;

  if (language === 'cpp') {
    console.log('he')
    exec(compileCommand, (compileError) => {
      if (compileError) {
        console.error('Compilation error:', compileError);
        tempSourceFile.removeCallback();
        return res.status(500).json({ error: 'Compilation failed' });
      }

      exec(runCommand, { input }, (runError, stdout, stderr) => {
        tempSourceFile.removeCallback();
        fs.unlinkSync(tempExecutableFile); 

        if (runError) {
          console.error('Execution error:', runError);
          return res.status(500).json({ error: 'Execution failed' });
        }

        res.json({
          output: stdout,
          error: stderr,
        });
      });
    });
  } else {
    return res.status(400).json({ error: 'Unsupported language' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
