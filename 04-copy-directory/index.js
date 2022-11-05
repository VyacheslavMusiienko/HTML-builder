const { mkdir, readdir, copyFile, unlink } = require('fs').promises;
const path = require('path');

(async function() {
  try {
    await mkdir(path.join(__dirname, 'files-copy'), { recursive: true });

    const COPY_FOLDER_NAME = 'files-copy';
    const FOLDER_NAME = 'files';

    const originPath = await readdir(path.join(__dirname, FOLDER_NAME));
    const copyPath = await readdir(path.join(__dirname, COPY_FOLDER_NAME)); 

    if (copyPath.length) {
      for (const fileCopy of copyPath) {
        unlink(path.join(__dirname, 'files-copy', fileCopy));
      }
    }

    for (const file of originPath) {
      copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file));
    }
  } catch (error) {
    console.error(error);
  }
})();