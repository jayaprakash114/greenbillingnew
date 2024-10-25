// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path as necessary

// Registration endpoint

// Login endpoint
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if password matches (in a real application, passwords should be hashed)
    if (user.password === password) {
      // Generate a token or set session here (this example does not handle sessions or tokens)
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
