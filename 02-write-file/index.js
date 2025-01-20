const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output } = require('process');

const stream = fs.createWriteStream(path.resolve(__dirname, 'text.txt'), { flags: 'a' });
const rl = readline.createInterface({ input, output });

output.write('введите текст для записи в файл:\n');
rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    endOfStream();
    return;
  }
  stream.write(`${input}\n`);
});

rl.on('SIGINT', () => {
  endOfStream();
});

function endOfStream() {
  rl.close();
  stream.end();
  output.write('запись завершена\n');
}
