const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
const cloudinary = require('cloudinary').v2;
const cloudinaryConfig = require('../config/cloudinaryConfig'); // Import Cloudinary config

// Apply Cloudinary configuration
cloudinaryConfig();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a song
router.post('/songs', authMiddleware, isAdmin, upload.single('audioFile'), async (req, res) => {
  const { title, artist, youtubeUrl, category } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const audioUploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'audio', folder: 'songs' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      req.file.stream.pipe(uploadStream);
    });

    const song = new Song({
      title,
      artist,
      youtubeUrl,
      category,
      audioUrl: audioUploadResult.secure_url,
    });

    await song.save();
    res.status(201).json(song);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while saving the song' });
  }
});

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
