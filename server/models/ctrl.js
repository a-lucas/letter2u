const Letters = require('./letters');

require('./../env');

const {isFuture} = require('date-fns');

const {encrypt, decrypt} = require('../encrypt');

const mailgun = require('mailgun-js')({apiKey: process.env.MG_KEY, domain: process.env.MG_DOMAIN});

const {format} = require('date-fns');

exports.listAllLetters = (req, res) => {
  Letters.find({}, (err, task) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(task);
  });
};

exports.createNewLetter = (req, res) => {
  console.log('creating new Letter');
  req.body.content = encrypt(req.body.content, req.body.email);
  const letter = new Letters(req.body);
  letter.save((err, task) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json({_id: task._id});
  });
};

exports.readLetter = (req, res) => {
  console.log('reading Letter');
  Letters.findById(req.params.letterid, (err, letter) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (isFuture(new Date(letter.expirationDate))) {
      letter.content = null;
      res.status(200).json(letter);
    } else {
      letter.content = decrypt(letter.content, letter.email);

      console.log('content OK');

      Letters.findOneAndUpdate({ _id: req.params.letterid }, {sent: true}, (err) => {
        if (err) {
          return res.status(404).send(err);
        }
        res.status(200).json(letter);
      });
    }
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
  Letters.findOneAndUpdate({ _id: req.params.letterid }, {deleted: true}, (err) => {
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "Task successfully deleted" });
  });
};
