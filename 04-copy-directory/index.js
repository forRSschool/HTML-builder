const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  const srcDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');

  try {
    await fs.mkdir(destDir, { recursive: true });

    const items = await fs.readdir(srcDir, { withFileTypes: true });

    const destItems = await fs.readdir(destDir);
    for (const item of destItems) {
      await fs.rm(path.join(destDir, item), { recursive: true, force: true });
    }

    for (const item of items) {
      const srcPath = path.join(srcDir, item.name);
      const destPath = path.join(destDir, item.name);

      if (item.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }

    console.log(`Contents of '${srcDir}' successfully copied to '${destDir}'`);
  } catch (err) {
    console.error('Error copying directory:', err.message);
  }
}

copyDir();
