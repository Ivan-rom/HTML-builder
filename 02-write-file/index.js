const fs = require('fs');
const path = require('path');
const readline = require('readline');

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

process.stdout._write('Hello user, write amy line to save it in text.txt\n');
process.stdout._write(
  'If you want to close app write "exit" or press "ctrl" + "c"\n ',
);

rl.on('line', (line) => {
  if (line === 'exit') {
    exit();
  } else {
    writeStream.write(`${line}\n`);
    rl.prompt();
  }
});

rl.on('SIGINT', exit);

function exit() {
  console.log('Closing app...');
  rl.close();
}

rl.prompt();
