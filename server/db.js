const mongoose = require('mongoose');
const environment = process.env.NODE_ENV || 'development';

require('./env');

const {MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB} = process.env;

const dbURI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}`;
const {sendLetter} = require('./mail');

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize:       10
};

const Letters = require('./models/letters');


const checkUnsentLetters = () => {
  Letters.find({
    deleted: false,
    sent: false,
    expirationDate: {$lt: new Date()}
  })
    .select('_id name createdOn rname remail email')
    .exec( (err, letters) => {
      if (err) {
        console.error('Error executing query', err);
        process.exit(1);
      }

      const promises = letters.map( sendLetter );

      Promise.all(promises).then((ids) => {
        console.log('done');
        ids.forEach((_id) => {
          Letters.findOneAndUpdate({_id}, { sent: true }, (err) => {
            if (err) {
              console.error(err);
            }
          });
        });
      }).catch((err) => {
        console.error(err);
      });
    });
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log('Database connection established!');

    console.log('Checking unsent Letters...');

    checkUnsentLetters();


  },
  err => {
    console.log('Error connecting Database instance due to: ', err);
  }
);

