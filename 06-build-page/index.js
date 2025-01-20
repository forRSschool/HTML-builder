const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const projectDistPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsFolderPath = path.join(__dirname, 'components');
const stylesFolderPath = path.join(__dirname, 'styles');
const assetsFolderPath = path.join(__dirname, 'assets');
const bundleCSSPath = path.join(projectDistPath, 'style.css');
const indexHTMLPath = path.join(projectDistPath, 'index.html');

async function createFolder(folderPath) {
  try {
    await fs.promises.mkdir(folderPath, { recursive: true });
  } catch (err) {
    stdout.write(`Error creating folder: ${err.message}\n`);
  }
}

async function generateHTML() {
  try {
    let template = await fs.promises.readFile(templatePath, 'utf-8');

    const componentTags = template.match(/{{\w+}}/g);

    for (const tag of componentTags) {
      const componentName = tag.replace(/[{}]/g, '');
      const componentPath = path.join(componentsFolderPath, `${componentName}.html`);

      try {
        const componentContent = await fs.promises.readFile(componentPath, 'utf-8');
        template = template.replace(tag, componentContent);
      } catch (err) {
        stdout.write(`Component ${componentName}.html not found.\n`);
      }
    }

    await fs.promises.writeFile(indexHTMLPath, template);
    stdout.write('index.html created successfully!\n');
  } catch (err) {
    stdout.write(`Error generating HTML: ${err.message}\n`);
  }
}

async function mergeCSS() {
  try {
    const writeStream = fs.createWriteStream(bundleCSSPath, 'utf-8');
    const files = await fs.promises.readdir(stylesFolderPath, { withFileTypes: true });

    const cssFiles = files.filter(file => file.isFile() && path.extname(file.name) === '.css');

    for (const file of cssFiles) {
      const filePath = path.join(stylesFolderPath, file.name);
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      writeStream.write(`${fileContent}\n`);
    }

    stdout.write('style.css created successfully!\n');
  } catch (err) {
    stdout.write(`Error merging CSS files: ${err.message}\n`);
  }
}

async function copyAssets() {
  try {
    await copyDirectory(assetsFolderPath, path.join(projectDistPath, 'assets'));
    stdout.write('Assets copied successfully!\n');
  } catch (err) {
    stdout.write(`Error copying assets: ${err.message}\n`);
  }
}

async function copyDirectory(src, dest) {
  const files = await fs.promises.readdir(src, { withFileTypes: true });
  await fs.promises.mkdir(dest, { recursive: true });

  for (const file of files) {
    const srcPath = path.join(src, file.name);
    const destPath = path.join(dest, file.name);

    if (file.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

async function buildPage() {
  try {
    await createFolder(projectDistPath);
    await generateHTML();
    await mergeCSS();
    await copyAssets();

    stdout.write('Page built successfully in project-dist folder!\n');
  } catch (err) {
    stdout.write(`Error building the page: ${err.message}\n`);
  }
}

buildPage();
