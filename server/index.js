const express = require('express')
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const path = require('path');
const fs = require('fs/promises')
const sharp = require('sharp');
const PORT = 8000;

const app = express();

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

app.listen(PORT, ()=> {
    console.log(`Server running on port: ${PORT}`)
})