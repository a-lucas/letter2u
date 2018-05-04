const Letters = require('./letters');
require('dotenv').config();
const {isFuture} = require('date-fns');

const crypto = require('crypto');
const algorithm = 'aes-256-ctr';

const mailgun = require('mailgun-js')({apiKey: process.env.MG_KEY, domain: process.env.MG_DOMAIN});

const {format} = require('date-fns');

const encrypt = (text, email) => {
  var cipher = crypto.createCipher(algorithm, email);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
};


const decrypt = (text, email) => {
  var decipher = crypto.createDecipher(algorithm, email);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
};

exports.listAllLetters = (req, res) => {
  Letters.find({}, (err, task) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(task);
  });
};

exports.createNewLetter = (req, res) => {
  req.body.content = encrypt(req.body.content, req.body.email);
  const letter = new Letters(req.body);
  letter.save((err, task) => {
    if (err) {
      return res.status(500).send(err);
    }

    const link = `http://${process.env.DOMAIN}:${process.env.PORT}/letter/${letter._id}`;
    const deleteLink = `http://${process.env.DOMAIN}:${process.env.PORT}/delete_letter/${letter._id}`;

    const data = {
      from: `${letter.name} <${letter.email}>`,
      to: letter.remail,
      subject: `${letter.name} wrote you a letter`,
      text: `Letter2U is a service that allows anyone to seal a letter for a determined period of time.
      The message cannot be cancelled neither edited. It is written as is. 
      
      ${letter.name} wrote you this letter on the ${format(letter.createdOn, 'Do of MMMM YYYY')}.
      
      This letter has now been activated, and his content has been decrypted.
      
      You can read it by clicking on this link ${link}.
      
      You can also ignore to read this letter and delete it forever here ${deleteLink}.
      `
    };

    mailgun.messages().send(data, (err, body) => {
      if (err) {
        return res.status(201).json(task);
        return res.status(500).send(err);
      }
      res.status(201).json(task);
    });
  });
};

exports.readLetter = (req, res) => {
  console.log('req', req.params);

  Letters.findById(req.params.letterid, (err, letter) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (isFuture(new Date(letter.expirationDate))) {
      letter.content = null;
    } else {
      letter.content = decrypt(letter.content, letter.email);
    }
    res.status(200).json(letter);
  });
};

exports.updateLetter = (req, res) => {
  Letters.findOneAndUpdate(
    { _id: req.params.letterid },
    req.body,
    { new: true },
    (err, task) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(task);
    }
  );
};

exports.deleteLetter = (req, res) => {
  Letters.remove({ _id: req.params.letterid }, (err, task) => {
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "Task successfully deleted" });
  });
};
