import inquirer from 'inquirer';
import chroma from '@v3rse/chroma';

inquirer.registerPrompt('directory', require('inquirer-directory'));

export const getShowDirectories = () => {
  const questions = [
    {
      type: 'directory',
      name: 'unorganizedShowsDirectory',
      message: 'Where are your unorganized shows?',
      basePath: '/home',
      transformer(dir) {
        return `~/${dir}`;
      },
    },
    {
      type: 'directory',
      name: 'organizedShowsDirectory',
      message: 'Where would you like to store your organized shows?',
      basePath: '/home',
      transformer(dir) {
        return `~/${dir}`;
      },
    },
  ];

  return inquirer.prompt(questions);
};

export const getSearchQuery = () => {
  const question = {
    type: 'input',
    name: 'searchQuery',
    message: `Provide a search pattern for the file(s). eg. ${chroma.lyellow('silicon')} for ${chroma.magenta('silicon.valley.s01e01.mkv')}`,
  };

  return inquirer.prompt([question]);
};

export const getShowDetails = () => {
  const questions = [
    {
      type: 'input',
      name: 'showName',
      message: `What's the name of the show? eg. ${chroma.magenta('Silicon Valley')}`,
    },
    {
      type: 'input',
      name: 'season',
      message: 'Which season? Please provide a number.',
      validate: value => (/^[1-9]\d*$/.test(value) ? true : 'Please provide a valid number'),
    },
  ];

  return inquirer.prompt(questions);
};


export const moveOrCopy = () => {
  const question = {
    type: 'confirm',
    name: 'move',
    message: 'Move file?',
  };

  return inquirer.prompt([question]);
};

export const updateShowDirectories = () => {
  const question = {
    type: 'confirm',
    name: 'update',
    message: 'Update directories for TV Shows?',
  };

  return inquirer.prompt([question]);
};

export const restartLoop = () => {
  const question = {
    type: 'confirm',
    name: 'loop',
    message: 'Move/Copy another TV Show?',
  };

  return inquirer.prompt([question]);
};
