#!/bin/bash

export NODE_PATH=${NODE_PATH:-/usr/local/course-site-builder}
export PATH=$NODE_PATH/node_modules/.bin:$PATH

cp /usr/local/course-site-builder/gulpfile.js /usr/src/app/gulpfile.js

exec npm run site