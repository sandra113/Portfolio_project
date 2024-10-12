const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Sermon = require('../models/Sermon');
const Song = require('../models/Song');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
  .option('type', { alias: 't', description: 'Type of content to upload (book, sermon, song)', type: 'string', demandOption: true })
  .option('title', { alias: 'ttl', description: 'Title of the content', type: 'string', demandOption: true })
  .option('author', { alias: 'a', description: 'Author of the book (for book uploads)', type: 'string' })
  .option('category', { alias: 'c', description: 'Category of the content', type: 'string', demandOption: true })
  .option('speaker', { alias: 's', description: 'Speaker for the sermon (for sermon uploads)', type: 'string' })
  .option('artist', { alias: 'r', description: 'Artist for the song (for song uploads)', type: 'string' })
  .option('file', { alias: 'f', description: 'Path to the cover image', type: 'string', demandOption: true }) // Cover image
  .option('bookFile', { alias: 'b', description: 'Path to the PDF book file', type: 'string', demandOption: true }) // PDF book
  .help()
  .argv;

router.post('/upload', upload.fields([{ name: 'file' }, { name: 'bookFile' }]), async (req, res) => {
  const { type, title, author, category, speaker, artist } = argv;
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

    // Upload based on type
    if (type === 'book') {
      const book = new Book({ title, author, category, coverImageUrl, bookFileUrl });
      await book.save();
      return res.status(201).json(book);
    } else if (type === 'sermon') {
      const sermon = new Sermon({ title, category, speaker, youtubeUrl: bookFileUrl }); // Assuming the sermon video is the bookFileUrl
      await sermon.save();
      return res.status(201).json(sermon);
    } else if (type === 'song') {
      const song = new Song({ title, category, artist, youtubeUrl: bookFileUrl }); // Assuming the song video is the bookFileUrl
      await song.save();
      return res.status(201).json(song);
    } else {
      return res.status(400).json({ error: 'Invalid upload type specified.' });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Unable to save upload' });
  }
});

module.exports = router;
