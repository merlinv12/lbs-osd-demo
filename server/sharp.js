const sharp = require('sharp');
const path = require('path');


const convertToDZI = (image) => {
let fullFileName = path.basename(image);
let extenstion = path.extname(image);
let fileName = path.basename(fullFileName, extenstion);
console.log(image)
sharp(image, {limitInputPixels: false})
    .png()
    .tile({
        size: 512
    })
  .toFile(`${fileName}.dz`, function(err, info) {
    // output.dzi is the Deep Zoom XML definition
    // output_files contains 512x512 tiles grouped by zoom level
    console.log(err)
  });
}

convertToDZI('./uploads/test.svs')
