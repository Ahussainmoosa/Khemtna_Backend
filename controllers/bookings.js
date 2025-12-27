const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Get all bookings (admin = all, user = own)
router.get('/', async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'user') {
      query.userId = req.user.id;
    }

    if (req.user.role === 'owner') {
      query = {};
    }

    const bookings = await Booking.find(query)
      .populate('propertyId')
      .populate('userId');

    // Owner sees only bookings for their properties
    const filtered =
      req.user.role === 'owner'
        ? bookings.filter(
            b => b.propertyId?.ownerId.toString() === req.user.id
          )
        : bookings;

    res.json({ success: true, data: filtered });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
    req.body.userId = req.user.id;
    const booking = await Booking.create({
      ...req.body,
      userId: req.user.id,
      status: 'pending',
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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

router.put('/:id/approve', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id/reject', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
