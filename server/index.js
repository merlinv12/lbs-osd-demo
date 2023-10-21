const express = require('express')
const http2 = require('http2')
const http2Express = require('http2-express-bridge')
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const path = require('path');
const fs = require('fs/promises')
const { readFileSync } = require('fs');
const sharp = require('sharp');
const { getZoomPixelCoords } = require('./utils.js')
const PORT = 8000;

const app = http2Express(express);
const options = {
  key: readFileSync('./private.key'),
  cert: readFileSync('./csr.pem'),
  allowHTTP1: true
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  // TODO: Add checking to see if duplicate file name is already uploaded
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  }
});

const imageFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(svs|SVS|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const convertToDZI = (image) => {
  let fullFileName = path.basename(image);
  let extenstion = path.extname(image);
  let fileName = path.basename(fullFileName, extenstion);
  console.log(`Converting ${fullFileName} to dzi...`)
  sharp(image, {limitInputPixels: false})
      .png()
      .tile({
          size: 512
      })
      .fill()
    .toFile(`./dz/${fileName}.dz`, function(err, info) {
      // output.dzi is the Deep Zoom XML definition
      // output_files contains 512x512 tiles grouped by zoom level
      console.log(err)
    });
  }

app.use('/', express.static('../public'));
app.use('/dz', express.static('./dz'));
app.use('/openseadragon-images', express.static('./openseadragon-images'));



app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`, (err) => {
    if (err) {
      console.log(err);
      res.end(err.message);
    }
  });
});

app.post('/image', (req, res, next) => {
  let imageUpload = multer({ storage: storage, fileFilter: imageFilter }).single('image');
  console.log('Uploading...')
  imageUpload(req, res, (err) => {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any
    console.log(req.file)
    if (req.fileValidationError) {
        return res.send(req.fileValidationError);
    }
    else if (!req.file) {
        return res.send('Please select an image to upload');
    }
    else if (err instanceof multer.MulterError) {
        return res.send(err);
    }
    else if (err) {
        return res.send(err);
    }

    // Display uploaded image for user validation
    convertToDZI(`./${req.file.destination}${req.file.filename}`)
    res.send(`You have uploaded the image.  Wait a sec and it will process and be visible on the slide nav bar. Sorry this upload UI sucks its a WIP`);
  });
})

app.get('/images', async (req, res) => {
  let images;
  try {
    images = await fs.readdir('./dz')
    if (images === 'undefined') {
      res.send('No images found')
    } else {
      let dziFiles = images.filter(file => path.extname(file) === '.dzi');
      res.json({images: dziFiles})
    }
  } catch (err) {
    console.log(err)
  }
})

app.get('/dz/:filename/:deepZoomLevel/:colrow', async (req, res) => {
  // remove '_files' from filename
  let filename = req.params.filename.replace('_files', '')
  // seperate col and row and remove .png
  let colrow = req.params.colrow.split('_')
  let col = Number(colrow[0])
  let row = Number(colrow[1].replace('.jpeg', ''))
  
  
  try {
    res.setHeader('Content-Type', 'image/jpeg'); // Change to the appropriate MIME type
    let pageAndPixel = getZoomPixelCoords(Number(req.params.deepZoomLevel), col, row)
    let {top, left, width, height, page} = pageAndPixel
    let metadata = await sharp(`./images/sample1.svs`, {limitInputPixels: false, page: page}).metadata()
    const baseWidth = metadata.width
    const baseHeight = metadata.height
    let newWidth = width;
    let newHeight = height;
    let newWidthRatio = 1
    let newHeightRatio = 1
    // Problem we're stuck on is that tiles on the right edge are not always 1024px wide (same for bottom edge)
    // We need to figure out how to resize to the correct tile sizes in these edge areas
    // Lets do some checks to make sure we are not going out of bounds
    let bottomRightCorner = [left + width, top + height];
    if (bottomRightCorner[0] >= baseWidth || bottomRightCorner[1] >= baseHeight) {
        console.log('bottom right corner out of bounds', bottomRightCorner[0], baseWidth, bottomRightCorner[1], baseHeight)
        // create a red image to show where the out of bounds is
        
        if (bottomRightCorner[0] >= baseWidth) {
          console.log('width out of bounds')
          newWidth = Math.abs(width - (bottomRightCorner[0] - baseWidth))
          newWidthRatio = newWidth / width
        }
        if (bottomRightCorner[1] >= baseHeight) {
          console.log('height out of bounds')
          newHeight = Math.abs(height - (bottomRightCorner[1] - baseHeight))
          newHeightRatio = newHeight / height
        }
      }
    
    console.log('page', page), 
    console.log('new width and height', newWidth, newHeight)
    console.log('new width and height ratio', newWidthRatio, newHeightRatio)
    if (newWidth < 0 || newHeight < 0) { 
     return res.send('out of bounds')
    }
    let processedImage = await sharp('./images/sample1.svs', {limitInputPixels: false, page: page})
    .extract({ top: top, left: left, width: newWidth, height: newHeight })
    .jpeg()
    .resize(Math.floor((1024 * newWidthRatio)), Math.floor((1024 * newHeightRatio)))
    .toBuffer()
    // Set the Content-Type header  
    // Send the image buffer as the response body
    // console.log(process.memoryUsage())
    res.send(processedImage);
    } catch(err) {
    console.log(err)
  }

})

// app.listen(PORT, ()=> {
//     console.log(`Server running on port: ${PORT}`)
// })

const server = http2.createSecureServer(options, app)
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})