const fs= require('fs');
const zlib = require('zlib');

//create readable stream from the original file
const readStream = fs.createReadStream('sample.txt')

//compressing the data
const writeStream = fs.createWriteStream('sample.txt.gz');

//create a gzip transformation
const gzib = zlib.createGzip();

//pipe::read::compress::write

readStream.pipe(gzib).pipe(writeStream)
console.log("File is compressed");