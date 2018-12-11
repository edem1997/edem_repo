const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: 'Token is required',
  },
});

module.exports = mongoose.model('token', tokenSchema );
