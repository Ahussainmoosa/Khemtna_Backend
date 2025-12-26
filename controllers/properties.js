const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Property = require('../models/Proparties.js');
const PropertyPhoto = require('../models/PropertyPhoto');

const upload = require('../middleware/upload');
const verifyToken = require('../middleware/verify-token');
const authorizeRoles = require('../middleware/authorize-roles');

// Get all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().lean();

    const propertyIds = properties.map(p => p._id);

    const photos = await PropertyPhoto.find({
      propertyId: { $in: propertyIds }
    });

    const photosByProperty = photos.reduce((acc, photo) => {
      acc[photo.propertyId] = acc[photo.propertyId] || [];
      acc[photo.propertyId].push(photo);
      return acc;
    }, {});

    const result = properties.map(property => ({
      ...property,
      photos: photosByProperty[property._id] || [],
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).lean();
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const photos = await PropertyPhoto.find({ propertyId: property._id });

    res.json({
      ...property,
      photos,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Upload property photos (owner / admin)
router.post(
  '/:id/photos',
  verifyToken,
  authorizeRoles('owner', 'admin'),
  upload.array('photos', 5),
  async (req, res) => {
    try {
      const photos = req.files.map(file => ({
        propertyId: new mongoose.Types.ObjectId(req.params.id),
        imageUrl: `/uploads/${file.filename}`,
      }));

      const savedPhotos = await PropertyPhoto.insertMany(photos);
      res.status(201).json({ success: true, data: savedPhotos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Update property (owner / admin)
router.put(
  '/:id',
  verifyToken,
  authorizeRoles('owner', 'admin'),
  async (req, res) => {
    try {
      const property = await Property.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!property) {
        return res.status(404).json({ success: false, message: 'Property not found' });
      }

      res.json({ success: true, data: property });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Delete property (owner / admin)
router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('owner', 'admin'),
  async (req, res) => {
    try {
      const property = await Property.findByIdAndDelete(req.params.id);
      if (!property) {
        return res.status(404).json({ success: false, message: 'Property not found' });
      }
      res.json({ success: true, message: 'Property deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

module.exports = router;
