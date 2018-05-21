const mongoose = require('mongoose');
const PROD = process.env.NODE_ENV === 'production';

const dbURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}`;
const {sendLetter} = require('./mail');

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize:       10
};

const Letters = require('./models/letters');


const checkUnsentLetters = () => {
  const searchParams = {
    deleted: false,
    sent: false,
    expirationDate: {$lt: new Date()}
  };

  if (!PROD) {
    searchParams.email = 'cooluhuru@gmail.com';
  }

  console.log(searchParams);

  Letters.find(searchParams)
    .select('_id name createdOn rname remail email')
    .exec( (err, letters) => {
      if (err) {
        console.error('Error executing query', err);
        process.exit(1);
      }
      const promises = letters.map( sendLetter );

      Promise.all(promises).then((ids) => {
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

    setInterval(() => {
      console.log('Checking unsent Letters...');
      checkUnsentLetters();
    }, 5 * 3600 * 1000); // Check Every 5 hour
  },
  err => {
    console.log('Error connecting Database instance due to: ', err);
    throw err;
  }
);

