const mongoose = require('mongoose');
require('dotenv').config();

const {MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB} = process.env;

const dbURI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}`;

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize:       10
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log('Database connection established!');
  },
  err => {
    console.log('Error connecting Database instance due to: ', err);
  }
);

require('./models/letters');
