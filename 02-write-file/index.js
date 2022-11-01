const fs = require('fs');
const path = require('path');
const process = require('process');
const { stdout, stdin, exit } = process;

process.on('exit', () => {stdout.write('You\'re done!')})
process.on('SIGINT', () => exit())

fs.writeFile(
  path.join(__dirname, 'text.txt'),
  '',
  (err) => {
    if(err) throw err;
    stdout.write('Input some text ...\n')
  }
)

stdin.on('data', data => {
  const dataToString = data.toString()

  if (dataToString.trim() === 'exit'){
    exit()
  }

  fs.appendFile(
    path.join(__dirname, 'text.txt'),
    dataToString,
    (err) => {
      if(err) throw err
    }
  )
})