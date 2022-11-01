const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

let readStream = fs.createReadStream(filePath, "utf-8")

readStream.on('data', (chunk) => {
  process.stdout.write(chunk);
})

