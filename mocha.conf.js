'use strict';

// Register the Babel require hook
require("babel-core/register")({
  // This will override `node_modules` ignoring - you can alternatively pass
  // an array of strings to be explicitly matched or a regex / glob
  ignore: false
});

var chai = require('chai');

// Load Chai assertions
global.expect = chai.expect;
global.assert = chai.assert;
chai.should();

// Load Sinon
global.sinon = require('sinon');

// Initialize Chai plugins
chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));
chai.use(require('chai-things'))
