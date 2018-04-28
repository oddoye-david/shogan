
import fs from 'fs';
import path from 'path';
import chroma from '@v3rse/chroma';
import mkdirp from 'mkdirp';

export const copyFile = (inputFile, outputDirectory, incomingDirectory, move) => {
  const file = inputFile.substring(inputFile.lastIndexOf('/') + 1);
  const fullPath = path.join(
    incomingDirectory,
    inputFile,
  );
  console.log(chroma.yellow(`${move ? 'Moving' : 'Copying'} ${inputFile} to ${outputDirectory}`));

  fs.copyFile(fullPath, path.join(outputDirectory, file), (err) => {
    if (err) {
      return console.log(chroma.red(`Error ${move ? 'moving' : 'copying'} ${inputFile}`), err);
    }

    if (move) {
      fs.unlinkSync(fullPath);
      return console.log(chroma.green(`Moved ${inputFile} successfuly`));
    }

    return console.log(chroma.green(`Copied ${inputFile} successfuly`));
  });
};

// TODO: Show progress bar, per each copy. Sequentially? Investigate streams for this
export const copyFiles = (files, inputDirectory, outputDirectory, move) => {
  fs.exists(outputDirectory, (exists) => {
    if (!exists) {
      mkdirp.sync(outputDirectory);
    }

    files.forEach((file) => {
      copyFile(file, outputDirectory, inputDirectory, move);
    });
  });
};
