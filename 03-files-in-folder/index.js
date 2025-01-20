const fs = require('fs');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

async function displayFileInfo() {
  try {
    const files = await fs.promises.readdir(secretFolderPath, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(secretFolderPath, file.name);


      if (file.isFile()) {
        const stats = await fs.promises.stat(filePath);

        // Extract file extension
        const fileExtension = path.extname(file.name).slice(1); // Remove the dot

        // Format file size in kilobytes (KB)
        const fileSize = (stats.size / 1024).toFixed(3); // Convert to KB with 3 decimal points

        console.log(`${path.basename(file.name, path.extname(file.name))} - ${fileExtension} - ${fileSize}kb`);
      }
    }
  } catch (err) {
    console.error(`Error reading folder: ${err.message}`);
  }
}

displayFileInfo();
