import chroma from '@v3rse/chroma';
import figlet from 'figlet';
import clear from 'clear';
import glob from 'glob';
import path from 'path';
import Configstore from 'configstore';

import pack from '../package.json';
import { copyFiles } from './lib/files';
import {
  getShowDirectories,
  getSearchQuery,
  getShowDetails,
  moveOrCopy,
  updateShowDirectories,
} from './lib/inquirer';

const config = new Configstore('shogan');

// TODO: Run in loop to copy/move multiple shows
(async function main() {
  clear();
  console.log(chroma.red(figlet.textSync(`Shogan v${pack.version}`, { horizontalLayout: 'full' })));
  let showDirectories;

  const savedOrganizedShowsDirectory = config.get('organizedShowsDirectory');
  const savedUnOrganizedShowsDirectory = config.get('unorganizedShowsDirectory');

  if (savedOrganizedShowsDirectory && savedUnOrganizedShowsDirectory) {
    console.log(`Unorganised shows saved at: ${savedUnOrganizedShowsDirectory}`);
    console.log(`Organised shows saved at: ${savedOrganizedShowsDirectory}`);

    const { update } = await updateShowDirectories();

    if (update) {
      showDirectories = await getShowDirectories();
      Object.entries(showDirectories).forEach(([key, value]) => {
        showDirectories[key] = `/home/${value}`;
        config.set(key, `/home/${value}`);
      });
    } else {
      showDirectories = {
        organizedShowsDirectory: savedOrganizedShowsDirectory,
        unorganizedShowsDirectory: savedUnOrganizedShowsDirectory,
      };
    }
  } else {
    showDirectories = await getShowDirectories();
    Object.entries(showDirectories).forEach(([key, value]) => {
      showDirectories[key] = `/home/${value}`;
      config.set(key, `/home/${value}`);
    });
  }
  const searchQuery = await getSearchQuery();
  const showDetails = await getShowDetails();
  const move = await moveOrCopy();
  const options = {
    ...showDirectories, ...searchQuery, ...showDetails, ...move,
  };

  const filteredFiles = glob
    .sync(`${options.unorganizedShowsDirectory}/**/*.+(mkv|avi|mp4)`)
    .filter(file => file.toLowerCase().includes(options.searchQuery.toLowerCase()))
    .map(file => file.replace(options.unorganizedShowsDirectory, ''));

  if (filteredFiles.length) {
    copyFiles(filteredFiles, options.unorganizedShowsDirectory, path.join(options.organizedShowsDirectory, `${options.showName}/Season ${options.season}`), options.move);
  } else {
    console.log(chroma.bgred(`Sorry, no files found for the search term ${options.searchQuery}`));
  }
}());
