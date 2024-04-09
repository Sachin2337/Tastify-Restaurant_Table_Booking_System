// routes/adminRoute.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Protected route accessible only to admin users
router.get('/', authenticate, authorize(['admin']), (req, res) => {
  res.json({ message: 'Admin route accessed' });
});

module.exports = router;
