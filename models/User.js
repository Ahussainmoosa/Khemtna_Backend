const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email:{
    type: String,
    require: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  role:{
    type:String ,
    required: true ,
    enum:['admin','user','owner'],
    default: 'user',
  },
  ContactNumber :{
    type:String,
    require: true,

  },
});
  

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
