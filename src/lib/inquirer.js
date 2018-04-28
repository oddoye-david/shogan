import inquirer from 'inquirer';
import path from 'path';
import chroma from '@v3rse/chroma';

export const getShowDirectories = () => {
  // TODO: Use a directory picker of sorts or allow autocomplete at least
  const questions = [
    {
      type: 'input',
      name: 'unorganizedShowsDirectory',
      message: 'Where are your unorganized shows?',
      validate: value => (path.isAbsolute(value) ? true : 'Path must be absolute directory'),
    }, {
      type: 'input',
      name: 'organizedShowsDirectory',
      message: 'Where would you like to store your organized shows?',
      validate: value => (path.isAbsolute(value) ? true : 'Path must be absolute directory'),
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
