const fs = require('fs');
const path = require('path');

const dirSecret = path.join(__dirname, 'secret-folder/');
console.log(dirSecret);

fs.readdir(dirSecret, { withFileTypes: true }, (error, files) => {
  if (error) return error;
  const filteredFiles = files.filter((dirent) => dirent.isFile());
  for (const dirent of filteredFiles) {
    const dir = path.join(dirSecret, dirent.name);

    const ext = path.extname(dir);
    const extName = ext.slice(1);
    const baseName = path.basename(dir, ext);

    fs.stat(dir, (err, stats) => {
      const sizeBites = (stats.size * 8) / 1000;
      console.log(`${baseName} - ${extName} - ${sizeBites}kb`);
    });
  }
});
