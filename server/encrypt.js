const crypto = require('crypto');
const algorithm = 'aes-256-ctr';

exports.encrypt = (text, email) => {
  var cipher = crypto.createCipher(algorithm, email);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
};

exports.decrypt = (text, email) => {
  var decipher = crypto.createDecipher(algorithm, email);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
};
