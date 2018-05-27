const express = require("express");
const bodyParser = require("body-parser");
const ctrl = require('./models/ctrl');
const history = require('connect-history-api-fallback');
const https = require('https');
const  http = require('http');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '150mb'}));

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

app
  .route("/letters")
  .get(ctrl.listAllLetters)
  .post(ctrl.createNewLetter);

app
  .route("/_letter/:letterid")
  .get(ctrl.readLetter)
  .put(ctrl.updateLetter)
  .delete(ctrl.deleteLetter);

const PROD = process.env.NODE_ENV==='production';
const port = process.env.PORT || 3302;

const staticPath = './spa-mat';

app.use('/', express.static(staticPath));

app.use(history({
//  disableDotRule: true,
  verbose: true
}));

app.use('/', express.static(staticPath));

if (PROD) {

  const key = require('./ssl/private.pem');
  const cert = require('./ssl/certificate.pem');

  https.createServer({key, cert,}, app).listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`HTTPS Express server listening on port ${port}`);
  });

  // Redirect from http port 80 to https

  http.createServer( (req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
  }).listen(80, (err) => {
    if (err) {
      throw err;
    }
    console.log(`HTTP redirecting to HTTPS`);
  });

} else {
  app.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Dev server running on port ${port}`);
  });
}


