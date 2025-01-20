const fs = require('fs');
const path = require('path');

const sourceFolder = path.join(__dirname, 'styles');
const outputFolder = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputFolder, 'bundle.css');


const mergeCSSFiles = async () => {
  try {
    await fs.promises.mkdir(outputFolder, { recursive: true });

    await fs.promises.rm(outputFile, { force: true });

    const writeStream = fs.createWriteStream(outputFile, 'utf-8');

    const files = await fs.promises.readdir(sourceFolder, { withFileTypes: true });

    const cssFiles = files.filter(file => file.isFile() && path.extname(file.name) === '.css');

    for (const file of cssFiles) {
      const filePath = path.join(sourceFolder, file.name);
      const data = await fs.promises.readFile(filePath, 'utf-8');
      writeStream.write(`${data}\n`);
    }

    console.log('CSS bundle created successfully at project-dist/bundle.css');
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
};

mergeCSSFiles();