const mongoose = require('mongoose');

const propartiesSchema = mongoose.Schema({
  ownerId:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  name:{
    type: String,
    require: true,
  },
  description: {
    type: String,
    required: true,
  }, 
  price:{
    type: Number,
    require: true,
    min : 0
  },
  ContactNumber :{
    type:String,
    require: true,

  },
});

const Proparites = mongoose.model('Proparites', propartiesSchema);
module.exports = Proparites;
