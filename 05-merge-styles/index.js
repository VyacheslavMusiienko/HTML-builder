const path = require('path');
const { readdir } = require('fs').promises;
const { createReadStream, createWriteStream } = require('fs');

(async function() {
  try {
    const STYLE_FOLDER_NAME = 'styles';
    const BUILD_FOLDER_NAME = 'project-dist';
    const BUNDLE_CSS_NAME = 'bundle.css';

    const styleFolderPath = path.join(__dirname, STYLE_FOLDER_NAME);

    const files = await readdir(styleFolderPath, { withFileTypes: true });
    const output = createWriteStream(path.join(__dirname, BUILD_FOLDER_NAME, BUNDLE_CSS_NAME));

    for (const file of files) {
      const isCssFile = path.extname(file.name) === '.css';
      
      if (file.isFile() && isCssFile) {
        const input = createReadStream(path.join(__dirname, 'styles', file.name));      

        input.on('data', (chunk) => output.write(chunk));
        input.on('error', (err) => {
          throw new Error(err.message);
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
})();