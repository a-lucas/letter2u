const Letters = require('./letters');

const {isFuture} = require('date-fns');

const {encrypt, decrypt} = require('../encrypt');

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
    res.status(200).json({_id: task._id});
  });
};

exports.readLetter = (req, res) => {
  Letters.findById(req.params.letterid, (err, letter) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (isFuture(new Date(letter.expirationDate))) {
      letter.content = null;
      res.status(200).json(letter);
    } else {
      letter.content = decrypt(letter.content, letter.email);
      Letters.findOneAndUpdate({ _id: req.params.letterid }, {read: letter.read + 1}, (err) => {
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
    res.status(200).json({ message: "Letter successfully deleted" });
  });
};
