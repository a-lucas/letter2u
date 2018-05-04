const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
const {isFuture} = require('date-fns');

const validateEmail = {
  validator: (email) => emailRegex.test(email),
  message: '{VALUE} is not a valid email!'
};

const LetterSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: validateEmail,
  },
  name: {
    type: String,
    required: true,
  },
  remail: {
    type: String,
    required: true,
    validate: validateEmail,
  },
  rname: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  expirationDate: {
    type: Date,
    required: true,
    validate: {
      validator: (date) => isFuture(new Date(date)),
      message: '{VALUE} is in the past'
    }
  },
  content: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Letters', LetterSchema);
