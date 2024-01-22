const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'project-dist');
const stylePath = path.join(__dirname, 'styles');

const writeStream = fs.createWriteStream(path.join(distPath, 'bundle.css'));

fs.readdir(stylePath, { withFileTypes: true }, (error, files) => {
  if (error) return error;
  const filteredFiles = files.filter(
    (dirent) =>
      dirent.isFile() &&
      path.extname(path.join(stylePath, dirent.name)) === '.css',
  );
  for (const dirent of filteredFiles) {
    const readStream = fs.createReadStream(path.join(stylePath, dirent.name));
    readStream.on('data', (chunk) => {
      writeStream.write(chunk);
    });
  }
});
