const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to upload files to Cloudinary
const uploadToCloudinary = (filePath, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    filePath.stream.pipe(uploadStream); // Pipe the stream to Cloudinary
  });
});

// Command-line arguments setup
const argv = require('yargs')
  .option('title', { alias: 'ttl', description: 'Title of the book', type: 'string', demandOption: true })
  .option('author', { alias: 'a', description: 'Author of the book', type: 'string', demandOption: true })
  .option('category', { alias: 'c', description: 'Category of the book', type: 'string', demandOption: true })
  .option('file', { alias: 'f', description: 'Path to the cover image', type: 'string', demandOption: true }) // Cover image
  .option('bookFile', { alias: 'b', description: 'Path to the PDF book file', type: 'string', demandOption: true }) // PDF book
  .help()
  .argv;

// Handle book uploads
router.post('/upload', upload.fields([{ name: 'file' }, { name: 'bookFile' }]), async (req, res) => {
  const { title, author, category } = argv; // Only relevant fields for book uploads
  let coverImageUrl, bookFileUrl;

  try {
    // Upload cover image if provided
    if (req.files.file) {
      const coverResult = await uploadToCloudinary(req.files.file[0], 'book_covers');
      coverImageUrl = coverResult.secure_url; // Set the Cloudinary URL as the cover image URL
    }

    // Upload PDF if provided
    if (req.files.bookFile) {
      const bookResult = await uploadToCloudinary(req.files.bookFile[0], 'books');
      bookFileUrl = bookResult.secure_url; // Set the Cloudinary URL as the PDF book URL
    }

    // Create a new book entry
    const book = new Book({
      title,
      author,
      category,
      coverImageUrl,
      bookFileUrl
    });

    await book.save();
    return res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Unable to save upload' });
  }
});

module.exports = router;
