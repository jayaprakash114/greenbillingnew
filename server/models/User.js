// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the User schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Ensure password is at least 6 characters
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
