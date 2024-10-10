const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/admin'); 
const cloudinaryConfig = require('../config/cloudinaryConfig'); // Import Cloudinary config

// Apply Cloudinary configuration
cloudinaryConfig();

// Set up multer storage for local files
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Create a book with file upload
router.post('/books', authMiddleware, isAdmin, upload.single('coverImage'), async (req, res) => {
  const { title, author, category, pdfUrl } = req.body;
  const coverImage = req.file;

  try {
    const coverUploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'book_covers' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      coverImage.stream.pipe(uploadStream);
    });

    const book = new Book({
      title,
      author,
      category,
      pdfUrl,
      coverImageUrl: coverUploadResult.secure_url,
    });

    await book.save();
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Unable to save book' });
  }
});

router.get('/books', async (req, res) => {
  try {
    const { category } = req.query;
    const books = category ? await Book.find({ category }) : await Book.find();
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

module.exports = router;
