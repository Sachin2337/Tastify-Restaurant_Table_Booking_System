const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const JWT_SEC = '#@sksj9kdkl&'

// Login route
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username exists
    const user = await User.findOne({ where: { Username: username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.Password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.UserID, username: user.Username, role: user.Role }, JWT_SEC, { expiresIn: '1h' });

    // Send token in response
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
