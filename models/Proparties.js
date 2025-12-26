const mongoose = require('mongoose');

const propartiesSchema = mongoose.Schema({
  ownerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true ,
  },
  name:{
    type: String,
    requireed: true,
  },
  description: {
    type: String,
    required: true,
  }, 
  price: {
    weekday: {
      type: Number,
      required: true,
      min: 0,
    },
    weekend: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  ContactNumber :{
    type:String,
    require: true,

  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], 
      required: true,
      },
    },
});

const Proparites = mongoose.model('Proparites', propartiesSchema);
module.exports = Proparites;
