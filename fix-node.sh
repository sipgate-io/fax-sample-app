#!/bin/sh

cd node_modules/sipgateio/dist
sed -i '/webhook_1/d' index.js

cd ../../strtok3/lib
sed -i 's/require("fs")/{}/' FsPromise.js

cd ../../token-types/lib
sed -i '/require("assert")/d' index.js

cd ../../peek-readable/lib
sed -i '/require("assert")/d' index.js
