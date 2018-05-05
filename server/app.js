const express = require("express");
const bodyParser = require("body-parser");
const ctrl = require('./models/ctrl');
const history = require('connect-history-api-fallback');
const redirectHttps = require('redirect-https');

const path = require('path');
require('./env');

const PROD = process.env.NODE_ENV==='production';

const lex = require('greenlock-express').create({
  server: PROD ? 'https://acme-v01.api.letsencrypt.org/directory' : 'staging',

  approveDomains: (opts, certs, cb) => {
    if (certs) {
      // change domain list here
      opts.domains = ['letter2u.club', 'www.letter2u.club', 'localhost'];
      opts.version = 'v01';
    } else {
      // change default email to accept agreement
      opts.email = 'cooluhuru@gmail.com';
      opts.agreeTos = true;
      opts.version = 'v01';
    }
    cb(null, { options: opts, certs: certs });
  }
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '150mb'}));

app.use(lex.middleware(redirectHttps()));

const port = process.env.PORT || 3301;

require('./db');

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS');
    res.sendStatus(200);
  } else {
    console.log('URL', req.url);
    next();
  }
});

app.get('/health-check', (req, res) => res.sendStatus(200));

app
  .route("/letters")
  .get(ctrl.listAllLetters)
  .post(ctrl.createNewLetter);

app
  .route("/_letter/:letterid")
  .get(ctrl.readLetter)
  .put(ctrl.updateLetter)
  .delete(ctrl.deleteLetter);


app.use(express.static('static'));

app.use('/', express.static(path.join(__dirname, '../dist/spa-mat')));

app.use(history({
//  disableDotRule: true,
  verbose: true
}));

app.use(express.static('static'));

app.use('/', express.static(path.join(__dirname, '../dist/spa-mat')));

app.listen(port, () => {
  console.log(`Server running `);
});
