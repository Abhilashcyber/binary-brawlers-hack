import { workerData, parentPort } from 'worker_threads';
import { exec } from 'child_process';
import tmp from 'tmp';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';  // Import UUID for unique identifiers

const { code, input } = workerData;
const TIMEOUT_MS = 5000;  // Set the timeout duration (e.g., 5000 ms = 5 seconds)

// Helper function to retry file deletion
const retryUnlink = async (filePath, retries = 5, delay = 100) => {
  for (let i = 0; i < retries; i++) {
    try {
      await fs.rm(filePath, { force: true, recursive: true });
      console.log(`Successfully deleted file: ${filePath}`);
      return;
    } catch (err) {
      if (err.code === 'EBUSY' && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } 
      else if (err.code === 'ENDENT' && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      else {
        console.error(`Failed to delete file: ${filePath}`, err);
        return;
      }
    }
  }
};

const execute = async () => {
  let tempSourceFile = tmp.fileSync({ postfix: '.cpp' });
  const uniqueId = uuidv4();  
  const tempExecutableFile = path.join(path.dirname(tempSourceFile.name), `exec_${uniqueId}`);

  try {
    await fs.writeFile(tempSourceFile.name, code);

    const compileCommand = `g++ ${tempSourceFile.name} -o ${tempExecutableFile}`;

    // Compile the code with a timeout
    exec(compileCommand, { timeout: TIMEOUT_MS }, (compileError, compileStdout, compileStderr) => {
      if (compileError) {
        console.error(`Compilation error: ${compileStderr || compileError.message}`);
        tempSourceFile.removeCallback();
        parentPort.postMessage({
          output: compileStdout,
          error: compileStderr || compileError.message,
        });
        return;
      }

      console.log(`Running executable: ${tempExecutableFile}`);
      
      // Run the executable with a timeout
      exec(tempExecutableFile, { input, timeout: TIMEOUT_MS }, (runError, stdout, stderr) => {
        tempSourceFile.removeCallback();

        retryUnlink(tempExecutableFile).catch(err => console.error('Error removing executable:', err));

        if (runError) {
          return parentPort.postMessage({
            output: stdout,
            error: stderr || runError.message,
          });
        }

        parentPort.postMessage({
          output: stdout,
          error: stderr,
        });
      });
    });
  } catch (error) {
    console.error('Execution error:', error);
    parentPort.postMessage({ error: 'An error occurred during code execution' });
  }
};

execute();
