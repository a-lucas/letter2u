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
  },
  content: {
    type: String,
    required: true
  },
  sent: {
    type: Boolean,
    default: false,
  },
  read: {
    type: Number,
    default: 0,
  },
  deleted: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model('Letters', LetterSchema);
