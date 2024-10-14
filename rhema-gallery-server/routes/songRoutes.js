const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to upload audio files to Cloudinary
const uploadToCloudinary = (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'audio', folder: 'songs',  public_id: fileName },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer); // End the stream with the fileBuffer content
    });
  };

// Route to upload a song
router.post('/songs', upload.single('file'), async (req, res) => {
  console.log('Received a request to upload a song'); // Debug log
  const { title, artist, category, youtubeUrl } = req.body; // Get details from the request body

  try {
    let audioUrl = youtubeUrl;

    // Upload audio file if provided
    if (req.file) {
      const audioUploadResult = await uploadToCloudinary(req.file.stream);
      audioUrl = audioUploadResult.secure_url; // Set the Cloudinary URL as the audio URL
    }

    const song = new Song({
      title,
      artist,
      youtubeUrl: audioUrl,
      category,
    });

    await song.save();
    res.status(201).json(song);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while saving the song' });
  }
});

// Route to get songs
router.get('/songs', async (req, res) => {
  try {
    const { category } = req.query;
    const songs = category ? await Song.find({ category }) : await Song.find();
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

module.exports = router;
