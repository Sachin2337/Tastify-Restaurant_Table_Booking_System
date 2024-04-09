const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');
const authenticate = require('../middleware/authentication');
const authorize = require('../middleware/authorise');

// Create a new feedback
router.post('/', async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all feedback
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific feedback by ID
router.get('/:id',authenticate, authorize(['admin']), async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a feedback
router.put('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    await feedback.update(req.body);
    res.json(feedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a feedback
router.delete('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    await feedback.destroy();
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
