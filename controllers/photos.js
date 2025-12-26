const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const PropertyPhoto = require('../models/PropertyPhoto');

router.post('/:propertyId', upload.array('photos', 10), async (req, res) => {
  console.log('FILES:', req.files);

  try {
    const photos = req.files.map(file => ({
      propertyId: req.params.propertyId,
      imageUrl: `/uploads/${file.filename}`,
    }));

    const savedPhotos = await PropertyPhoto.insertMany(photos);
    res.status(201).json({ success: true, data: savedPhotos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
