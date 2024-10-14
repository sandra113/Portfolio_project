const express = require('express');
const router = express.Router();
const Sermon = require('../models/Sermon');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route to upload a sermon
router.post('/api/sermons', upload.single('video'), async (req, res) => {
  const { title, description, youtubeUrl, category, speaker } = req.body; // Include speaker field

  try {
    let fileUrl = youtubeUrl; // Default to the provided YouTube URL

    // If a local video file is uploaded, upload it to Cloudinary
    if (req.file) {
      // Use a promise to wait for the upload to complete
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'video', folder: 'sermons' },
          (error, result) => {
            if (error) {
              console.error(error);
              return reject(new Error('Error uploading video'));
            }
            resolve(result);
          }
        );
        req.file.stream.pipe(uploadStream); // Pipe the stream to Cloudinary
      });

      fileUrl = result.secure_url; // Set the Cloudinary URL as the file URL
    }

    const sermon = new Sermon({ title, description, youtubeUrl: fileUrl, category, speaker }); // Save sermon details
    await sermon.save();
    res.status(201).json(sermon);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Unable to save sermon' });
  }
});

// Route to get sermons
router.get('/api/sermons', async (req, res) => {
  try {
    const { category } = req.query;
    const sermons = category ? await Sermon.find({ category }) : await Sermon.find();
    res.json(sermons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sermons' });
  }
});

module.exports = router;
