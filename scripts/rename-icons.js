const fs = require('fs');
const path = require('path');

// Function to extract number from filename
function extractNumber(filename) {
  const match = filename.match(/\d+x\d+/);
  if (match) {
    return match[0].split('x')[0]; // Get the first number before 'x'
  }
  return null;
}

// Function to rename files
async function renameFiles(directoryPath) {
  try {
    // Read all files in the directory
    const files = await fs.promises.readdir(directoryPath);

    for (const file of files) {
      // Skip if not a PNG file
      if (!file.toLowerCase().endsWith('.png')) {
        continue;
      }

      const number = extractNumber(file);
      if (number) {
        const newName = `icon-${number}.png`;
        const oldPath = path.join(directoryPath, file);
        const newPath = path.join(directoryPath, newName);

        try {
          await fs.promises.rename(oldPath, newPath);
          console.log(`Renamed: ${file} → ${newName}`);
        } catch (err) {
          console.error(`Error renaming ${file}:`, err);
        }
      } else {
        console.log(`Skipped: ${file} (no number found)`);
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}

// Directory path (current directory by default)
const directoryPath = process.argv[2] || '.';

// Run the script
console.log(`Processing files in: ${directoryPath}`);
renameFiles(directoryPath);
