const mongoose = require('mongoose');

const sermonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  speaker: { type: String, required: true }, 
  category: { type: String, required: true },
}, { timestamps: true });

const Sermon = mongoose.model('Sermon', sermonSchema);
module.exports = Sermon;
