const express = require('express');
const router = express.Router();
const MenuItem = require('../models/menuItems')
const authenticate = require('../middleware/authentication');
const authorize = require('../middleware/authorise');
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images')); // Destination directory for storing uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Filename generation
  }
});

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limit file size to 5MB (adjust as needed)
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/; // Accepted file types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check file extension
    const mimetype = filetypes.test(file.mimetype); // Check file mimetype
    if (extname && mimetype) {
      cb(null, true); // Accept the file
    } else {
      cb('Error: Images only! (JPEG, JPG, PNG)'); // Reject the file
    }
  }
}).single('image'); // Single file upload, with fieldname 'image'


// POST route for adding a new menu item 
router.post('/', (req, res) => {
  // Handle image upload using multer middleware
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ message: err }); // Error handling for multer
      }

      // If no file is uploaded, set image to null
      const image = req.file ? `/images/${req.file.filename}` : null;

      // Extract other fields from request body
      const { name, description, price, availabilityStatus } = req.body;

      // Create menu item with image
      const menuItem = await MenuItem.create({ name, description, price, availabilityStatus, image });
      res.status(201).json(menuItem);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
});

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll();
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (menuItem === null) {
      res.status(404).json({ message: 'Menu item not found' });
    } else {
      res.json(menuItem);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a menu item
router.put('/:id',authenticate, authorize(['admin']), async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (menuItem === null) {
      res.status(404).json({ message: 'Menu item not found' });
    } else {
      await menuItem.update(req.body);
      res.json(menuItem);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a menu item
router.delete('/:id',authenticate, authorize(['admin']), async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (menuItem === null) {
      res.status(404).json({ message: 'Menu item not found' });
    } else {
      await menuItem.destroy();
      res.json({ message: 'Menu item deleted' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
