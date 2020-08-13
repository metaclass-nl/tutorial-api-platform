#!/usr/bin/env node
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _handlebars = _interopRequireDefault(require("handlebars"));

var _comparison = _interopRequireDefault(require("handlebars-helpers/lib/comparison"));

_handlebars["default"].registerHelper("compare", _comparison["default"].compare);

require("@api-platform/client-generator/lib/index.js");
