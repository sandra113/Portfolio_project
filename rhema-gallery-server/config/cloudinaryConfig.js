const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config(); // Load environment variables

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'songs', // The folder in Cloudinary where the files will be uploaded
    allowed_formats: ['jpg', 'png', 'mp3', 'mp4'], // Allowed file formats
  },
});

// Create multer upload middleware
const upload = multer({ storage });

// Export Cloudinary instance and upload middleware

