const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: 'Username is required',
  },
  fullname: String,
  email: {
    type: String,
    unique: true,
    required: 'Email address is required',
  },
  password: {
    type: String,
    required: 'Password is required',
  },
});

module.exports = mongoose.model('User', userSchema );
