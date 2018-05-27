console.log ('Process Env', process.env.MG_KEY);

const mailgun = require('mailgun-js')({apiKey: process.env.MG_KEY, domain: process.env.MG_DOMAIN});

const {format} = require('date-fns');
const PROD = process.env.NODE_ENV === 'production';

exports.sendLetter = (letter) => {

  console.log('Sending letter', letter);

  return new Promise((resolve, reject) => {
    let link;
    let deleteLink;
    if (process.env.PORT == 443 || process.env.PORT == 80) {
      link = `${process.env.DOMAIN}/letter/${letter._id}`;
      deleteLink = `${process.env.DOMAIN}/delete/${letter._id}`;
    } else {
      link = `${process.env.DOMAIN}:${process.env.PORT}/letter/${letter._id}`;
      deleteLink = `${process.env.DOMAIN}:${process.env.PORT}/delete/${letter._id}`;
    }

    const destinationEmail = PROD ? letter.remail : 'cooluhuru@gmail.com';

    const data = {
      from: `Letter2U <no-reply@mg.letter2u.club>`,
      to: `${letter.rname} <${destinationEmail}>`,
      subject: `Hi ${letter.rname}, ${letter.name} wrote you a letter`,
      text: `Good day ${letter.rname},
      
Letter2U is a service that allows anyone to seal a letter for a determined period of time.      

The message cannot be cancelled neither edited. It is delivered as is. 
     
${letter.name} wrote you this letter on the ${format(letter.createdOn, 'Do of MMMM YYYY')}.

This letter has now been activated, and its content has been decrypted.

You can read it by clicking on this link ${link}.

The Letter2U team.
      `
      //You can also ignore to read this letter and delete it forever by clicking on this link ${deleteLink}.

    };

    mailgun.messages().send(data, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(letter._id);
    });
  });
};
