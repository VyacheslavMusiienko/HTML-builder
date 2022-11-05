const fs = require('fs');
const { mkdir, copyFile, readdir, readFile, rm, stat } = require('fs').promises;
const { join, extname } = require('path');
const { exit, stderr } = require('process');
const { pipeline } = require('stream').promises;

const copyDir = async (fromDir, toDir) => {
  await rm(toDir, { recursive: true, force: true });
  await mkdir(toDir, { recursive: true });

  const filesToCopy = await readdir(fromDir);
  for (let file of filesToCopy) {
    const fromFile = join(fromDir, file);
    const toFile = join(toDir, file);
    const stats = await stat(fromFile);
    if (stats.isFile()) await copyFile(fromFile, toFile);
    else await copyDir(fromFile, toFile);
  }
};

const mergeStyles = async (stylesPath, outputPath) => {
  fs.createWriteStream(outputPath).close();

  const stylesDirFiles = await readdir(stylesPath, { withFileTypes: true });
  for (let file of stylesDirFiles.reverse()) {
    const filePath = join(stylesPath, file.name);
    if (file.isFile() && extname(filePath) === '.css') {
      const rs = fs.createReadStream(filePath);
      const ws = fs.createWriteStream(outputPath, { flags: 'a' });

      await pipeline(rs, ws);
    }
  }
};

const createHtml = async (templePath, componentsPath, outputPath) => {
  const rs = fs.createReadStream(templePath, 'utf-8');
  const ws = fs.createWriteStream(outputPath);

  let templateHtml = '';

  rs.on('data', chunk => {
    templateHtml += chunk;
  });

  rs.on('end', async () => {
    const matches = [...templateHtml.matchAll(/{{(.*)}}/g)];
    for (let component of matches) {
      const componentFilePath = join(componentsPath, `${component[1]}.html`);
      const content = await readFile(componentFilePath);
      templateHtml = templateHtml.replace(component[0], content);
    }
    ws.write(templateHtml);
  });
};

(async () => {
  try {
    const assetsDir = 'assets';
    const stylesDir = 'styles';
    const outputDir = 'project-dist';
    const componentsDir = 'components';
    const bundlerCssName = 'style.css';
    const bundlerHtmlName = 'index.html';
    const templateHtmlName = 'template.html';

    const fromDir = join(__dirname, assetsDir);
    const toDir = join(__dirname, outputDir, assetsDir);
    await copyDir(fromDir, toDir);

    const fromStyles = join(__dirname, stylesDir);
    const toStyles = join(__dirname, outputDir, bundlerCssName);
    await mergeStyles(fromStyles, toStyles);

    const templatePath = join(__dirname, templateHtmlName);
    const componentsPath = join(__dirname, componentsDir);
    const outputHtmlPath = join(__dirname, outputDir, bundlerHtmlName);
    await createHtml(templatePath, componentsPath, outputHtmlPath);
  } catch (error) {
    stderr.write(`Error: ${error.message}`);
    exit(1);
  }
})();
