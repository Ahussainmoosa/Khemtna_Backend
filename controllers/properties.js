const express = require('express');
const router = express.Router();
const Property = require('../models/Proparties.js');

// Get all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create property
router.post('/', async (req, res) => {
  try {
    req.body.ownerId = req.user.id;

    const property = await Property.create(req.body);
    if (!property) return res.status(400).json({ success: false, message: "Property not created" });

    res.status(201).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update property
router.put('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete property
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    res.json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
