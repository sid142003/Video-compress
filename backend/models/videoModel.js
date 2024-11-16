const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalUrl: { type: String, required: true },
  compressedUrl: { type: String, required: true },
  size: { type: Number, required: true },
  isCompressed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Video', videoSchema);
