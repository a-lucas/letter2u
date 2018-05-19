const path = require('path');
const environment = process.env.NODE_ENV || 'development';
require('dotenv').config({
  path: path.resolve(__dirname, `./../.env.${environment}`)
});

console.log('Process.env = ', process.env);
