#!/bin/sh
set -e

if [ ! -d "./node_modules" ]; then
	npm install
fi

npm start
