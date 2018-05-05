require('./env');

const mailgun = require('mailgun-js')({apiKey: process.env.MG_KEY, domain: process.env.MG_DOMAIN});


const data = {
  from: `cooluhuru@gmail.com`,
  to: `cooluhuru@gmail.com`,
  subject: `I wrote you a letter`,
  text: `Letter2U is a service that allows anyone to seal a letter for a determined period of time.
      The message cannot be cancelled neither edited. It is written as is. 
      `
};

mailgun.messages().send(data, (err, body) => {
  if (err) {
    throw err;
  }
  console.log(body);
});


curl -s --user 'api:key-afdcc9bfcc6cd3eec8a3751c3df0a328' \
https://api.mailgun.net/v3/mg.letter2u.club/messages \
  -F from='Excited User <excited@mg.letter2u.club>' \
 -F to='cooluhuru@gmail.com' \
 -F subject='Hello' \
 -F text='Testing some Mailgun awesomeness!'
