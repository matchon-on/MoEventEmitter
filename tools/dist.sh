#!/bin/bash
node_modules/.bin/uglifyjs\
    --comments\
    --mangle sort=true\
    --compress\
    --output MoEventEmitter.min.1.1.3.js MoEventEmitter.js
