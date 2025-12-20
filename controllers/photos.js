const express = require('express');
const router = express.Router();
const PropertyPhoto = require('../models/PropertyPhoto.js');

// Get all photos for a property
router.get('/:propertyId', async (req, res) => {
  try {
    const photos = await PropertyPhoto.find({ property: req.params.propertyId });
    res.json({ success: true, data: photos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload a photo
router.post('/', async (req, res) => {
  try {
    const photo = new PropertyPhoto(req.body);
    await photo.save();
    res.status(201).json({ success: true, data: photo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a photo
router.delete('/:id', async (req, res) => {
  try {
    const photo = await PropertyPhoto.findByIdAndDelete(req.params.id);
    if (!photo) return res.status(404).json({ success: false, message: "Photo not found" });
    res.json({ success: true, message: "Photo deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
