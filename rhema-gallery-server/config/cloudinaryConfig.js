const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME',
  api_key: 'YOUR_API_KEY',
  api_secret: 'YOUR_API_SECRET',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'songs', // The folder in Cloudinary where the files will be uploaded
    allowed_formats: ['jpg', 'png', 'mp3', 'mp4'], // Allowed file formats
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
