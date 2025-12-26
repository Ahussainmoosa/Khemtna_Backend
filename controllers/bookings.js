const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Get all bookings (admin = all, user = own)
router.get('/', async (req, res) => {
  try {
    const query =
      req.user.role === 'admin'
        ? {}
        : { userId: req.user.id };

    const bookings = await Booking.find(query)
      .populate('propertyId')
      .populate('userId');

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('propertyId')
      .populate('userId');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    // 🔑 Required
    req.body.userId = req.user.id;

    const booking = await Booking.create(req.body);

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error('BOOKING CREATE ERROR:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
