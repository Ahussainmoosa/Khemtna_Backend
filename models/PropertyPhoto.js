const mongoose = require('mongoose');

const propertyPhotoSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
},
);

const PropertyPhoto = mongoose.model('PropertyPhoto', propertyPhotoSchema);
module.exports =PropertyPhoto;
