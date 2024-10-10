const express = require('express');
const router = express.Router();
const Sermon = require('../models/Sermon');
const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
const cloudinaryConfig = require('../config/cloudinaryConfig'); // Import Cloudinary config

// Apply Cloudinary configuration
cloudinaryConfig();

// Create a sermon
router.post('/sermons', authMiddleware, isAdmin, async (req, res) => {
  const { title, description, youtubeUrl, category } = req.body;
  try {
    const sermon = new Sermon({ title, description, youtubeUrl, category });
    await sermon.save();
    res.status(201).json(sermon);
  } catch (err) {
    res.status(400).json({ error: 'Unable to save sermon' });
  }
});

router.get('/sermons', async (req, res) => {
  try {
    const { category } = req.query;
    const sermons = category ? await Sermon.find({ category }) : await Sermon.find();
    res.json(sermons);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sermons' });
  }
});

module.exports = router;
