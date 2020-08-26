#!/bin/sh

cd node_modules/sipgateio/dist
sed -i '/webhook_1/d' index.js
