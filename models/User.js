const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
  },

  hashedPassword: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['admin', 'user', 'owner'],
    default: 'user',
  },

  ContactNumber: {
    type: String,
    required: true,
  },

  ownerRequestStatus: {
    type: String,
    enum: ['none', 'pending', 'approved', 'rejected'],
    default: 'none',
  },
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
