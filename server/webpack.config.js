const path = require('path');
const fs = require('fs');
const Dotenv = require('dotenv-webpack');

const environment = process.env.NODE_ENV || 'development';

const envPath = path.resolve(__dirname, `./../.env.${environment}`);

console.log('EnvPath = ', envPath);

const nodeModules = {};
fs.readdirSync('./../node_modules')
  .filter((x) => {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach((mod) => {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './app.js',
  target: 'node',
  //externals: nodeModules,
  output: {
    path: path.resolve(__dirname, './../dist'),
    filename: 'server.js'
  },
  //watch: true,
  plugins: [
      new Dotenv({
        path: envPath,
        silent: false,
        systemvars: false,
      })
  ],
  module: {
    rules: [
      {
        test: /\.pem$/,
        use: 'raw-loader'
      }
    ]
  }
};
