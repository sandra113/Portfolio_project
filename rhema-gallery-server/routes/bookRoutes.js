const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Route for fetching all books or filtering by category
router.get('/books', async (req, res) => {
  try {
    const { category, title, author } = req.query;
    let query = {};

    // Build query based on provided parameters
    if (category) {
      query.category = category;
    }
    if (title) {
      query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    }
    if (author) {
      query.author = { $regex: author, $options: 'i' }; // Case-insensitive search
    }

    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books' });
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
