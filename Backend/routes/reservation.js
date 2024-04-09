const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');
const authenticate = require('../middleware/authentication');
const authorize = require('../middleware/authorise');

// Create a new reservation
router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const reservation = await Reservation.create(req.body);
    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all reservations
router.get('/',authenticate, authorize(['admin']), async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// delete 
router.delete('/:id',authenticate, authorize(['admin','customer']), async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    await reservation.destroy();
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

