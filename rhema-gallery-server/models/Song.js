const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  artist: { type: String, required: true }, 
  category: { type: String, required: true },
}, { timestamps: true });

const Song = mongoose.model('Song', songSchema);
module.exports = Song;
