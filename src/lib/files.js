
import fs from 'fs';
import path from 'path';
import chroma from '@v3rse/chroma';
import mkdirp from 'mkdirp';
import cliProgress from 'cli-progress';

export const copyFile =
  (inputFiles, outputDirectory, incomingDirectory, move) => new Promise((resolve, reject) => {
    if (!inputFiles.length) {
      resolve();
    }

    const inputFile = inputFiles.pop();
    const file = inputFile.substring(inputFile.lastIndexOf('/') + 1);
    const fullPath = path.join(
      incomingDirectory,
      inputFile,
    );
    console.log(chroma.yellow(`${move ? 'Moving' : 'Copying'} ${inputFile} to ${outputDirectory}`));

    const progressBar = new cliProgress.Bar({
      barCompleteChar: '#',
      barIncompleteChar: '.',
      format: `${chroma.green(' {bar}')} {percentage}% | ETA: {eta}s | {value}/{total}`,
    });
    fs.stat(fullPath, (err, stat) => {
      if (err) {
        reject(err);
      }

      const filesize = stat.size;
      let bytesCopied = 0;
      progressBar.start(100, 0);

      const readStream = fs.createReadStream(fullPath);

      readStream.on('data', (buffer) => {
        bytesCopied += buffer.length;
        const percentage = ((bytesCopied / filesize) * 100).toFixed(2);
        progressBar.update(percentage);
      });
      readStream.on('end', () => {
        progressBar.stop();
        if (move) {
          fs.unlinkSync(fullPath);
        }

        console.log('\n');
        resolve(copyFile(inputFiles, outputDirectory, incomingDirectory, move));
      });

      readStream.pipe(fs.createWriteStream(path.join(outputDirectory, file)));
    });
  });


export const copyFiles = async (files, inputDirectory, outputDirectory, move) => {
  const exists = fs.existsSync(outputDirectory);
  if (!exists) {
    mkdirp.sync(outputDirectory);
  }

  try {
    await copyFile(files, outputDirectory, inputDirectory, move);
    return 0;
  } catch (error) {
    throw error;
  }
};
