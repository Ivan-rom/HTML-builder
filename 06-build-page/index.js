const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'project-dist');

fs.mkdir(distPath, { recursive: true }, (err) => {
  if (err) throw err;

  /* creating style.css */
  const stylePath = path.join(__dirname, 'styles');

  const styleWriteStream = fs.createWriteStream(
    path.join(distPath, 'style.css'),
  );
  fs.readdir(stylePath, (error, styleFiles) => {
    if (error) return error;

    for (const file of styleFiles) {
      const readStream = fs.createReadStream(path.join(stylePath, file));
      readStream.on('data', (chunk) => {
        styleWriteStream.write(chunk);
      });
    }
  });

  /* copying assets */
  const copyDir = path.join(distPath, 'assets');

  fs.mkdir(copyDir, { recursive: true }, (err) => {
    if (err) throw err;
    fs.readdir(path.join(__dirname, 'assets'), (error, folders) => {
      if (error) return error;
      for (const folder of folders) {
        const folderDir = path.join(copyDir, folder);
        fs.mkdir(folderDir, { recursive: true }, (err) => {
          if (err) throw err;
          fs.readdir(path.join(__dirname, 'assets', folder), (error, files) => {
            if (error) throw error;
            for (const file of files) {
              fs.copyFile(
                path.join(__dirname, 'assets', folder, file),
                path.join(copyDir, folder, file),
                fs.constants.COPYFILE_FICLONE,
                (err) => {
                  if (err) throw err;
                },
              );
            }
          });
        });
      }
      // delete unnecessary files and folders
      // removing unnecessary folders
      fs.readdir(copyDir, (error, folders) => {
        if (error) throw error;
        for (const folder of folders) {
          fs.stat(path.join(__dirname, 'assets', folder), (err) => {
            if (err) {
              fs.rm(path.join(copyDir, folder), { recursive: true }, (err) => {
                if (err) throw err;
              });
              fs.readdir(path.join(copyDir, folder), (err, files) => {
                if (err) throw err;
                for (const file of files) {
                  fs.unlink(path.join(copyDir, folder, file), (err) => {
                    if (err) throw err;
                  });
                }
              });
            }
          });
          // checking files
          fs.readdir(path.join(copyDir, folder), (err, files) => {
            if (err) throw err;
            for (const file of files) {
              fs.access(
                path.join(__dirname, 'assets', folder, file),
                fs.constants.F_OK,
                (err) => {
                  if (err) {
                    fs.unlink(path.join(copyDir, folder, file), (error) => {
                      if (error && error?.code !== 'ENOENT') throw error;
                    });
                  }
                },
              );
            }
          });
        }
      });
    });
  });

  /* creating index.html */
  const readHtmlStream = fs.createReadStream(
    path.join(__dirname, 'template.html'),
  );
  readHtmlStream.on('data', (chunk) => {
    let string = chunk;
    fs.readdir(path.join(__dirname, 'components'), (err, files) => {
      if (err) throw err;

      for (const file of files) {
        const readStream = fs.createReadStream(
          path.join(__dirname, 'components', file),
        );
        readStream.on('data', (chunk) => {
          string = string.toString().replace(/\{\{([^}]+)\}\}/g, (x) => {
            const componentName = x.slice(2, -2);
            if (componentName === path.parse(file).name) return chunk;
            return x;
          });
          fs.writeFile(path.join(distPath, 'index.html'), string, () => {});
        });
      }
    });
  });
});
