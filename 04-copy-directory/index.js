const fs = require('fs');
const path = require('path');

const copyDir = path.join(__dirname, 'files-copy');

fs.mkdir(copyDir, { recursive: true }, (err) => {
  if (err) throw err;
  fs.readdir(path.join(__dirname, 'files'), (error, files) => {
    if (error) return error;
    for (const file of files) {
      fs.copyFile(
        path.join(__dirname, 'files', file),
        path.join(copyDir, file),
        fs.constants.COPYFILE_FICLONE,
        (err) => {
          if (err) throw err;
        },
      );
    }
  });
  fs.readdir(copyDir, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.access(
        path.join(__dirname, 'files', file),
        fs.constants.F_OK,
        (err) => {
          if (err) {
            fs.unlink(path.join(copyDir, file), (err) => {
              if (err) throw err;
            });
          }
        },
      );
    }
  });
});
