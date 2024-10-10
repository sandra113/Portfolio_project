const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['admin', 'user'], // Only allow 'admin' or 'user'
    default: 'user', // Default role is 'user'
  },
});

module.exports = mongoose.model('User', userSchema);
