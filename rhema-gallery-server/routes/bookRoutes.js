const express = require('express');
const router = express.Router();
const multer = require('multer');
const Book = require('../models/Book');

// Configure multer for file uploads (you can adjust destination and file naming)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique file name
  }
});

const upload = multer({ storage: storage });

// Route for fetching all books or filtering by category
router.get('/books', async (req, res) => {
  try {
    const { category, title, author } = req.query;
    let query = {};

    // Build query based on provided parameters
    if (category) query.category = category;
    if (title) query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    if (author) query.author = { $regex: author, $options: 'i' }; // Case-insensitive search

    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Route for uploading a book
router.post('/books', upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'bookFile', maxCount: 1 }
]), async (req, res) => {
  try {
    // Check if both files were uploaded
    const cover = req.files.file[0];
    const bookFile = req.files.bookFile[0];

    // Create a new book document with file paths and other details
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      coverUrl: cover.path, // Path to the cover image
      fileUrl: bookFile.path // Path to the book file
    });

    // Save the book in the database
    await newBook.save();

    res.status(201).json({ message: 'Book uploaded successfully', book: newBook });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload book' });
  }
});

// Route for fetching a specific book by title
router.get('/books/title/:title', async (req, res) => {
  try {
    const book = await Book.findOne({ title: { $regex: req.params.title, $options: 'i' } });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Route for fetching a specific book by author
router.get('/books/author/:author', async (req, res) => {
  try {
    const books = await Book.find({ author: { $regex: req.params.author, $options: 'i' } });
    if (books.length === 0) {
      return res.status(404).json({ error: 'No books found for this author' });
    }
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

module.exports = router;
