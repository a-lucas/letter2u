#!/bin/sh
export NODE_ENV=production
cd server
webpack
cd ..
quasar build
