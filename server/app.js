const express = require("express");
const bodyParser = require("body-parser");
const ctrl = require('./models/ctrl');
const path = require('path');
const history = require('connect-history-api-fallback');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../dist/spa-mat')));

app.use(history({
//  disableDotRule: true,
  verbose: true
}));

app.use('/', express.static(path.join(__dirname, '../dist/spa-mat')));


const port = process.env.PORT || 3301;

require('./db');


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app
  .route("/letters")
  .get(ctrl.listAllLetters)
  .post(ctrl.createNewLetter);

app
  .route("/letter/:letterid")
  .get(ctrl.readLetter)
  .put(ctrl.updateLetter)
  .delete(ctrl.deleteLetter);

app.listen(port, () => {
  console.log(`Server running `);
});
