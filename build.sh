#!/bin/sh
rm -Rf dist
mkdir dist
cd server
webpack
cd ..
quasar build
